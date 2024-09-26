interface ParserToken<T> {
    type: string;
    value: T;
}

export enum ParserState {
    EXPECT_NEW_DATA = 'EXPECT_NEW_DATA'
}

interface ParserValue<T = unknown> extends ParserToken<T> {}

type ParserResult<T> = [ParserValue<T>, Iterable<T>];

export type Parser<T = unknown, R = unknown> = (iterable: Iterable<T>, prev?: ParserValue) => Generator<ParserState | ParserToken<T>, ParserResult<R>, Iterable<T>>;

type TestFunc<T> = (value: T) => boolean;

export type Test = RegExp | string | TestFunc<string>;

export interface ParserOptions<T = unknown> {
    token: string;
    tokenValue?(unknown): T;
}