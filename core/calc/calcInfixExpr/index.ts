import {ParserToken} from "../../parsing/types";
import {getCellValue, atomCalc} from './helpers';
import {signPriorities} from "./constants";
import {TokenTypes} from "../../parsing/parsers/expressionParser/types";

export function calcInfixExpression(tokens: (ParserToken<string> | string)[]) {
    const stack = [];
    const queue = [];
    const stackValues = [];

    for (const token of tokens) {
        if (typeof token === 'string') break;

        if (token.type === TokenTypes.NUM || token.type === TokenTypes.LINK) {
            queue.push(token);
        } else {
            if (stack.length === 0) {
                stack.push(token);
            } else {
                let head = stack[stack.length - 1];

                while (signPriorities[head?.value] >= signPriorities[token.value]) {

                    queue.push(stack.pop());
                    head = stack[stack.length - 1];
                }

                stack.push(token);
            }
        }
    }

    while (stack.length > 0) {
        queue.push(stack.pop());
    }

    for (const token of queue) {
        switch (token.type) {
            case 'NUM': {
                stackValues.unshift(parseInt(token.value));
                break;
            }
            case 'LINK': {
                const cellValue = getCellValue(token.value);
                console.log(cellValue);

                stackValues.unshift(cellValue);
                break;
            }
            case 'SIGN_DIVIDED':
            case 'SIGN_MULTI':
            case 'SIGN_MINUS':
            case 'SIGN_PLUS': {
                const value2 = stackValues.shift();
                const value1 = stackValues.shift();

                const res = atomCalc(value1, value2, token.value);
                stackValues.unshift(res);
                break;
            }
        }
    }

    return stackValues[0];
}