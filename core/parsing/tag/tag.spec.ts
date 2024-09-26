import { describe, test, expect } from '@jest/globals';
import { tag } from './';

describe('Parser tag', () => {
    test('Parsing by string', () => {
        expect(tag('function')('function').next())
            .toStrictEqual(
                {
                    value: [{type: 'TAG', value: 'function'}, ''[Symbol.iterator]()],
                    done: true
                }
            );
    });

    test('Parsing by regExp', () => {
        expect(tag([/[a-z]/, /[a-z]/, /[a-z]/])('bla').next())
            .toStrictEqual(
                {
                    value: [{type: 'TAG', value: 'bla'}, ''[Symbol.iterator]()],
                    done: true
                }
            );
    });

    test('Parsing by function', () => {
        expect(tag([
            (s) => s === 'b',
            (s) => s === 'a',
            (s) => s === 'r'
        ])('bar').next())
            .toStrictEqual(
                {
                    value: [{type: 'TAG', value: 'bar'}, ''[Symbol.iterator]()],
                    done: true
                }
            );
    });

    test('Parsing by string width options', () => {
        expect(tag('else', {token: 'CONDITION_OPERATOR_ELSE'})('else').next())
            .toStrictEqual(
                {
                    value: {type: 'CONDITION_OPERATOR_ELSE', value: 'else'},
                    done: false
                }
            );
    });
});