# findIndex

findIndex() 方法返回数组中满足提供的测试函数的第一个元素的数组下标。否则返回 -1

## 返回值

数组中第一个满足所提供测试函数的值，没有则返回-1

## 注意点

1. 不会改变原数组
2. 对数组中所有值都有效，对于稀疏数组来说，该方法的效率要低于那些只遍历有值的索引的方法。
3. 已删除的数组元素仍旧会访问到，访问到那一刻的时候默认是undefined值
4. 第一次调用callback函数的时候就已经确定了数组遍历的范围，后添加进来的元素不会被访问到， 如果数组中一个尚未被callback函数访问到的元素的值被callback函数所改变，那么当callback函数访问到它时，它的值是将是根据它在数组中的索引所访问到的当前值。
5. 如果提供了thisArgs，this值指向thisArgs，如果没有提供，则是undefined

## polyfill

```js
Array.prototype._findIndex = function (callback, thisArgs = undefined) {
    if (typeof callback !== 'function') {
        throw new Error()
    }
    if (this == null) {
        throw new Error('this is null or undefined')
    }

    let len = this.length
    let i = 0

    while(i < len) {
        if (callback.call(thisArgs, this[i], i, this)) {
            return i
        }
        i++
    }

    return -1
}

let arr = [ 0, 1, 2, 3, 4,, 5 ]

let index = arr._findIndex(function (it, i, array) {
  console.log(it, i, array, this)
  return it > 2
}, { name: '前端胖头鱼' })

console.log(index) // 3
```
