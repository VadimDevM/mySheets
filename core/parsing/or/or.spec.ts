import {test, describe, expect} from '@jest/globals';
import {or} from './';
import {tag} from "../tag";
import {seq} from "../seq";
import {take} from "../take";

describe('Parser combinator or', () => {
    test('parsing boolean value', () => {
        expect(
            or(
                tag('true'),
                tag('false')
            )('false').next()
        ).toEqual({
            value: [
                {
                    type: 'OR',
                    value: {type: 'TAG', value: 'false'}
                },
                ''[Symbol.iterator]()
            ],
            done: true
        })
    });

    test('parsing boolean value with option', () => {
        expect(
            or(
                {token: 'BOOLEAN'},
                tag('true'),
                tag('false')
            )('false').next()
        ).toEqual({
            value: {
                type: 'BOOLEAN',
                value: {type: 'TAG', value: 'false'}
            },
            done: false
        })
    });

    test('parsing BB or HTML tag', () => {
        const BBTag = seq(
            {token: 'BB_TAG'},
            tag('['),
            take(/\w/),
            tag(']')
        );

        const HTMLTag = seq(
            {token: 'HTML_TAG'},
            tag('<'),
            take(/\w/),
            tag('>')
        );

        expect(
            or(BBTag, HTMLTag)('<body>').next()
        ).toEqual({
            value: {
                type: 'HTML_TAG',
                value: [
                    {type: 'TAG', value: '<'},
                    {type: 'TAKE', value: 'body'},
                    {type: 'TAG', value: '>'}
                ]
            },
            done: false
        })
    });
});