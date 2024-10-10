import {Parser, ParserOptions, ParserState, ParserToken} from "../types";
import {intoIter, ParserError} from "../helpers";
import {intoBuffIter} from "../helpers/intoBuffIter";

/**
 * Parser combinator or.
 */
function or<T = unknown, R = unknown>(...parsers: Parser[]): Parser<T | T[], R[]>;
function or<T = unknown, R = unknown>(optsOrParser: ParserOptions | Parser, ...parsers: Parser[]): Parser<T | T[], R[]>;
export function or<T = unknown, R = unknown>(optsOrParser: ParserOptions | Parser, ...parsers: Parser[]): Parser<T, R> {
    let opts: ParserOptions = {};

    if (typeof optsOrParser === 'function') {
        parsers.unshift(optsOrParser);
    } else {
        opts = optsOrParser;
    }

    return function* (source, prev) {
        let iterOnSrc = intoIter(source);
        const yields: ParserToken<T>[] = [];
        let value;
        let isDone: boolean = false;

        parsers: for (const parser of parsers) {
            const buffer: T[] = [];
            const parsing = parser(intoBuffIter(iterOnSrc, buffer), prev);
            let data;

            while (true) {
                try {
                    const chunk = parsing.next(data);

                    if (chunk.done) {
                        prev = chunk.value[0];
                        value = prev;
                        isDone = true;
                        break parsers;

                    } else {
                        if (chunk.value === ParserState.EXPECT_NEW_DATA) {
                            data = yield chunk.value;

                        } else {
                            yields.push(chunk.value as ParserToken<T>);
                        }
                    }
                } catch (err) {
                    if (buffer.length > 0) {
                        iterOnSrc = intoIter([...buffer, ...iterOnSrc]);
                        yields.length = 0;
                    }

                    break;
                }
            }
        }

        if (!isDone) {
            throw new ParserError('Invalid data for combinator or');
        }

        yield* yields;

        if (opts?.token) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            }
        }

        const token = {
            type: 'OR',
            value
        };

        return [token, iterOnSrc];
    }
}