# reduceRight

reduceRight 方法对数组中的每个元素执行一个由您提供的reducer函数(降序执行)，将其结果汇总为单个返回值

和reduce很类似，唯一不同的是reduceRight从右往左遍历

## polyfill

```js
Array.prototype._reduceRight = function (callback, initialValue) {
    if (typeof callback !== 'function') {
       throw new Error()
    }

    let len = this.length
    let i = len - 1
    let pre = initialValue
    if (typeof pre === 'undefined') {
        pre = this[i]
        i--
    }
    while(i >= 0) {
        if (i in this) {
            pre = callback(pre, this[ i ], i, this)
        }
        i--
    }
    return pre
}

const sum = [1, 2, 3, 4]._reduceRight((prev, cur) => {
  console.log(cur)
  return prev + cur;
})

// 3 2
// 2 1
// 1 0

console.log(sum) // 10

```
