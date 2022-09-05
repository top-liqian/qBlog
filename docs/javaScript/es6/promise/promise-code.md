### promise

#### promise出现的原因 --- 解决异步嵌套的问题

回调地狱带来的负面作用有以下几点：

   + 代码臃肿。
   + 可读性差。
   + 耦合度过高，可维护性差。
   + 代码复用性差。
   + 容易滋生 bug。
   + 只能在回调里处理异常。

有了promise可以很好的避免回调地狱产生的影响

#### 什么是promise

```js
new Promise(请求1)
  .then(请求2(请求结果1))
  .catch(处理异常(异常信息))
```
Promise 的写法更为直观，并且能够在外层捕获异步函数的异常信息。

```js
   // 采用观察者模式  then-搜集依赖 -> 异步触法resolve ->   取出依赖执行
    class MyPromise {
        constructor(excutor) {
            this._resolveQueue = []
            this._rejecctQueue = []

            const _resolve = (val) => {
                while (this._resolveQueue.length) {
                  const callback = this._resolveQueue.shift()
                  callback(val)
                }
            }
            const _reject = (val) => {
                while (this._rejecctQueue.length) {
                  const callback = this._rejecctQueue.shift()
                  callback(val)
                }
            }
            excutor(_resolve, _reject)
        }
        then (resolveFn, rejectFn) {
            this._resolveQueue.push(resolveFn)
            this._rejecctQueue.push(rejectFn)
        }
    }
    const p1 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('result')
        }, 1000);
    })
    p1.then(res => console.log(res))

    // test code

```

> 1. Promise本质是一个状态机，且状态只能为以下三种：Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态），状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
> 2. then方法接收两个可选参数，分别对应状态改变时触发的回调。then方法返回一个promise。then 方法可以被同一个 promise 调用多次。

补充代码
```js
    const PENGING = 'pending'
    const FULFILLED = 'fulfilled'
    const Reject = 'rejected'
    class MyPromise {
        construtor (executor) {
            this._status = PENGING
            this._resolveQueue = []
            this._rejectQueue = []
            let _resolve = (val) => {
                if (this._status !== PENGING) return
                this._status = FULFILLED
                while (this._resolveQueue.length) {
                    const callback = this._resolveQueue.shift()
                    callback(val)
                }
            }
            let _reject = (val) => {
                if (this._status !== PENGING) return
                this._status = Reject
                while (this._rejectQueue.length) {
                    const callback = this._rejectQueue.shift()
                    callback(val)
                }
            }
            executor(_resolve, _reject)
        }
        
        then (resolveFn, rejectFn) {
            this._resolveQueue.push(resolveFn)
            this._rejectQueu.push(rejectFn)
        }
    }
```

实现then的链式调用的方式

1. then方法需要返回一个```Promise```, 这样才能找到then方法
2. 回调需要按顺序执行，我们要等当前的Promise状态变更之后在执行下一个then收集回调，这就要求我们对then的返回值分类讨论

```js
    then (resolveFn, rejectFn) {
        return new Promise((resolve, reject) => {
            // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
            const fulfilledFn = value => {
                try {
                    let x = resolveFn(value)
                     // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
                    x instanceof Promise ? x.then(resolve, reject) : resolve(x)
                } catch (err) {
                    reject(err)
                }
            }
            this._resolveQueue.push(fulfilledFn)
            const rejectedFn = err => {
                try {
                    let x = rejectedFn(err)
                    x instanceof Promise ? x.then(resolve, reject) : reject(x)
                } catch (err) {
                    reject(err)
                }
            }
            this._rejectQueue.push(rejectedFn)
        })
    }

```

以上已经初步完成了链式调用，但是对于then方法，我们还需要处理两个细节

1. 值穿透：根据规范，如果 then() 接收的参数不是function，那么我们应该忽略它。如果没有忽略，当then()回调不为function时将会抛出异常，导致链式调用中断
2. 处理状态为resolve/reject的情况：其实我们上边 then() 的写法是对应状态为pedding的情况，但是有些时候，resolve/reject 在 then() 之前就被执行（比如Promise.resolve().then()），如果这个时候还把then()回调push进resolve/reject的执行队列里，那么回调将不会被执行，因此对于状态已经变为fulfilled或rejected的情况，我们直接执行then回调：

