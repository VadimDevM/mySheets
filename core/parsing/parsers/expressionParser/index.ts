import {or, opt, seq, repeat} from "../../parser_combinators";
import {tag, take} from "../../parser_generators";

const sign = or(
    tag('+', {token: 'SIGN_PLUS'}),
    tag('-', {token: 'SIGN_MINUS'}),
    tag('*', {token: 'SIGN_MULTI'}),
    tag('/', {token: 'SIGN_DIVIDED'})
);

const number = take(/\d/, {min: 1, token: 'NUM'});
const space = tag(' ');

const exp = seq(
    opt(space),
    sign,
    opt(space),
    number
);

export const expressionParser = seq(
    tag('='),
    opt(space),
    number,
    repeat(exp)
);