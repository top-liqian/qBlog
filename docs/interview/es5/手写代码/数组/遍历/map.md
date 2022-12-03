# 手写map源码

map方法创建一个新数组，其结果是原数组的每一项都执行一次给定的function函数后的返回值

## 关注点

1. map 方法会给原数组中的每个元素都按顺序调用一次  callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组
2. callback 函数只会在有值的索引上被调用
3. 那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。
4. 如果 thisArg 参数提供给map，则会被用作回调函数的this值。否则undefined会被用作回调函数的this值。
5. map 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）
6. map 方法处理数组元素的范围是在 callback 方法第一次调用之前就已经确定了。调用map方法之后追加的数组元素不会被callback访问。如果存在的数组元素改变了，那么传给callback的值是map访问该元素时的值。在map函数调用后但在访问该元素前，该元素被删除的话，则无法被访问到
   
```js
  Array.prototype.map = function (callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    // 将数组转换成类数组
    let O = Object(this)
    // 获得数组长度
    let len = O.length >>> 0
    // 可选项 callbackfn 函数执行时的 this 值赋值给T
    let T = thisArg
    // 创建同长度新数组作为返回
    let A = new Array(len)
    // 新数组索引
    let k = 0
    // 依次执行callbackfn函数
    while (k < len) {
      if (k in O) {
        let cur = O[k]
        let mappedValue = callbackfn.call(T, cur, k, O)
        A[k] = mappedValue
      }
      k++
    }
    // 返回执行过后的数组
    return A
  }
```

问题：map 并不会修改原数组，不过也不是绝对的，如果你在 callbackfn 中修改了原数组，那还是会改变。那问题来了，修改后会影响到 map 自身的执行吗？
  
  答案是会的！不过得区分以下几种情况。

  + 原数组新增元素：因为 map 第一次执行时 length 已经确定了，所以不影响

    + 原数组修改元素：传递给 callbackfn 的元素是 map 遍历到它们那一瞬间的值，所以可能受影响

    + 修改当前索引之前的元素，不受影响

    + 修改当前索引之后的元素，受影响


  + 原数组删除元素：被删除的元素无法被访问到，所以可能受影响

  + 删除当前索引之前的元素，已经访问过了，所以不受影响

  + 删除当前索引之后的元素，受影响