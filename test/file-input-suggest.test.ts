import { JSDOM } from "jsdom";
import { App, TFile, TFolder, type TAbstractFile } from "obsidian";
import { damerauLevenshtein } from "../src/damerau-levenshtein";
import { FileInputSuggest } from "../src/file-input-suggest";
import { getRandomFile } from "./util/get-random-file";

jest.mock('../src/damerau-levenshtein', () => ({
    damerauLevenshtein: jest.fn(),
}));


describe('similarityScore', () => {
    it('should return the modified distances when prefixes match', () => {
        (damerauLevenshtein as jest.Mock).mockReturnValue(10);

        expect(FileInputSuggest.similarityScore('moo', 'mootoo')).toBe(10 * 0.2 * 0.1);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');

        expect(FileInputSuggest.similarityScore('Moo', 'mootoo')).toBe(10 * 0.2 * 0.1);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');

        expect(FileInputSuggest.similarityScore('moO', 'mOotoo')).toBe(10 * 0.2 * 0.1);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');

        expect(FileInputSuggest.similarityScore('moo', 'mootoo')).toBe(10 * 0.2 * 0.1);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');
    });

    it('should return the modified distances when the path includes the query', () => {
        (damerauLevenshtein as jest.Mock).mockReturnValue(10);

        expect(FileInputSuggest.similarityScore('moo', 'toomoo')).toBe(10 * 0.2);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'toomoo');

        expect(FileInputSuggest.similarityScore('Moo', 'toomoo')).toBe(10 * 0.2);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');

        expect(FileInputSuggest.similarityScore('moO', 'tOomoo')).toBe(10 * 0.2);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');

        expect(FileInputSuggest.similarityScore('moo', 'toomoo')).toBe(10 * 0.2);
        expect(damerauLevenshtein).toHaveBeenCalledWith('moo', 'mootoo');
    });

    it('should not modify distances when there are no complete substring matches', () => {
        (damerauLevenshtein as jest.Mock).mockReturnValue(10);

        expect(FileInputSuggest.similarityScore('asdf', 'toomoo')).toBe(10);
        expect(damerauLevenshtein).toHaveBeenCalledWith('asdf', 'toomoo');
    });
});

describe('getFolders', () => {
    const mockApp = new App();
    const dom = new JSDOM("<!DOCTYPE html>");
    const mockInput = dom.window.document.createElement("input");

    it("should return a flat list containing all of the vault's folders", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        const dirs = fis.getFolders();
        expect(dirs).toBeInstanceOf(Array<TFolder>);
        expect(dirs.every((d) => d instanceof TFolder)).toBeTruthy();
        //@ts-ignore
        expect(dirs.length).toEqual(fis.app.vault.dirs.length);
    });

});

describe('getSuggestions', () => {
    const mockApp = new App();
    const dom = new JSDOM("<!DOCTYPE html>");
    const mockInput = dom.window.document.createElement("input");

    it("should return folder suggestions when the folder filter is set", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        fis.filter = "folder";
        const sugs = fis.getSuggestions("");

        expect(sugs).toBeInstanceOf(Array<TAbstractFile>);
        expect(sugs.every((d) => d instanceof TFolder)).toBeTruthy();
        //@ts-ignore
        expect(sugs.length).toEqual(fis.app.vault.dirs.length);
    });

    it("should return file suggestions when the file filter is set", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        fis.filter = "file";
        const sugs = fis.getSuggestions("");

        expect(sugs).toBeInstanceOf(Array<TAbstractFile>);
        expect(sugs.every((d) => d instanceof TFile)).toBeTruthy();
        //@ts-ignore
        expect(sugs.length).toEqual(fis.app.vault.files.length);
    });

    it("should return mixed suggestions when no filter is set", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        const sugs = fis.getSuggestions("");

        expect(sugs).toBeInstanceOf(Array<TAbstractFile>);
        expect(sugs.some((d) => d instanceof TFile)).toBeTruthy();
        expect(sugs.some((d) => d instanceof TFolder)).toBeTruthy();
        //@ts-ignore
        expect(sugs.length).toEqual(fis.app.vault.files.length + fis.app.vault.dirs.length);
    });

    it("should have the query target as the top suggestion", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        // @ts-ignore
        const query = getRandomFile(fis.app.vault.dirs);
        const sugs = fis.getSuggestions(query.name);
        expect(sugs[0].name).toEqual(query.name);
    });

    it("should be sorted by score in ascending order", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        // @ts-ignore
        const query = getRandomFile(fis.app.vault.dirs).name;
        const sugs = fis.getSuggestions(query);
        const score = FileInputSuggest.similarityScore;
        expect(sugs.every((_, idx) =>
            score(query, sugs[idx].name) <=
            score(query, sugs[idx + 1]?.name || sugs[idx].name))
        ).toBeTruthy();
    });
});

describe('renderSuggestion', () => {
    const mockApp = new App();
    const dom = new JSDOM("<!DOCTYPE html>");
    const mockInput = dom.window.document.createElement("input");

    it("should append a folder path to an HTML element", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        // @ts-ignore
        const dir = getRandomFile(fis.app.vault.dirs);
        const el = dom.window.document.createElement("div");
        el.appendText = jest.fn();

        fis.renderSuggestion(dir, el);
        expect(el.appendText).toHaveBeenCalledWith(dir.path);
    });

    it("should append a file path to an HTML element", () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        // @ts-ignore
        const file = getRandomFile(fis.app.vault.files);
        const el = dom.window.document.createElement("div");
        el.appendText = jest.fn();

        fis.renderSuggestion(file, el);
        expect(el.appendText).toHaveBeenCalledWith(file.path);
    });
});

describe('selectSuggestion', () => {
    const mockApp = new App();
    const dom = new JSDOM("<!DOCTYPE html>");
    const mockInput = dom.window.document.createElement("input");

    it("should fire callback function with the file and evt args", async () => {
        const fis = new FileInputSuggest(mockApp, mockInput);
        // @ts-ignore
        const dir = getRandomFile(fis.app.vault.dirs);
        const evt = {} as MouseEvent;

        fis.setValue = jest.fn();
        fis.callback = jest.fn();


        await fis.selectSuggestion(dir, evt);
        expect(fis.setValue).toHaveBeenCalledWith(dir.path);
        expect(fis.callback).toHaveBeenCalledWith(dir, evt);
        expect(fis.close).toHaveBeenCalled();
    });
});