import {test, describe, expect} from '@jest/globals';
import {take} from './';
import {ParserState} from "../types";
import {iterSeq} from "../helpers/iterSeq";
import {intoIter} from "../helpers";

describe('Parser generator take', () => {
    test('take for numbers', () => {
        expect(JSON.stringify(take(/\d/)('123bla').next()))
            .toEqual(JSON.stringify({
                value: [{type: 'TAKE', value: '123'}, iterSeq(intoIter(['b']), 'bla'[Symbol.iterator]())],
                done: true,
            }));
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