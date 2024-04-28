import { TextComponent, type App, type TAbstractFile } from "obsidian";
import { FileInputSuggest } from "./file-input-suggest";

/**
 * Represents a text input component that provides file and/or folder suggestions.
 * @class
 */
export class FileSuggestionComponent extends TextComponent {
    fileInputSuggest: FileInputSuggest;

    /**
     * Creates an <input> which will offer a popover list of suggested files and/or folders.
     * @constructor
     * @param {HTMLElement} containerEl - The container element to append the FileSuggester to.
     * @param {App} app - The App instance. Required to list files/folders in the Vault.
     */
    constructor(containerEl: HTMLElement, app: App) {
        super(containerEl);
        containerEl.appendChild(this.inputEl);
        this.fileInputSuggest = new FileInputSuggest(app, this.inputEl);
    }

    /**
     * Sets the callback function to be executed when a file is selected.
     * 
     * @param cb - The callback function to be executed. It takes two parameters: the selected file and the event that triggered the selection.
     * @returns The current instance of the `FileSuggester` class.
     */
    // biome-ignore lint/suspicious/noExplicitAny: obsidian demands it
    onSelect(cb: (value: TAbstractFile, evt: MouseEvent | KeyboardEvent) => any): this {
        // i'm not sure why, but calling the ancestor's onSelect alone wasn't enough. i had to
        // explicitly manage the callback in the descendant as well. skill issue for sure...
        this.fileInputSuggest.onSelect(cb);
        this.fileInputSuggest.callback = cb;
        return this;
    }

    /**
     * Sets the component up to suggest files, folders, or both.
     * 
     * @param filter - The filter to apply. Can be "file", "folder", or "both". Defaults to "both".
     * @returns The current instance of the file suggester.
     */
    setFilter(filter: "file" | "folder" | "both" = "both"): this {
        this.fileInputSuggest.filter = filter;
        return this;
    }

    /**
     * Sets the limit for the number of files and/or folders suggested.
     * 
     * @param limit - The maximum number of files and/or folders to suggest. Defaults to 100.
     * @returns The current instance of the `FileSuggester` class.
     */
    setLimit(limit = 100): this {
        this.fileInputSuggest.limit = limit;
        return this;
    }
}

