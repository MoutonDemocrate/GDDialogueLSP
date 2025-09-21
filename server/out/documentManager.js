"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueDocumentManager = void 0;
class DialogueDocumentManager {
    constructor() {
        this.characters = new Map(); // URI -> Set of character names
        this.titles = new Map(); // URI -> Set of titles
        this.keywords = [
            'if', 'elif', 'else', 'endif',
            'while', 'endwhile',
            'match', 'when',
            'do', 'set'
        ];
    }
    updateDocument(document) {
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        // Clear existing data for this document
        this.characters.set(document.uri, new Set());
        this.titles.set(document.uri, new Set());
        console.log(`Updating document: ${document.uri}`);
        console.log(`Found ${lines.length} lines`);
        for (const line of lines) {
            // Match character definitions (lines ending with :)
            // Skip lines that start with keywords
            const trimmedLine = line.trimStart();
            if (this.keywords.some(keyword => trimmedLine.startsWith(keyword))) {
                continue;
            }
            // Match character definitions but exclude lines starting with keywords
            const characterMatch = line.match(/^\s*([^:\n]+?)\s*:(?:\s*$|[^:])/);
            if (characterMatch) {
                const characterName = characterMatch[1].trim();
                console.log(`Found character: ${characterName}`);
                const docCharacters = this.characters.get(document.uri);
                docCharacters?.add(characterName);
                continue;
            }
            // Match titles (lines starting with ~)
            const titleMatch = line.match(/^\s*~\s*([A-Za-z_][A-Za-z0-9_]*)/);
            if (titleMatch) {
                const titleName = titleMatch[1].trim();
                console.log(`Found title: ${titleName}`);
                const docTitles = this.titles.get(document.uri);
                docTitles?.add(titleName);
            }
        }
    }
    getCharacters(documentUri) {
        return Array.from(this.characters.get(documentUri) || []);
    }
    getTitles(documentUri) {
        return Array.from(this.titles.get(documentUri) || []);
    }
    getKeywords() {
        return this.keywords;
    }
}
exports.DialogueDocumentManager = DialogueDocumentManager;
//# sourceMappingURL=documentManager.js.map