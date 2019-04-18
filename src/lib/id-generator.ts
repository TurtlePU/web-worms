const { floor, pow, random } = Math;

const helper = {
    digits: [] as string[],
    length: 0,
    order: [] as number[],
    index: 0,
    shuffle<T>(array: T[]) {
        let i = array.length, t, j;
        while (i != 0) {
            j = floor(random() * i);
            --i;

            t = array[i];
            array[i] = array[j];
            array[j] = t;
        }
        return array;
    },
    build(from: number) {
        let ans = '';
        while (from != 0) {
            ans += `-${helper.digits[from % helper.digits.length]}`;
            from = floor(from / helper.digits.length);
        }
        return ans.substr(1);
    }
};

export function initIdGenerator(digits: string[], length: number) {
    helper.digits = digits;
    helper.length = length;

    const N = pow(helper.digits.length, length);
    helper.order = helper.shuffle([...new Array(N).keys()]);
};

export default function() {
    return helper.build(helper.order[helper.index++]);
};
