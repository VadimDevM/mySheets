import {Parser, ParserOptions} from "../types";
import {repeat} from "../repeat";

/**
 * Parser combinator Opt.
 */
export function opt<T, R>(parser: Parser<T, R>, opts?: ParserOptions): Parser<T | T[], R[]> {
    return repeat(parser, {min: 0, max: 1, ...opts});
}