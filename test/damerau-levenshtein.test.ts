import { damerauLevenshtein } from '../src/damerau-levenshtein';


describe('damerauLevenshtein', () => {
    it('should return 0 for identical strings', () => {
        expect(damerauLevenshtein('hello', 'hello')).toBe(0);
    });

    it('should return the correct edit distance for different strings', () => {
        expect(damerauLevenshtein('kitten', 'sitting')).toBe(3);
        expect(damerauLevenshtein('book', 'back')).toBe(2);
        expect(damerauLevenshtein('abc', 'def')).toBe(3);
    });

    it('should be case-insensitive', () => {
        expect(damerauLevenshtein('Hello', 'hello')).toBe(0);
        expect(damerauLevenshtein('CAT', 'cat')).toBe(0);
    });

    it('should handle empty strings', () => {
        expect(damerauLevenshtein('', '')).toBe(0);
        expect(damerauLevenshtein('abc', '')).toBe(3);
        expect(damerauLevenshtein('', 'xyz')).toBe(3);
    });
});