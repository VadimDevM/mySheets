import { ParserOptions, Test, Parser, ParserState } from "../types";
import { intoIter, ParserError, testChar } from "../helpers";

/**
 * Parsing generator index.
 */
export function tag<T, R>(template: Iterable<Test>, options?: ParserOptions): Parser<T, R> {
    return function* (source, prev) {
        let value = '';
        let iterOnSrc = intoIter(source);

        for(const test of template) {
            let chunk = iterOnSrc.next(), char = chunk.value;

            if (chunk.done) {
                source = yield ParserState.EXPECT_NEW_DATA;
                iterOnSrc = intoIter(source);
                chunk = iterOnSrc.next();
                char = chunk.value;

            } else {
                try {
                    testChar(char, test, prev);
                    value += char;

                } catch(err: ParserError) {
                    throw err;
                }
            }
        }

        if (options?.token) {
            yield {
                type: options.token,
                value: options.tokenValue?.(value) ?? value,
            }
        }

        const token = {
            type: 'TAG',
            value
        };

        return [token, iterOnSrc];
    }
}

