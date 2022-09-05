# 函数组合

函数组合：如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间过程的函数合并成一个函数

+ 函数就像是数据的管道，函数组合就是把这些管道连接起来，让数据穿过多个管道形成最终的结果
+ 函数组合默认是从右到左执行

```js
function compose(f,g) {
    return function (value) {
        return f(g(value))
    }
}
```

## 求数组最后一个元素

```js
const reverse = array => array.reverse()
const getFirst = array => array[0]
function compose(f,g) {
    return function (value) {
        return f(g(value))
    }
}

const last = compose(getFirst, reverse)
console.log(last([1,2,3,4]))
```

## lodash中的组合函数

+ lodash中的组合函数flow()或者flowRight()，他们都可以组合多个函数
+ flow()是从左到右运行
+ flowright()是从右到左运行，使用的更多一些

## 组合函数的实现原理

```js
function flowRight(...args) {
    return function (value) {
        return args.reverse().reduce((acc,fn) => {
            return fn(acc)
        }, value)
    }
}
// 箭头函数的写法
const flowRight = (...args) => value => args.reverse().reduce((acc,fn) => fn(acc), value)
```

## 函数组合满足结合律

结合律：我们即可以把函数A和函数B组合，也可以将函数A和函数C组合，得到的结果应该是一样的

