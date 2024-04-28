import { JSDOM } from "jsdom";
import type { App, TAbstractFile } from "obsidian";
import { FileSuggestionComponent } from "../src/index";


jest.mock('../src/file-input-suggest', () => {
    return {
        FileInputSuggest: jest.fn().mockImplementation(() => {
            return {
                onSelect: jest.fn(),
                filter: null,
                callback: null,
                limit: null,
            };
        })
    };
});

describe("constructor", () => {
    const dom = new JSDOM("<!DOCTYPE html>");

    it('should append an inputEl to the provided container element', () => {
        const mockDiv = dom.window.document.createElement("div");
        const mockApp = {} as App;
        const containerEl = mockDiv;
        const instance = new FileSuggestionComponent(containerEl, mockApp);
        expect(containerEl.contains(instance.inputEl)).toBe(true);
    });
});

describe("onSelect", () => {
    const dom = new JSDOM("<!DOCTYPE html>");

    it('should set the FileInputSuggest onSelect callback', () => {
        const mockDiv = dom.window.document.createElement("div");
        const mockApp = {} as App;
        const containerEl = mockDiv;
        const instance = new FileSuggestionComponent(containerEl, mockApp);
        const cb = (value: TAbstractFile, evt: MouseEvent | KeyboardEvent) => { };
        const ret = instance.onSelect(cb);
        expect(instance.fileInputSuggest.callback).toBe(cb);
        expect(instance.fileInputSuggest.onSelect).toHaveBeenCalledWith(cb);
        expect(ret).toBe(instance);
    });
});

describe("setFilter", () => {
    const dom = new JSDOM("<!DOCTYPE html>");

    it('should set the FileInputSuggest filter property', () => {
        const mockDiv = dom.window.document.createElement("div");
        const mockApp = {} as App;
        const containerEl = mockDiv;
        const instance = new FileSuggestionComponent(containerEl, mockApp);
        const ret = instance.setFilter();
        expect(instance.fileInputSuggest.filter).toBe("both");
        expect(ret).toBe(instance);
        instance.setFilter("file");
        expect(instance.fileInputSuggest.filter).toBe("file");
        instance.setFilter("folder");
        expect(instance.fileInputSuggest.filter).toBe("folder");
    });
});

describe("setLimit", () => {
    const dom = new JSDOM("<!DOCTYPE html>");

    it('should set the FileInputSuggest limit property', () => {
        const mockDiv = dom.window.document.createElement("div");
        const mockApp = {} as App;
        const containerEl = mockDiv;
        const instance = new FileSuggestionComponent(containerEl, mockApp);
        const ret = instance.setLimit();
        expect(instance.fileInputSuggest.limit).toBe(100);
        expect(ret).toBe(instance);
        instance.setLimit(123);
        expect(instance.fileInputSuggest.limit).toBe(123);
    });
});
