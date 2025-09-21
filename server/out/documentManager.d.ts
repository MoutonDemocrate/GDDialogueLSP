import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class DialogueDocumentManager {
    private characters;
    private titles;
    private keywords;
    updateDocument(document: TextDocument): void;
    getCharacters(documentUri: string): string[];
    getTitles(documentUri: string): string[];
    getKeywords(): string[];
}
