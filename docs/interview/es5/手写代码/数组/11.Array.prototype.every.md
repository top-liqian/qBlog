# every

every方法测试一个数组内的所有元素是否都能通过某一个函数的测试，返回值是一个boolean

## 关注点

1. every方法为数组每一个元素都执行一次callback函数，直到找到一个会使calkback函数返回false的元素，如果存在，every函数立刻返回false，否则callback函数为每一个元素返回true，every函数就会返回true
2. every函数只会为那些已经被赋值的索引调用
3. 不会为那些删除的或从未被赋值的索引调用
4. 如果为 every 提供一个 thisArg 参数，则该参数为调用 callback 时的 this 值。如果省略该参数，则 callback 被调用时的 this 值，在非严格模式下为全局对象，在严格模式下传入 undefined
5. every 不会改变原数组
6. every 遍历的元素范围在第一次调用 callback 之前就已确定了。在调用 every 之后添加到数组中的元素不会被 callback 访问到。如果数组中存在的元素被更改，则他们传入 callback 的值是 every 访问到他们那一刻的值。那些被删除的元素或从来未被赋值的元素将不会被访问到。
7. 传入的空数组，ervery就会返回true
   
## pollify

```js
Array.prototype._every = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new Error()
    }
    
    let len = this.length
    let i = 0
    
    while(i < len) {
        if (i in this && !callback.call(thisArg, this[i], i , this)) {
            return false
        }
        i++
    }
    return true
}

let emptyArr = []

console.log(emptyArr._every((it) => it > 0)) // true

let arr = [ 0, 1, 2, 3, 4,, 5, -1 ]

delete arr[7]

console.log(arr._every((it) => it >= 0)) // true
```