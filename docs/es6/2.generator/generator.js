function * g() {
    yield 'liqian'
    yield 'hello'
    yield 'world'
}
const result = g()
console.log(result.next())
console.log(result.next())
console.log(result.next())
console.log(result.next()) 

let likeArray = {
    0:1, 1:2,2:3,length: 3,
    get [Symbol.toStringTag]() {
        return 'my tag'
    },
    // [Symbol.iterator]() {
    //     let index = 0
    //     return {
    //         next: () => {
    //             return { value: this[index], done: index++ === this.length }
    //         }
    //     }
    // }
    [Symbol.iterator]: function* () {
        let index = 0
        let len = this.length
        while(index !== len) {
            yield this[index++]
        }
    }
} 

let arr = [...likeArray]
console.log(arr)