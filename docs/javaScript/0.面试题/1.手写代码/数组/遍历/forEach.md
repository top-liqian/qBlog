# 手写forEach源码

## 语法

arr.forEach(func, thisArgs)

+ func为数组每一项执行func函数
+ **thisArgs**用作数组执行func函数时的**this**值，如果省略了 **thisArg** 参数，或者其值为 **null** 或 **undefined**，**this** 则指向全局对象。

## 返回值

undefined

## 一些mdn上不经常关注的点

1. forEach函数为数组的每一项执行callback函数，返回值是undefined，并且不可链式调用
2. forEach() 方法按升序为数组中含有效值的每一项执行一次 callback 函数
   + **forEach()** 遍历的范围在第一次调用** callback** 前就会确定，调用 forEach 后添加到数组中的项不会被 callback 访问到。
   + 如果**已经存在的值**被改变，则传递给 callback 的值是 forEach() 遍历到他们那一刻的值。
   + 那些**已删除**或者**未初始化的项**将被跳过（例如在稀疏数组上）。
3. forEach() 被调用时，不会改变原数组，也就是调用它的数组（尽管 callback 函数在被调用时可能会改变原数组）。
4. 除了抛出异常以外，没有办法中止或跳出 forEach() 循环

```js
let demoArr = [ 1, 2, 3, 4, , 5 ]

demoArr.forEach((it, i) => {
  if (i === 1) {
    // 后添加进去的不会被访问到
    demoArr.push(5)
  } else if (i === 2) {
    // 4将不会被访问到，而4-4会被访问到
    demoArr.splice(3, 1, '4-4')
  }

  console.log(it)
})
```

## 代码实现

```js
Array.prototype.forEach = function (callbackfn, thisArg) {
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
  // 新数组索引
  let k = 0
  // 依次执行callbackfn函数
  while (k < len) {
    if (k in O) {
      let cur = O[k]
      callbackfn.call(T, cur, k, O)
    }
    k++
  }
}
```