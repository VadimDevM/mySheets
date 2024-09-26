import { test, expect, describe } from '@jest/globals';
import { testChar } from './';

describe('testChar function', () => {
    test('test by string', () => {
        expect(testChar('a', 'a')).toBe(true);
    });

    test('test by regExp', () => {
        expect(testChar(3, /\d/)).toBe(true);
    });

    test('test by function', () => {
        expect(testChar('b', (v) => v === 'b')).toBe(true);
    });

    test('test by function width error result', () => {
        expect(() => testChar('c', (v) => v === 'b')).toThrow();
    });
});
