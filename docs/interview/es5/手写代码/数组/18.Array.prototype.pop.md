# pop

pop方法从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度。

## 注意点

1. 如果数组为空，返回undefined
2. 修改了原数组

## polyfill

```js
Array.prototype._pop = function () {
    const len = this.length
    if(len === 0) {
       return undefined
    }
    const result = this[len - 1]
    this.length = len - 1
    return result
}

let arr = [ 1, 2 ]
let arr2 = []

console.log(arr._pop(), arr) // 2 [1]
console.log(arr2._pop(), arr2) // undefined []
```