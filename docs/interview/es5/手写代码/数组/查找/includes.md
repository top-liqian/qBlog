# includes

includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。

## 参数

1. searchElement： 要查找的元素， **比较字符串和字符时是区分大小写的**
2. fromIndex（可选）
   + index >= length, 不会再数组中查找，返回false
   + 如果 fromIndex 为负值，计算出的索引将作为开始搜索searchElement的位置。如果计算出的索引小于 0，则整个数组都会被搜索。 index < 0, 按升序从 array.length + fromIndex 的索引开始搜

## 注意点

1. 0 的值将全部视为相等
2. 字符串和字符时是区分大小写的
3. 数组中存在NaN的话，[ ..., NaN ].includes(NaN)为true

## polyfill

```js
Array.prototype._includes = function (searchItem, fromIndex) {

    if (this == null) {
        throw new TypeError('"this" is null or not defined');
    }
    let len = this.length

    if (len === 0 || Math.abs(fromIndex) >= len) {
        return false
    }

    fromIndex = Math.max(fromIndex < 0 ? len - Math.abs(fromIndex) : fromIndex , 0)

    const sameValueZero = (x, y) => {
       return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y))
    }
    let i = 0
    
    while(i < len) { 
        if (i in this && sameValueZero(this[i], searchItem)) {
            return true
        }
        i++
    }
    return false
}

console.log([1, 2, 3]._includes(2))     // true
console.log([1, 2, 3]._includes(4))     // false
console.log([1, 2, 3]._includes(3, 3))  // false
console.log([1, 2, 3]._includes(3, -1)) // true
console.log([1, 2, NaN]._includes(NaN)) // true
```