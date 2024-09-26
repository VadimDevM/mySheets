import { Test } from "../../types";
import { ParserError } from "../parserErr";

export function testChar<T>(char: T, test: Test, prev?: T): boolean {
    const parserErrMessage = 'Invalid value';

    switch (typeof test) {
        case 'string': {
            if (char !== test) {
                throw new ParserError(parserErrMessage, prev);
            }
            return true;
        }

        case 'function': {
            if (!test(char)) {
                throw new ParserError(parserErrMessage, prev);
            }
            return true;
        }

        default: {
            if(!test.test(char)) {
                throw new ParserError(parserErrMessage, prev);
            }
            return true;
        }
    }
}