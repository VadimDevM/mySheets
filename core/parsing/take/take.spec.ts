import { test, describe, expect } from '@jest/globals';
import { take } from './';
import { ParserState } from "../types";

describe('Parser generator take', () => {
    test('take for numbers', () => {
       expect(take(/\d/)('123bla').next())
           .toEqual(
               {
                   value: [{type: 'TAKE', value: '123'}, 'bla'[Symbol.iterator]()],
                   done: true,
               }
           );
    });

    test('take for numbers (with option max)', () => {
        expect(take(/\d/, {max: 2})('1234').next())
            .toEqual({
                value: [{type: 'TAKE', value: '12'}, '34'[Symbol.iterator]()],
                done: true,
            });
    });

    test('take for numbers (expect new data)', () => {
        expect(take(/\d/, {min: 4})('123').next())
            .toEqual({value: ParserState.EXPECT_NEW_DATA, done: false});
    });

    test('take for numbers (throw error)', () => {
       expect(() => take(/\d/, {min: 4})('123a').next()).toThrow();
    });
});