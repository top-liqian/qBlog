# reduce

reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。

# 返回值

函数累计处理的结果

## 注意点

## polyfill

```js
Array.prototype.reduce = function (callbackfn, initalValue) {
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this)
    let len = O.length >>> 0
    let k=0, accumulator

    if (initalValue) {
      accumulator = initalValue
    } else {
      if (len === 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      let flag = false
      while(!flag && (k < len)) {
        flag = k in O
        if (flag) {
          accumulator = O[k]
        }
        k++
      }
    }

    while(k< len) {
      if (k in O) {
        let cru = O[k]
        accumulator = callbackfn.call(undefined, accumulator, cru, k, O)
      }
      k++
    }
    return accumulator
}

const sum = [1, 2, 3, 4]._reduce((prev, cur) => {
  return prev + cur;
})

console.log(sum)
```