import {Parser, ParserOptions, ParserState} from "../../types";
import {intoIter, ParserError} from "../../helpers";
import {intoBuffIter} from "../../helpers/intoBuffIter";
import {iterSeq} from "../../helpers/iterSeq";

interface RepeatOptions extends ParserOptions {
    min?: number;
    max?: number;
}

/**
 * Parser combinator repeat.
 */
export function repeat<T, R>(parser: Parser<T, R>, options?: RepeatOptions): Parser<T | T[], R[]> {
    const min = options?.min ?? 1, max = options?.max ?? Infinity;

    return function* (source, prev) {
        let iterOnSrc = intoIter(source),
            count = 0;
        const value: T[] = [],
            yields = [];

        const outerBuffer = [];
        let data;

        parserRepeat: while (true) {
            let buffer = count >= min ? [] : outerBuffer;
            const parsing = parser(intoBuffIter(iterOnSrc, buffer), prev);


            while (true) {
                if (count >= max) {
                    yield* yields;
                    break parserRepeat;
                }

                try {
                    const chunk = parsing.next(data);

                    if (chunk.done) {
                        prev = chunk.value[0];
                        iterOnSrc = intoIter(chunk.value[1]);
                        value.push(prev);
                        count++;

                        if (count >= min) {
                            yield* yields;
                            yields.splice(0, yields.length);
                        }

                        break;

                    } else {
                        if (chunk.value === ParserState.EXPECT_NEW_DATA) {
                            data = yield chunk.value;

                            if (data == null) {
                                throw new ParserError('Invalid input');
                            }

                            iterOnSrc = intoIter(data);
                        } else {
                            yields.push(chunk.value);
                        }
                    }

                } catch (err) {
                    if (count < min) {
                        throw err;
                    }

                    if (buffer.length > 0) {
                        iterSeq(buffer, iterOnSrc);
                    }

                    break parserRepeat;
                }
            }
        }

        if (options?.token) {
            yield {
                type: options.token,
                value: options.tokenValue?.(value) ?? value
            }
        }

        const token = {
            type: 'REPEAT',
            value
        };

        return [token, iterOnSrc];
    }
}