import {Parser, ParserOptions, ParserState} from "../types";
import {intoIter, ParserError} from "../helpers";
import {intoBuffIter} from "../helpers/intoBuffIter";
import {iterSeq} from "../helpers/iterSeq";

interface RepeatOptions extends ParserOptions {
    min?: number;
    max?: number;
}

/**
 * Parser combinator repeat.
 */
export function repeat<T, R>(parser: Parser<T, R>, options?: RepeatOptions): Parser<T | T[], R> {
    const min = options?.min ?? 1, max = options?.max ?? Infinity;

    return function* (source, prev) {
        let iterOnSrc = intoIter(source),
            count = 0;
        const value: T[] = [],
            yields = [];

        const outerBuffer = [];

        parserRepeat: while (true) {
            let buffer = count >= min ? [] : outerBuffer;
            let data;
            const parsing = parser(intoBuffIter(iterOnSrc, buffer), prev);


            while (true) {
                if (count >= max) {
                    break parserRepeat;
                }

                try {
                    const chunk = parsing.next(data);

                    if (chunk.done) {
                        prev = chunk.value[0];
                        value.push(prev);
                        iterOnSrc = intoIter(chunk.value[1]);
                        count++;
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
                    if (buffer.length > 0) {
                        iterSeq(buffer, iterOnSrc);
                    }

                    break parserRepeat;
                }
            }
        }

        if (count < min) {
            throw new ParserError(`Invalid value (Incorrect count. Should be [${options.min}] matches for ${options.token ?? 'REPEAT'})`);
        }

        yield* yields;

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