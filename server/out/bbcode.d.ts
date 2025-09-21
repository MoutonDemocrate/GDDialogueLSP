export interface BBCodeTag {
    name: string;
    description: string;
    parameters?: {
        name: string;
        description: string;
        optional?: boolean;
    }[];
    example?: string;
    selfClosing?: boolean;
}
export declare const builtinTags: BBCodeTag[];
export declare const effectTags: BBCodeTag[];
export declare const dialogueManagerTags: BBCodeTag[];
export declare function tagToMarkdown(tag: BBCodeTag): string;
export declare function getAllTagNames(): string[];
export declare function findTag(name: string): BBCodeTag | undefined;
export declare function isValidTag(name: string): boolean;
