## 1. 为什么需要promise

直接使用传统的回调函数的方式去完成复杂的异步流程，就会出现函数嵌套的问题，非常不利于后面的维护，为了使回调函数可以使用更优雅的方式进行调用，CommonJs社区提出了Promise的规范，目的在于用一种更合理更强大的解决方案，在ES2015中被标准化，成为语言规范，可以让异步操作变得近乎【同步化】，尽可能的避免回调地狱

所谓Promise，就是一个对象，用来解决异步任务的结束过后成功还是失败，就像是内部对外部的一种承诺待定状态（pending），最后有可能成功（fulfilled），也有可能失败（rejected），无论是成功还是失败，都存在一定的反应即任务自动执行，一旦明确了结果就不能在改变了

## 2. promise的基础

1. promise 会有三种状态，`【进行中-pending】【已完成-fulfullied】【已拒绝-rejected】`，进行中的状态可以转换成已完成和已拒绝状态，此过程不可逆，已经更改过的状态没有办法继续更改
2. es6中的构造函数promise，我们实例化之后需要传入一个函数，它接受两个函数参数resolve和reject，执行第一个函数【resolve】之后就会把当前的promise更改成`【已完成】`状态，执行第二个函数【reject】之后就会把当前的promise更改成`【已拒绝】`状态，
3. promise提供了`.then`方法，接受两个函数作为参数，当promise实例状态从`【pending】`转换成`【fulfilled】`状态时执行第一个函数参数，同时resolve若有返回值，将传递给此函数；当promise实例状态从【pending】转换成【rejected】状态时执行第二个函数参数，同时reject若有返回值，将传递给此函数
4. 【已拒绝】的promise，后续可以通过.then的第二个函数参数捕获；也可以通过.catch捕获；也可以通过try catch捕获

## 3. 如何封装异步操作为promise

封装一个ajax请求：

```js
  function ajaxAsync(url) {
    return new Promise((resolve, reject) => {
      var client = new XMLHttpRequest()
      client.open("GET", url)
      client.onChange = function () {
        if (this.readyState !== 4) return
        if (this.status === 200) {
          resolve(this.response)
        } else {
          reject(new Error(this.statusText))
        }
      }
      client.send()
    })
  }
  ajaxAsync('http://www.baidu.com').then(() => {}, () => {})
```

1. 我们可以很轻松的将异步函数封装成promise，尤其是异步函数，改为promise之后就可以进行链式调用，增强可读性
2. 将带有回调函数的异步改为promise也很简单，只需要在内部实例化promise之后，在原来执行回调函数的地方对应执行promise的状态函数即可

## 4. promise的规范解读

**要求**

1. 在执行上下文堆栈仅包含平台代码之前，不能调用`onFulfilled`和`onRejected`
2. `onFulfilled`和`onRejected`必须作为普通函数调用（即非实例化调用，这样函数内部this非严格指向window）
3. then方法可以被同一个`promise`多次调用
4. then方法必须返回一个promise对象 promise2 = promise1.then(onFulfilled, onRejected)
  + 只要`onFulfilled`或者`onRejected`返回一个值`x`，promise2都会进入`onFulfilled`状态
  + 如果`onFulfilled`或者`onRejected`抛出一个异常`e`，则`promise2`必须拒绝执行，并返回拒因`e`
  + 如果`onFulfilled`不是函数且`promise1`状态变成已完成，`promise2`必须成功执行并且返回相同的值
  + 如果`onRejected`不是函数且`promise1`状态变成已拒绝，`promise2`必须拒绝执行回调并且返回相同拒因


```js
  const promise = new Promsie((resolve, reject) => {
    reject(new Error('error'))
  })

  // 常见面试题-关键考点1
  promise
    .catch(err => {
      console.log(err)
    })
    .then(() => {
      console.log('promise2 fulfilled')
    })

  // error
  // promise2 fulfilled
  // 原因： promiseA+规范只要promise返回一个x值，就会进入fulfilled状态，所以执行完catch函数后仍然可以执行.then函数

  // 常见面试题-关键考点2
  promise
    .catch(err => {
      throw err
    })
    .then(() => {
      console.log('promise2 fulfilled')
    })
    .catch(err => {
      console.log('err')
    })
  // err
  // 原因： promiseA+规范只要promise抛出异常throw出去，then就不会执行
```
## 5. promise的解决过程

promise的解决过程是一个抽象的操作，其需要输入一个promise和一个值，我们表示为[[Resolve]](promise, x)(这句话的意思就是把promise resolve了同时传入一个x值)


如果`x`有`then`方法且按上去像一个`promise`，解决程序即尝试使promise接受`x`的状态，否则其用`x的值执行promsie`
  + 如果promise和x指向同一个对象，以TypeError为拒因拒绝执行promise
  + 如果x是一个promise
    - x => pending，promise需要保持pending直至x被执行或者被拒绝
    - x => fulfilled，用相同的值执行promise
    - x => rejected，用相同的拒因拒绝promise

