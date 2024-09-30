import { test, describe, expect } from '@jest/globals';
import { iterSeq } from './';

describe('Helper iterSeq', () => {
    test('iterSeq strings', () => {
        expect([...iterSeq('abc', 'de')]).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    test('iterSeq number arrays', () => {
        expect([...iterSeq([1, 2, 3], [4, 5])]).toEqual([1, 2, 3, 4, 5]);
    });
})