```js
   then (resolveFn, rejectFn) {
        typeof resolveFn !== 'function' ? resolveFn = value => value : null
        typeof rejectFn !== 'function' ? rejectFn = value => value : null
        return new Promise (resolve, reject) {
            const fulfilledFn = value => {
                try {
                    let x = resolveFn(value)
                    x instanceof Promise ? x.then(resolve, reject) : resolve(value)
                } catch (err) {
                   reject(err)
                }
               
            }
            

            const rejectedFn = value => {
                try {
                    let x = rejectFn(value)
                    x instanceof Promise ? x.then(resolve, reject) : reject(value)
                } catch (err) {
                    reject(err)
                }
            }

            switch(this._status) {
                case PENDING: 
                    this._resolveQueue.push(fulfilledFn)
                    this._resolveQueue.push(rejectedFn)
                    break;
                case  FULFILLED:
                    fulfilledFn(this._value)
                    break;
                case REJECTED:
                    rejectedFn(this._value)
                    break;
            }
           
        }
   }
```

兼容同步任务

Promise的执行顺序是```new Promise -> then()收集回调 -> resolve/reject执行回调```，然后放出完整代码。这一顺序是建立在executor是异步任务的前提上的，如果executor是一个同步任务，那么顺序就会变成new Promise -> resolve/reject执行回调 -> then()收集回调，resolve的执行跑到then之前去了，为了兼容这种情况，我们给resolve/reject执行回调的操作包一个setTimeout，让它异步执行

> 这里插一句，有关这个setTimeout，其实还有一番学问。虽然规范没有要求回调应该被放进宏任务队列还是微任务队列，但其实Promise的默认实现是放进了微任务队列，我们的实现（包括大多数Promise手动实现和polyfill的转化）都是使用setTimeout放入了宏任务队列（当然我们也可以用MutationObserver模拟微任务）

```js
  const PENDING = 'pending'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'
  class MyPromise {
    constructor (executor) {
      this._status = PENDING
      this._value = ''
      this._resolveQueue = []
      this._rejectQueue = []
      let _resolve = (val) => {
        const run = () => {
          if (this._status !== PENDING) return
          
          this._status = FULFILLED
          this._value = val
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      let _reject = (val) => {
        const run = () => {
          if (this._status !== PENDING) return
          
          this._status = REJECTED
          this._value = val
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      executor(_resolve, _reject)
    }
    then (resolveFn, rejectFn) {
      typeof resolveFn !== 'function' ? resolveFn = value => value : null
      typeof rejectFn !== 'function' ? rejectFn = value => value : null
      return new MyPromise ((resolve, reject) => {
        const fulfilledFn = value => {
          try {
            let x = resolveFn(value)
            x instanceof Promise ? x.then(resolve, reject) : resolve(x)
          } catch (err) {
            reject(err)
          }
        }
        const rejectedFn = value => {
          try {
            let x = rejectFn(value)
            x instanceof Promise ? x.then(resolve, reject) : resolve(x)
          } catch (err) {
            reject(err)
          }
        }
        switch(this._status) {
          case PENDING: 
           this._resolveQueue.push(fulfilledFn)
           this._resolveQueue.push(rejectedFn)
           break;
          case  FULFILLED:
           fulfilledFn(this._value)
           break;
          case REJECTED:
           rejectedFn(this._value)
           break;
        }
      })
    }
  }
```

#### 手动实现promise.catch

catch方法在于执行回调去获取reject的结果，所以只需执行一下then并传入callback就实现了，相对好理解。

```js
  class MyPomise {
    ...

    catch (errorFn) {
      this.then(null, errorFn)
    }
  }
```

#### 手动实现promise.all

业务场景中，我们经常会遇到不止一个promie的场景，因此需要合并一次执行多个promise，统一返回结果，Promise.all就是为了解决此问题。

all方法不需要实例化类，即可直接通过该类来调用的方法，即称之为“静态方法”，所以在class中书写要加static关键字

> 根据Promise A+规范，Promise.all可以同时执行多个Promise，并且在所有的Promise方法都返回完成之后才返回一个数组返回值。当有其中一个Promise reject的时候，则返回reject的结果。

```js
  class MyPomise {
    ...

    static all (promises) {
      return new MyPromise((resolve, reject) => {
        let result = [] // 存放promise resolve时的返回值
        /* 
        * @param {MyPromise} promise 每一个promise方法
        * @param {number} index 索引
        * @param {string[]} result 收集返回结果的数组
        */
        const deepPromise = (promise, index, result) => {
          // 边界值限定：所有执行完之后返回收集数组
          if (index > promises.length -1) {
            return result
          }
      
          if (typeof promise.then === 'function') {
            promise.then((res) => {
              index++
              result.push(res)
              deepPromise(promises[index], index, result)
            }).catch(err => {
              reject(err instanceof Error ? e.message : err)
            })
          } else {
            index++
            result.push(promise)
            deepPromise(promises[index], index, res)
          }
        }
      })

      deepPromise(promises[0], 0 , result)

      resolve(result)
    }
  }
```

