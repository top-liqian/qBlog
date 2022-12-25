# promise相关的面试题

## 1. promise解决什么样的问题

1. 我们写代码都是基于回掉的，在串行模式当中，上一个函数的输出通常作为下一个函数的输入，这样就容易形成回掉地狱
2. 解决异步并发问题，promise.all
3. 错误处理变得更加容易

## 2. 什么是promise？

Promise 对象是异步编程的一种解决方案，最早由社区提出。Promise 是一个构造函数，接收一个函数作为参数，返回一个 Promise 实例。一个 Promise 实例有三种状态，分别是pending、resolved 和 rejected，分别代表了进行中、已成功和已失败。实例的状态只能由 pending 转变 resolved 或者rejected 状态，并且状态一经改变，就凝固了，无法再被改变了。
状态的改变是通过 resolve() 和 reject() 函数来实现的，可以在异步操作结束后调用这两个函数改变 Promise 实例的状态，它的原型上定义了一个 then 方法，使用这个 then 方法可以为两个状态的改变注册回调函数。这个回调函数属于微任务，会在本轮事件循环的末尾执行。

## Promise的缺点：

无法取消Promise，一旦新建它就会立即执行，无法中途取消。
如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## Promise的特点：

+ 对象的状态不受外界影响。promise对象代表一个异步操作，有三种状态，pending（进行中）、fulfilled（已成功）、rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，这也是promise这个名字的由来——“承诺”；
+ 一旦状态改变就不会再变，任何时候都可以得到这个结果。promise对象的状态改变，只有两种可能：从pending变为fulfilled，从pending变为rejected。这时就称为resolved（已定型）。如果改变已经发生了，你再对promise对象添加回调函数，也会立即得到这个结果。这与事件（event）完全不同，事件的特点是：如果你错过了它，再去监听是得不到结果的。

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
   
## 19.return promise 与 return await promise 有何区别

return promise:

返回结果为 Promise {fulfilled 或者 rejected}

return await promise:

返回结果为 Promise {pending}, 因为 async 函数总是返回一个 promise (resolved promise?

## 20.输出下面的结果

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
```

0 1 2 3 4 5 6

为什么 return Promise 为什么产生了 2 次微任务?

根据 promise/A+ ，结果应该为 0 1 2 4 3 5 6 ，也就是根据 Promise/A++ 标准只产生了 1 次微任务, 按照 PromiseA+的规范，此处应该是 2.3.2 标准：If x is a promise ,根据 A+准则的源码是以这么处理的：

1. 遇到.then 就创建一 pending 状态的 Promise 保存起来。
2. 如果是一个普通的 number 类型，则直接用 Promise.resolve(number)即可。 如果是 promise 类型的话，需要做一个状态同步操作，代码如下： 其中 x 是接收的已经 resolved 的 Promise，即(Promise.resolve(4))，而 this 指向我们刚创建的 pending 状态的 Promise

也就是说，这 1 个 micro task 的作用就是同步状态。

如果 resolve()的括号内的结果是一个 promise 的话，会多执行两个micro task

至于还有一个微任务的产生原因是来自：v8 和 PromiseA+规范的差异。 v8 中的 Promie 实现是通过 C++编写的，与 promise/A+规范的不同之处在于，v8 并没有对x is a promise 的情况做处理，而是只有对x is an object的处理。所以多了一步 micro task：作用就是将 resolveWithPromise => resolveWithThenableObject

## 21.输出下面的结果

```JS
new Promise((resolve) => {
  let resolvedPromise = Promise.resolve();
  resolve(resolvedPromise);
}).then(() => {
  console.log("resolvePromise resolved");
});

Promise.resolve()
  .then(() => {
    console.log("promise1");
  })
  .then(() => {
    console.log("promise2");
  })
  .then(() => {
    console.log("promise3");
  });
```
promise1, promise2, resolvePromise resolved ,promise3

## 22. 实现 Promise.retry，成功后 resolve 结果，失败后重试，尝试超过一定次数才真正的 reject

```js
  Promise.retry = (promiseFn, time = 3) => {
    return new Promise(async (resolve, reject) => {
      while (time--) {
        try {
          console.log('------', time)
          let result = await promiseFn()
          console.log('result', result)
          resolve(result)
          break
        } catch (err) {
          console.log('########', time)
          if (!time) reject('time 到了，但是仍然没有执行成功')
        }
      }
    })
  }

  const promiseFn = () => {
    return new Promise((resolve, reject) => {
      reject()
    })
  }

  Promise.retry(promiseFn)
```
