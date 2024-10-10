import {test, describe, expect} from '@jest/globals';
import {repeat} from './';
import {seq} from "../seq";
import {take} from "../take";
import {tag} from "../tag";
import {or} from "../or";

const bbTag = seq(
    tag('['),
    take(/\w/),
    tag(']')
)

const xmlTag = seq(
    tag('<'),
    take(/\w/),
    tag('>')
);

describe('Parser combinator Repeat', () => {
    test('parsing tag xml or BB', () => {
        expect(
            repeat(or(bbTag, xmlTag), {max: 2})('[bla]<root>').next()
        ).toEqual({
            value: [
                {
                    type: 'REPEAT',
                    value: [
                        {
                            type: 'OR',
                            value: {
                                type: 'SEQ',
                                value: [{type: 'TAG', value: '['}, {type: 'TAKE', value: 'bla'}, {type: 'TAG', value: ']'}]
                            }
                        },
                        {
                            type: 'OR',
                            value: {
                                type: 'SEQ',
                                value: [{type: 'TAG', value: '<'}, {type: 'TAKE', value: 'root'}, {type: 'TAG', value: '>'}]
                            }
                        }
                    ]
                },
                ''[Symbol.iterator]()
            ],
            done: true
        })
    });
});