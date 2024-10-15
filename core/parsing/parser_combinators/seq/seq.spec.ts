import {test, describe, expect} from '@jest/globals';
import {tag} from "../../parser_generators/tag";
import {take} from "../../parser_generators/take";
import {seq} from "./index";

describe('Parser combinator SEQ', () => {
    test('parse XML tag', () => {
        expect(JSON.stringify(seq(
            tag('<'),
            take(/\w/),
            tag('>')
        )('<root>').next()))
            .toEqual(
                JSON.stringify({
                        value: [
                            {
                                type: 'SEQ',
                                value: [
                                    {type: 'TAG', value: '<'},
                                    {type: 'TAKE', value: 'root'},
                                    {type: 'TAG', value: '>'}
                                ]

                            },
                            ''[Symbol.iterator]()
                        ],
                        done: true
                    }
                ));
    });

    test('parse XML tag with options', () => {
        expect(seq(
            {token: 'XML_TAG'},
            tag('<'),
            take(/\w/),
            tag('>')
        )('<root>').next())
            .toEqual(
                {
                    value: {
                        type: 'XML_TAG',
                        value: [
                            {type: 'TAG', value: '<'},
                            {type: 'TAKE', value: 'root'},
                            {type: 'TAG', value: '>'}
                        ]

                    },
                    done: false
                }
            );
    });

    test('parse function key words', () => {
        expect(JSON.stringify(seq(
                tag('function '),
                take(/\w/),
                tag('()')
            )('function sum()').next()
        ))
            .toEqual(JSON.stringify({
                value: [
                    {
                        type: 'SEQ',
                        value: [
                            {type: 'TAG', value: 'function '},
                            {type: 'TAKE', value: 'sum'},
                            {type: 'TAG', value: '()'}
                        ]
                    },
                    ''[Symbol.iterator]()
                ],
                done: true
            }))
    })
});