# indexOf

indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

## 返回值

给定元素的第一个索引或者-1

## 参数

1. searchElement： 要查找的元素
2. fromIndex（可选）
   + index >= length, 不会再数组中查找，返回-1
   + index < 0, 从数组末尾抵消负号，但是查找顺序不变，还是从左到右，例如说 -1，从数组末尾第一个元素开始查找
   + 如果index的负号抵消后仍然 < 0, 整个数组都会被查询

## polyfill

```js
Array.prototype._indexOf = function (searchItem, fromIndex) {

    let len = this.length
    fromIndex = +fromIndex || 0

    if (fromIndex >= len || len === 0) return -1

    let i = Math.max(fromIndex < 0 ? (len - Math.abs(fromIndex)) : fromIndex, 0)

    while(i < len) {
       if (i in this && this[i] === searchItem) {
         return i
       }
       i++
     }
    return -1
}

const array = [2, 5, 9]

console.log(array._indexOf(2))      // 0
console.log(array._indexOf(7))      // -1
console.log(array._indexOf(9, 2))   // 2
console.log(array._indexOf(2, -1))  // -1
console.log(array._indexOf(2, -3))  // 0
```