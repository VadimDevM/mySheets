import {test, expect, describe} from '@jest/globals';
import {ParserToken} from "../../parsing/types";
import {calcInfixExpression} from "./index";
import {TokenTypes} from "../../parsing/parsers/expressionParser/types";

const expTokens: (ParserToken<string> | string)[] = [
    { type: TokenTypes.NUM, value: '1' },
    { type: TokenTypes.SIGN_PLUS, value: '+' },
    { type: TokenTypes.NUM, value: '4' },
    { type: TokenTypes.SIGN_MULTI, value: '*' },
    { type: TokenTypes.NUM, value: '5' },
    { type: TokenTypes.SIGN_DIVIDED, value: '/' },
    { type: TokenTypes.NUM, value: '2' },
    { type: TokenTypes.SIGN_PLUS, value: '+' },
    { type: TokenTypes.NUM, value: '2' },
    TokenTypes.EXPECT_NEW_DATA
];

const expTokensWidthCells: (ParserToken<string> | string)[] = [
    { type: TokenTypes.NUM, value: '1' },
    { type: TokenTypes.SIGN_PLUS, value: '+' },
    { type: TokenTypes.LINK, value: 'C4' },
    { type: TokenTypes.SIGN_MULTI, value: '*' },
    { type: TokenTypes.NUM, value: '5' },
    { type: TokenTypes.SIGN_DIVIDED, value: '/' },
    { type: TokenTypes.NUM, value: '2' },
    { type: TokenTypes.SIGN_PLUS, value: '+' },
    { type: TokenTypes.NUM, value: '2' },
    TokenTypes.EXPECT_NEW_DATA
];

describe('calcInfixExpr', () => {
    test('calc on tokens', () => {
        expect(calcInfixExpression(expTokens)).toBe(13);
    });

    test('calc on tokens (width cells coords)', () => {
        expect(calcInfixExpression(expTokensWidthCells)).toBe(20.5);
    });
});