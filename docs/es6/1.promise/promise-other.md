# promise的其他方法

## Promise.resolve

直接返回一个promise实例即可，并且将返回的promise实例执行resolve函数，将参数传递给resolve

但是仍然存在`Promise.resolve(new Promsie())`的情况，ecmascript 规定了resolve方法是可以递归的，所以需要改造promise的constructor构造器当中的resolve方法，需要判断返回值value是否是promise，如果是promise则将then方法进行返回

```js
class Promise{
    static resolve(data) {
        return new Promise((resolve, reject) => {
            resolve(data)
        })
    }
}
```

## Promise.reject

直接返回一个promise实例即可，并且将返回的promise实例执行reject函数，一个promise已经是失败状态时就已经结束了

```js
class Promise{
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
}
```

## Promise.catch

```js
class Promise{
    catch(onRejected) {
        return this.then(null, onRejected)
    }
}
```

## Promise.prototype.finally

promise无论是成功状态还是失败状态，promise都会走finally的逻辑, 并且在finally内部可能会存在返回一个具备异步任务的promise实例，所以需要使用`Promise.resolve`包裹一层，实现等待操作

```js
Promise.prototype.finally = function (final) {
    return this.then((value) => {
        return Promise.resolve(final()).then(() => value )
    }, reason => {
        return Promise.resolve(final()).then(() => { throw reason })
    })
}
```

## 可以将node的异步api转换成promise

本质其实就是一个高阶函数，返回的函数内部是一个promise的实例

```js
const Promise = require('./promise-other')
const fs = require('fs')
const path = require('path')

function promisify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
        fn(...args, function (err, data) {
            if(err) reject(err)
            resolve(data)
        })
    })
  }
}

let readFile = promisify(fs.readFile)

readFile(path.resolve(__dirname, 'name.txt'), 'utf-8').then(data => {
    console.log(data) // 你好
})
```

## Promsie.prototype.all

多个promise一起执行，只要其中一个promise的状态是失败态，直接reject

```js
Promise.all = function(values){
    return new Promise((resolve,reject)=>{
        let arr = []; // arr[3] = 2  arr.length = 4
        let i = 0;
        let processData = (key,value)=>{
            arr[key] = value; // after函数
            if(++i === values.length){
                resolve(arr);
            }
        }
        for(let i = 0 ; i < values.length;i++){
            let current = values[i];
            Promise.resolve(current).then(data => {
                processData(i,data);
            }, reject)
        }
    })
}
```

## Promsie.allSettled

当多个promise同时请求的时候，无论成功与否都会将它的状态和结果以数组的形式返回给then函数

```js
Promise.allSettled = function (values) {
    return new Promise((resolve, reject) => {
        let result = []
        let times = 0
        let processData = (key, value) => {
            result[key] = value
            if(++times === values.length) {
                resolve(result)
            }
        }
        for(let i = 0 ; i < values.length;i++){
            const current = values[i];
            Promise.resolve(current).then((data) => {
                processData(i, { status: 'fulfilled', data })
            }).catch(reason => {
                processData(i, { status: 'rejected', reason })
            })
        }
    })
}
```

## Promsie.race

当多个promise同时请求的时候，最先完成的那个先返回，无论成功与否

```js
Promise.race = function (values) {
    return new Promise((resolve, reject) => {
        values.forEach(item => {
            Promise.resolve(item).then(resolve, reject)
        })
    })
}
```

## Promise.race超时处理封装

如果想超时处理，那么需要对外暴露promise的reject方法结合Promise.race

1. 提供 withAbort超时封装函数
2. 内部构造一个innerPromise实例，将reject暴露给局部变量abort
3. 根据用户传进来的userPromise和自己构造的innerPromise，看谁先完成，结果给临时变量p
4. 将abort挂载在p上
5. 将完成的promise拿到的结果传递给then函数

如果用户提前调用了p.abort方法，说明userPromise先完成，代表这个promise已经超时了

```js
const Promise = require("./promise-other");

function withAbort(userPromise) {
    let abort
    let innerPromise = new Promise((resolve, reject) => { abort = reject })
    let p = Promise.race([innerPromise, userPromise])
    p.abort = abort
    return p
}

let p = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('success')
    }, 1000)
})

p = withAbort(p)

p.then((data) => {
    console.log(data)
}, reason => {
    console.log(reason)
})

setTimeout(() => {
    p.abort('失败了，超时了')
})
```
