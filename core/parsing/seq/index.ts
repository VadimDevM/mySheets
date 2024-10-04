import {Parser, ParserOptions, ParserState, ParserValue} from "../types";
import {intoIter} from "../helpers";

/**
 * Parser combinator seq.
 */
function seq<T = unknown, R = unknown>(...parsers: Parser[]): Parser<T | T[], R[]>;
function seq<T = unknown, R = unknown>(options: ParserOptions, ...parsers: Parser[]): Parser<T | T[], R>;
export function seq(parserOrOptions: ParserOptions | Parser, ...parsers: Parser[]): Parser {
    let opts: ParserOptions = {};

    if (typeof parserOrOptions === 'function') {
        parsers.unshift(parserOrOptions);
    } else {
        opts = parserOrOptions;
    }

    return function* (source, prev) {
        let iterOnSrc = intoIter(source);
        const value: unknown[] = [];

        for (const parser of parsers) {
            let parsing = parser(iterOnSrc, prev);
            let data;

            while (true) {
                try {
                    const chunk = parsing.next(data);

                    if (chunk.done) {
                        value.push(chunk.value[0]);
                        prev = chunk.value[0];
                        iterOnSrc = intoIter(chunk.value[1]);
                        break;

                    } else {
                        if (chunk.value === ParserState.EXPECT_NEW_DATA) {
                            data = yield chunk.value;
                        } else {
                            yield chunk.value as ParserValue;
                        }
                    }
                } catch (err) {
                    throw err;
                }
            }
        }

        if (opts?.token) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            }
        }

        const token = {
            type: 'SEQ',
            value
        };

        return [token, iterOnSrc];
    }
}