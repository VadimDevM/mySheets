import {test, expect, describe} from '@jest/globals';
import {expressionParser} from "./";

describe('Parser expression', () => {
    test('expression (= 1 + 2)', () => {
        expect([...expressionParser('= 1 + 2')]).toEqual(
            [
                { type: 'NUM', value: '1' },
                { type: 'SIGN_PLUS', value: '+' },
                { type: 'NUM', value: '2' },
                'EXPECT_NEW_DATA'
            ]
        )
    });

    test('expression (= 1 + 2 * 3)', () => {
        expect([...expressionParser('= 1 + 2 * 3')]).toEqual(
            [
                { type: 'NUM', value: '1' },
                { type: 'SIGN_PLUS', value: '+' },
                { type: 'NUM', value: '2' },
                { type: 'SIGN_MULTI', value: '*' },
                { type: 'NUM', value: '3' },
                'EXPECT_NEW_DATA'
            ]
        )
    });
})