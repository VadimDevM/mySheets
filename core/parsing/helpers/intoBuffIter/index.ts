import {intoIter} from "../intoIter";

export function intoBuffIter<T>(iter: Iterable<T>, buffer: T[]): IterableIterator<T> {
    const innerIter = intoIter(iter);

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            const chunk = innerIter.next();

            if (!chunk.done) {
                buffer.push(chunk.value);
            }

            return chunk;
        }
    }
}