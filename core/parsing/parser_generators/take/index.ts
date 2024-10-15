import {Parser, ParserOptions, ParserState, Test} from "../../types";
import {intoIter, ParserError, testChar} from "../../helpers";
import {iterSeq} from "../../helpers/iterSeq";

/**
 * Parsing generator take.
 */
interface TakeOptions extends ParserOptions {
    min?: number;
    max?: number;
}

export function take<T, R>(test: Test<T>, options?: TakeOptions): Parser<T, R> {
    const min = options?.min ?? 1, max = options?.max ?? Infinity;

    return function* (source, prev) {
        let iterOnSrc = intoIter(source),
            value = '',
            count = 0;

        const buffer = [];

        while(true) {
            if (count >= max) {
                break;
            }

            let chunk = iterOnSrc.next(), char = chunk.value;

            if (chunk.done) {
                if (count < min) {
                    source = yield ParserState.EXPECT_NEW_DATA;
                    iterOnSrc = intoIter(source);
                    chunk = iterOnSrc.next();
                    char = chunk.value;
                } else {
                    break;
                }
            }

            try {
                if (testChar(char, test, prev)) {
                    count++;
                    value += char;
                }

            } catch (err) {
                if (count < min) {
                    throw new ParserError(
                        `Invalid value (incorrect count matches for ${options.token ?? 'TAKE'})`,
                        prev
                    );
                }

                buffer.push(char);
                break;
            }
        }

        if (count < min) {
            throw new ParserError(
                `Invalid value (incorrect count matches for ${options.token ?? 'TAKE'})`,
                prev
            );
        }

        if (options?.token) {
            yield {
                type: options.token,
                value
            }
        }

        const token = {
            type: 'TAKE',
            value
        };

        return [token, buffer.length > 0 ? iterSeq(buffer, iterOnSrc) : iterOnSrc];
    }
}