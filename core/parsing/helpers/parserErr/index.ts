export class ParserError<T = string> extends Error {
    value: T;

    constructor(message: string, value?: T) {
        super(message);
        this.value = value;
    }
}