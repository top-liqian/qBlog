# lastIndexOf

lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。

## 返回值

给定元素的最后一个索引或者-1

## 参数

1. searchElement： 要查找的元素
2. fromIndex（可选）逆向开始查找，默认是数组长度-1
   + index >= length, 整个数组中查找
   + index < 0, 数组仍然会被从后向前查找 Math.abs(index) > len 返回-1

## 注意点

lastIndexOf 使用严格相等（strict equality，即 ===）比较 searchElement 和数组中的元素。

## polyfill

```js
Array.prototype._lastIndexOf = function (searchItem, fromIndex) {
   let len = this.length

   fromIndex = typeof fromIndex === 'undefined' ? len - 1 : +fromIndex

   if (len === 0 || (fromIndex < 0 && Math.abs(fromIndex) >= len)) {
       return -1
   }

   
   let i = 0

   if (fromIndex >= 0) {
      i = Math.min(fromIndex, len-1)
   } else {
       i = len - Math.abs(fromIndex)
   }

    while(i >= 0) {
       if (i in this && this[i] === searchItem) {
          return i
       }
       i--
    }
   
   return -1
}

let array = [2, 5, 9, 2]

console.log(array._lastIndexOf(2)) // 3
console.log(array._lastIndexOf(7)) // -1
console.log(array._lastIndexOf(2, 3)) // 3
console.log(array._lastIndexOf(2, 2)) // 0
console.log(array._lastIndexOf(2, -2)) // 0
console.log(array._lastIndexOf(2, -1)) // 3

```