# promise相关的面试题

## 1. promise解决什么样的问题

1. 我们写代码都是基于回掉的，在串行模式当中，上一个函数的输出通常作为下一个函数的输入，这样就容易形成回掉地狱
2. 解决异步并发问题，promise.all
3. 错误处理变得更加容易

## 2. 什么是promise？

Promise实际上是一个构造函数，并且是以一个函数作为参数，promise是具备状态的，promise主要有3种状态，pending、reject、fullfield，默认是pending的状态，promise的状态都是从pending状态转变成成功状态或者失败状态且不可逆，promise的执行器回掉函数（executor）是立即执行函数，接受两个函数作为参数，resolve函数代表成功状态的函数，reject函数代表失败状态函数且会有一个失败原因抛出，两个函数主要是对状态的改变的一个说明，并且通知订阅者状态发生了改变，由于两种方式会使promise走向失败状态，reject和 throw Error，所以executor是放在trycatch函数体当中执行

## 3. 为什么promise的then方法要返回一个 promise的实例

因为then方法实现了链式调用

## 4. 为什么不效仿jquery方法的return this来实现链式调用？

因为promise是具有状态的，且在promise的excutor的回掉函数当中可能会具有异步任务，且promise的状态都是从pending状态转变成成功状态或者失败状态且不可逆，所以此处返回一个promise的实例刚好，因为新的promise的实例具有新的状态转变

## 5. 为什么在新返回的promise的实例当中要不断的调用resolve函数？

因为then方法在返回值不是一个promise的时候，除抛出异常外，都会走到下一个promise的resolve函数当中，所以我们需要将此次的返回值直接传递给resolve函数使得此次的promise走向成功状态

## 6. excutor是被包裹在trycatch代码块当中执行的，所以会捕获最外层的异常，一旦promise内部存在异步任务且抛出异常的情况下，就不能够捕获到了，怎么办？

在then方法当中继续包裹trycatch代码块

## 7. let promise2 = p.then(() => { then: function () {} })` 这是一个promise吗？

是，有then有函数就是promise

## 8. 实现一个完整版的promise

```js
// 1. 定义promise的3种状态
const PENDING = "PENDING";
const SUCCESS = "FULFILLED";
const FAIL = "REJECTED";

// 2. 定义class类
class Promise {
    // 3. 定义constructor函数
    constructor(executor) {
        // 5. 定义一些常量用来存储
        this.status = PENDING; // 5.1 - 初始状态
        this.reason = undefined; // 5.3 - 存储失败的原因
        this.onResolvedCallbacks = []; // 5.4 用来存储成功状态的回调函数队列
        this.onRejectedCallbacks = []; // 5.5 用来存储失败状态的回调函数队列

        // 6. 定义resolve函数
        const resolve = value => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = SUCCESS;
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        };
        // 7. 定义reject函数
        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = FAIL;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        // 4. 使用try-catch代码块包裹，执行ececutor函数
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
}
```

## 9. 实现Promise的then方法

promise具备一个then函数，接受两个函数作为参数

- state的状态是成功状态调用onFulfilled函数，如果onFulfilled不是一个函数，需要被忽略
- state的状态是失败状态调用onRejected函数，如果onRejected不是一个函数，需要被忽略
- 如果promise内是一个异步的任务，那state的状态依旧是pending状态，此时需要将onFulfilled函数和onRejected函数分别存到成功函数队列和失败函数队列，当状态发生改变的时候一起执行并且一个promise当中可以多次调用then方法，所有的成功和失败的回掉函数都是会按照顺序进行执行

根据promiseA+规范来看，promise的then函数的返回值具有以下的特点：
1. 返回值 != promise, 无论data是什么都会被传递到下一个then函数的resolve当中，data作为resolve参数，如果想再下一个then函数当中执行reject，那么需要在当前的then函数当中抛出异常`throw new Error()`
2. 返回值是一个pending状态的promise，那么回掉链会中断
3. 返回值 = promise实例，通过Promise的返回值决定下一次then方法的走向，then方法当中的onFulfilled和onRejected函数必须异步执行且给出解决方案可以包裹在宏任务或者微任务当中执行，所以将所有的trycatch代码块包裹在setTimeout当中，并且提供一个解析返回的promise的值的预处理函数
4. 值穿透问题：如果onFulfilled不是一个函数，需要被忽略，将上一个函数的返回值传递给下一个then函数，onRejected是一样的道理 

