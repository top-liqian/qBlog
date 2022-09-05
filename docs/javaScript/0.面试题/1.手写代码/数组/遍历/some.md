# some

some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。

## 关注点

1. some() 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。如果找到了这样一个值，some() 将会立即返回 true。否则，some() 返回 false。callback 只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用。
2. some() 被调用时不会改变数组。
3. some() 遍历的元素的范围在第一次调用 callback. 前就已经确定了。在调用 some() 后被添加到数组中的值不会被 callback 访问到。如果数组中存在且还未被访问到的元素被 callback 改变了
4. 如果用一个空数组进行测试，在任何情况下它返回的都是false。
5. 如果一个thisArg参数提供给some()，它将被用作调用的 callback的 this 值。否则， 它的 this value将是 undefined。

## polyfill

```js
Array.prototype._some = function (callback, thisArg) {
    if (typeof callback !== 'function') {
       throw new Error()
    }

    let len = this.length
    let i = 0

    while(i < len) {
        if (i in this && callback.call(thisArg, this[i], i , this)) {
            return true
        }
        i++
    }
    return false
}

let emptyArr = []
// 空数组直接返回true
console.log(emptyArr._some((it) => it > 0)) // false
let arr = [ 0, 1, 2, 3, 4,, 5, -1 ]

delete arr[7]

console.log(arr._some((it) => it < 0)) // false
console.log(arr._some((it) => it > 0)) // true
```

