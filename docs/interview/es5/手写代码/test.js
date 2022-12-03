const add10 = x => x + 10
const mul10 = x => x * 10
const add100 = x => x + 100
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

// (10 + 100) * 10 + 10 = 1110
compose(add10, mul10, add100)(10)

// function compose(...fns) {
//     fns.reduce((fn, cur) => {
//         fn(vur)
//         return fn
//     }, )
// }