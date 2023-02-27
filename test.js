const obj = {
    i: 5,
    c: 3,
    b: 9,
    m: 0,
};

const out2 = Object.fromEntries(
    Object.entries(obj).sort(([,a],[,b]) => a < b? -1: 1 )
);

console.log(out2)