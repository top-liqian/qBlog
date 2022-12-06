# 字节编程题：实现一个add方法

```js
add(1)(2,3)(4).value()   

// 输出： 10
```

**实现方法：考察闭包+this**

```js
function myAdd(...args) {
    const _add = function (...args1) {
      return myAdd(...args, ...args1)
    }
    _add.value = () => args.reduce((pre,cru) => pre + cru)
    return _add
}

const result = myAdd(1)(2,3)(4).value()  

console.log('result', result)
```