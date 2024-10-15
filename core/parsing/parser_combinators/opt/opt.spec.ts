import {test, describe, expect} from '@jest/globals';
import {seq} from "../seq";
import {tag} from "../../parser_generators/tag";
import {take} from "../../parser_generators/take";
import {opt} from "./index";

const xmlTag = seq(
    {token: 'XML_TAG'},
    tag('<'),
    take(/\w/),
    tag('>')
);

describe('Parser combinator Opt', () => {
    test('optional XML_TAG in str (is has)', () => {
        expect(opt(xmlTag)('<root>').next()).toEqual(
            {
                value: {
                    type: 'XML_TAG',
                    value: [
                        { type: 'TAG', value: '<' },
                        { type: 'TAKE', value: 'root' },
                        { type: 'TAG', value: '>' }
                    ]
                },
                done: false
            }
        )
    });

    test('optional XML_TAG in str', () => {
        expect(JSON.stringify(opt(xmlTag)('[BB]').next())).toEqual(
            JSON.stringify({
                value: [{
                    type: 'REPEAT',
                    value: []
                }, ''[Symbol.iterator]()],
                done: true
            })
        )
    });
});