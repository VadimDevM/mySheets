import {or, opt, seq, repeat} from "../../parser_combinators";
import {tag, take} from "../../parser_generators";
import {TokenTypes} from "./types";
import {ParserToken} from "../../types";

const sign = or(
    tag('+', {token: TokenTypes.SIGN_PLUS}),
    tag('-', {token: TokenTypes.SIGN_MINUS}),
    tag('*', {token: TokenTypes.SIGN_MULTI}),
    tag('/', {token: TokenTypes.SIGN_DIVIDED})
);

const number = take(/\d/, {min: 1, token: TokenTypes.NUM});

function getLinkTokenValue(tokens) {
    return tokens.reduce((acc: string, curr: ParserToken<string>) => {
        if (Array.isArray(curr.value)) {
            acc += curr.value[0].value;
        } else {
            acc += curr.value;
        }

        return acc;
    }, '');
}

const link = seq(
    {token: TokenTypes.LINK, tokenValue: getLinkTokenValue},
    tag([/[a-z]/i]),
    repeat(tag([/\d/]))
);

const space = tag(' ');

const exp = seq(
    opt(space),
    sign,
    opt(space),
    or(number, link)
);

export const expressionParser = seq(
    tag('='),
    opt(space),
    or(number, link),
    repeat(exp)
);