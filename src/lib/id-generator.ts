const { floor, pow, random } = Math;

var id: IterableIterator<number>;
function* ShuffledGenerator(N: number) {
    let index = 0;
    let order = shuffle([...new Array(N).keys()]);
    while (index < order.length) {
        yield order[index++];
    }
}

function shuffle(array: any[]) {
    for (let i = array.length - 1; i != 0; --i) {
        let j = floor(random() * (i + 1));
        [ array[i], array[j] ] = [ array[j], array[i] ];
    }
    return array;
}

var digits: string[];
var idLength: number;
function toString(num: number) {
    let ans = '', n = digits.length;
    for (let i = 0; i != idLength; ++i) {
        ans += `-${digits[num % n]}`;
        num = floor(num / n);
    }
    return ans.substr(1);
}

/**
 * Initializes readable-ID generator.
 * @param words - digits of IDs
 * @param length - length of returned IDs in words
 */
export function initIdGenerator(words: string[], length: number) {
    digits = words;
    idLength = length;
    const N = pow(digits.length, length);
    id = ShuffledGenerator(N);
};

/**
 * ID generation.
 * @throws RangeError if too many requests
 * @returns next ID
 */
export default function() {
    let nxt = id.next();
    if (nxt.done) {
        throw new RangeError('All IDs are used');
    }
    return toString(nxt.value);
};
