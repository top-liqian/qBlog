# generator

```js
function * g() {
    let nothing = yield 'liqian'
    console.log('nothing', nothing)
    let name = yield 'hello'
    console.log('name', name)
    let say = yield 'world'
    console.log('say', say)
}
const result = g()
console.log(result.next())
console.log(result.next('zhangsan'))
console.log(result.next('没啥'))

```
+ generator碰到yield就停止

+ 下一次next传递的参数就是上一次的返回值

+ 抛出的异常可以在代码当中捕获到

yield产出的结果，可以等待上次的结果之后，在执行下一次操作，generator使得并行操作更像串行


## 类数组

>什么叫做类数组？
>
>具有索引，有长度且能遍历的数组称之为类数组

我们可以通过“元编程”来修改属性本身的逻辑，本身不能迭代的我们可以添加迭代方法，本身没有类型的我们可以添加类型

```js
let likeArray = {
    0:1, 1:2,2:3,length: 3,
    get [Symbol.toStringTag]() {
        return 'my tag'
    },
    // [Symbol.iterator]() {
    //     let index = 0
    //     return {
    //         next: () => {
    //             return { value: this[index], done: index++ === this.length }
    //         }
    //     }
    // }
    [Symbol.iterator]: function* () {
        let index = 0
        let len = this.length
        while(index !== len) {
            yield this[index++]
        }
    }
} 

let arr = [...likeArray]
console.log(arr)
```

## 封装异步co函数

generater的异步串行，需要每次手动执行next函数，自己实现一个co函数，用来迭代generator
```js
const fs = require('fs').promises
const path = require('path')

function* read () {
   const name = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8')
   const age = yield fs.readFile(path.resolve(__dirname, data), 'utf8')
   return age
}

function co(it) {
    return new Promise((resolve, reject) => {
        function next(data = ''){
            let { value, done } = it.next(data)
            if(!done) {
                Promise.resolve(value).then((data) => {
                    next(data)
                },reject)
            }else{
                resolve(value)           }
        }
        next()
    })
}

co(read()).then(data => {
    console.log(data)
})
```
