export function intoIter<T>(iterable: Iterable<T>): IterableIterator<T> {
    return intoIterableIter(iterable[Symbol.iterator]());
}

function intoIterableIter<T>(iterator: Iterator<T>): IterableIterator<T> {
    if (typeof iterator[Symbol.iterator] === 'function') {
        return <any>iterator;
    }

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            return iterator.next();
        }
    }
}