```js
class Promise {
    then(onFulfilled, onRejected) {
        // 1. 重新定义onFulfilled函数，如果不是函数，需要执行以下拿到返回值
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        // 2. 重新定义onRejected函数，如果不是函数，就抛出一个异常
        onRejected = typeof onRejected === 'function' ? onRejected :   err => {
            throw err
        }
        // 3. 定一个常量存储要返回的promise实例并返回
        let promise2;
        // 4. 定义promise实例，使用promise的值的预处理函数进行处理
        promise2 = new Promise((resolve, reject) => {
            // 分为3种情况进行处理
            // 5.1 如果是成功状态，返回值x是执行onFulfilled函数
            if (this.status === SUCCESS) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            // 5.2 如果是失败状态，返回值x是执行onRejected函数
            if (this.status === FAIL) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            // 5.3 如果是pending状态，将onFulfilled函数和onRejected函数分别存到成功函数队列和失败函数队列
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
            }
        })
        return promise2
    } 
}

// 提供预处理函数

function resolvePromise(promise2, x, resolve, reject) {
    // 解析promise2和x之间的关系，来判断promise2是走成功还是走失败
    // 1. 如果promise2和x相等，也就是promise2返回值是一个promise，那么就会陷入无限循环，相当于自己等自己状态改变，永远等不到就会抛出异常，promise规范当中规定好使用`new TypeError`抛出异常
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called; // 6. resolve或者reject存在多个的情况下，只能是成功resolve或者失败reject的一种情况，且是第一次执行的情况,此时需要一个标记的状态位来表示是否已经执行过resolve或者reject
    // 3. 如果x是对象或者是一个函数
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        try {
            
            let then = x.then
            if (typeof then === 'function') {
                // 4. 并且具有then方法，如果then方法是一个函数，那么就将x作为then的this指向，执行then方法
                then.call(x, y => {
                    if (called) return
                    called = true
                    // 4.1 如果then方法当中返回的还是一个promise的实例，那么将递归这个解析函数直到返回的是一个resolve常量或者reject常量
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else { 
                // 5. 如果then方法不是一个函数，那就直接`resolve(x)`
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {
        // 2. 如果x是一个普通值，直接`resolve(x)`
        resolve(x)
    }
}
```

## 8. promise的测试方法

promisea+ 当中提供了测试方法，会调用deferred方法获取到promise实例

通过npm install promises-aplus-tests -g 全局安装

promises-aplus-tests promise.js 来检查是否符合规范

所以我们需要提供一个延迟对象的方法

```js
Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
```

## 9. Promise.resolve

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

## 10. Promise.reject

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

## 11. Promise.catch

```js
class Promise{
    catch(onRejected) {
        return this.then(null, onRejected)
    }
}
```
## 12. Promise.prototype.finally

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

## 13. Promsie.prototype.all

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

## 14. Promsie.allSettled

接收一个可迭代对象，其中每个成员都是Promise。在所有给定的Promise都已经fulfilled或rejected后返回一个Promise，并带有一个对象数组，每个对象表示对应的Promise结果 相较于Promise.all，后者会在任何一个Promise为rejected时立即结束

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

## 15. Promsie.race

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

## 16. 可以将node的异步api转换成promise

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

## 17. Promise then 第二个参数和catch的区别是什么?

1. reject是用来抛出异常的，catch是用来处理异常的；
2. reject是Promise的方法，而then和catch是Promise实例的方法

主要区别在于：

如果resolve当中抛出去的异常会由catch捕获，但是reject函数当中抛出去的异常catch捕获不到，then的第二个参数和catch捕获错误信息的时候会就近原则，如果是promise内部报错，reject抛出错误后，then的第二个参数和catch方法都存在的情况下，只有then的第二个参数能捕获到，如果then的第二个参数不存在，则catch方法会捕获到。

## 18. 如何实现 promise.map，限制 promise 并发数

实现一个 promise.map，进行并发数控制，有以下测试用例

```js
pMap([1, 2, 3, 4, 5], x => Promise.resolve(x + 1))

pMap([Promise.resolve(1), Promise.resolve(2)], x => x + 1)

// 注意输出时间控制
pMap([1, 1, 1, 1, 1, 1, 1, 1], x => sleep(1000), { concurrency: 2 })
```

```js
function pMap(list, mapper, concurrency = Infinity) {
  // list 为 Iterator，先转化为 Array
  list = Array.from(list)
  return new Promise((resolve, reject) => {
    let currentIndex = 0
    let result = []
    let resolveCount = 0
    let len = list.length
    function next() {
      const index = currentIndex
      currentIndex++
      Promise.resolve(list[index]).then(o => mapper(o, index)).then(o => {
        result[index] = o
        resolveCount++
        if (resolveCount === len) { resolve(result) }
        if (currentIndex < len) { next() }
      })
    }
    for (let i = 0; i < concurrency && i < len; i ++) {
      next()
    }
  })
}
```
   