```js
  const promise = new Promise((resolve, reject) => {
   resolve()
  })

  const promise2 = promise()
    .then(() => {
      return 'string'
    })

  
  promise2.then(content => {
    console.log('content', content) 
  })

  // content:string

  const promise3 = promise()
    .then(() => {
      return '123'
    })
  const promise4 = promise()
    .then(() => {
      return promise3
    })

  promise4.then(content => {
    console.log('content', content) 
  })

  // content:123
```
  + 如果x是一个对象或者普通函数
    - 如果x具有then方法，首先尝试执行x.then
    - 如果读取x.then的值抛出错误e，则以e为拒因拒绝promise
    - 如果then是函数，将x作为函数的作用域this调用，传递两个回调函数作为参数，第一个参数叫做`resolvePromise`，第二个参数叫做`rejectPromsie`
      + `resolvePromise`如果被执行，then方法则被变成已完成状态
      + `rejectPromsie`如果被执行，then方法则被变成已拒绝状态
      + `resolvePromise`和`rejectPromsie`同时被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略其他的调用
      + 如果调用then抛出异常e，如果`resolvePromise`或者`rejectPromsie`被调用，则忽略，否则以e为拒因拒绝promise
    - 如果then不是函数，以x为参数将promise变成已完成状态
  + 如果x不是对象或者函数，以x为参数将promise变成已完成状态
```js
  const promise = new Promise((resolve, reject) => {
   resolve()
  })

  // 如果读取x.then的值抛出错误e，则以e为拒因拒绝promise
  const obj = {
    get then(){
      throw new Error('error')
    }
  }

  promise
    .then(() => {
      return obj
    })
    .then((obj) => {
      console.log('obj', obj)
    })
    .catch(error => {
      console.log('123', error)
    })
  // 123 Error: error at Object.get then [as then] (<anonymous>:7:13)

  //  如果then是函数

  const obj1 = {
    then(resolvePromise, rejectPromsie) {
      // resolvePromise('123') // 1
      // rejectPromsie('123') // 2
      // 3
      // resolvePromise('123')
      // rejectPromsie('123') 
      // 4
      rejectPromsie('123') 
      throw new Error('throw error')
    }
  }

  promise
    .then(() => {
      return obj1
    })
    .then(content => {
      console.log('content', content)
    })
    .catch(error => {
      console.log('123', error)
    })
  // - 1 content:123
  // - 2 123:123
  // - 3 content:123
  // - 4 123 123
```

## 6. promise构造函数上的静态方法

+ Promise.resolve
+ Promise.reject
+ Promise.all
+ Promise.race

```js
// 处理Promise.all需要每个promise都是已完成状态才会执行resolve方法

const promise1 = new Promise(function (resolve, reject) {
  return resolve('123')
})

const promise2 = new Promise(function (resolve, reject) {
  return reject('456')
})

Promise.all([promise1, promise2])
  .then(content => console.log('content', content))
  .catch(err => console.log('err', err))

// VM1773:11 err 456

Promise.all([
  promise1.catch(err => console.log('promsie1 error', err)), 
  promise2.catch(err => console.log('promsie2 error', err)),
])
  .then(content => console.log('content', content))
  .catch(err => console.log('err', err))

// promsie2 error 456
// content (2) ["123", undefined]
// 此时不管promsie1, promsie2是什么状态都会执行resolve
```
  
## 7. 异常处理

promise的异常处理由两种形式，一种是作为promise的reject函数进行接收，另外一种形式就是利用promise的catch函数进行捕获

```js
var promise = new Promise((resolve, reject) => {
   reject(new Error('error'))
})

promise.then(
    () => {},
    error => { 
        console.log('reject函数进行捕获', error)
    })

promise.catch(error => {
    console.log('catch方法进行捕获', error)}
)
```

两种捕获方式的区别在于：
+ reject处理的异常只针对当前返回的promise的状态进行处理，而不处理回调函数当中新产生的Promise的异常状态
+ catch相当于给全局的Promise注册的错误捕获，catch之所以可以处理当前返回的promise的状态的异常是因为链式调用的特点，由于异常没有被处理才会被catch捕获，如果存在reject函数，优先级高于catch；catch进行整体Promise返回的错误状态的捕获，

Promise存在的异常会一直向后传递，直至被捕获

```js
var promise = new Promise((resolve, reject) => {
   reject(new Error('error'))
})

promise
.then(() => {}, error => { 
    new Promise((resolve, reject) => {
       reject(new Error('第二个异常信息'))
    })
    console.log('error1', error)
})
.catch(error => console.log('error2', error))

// error1 Error: error
// Error: 第二个异常信息
```

catch里面有throw或者return了一个拒绝的promise，只有这两种情况，catch之后还会进入已拒绝状态，执行catch，其余情况都会进入已完成状态

```js
var promise = new Promise((resolve, reject) => {
   reject(new Error('error'))
})

promise
.catch(error => console.log('error2', error)) // fulfilled

promise
.catch(error => throw Error('这是通过throw抛出来的异常需要进行处理，此时Promise会进入到rejected状态')) // rejected

promise
.catch(error => {
  return new Promise((resolve, reject) => {
    reject(new Error('return了一个拒绝的promis, 此时Promise会进入到rejected状态'))
  })
}) // rejected

```