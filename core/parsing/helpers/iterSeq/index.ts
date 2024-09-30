import { intoIter } from "../intoIter";

export function iterSeq<T>(...iterable: Iterable<T>[]): IterableIterator<T> {
    let cursor = 0;
    let currentIter = intoIter(iterable[cursor]);

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            let chunk = currentIter.next();

            while (chunk.done) {
                cursor++;

                if (iterable[cursor] == null) {
                    return chunk;
                }

                currentIter = intoIter(iterable[cursor]);
                chunk = currentIter.next();
            }

            return chunk;
        }
    }
}