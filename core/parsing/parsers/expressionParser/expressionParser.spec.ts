import {test, expect, describe} from '@jest/globals';
import {expressionParser} from "./";
import {TokenTypes} from "./types";

describe('Parser expression', () => {
    test('expression (= 1 + 2)', () => {
        expect([...expressionParser('= 1 + 2')]).toEqual(
            [
                { type: TokenTypes.NUM, value: '1' },
                { type: TokenTypes.SIGN_PLUS, value: '+' },
                { type: TokenTypes.NUM, value: '2' },
                TokenTypes.EXPECT_NEW_DATA
            ]
        )
    });

    test('expression (= 1 + 2 * 3)', () => {
        expect([...expressionParser('= 1 + 2 * 3')]).toEqual(
            [
                { type: TokenTypes.NUM, value: '1' },
                { type: TokenTypes.SIGN_PLUS, value: '+' },
                { type: TokenTypes.NUM, value: '2' },
                { type: TokenTypes.SIGN_MULTI, value: '*' },
                { type: TokenTypes.NUM, value: '3' },
                TokenTypes.EXPECT_NEW_DATA
            ]
        )
    });

    test('expression (= A1 + C2 * 3)', () => {
        expect([...expressionParser('= A1 + C2 * 3')]).toEqual(
            [
                { type: TokenTypes.LINK, value: 'A1' },
                { type: TokenTypes.SIGN_PLUS, value: '+' },
                { type: TokenTypes.LINK, value: 'C2' },
                { type: TokenTypes.SIGN_MULTI, value: '*' },
                { type: TokenTypes.NUM, value: '3' },
                TokenTypes.EXPECT_NEW_DATA
            ]
        )
    });
})