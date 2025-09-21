"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const bbcode_1 = require("./bbcode");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const documentManager_1 = require("./documentManager");
const bbcode_2 = require("./bbcode");
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a text document manager
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const dialogueManager = new documentManager_1.DialogueDocumentManager();
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
// Validate BBCode tags in text and return diagnostics
function validateBBCode(text) {
    const diagnostics = [];
    const tagPattern = /\[(\/?)(\w+)(?:\s*[^\]]*?)?\]/g;
    let match;
    while ((match = tagPattern.exec(text)) !== null) {
        const [fullMatch, isClosing, tagName] = match;
        if (!(0, bbcode_1.isValidTag)(tagName)) {
            // Only show error for opening tags or self-closing tags
            if (!isClosing || !text.includes(`[${tagName}]`)) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: {
                            line: text.substring(0, match.index).split('\n').length - 1,
                            character: match.index - text.lastIndexOf('\n', match.index) - 1
                        },
                        end: {
                            line: text.substring(0, match.index + fullMatch.length).split('\n').length - 1,
                            character: match.index + fullMatch.length - text.lastIndexOf('\n', match.index + fullMatch.length) - 1
                        }
                    },
                    message: `Invalid BBCode tag: [${tagName}]`,
                    source: 'gd-dialogue'
                });
            }
        }
    }
    return diagnostics;
}
// Update document data when content changes
documents.onDidChangeContent(change => {
    dialogueManager.updateDocument(change.document);
    // Validate document and send diagnostics
    const diagnostics = validateBBCode(change.document.getText());
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Enable completion support
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['=', '>', '-', '~', ':', '[']
            },
            // Enable hover support
            hoverProvider: true
        }
    };
    return result;
});
// Get the current line's text and indentation
function getCurrentLine(document, position) {
    const offset = document.offsetAt(position);
    const text = document.getText();
    // Find the start of the current line
    let start = offset - 1;
    while (start > 0 && text[start] !== '\n') {
        start--;
    }
    start = start < 0 ? 0 : start + 1;
    // Find the end of the current line
    let end = offset;
    while (end < text.length && text[end] !== '\n') {
        end++;
    }
    const lineText = text.substring(start, end);
    const indent = lineText.match(/^\s*/)?.[0] || '';
    return { text: lineText, indent };
}
// Handle completion requests
connection.onCompletion((params) => {
    connection.console.log('Completion request received');
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        connection.console.log('No document found');
        return [];
    }
    const position = params.position;
    const line = getCurrentLine(document, position);
    const textBeforeCursor = line.text.slice(0, position.character);
    connection.console.log(`Line text before cursor: "${textBeforeCursor}"`);
    // At line start or if we're typing a character name (only letters after whitespace)
    // Don't suggest characters if the line starts with a keyword
    const keywords = dialogueManager.getKeywords();
    const isKeywordStart = keywords.some(keyword => textBeforeCursor.trimStart().toLowerCase().startsWith(keyword.toLowerCase()));
    if (textBeforeCursor.match(/^\s*[A-Za-z]*$/) && !isKeywordStart) {
        connection.console.log('At line start or character name start, suggesting characters and keywords');
        const characters = dialogueManager.getCharacters(document.uri);
        connection.console.log(`Found characters: ${characters.join(', ')}`);
        return [
            ...characters.map(name => ({
                label: name + ':',
                kind: node_1.CompletionItemKind.Class,
                detail: 'Character name',
                sortText: '0' + name, // Make characters appear first
                // Replace from indent to cursor with the full character name
                textEdit: {
                    range: {
                        start: { line: position.line, character: line.indent.length },
                        end: position
                    },
                    newText: name + ':'
                }
            })),
            ...dialogueManager.getKeywords().map(keyword => {
                const snippets = {
                    'if': `if \${1:condition}\n${line.indent}\t\${2:\${0}}`,
                    'elif': `elif \${1:condition}\n${line.indent}\t\${2:\${0}}`,
                    'else': `else\n${line.indent}\t\${1:\${0}}`,
                    'if-else': `if \${1:condition}\n${line.indent}\t\${2:\${0}}\n${line.indent}else\n${line.indent}\t\${3:\${0}}`,
                    'while': `while \${1:condition}\n${line.indent}\t\${2:\${0}}`,
                    'match': `match \${1:value}\n${line.indent}\t\${2:\${0}}`,
                    'when': `when \${1:value}\n${line.indent}\t\${2:\${0}}`,
                    'do': 'do ${1:expression}',
                    'set': 'set ${1:variable} = ${2:value}'
                };
                return {
                    label: keyword,
                    kind: node_1.CompletionItemKind.Snippet,
                    detail: 'Control flow',
                    sortText: '1' + keyword,
                    insertText: snippets[keyword] || keyword,
                    insertTextFormat: snippets[keyword] ? node_1.InsertTextFormat.Snippet : node_1.InsertTextFormat.PlainText,
                    command: snippets[keyword] ? { title: 'Trigger Suggest', command: 'editor.action.triggerSuggest' } : undefined
                };
            })
        ];
    }
    // After "=>", suggest titles or "END"
    if (textBeforeCursor.match(/=>\s*$/)) {
        console.log('After =>, suggesting titles and END');
        return [
            {
                label: 'END',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'End the dialogue'
            },
            ...dialogueManager.getTitles(document.uri).map(title => ({
                label: title,
                kind: node_1.CompletionItemKind.Reference,
                detail: 'Jump to title'
            }))
        ];
    }
    // After typing [ or inside a partial tag, suggest BBCode tags
    const bbCodeMatch = textBeforeCursor.match(/\[([a-zA-Z_]*)$/);
    if (bbCodeMatch) {
        const partialTag = bbCodeMatch[1]; // This will be empty string if we just typed [
        const textAfterCursor = document.getText({
            start: position,
            end: { line: position.line, character: position.character + 1 }
        });
        return [...bbcode_2.builtinTags, ...bbcode_2.dialogueManagerTags, ...bbcode_2.effectTags]
            .filter(tag => tag.name.startsWith(partialTag))
            .map(tag => {
            const insertPosition = {
                line: position.line,
                character: position.character - partialTag.length
            };
            const endPosition = {
                line: position.line,
                character: position.character + (textAfterCursor === ']' ? 1 : 0)
            };
            const paramSnippets = tag.parameters?.map((param, i) => `${param.name}=\${${i + 1}:${param.name}}${i < (tag.parameters?.length || 0) - 1 ? ' ' : ''}`).join('') || '';
            const newText = tag.selfClosing
                ? `${tag.name}${tag.parameters?.length ? ' ' + paramSnippets : ''}]`
                : `${tag.name}${tag.parameters?.length ? ' ' + paramSnippets : ''}]\${${(tag.parameters?.length || 0) + 1}:content}[/${tag.name}]`;
            return {
                label: tag.name,
                kind: node_1.CompletionItemKind.Snippet,
                detail: tag.description,
                documentation: {
                    kind: 'markdown',
                    value: (0, bbcode_2.tagToMarkdown)(tag)
                },
                textEdit: {
                    range: {
                        start: insertPosition,
                        end: endPosition
                    },
                    newText: newText
                },
                insertTextFormat: node_1.InsertTextFormat.Snippet
            };
        });
    }
    return [];
});
// Handle hover requests
connection.onHover((params) => {
    // Example hover information - replace with your language's documentation
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return { contents: [] };
    }
    const position = params.position;
    const word = getWordAtPosition(document, position);
    // Check if the word is a BBCode tag
    const tag = (0, bbcode_2.findTag)(word);
    if (tag) {
        return {
            contents: {
                kind: 'markdown',
                value: (0, bbcode_2.tagToMarkdown)(tag)
            }
        };
    }
    // Check other language keywords
    switch (word) {
        case 'character':
            return {
                contents: {
                    kind: 'markdown',
                    value: '**character** - Defines a character in the dialogue'
                }
            };
        case 'dialogue':
            return {
                contents: {
                    kind: 'markdown',
                    value: '**dialogue** - Represents a line of dialogue'
                }
            };
        case 'choice':
            return {
                contents: {
                    kind: 'markdown',
                    value: '**choice** - Defines a player choice option'
                }
            };
        default:
            return { contents: [] };
    }
});
// Helper function to get word at position
function getWordAtPosition(document, position) {
    const line = document.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line + 1, character: 0 }
    });
    // Check for BBCode tags
    const bbCodeRegex = /\[([a-zA-Z_]+)(?:=[^\]]*)?]/g;
    let match;
    while ((match = bbCodeRegex.exec(line)) !== null) {
        const tagStart = match.index + 1; // +1 to skip the [
        const tagEnd = tagStart + match[1].length;
        if (tagStart <= position.character && position.character <= tagEnd) {
            return match[1]; // Return just the tag name without [ ]
        }
    }
    // Check for regular words
    const wordRegex = /[a-zA-Z]+/g;
    while ((match = wordRegex.exec(line)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (start <= position.character && position.character <= end) {
            return match[0];
        }
    }
    return '';
}
// Make the text document manager listen on the connection
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map