#### 手动实现Promise.resolve

```js
  class MyPromise {
    static resolve (val) {
      return new MyPromise((resolveFn, rejectFn) => {
        resolveFn(val)
      })
    }
  }

  // 测试
  MyPromise.resolve('static resolve').then(res => {
    console.log(res)
  })

  // 打印结果
  // static resolve
```

#### 手动实现Promise.reject

```js
  class MyPromise {
    static reject (val) {
      return new MyPromise((resolveFn, rejectFn) => {
        rejectFn(val)
      })
    }
  }

  // 测试
  MyPromise.reject('static reject').catch(e => {
    console.log(res)
  })

  // 打印结果
  // static reject
```

#### 手动实现Promise.allSettled

ECMA官网最新更新了Promise的新的静态方法Promise.allSettled，那么这是一个怎样的方法呢？总体来讲他也是一个批量处理Promise的函数，但是我们已经有了Promise.all，为什么还需要allSettled。要解开这个问题，我们得回顾一下Promise.all。现有的Promise.all我们说过，如果Promise队列里有一个reject，那么他就只会返回reject，所以Promise.all不一定会返回所有结果，很显然Promise.allSettled能够解决这个问题。

```js
  // Promise A+
  // 创建三个promise
  const promise1 = Promise.resolve(1)
  const promise2 = Promise.resolve(2)
  const promise3 = Promise.resolve(3)

  Promise.allSettled([promise1,promise12,promise3]).then(res => {
    console.log(res)
  })

  // 打印结果
  /*
  [
    {status: 'fulfilished', value: 1},
    {status: 'fulfilished', value: 2},
    {status: 'fulfilished', value: 3}
  ]
  */

  // 添加一个reject
  const promise4 = Promise.resolve(1)
  const promise5 = Promise.reject('reject')
  const promise6 = Promise.resolve(3)

  Promise.allSettled([promise4, promise5,promise6]).then(res => {
    console.log(res, 'resolve')
  }).catch(e => {
    console.log(e)
  })

  // 打印结果
   /*
  [
    {status: 'fulfilished', value: 1},
    {status: 'rejected', value: 'reject'},
    {status: 'fulfilished', value: 3}
  ]
  */

```

可以看出来allSettled和all最大的区别就是，allSettled不管是resolve，还是reject都能完整返回结果数组，只不过每个数组项都是以对象的形式输出，status描述状态，value接收返回值。

实现MyPromise.allSettled

```js
  class MyPromise {
    static allSettled (promises) {
      return new MyPromise((resolve, reject) => {
        const result = []

        const deepPromise = (promise, index, result) => {
          if (index > promises.length -1) {
            return result
          }

          if (typeof promise.then === 'function') {
            promise.then(val => {
              index++
              result.push({ status: 'fulfilled', value: val })
              deepPromise(promises[index], index, result)
            }).catch(err => {
              index++
              result.push({ status: 'rejected', value: err })
              deepPromise(promises[index], index, result)
            })
          } else {
              index++
              result.push({ status: 'fulfilled', value: err })
              deepPromise(promises[index], index, result)
          }
        }

        deepPromise(promises[0], 0, result)
        resolve(result)
      })
    }
  }
  // 测试
  // 创建三个promise
  const promise1 = MyPromise.resolve(1)
  const promise2 = MyPromise.resolve(2)
  const promise3 = MyPromise.resolve(3)

  MyPromise.allSettled([promise1,promise12,promise3]).then(res => {
    console.log(res)
  })

  // 打印结果
  /*
  [
    {status: 'fulfilished', value: 1},
    {status: 'fulfilished', value: 2},
    {status: 'fulfilished', value: 3}
  ]
  */

  // 添加一个reject
  const promise4 = MyPromise.resolve(1)
  const promise5 = MyPromise.reject('reject')
  const promise6 = MyPromise.resolve(3)

  Promise.allSettled([promise4, promise5,promise6]).then(res => {
    console.log(res, 'resolve')
  }).catch(e => {
    console.log(e)
  })

  // 打印结果
   /*
  [
    {status: 'fulfilished', value: 1},
    {status: 'rejected', value: 'reject'},
    {status: 'fulfilished', value: 3}
  ]
  */
```


[出处](https://juejin.im/post/6866372840451473415)