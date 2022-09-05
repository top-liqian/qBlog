const PENDING = 'pending'
const REJECTED = 'rejected'
const FULFILLED = 'fulfilled'

class MyPromise {
  constructor (excutor) {
    this.status = PENDING
    this._resolveQueue = []
    this._rejectQueue = []
    this._value = ''

    const _resolve = (val) => {
      const run = () => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this._value = val
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }

    const _reject = (val) => {
      const run = () => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }

    excutor(_resolve, _reject)
  }
  
  then (resolveFn, rejectFn) {
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = value => value : null
    return new Promise((resolve, reject) => {
      const fulfilledFn = value => {
        try {
          const x = resolveFn(value)
          x instanceof Promise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
      // this._resolveQueue.push(fulfilledFn)

      const rejectedFn = value => {
        try {
          const x = rejectFn(value)
          x instanceof Promise ? x.then(resolve, reject) : reject(x)
        } catch (error) {
          reject(error)
        }
      }
      // this._rejectQueue.push(rejectedFn)

      switch(this.status) {
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        case FULFILLED:
          fulfilledFn(this._value)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
    // this._resolveQueue.push(resolveFn)
    // this._rejectQueue.push(rejectFn)
  }
  catch (errorFn) {
    this.then(null, errorFn)
  }
  static all (promises) {
    return new MyPromise((resolve, reject) => {
      let result = []

      const deepPromise = (promise, index, result) => {
        if (index > promises.length - 1) {
          return result
        }

        if (typeof promise.then === 'function') {
          promise.then((res) => {
            index++
            result.push(res)
            deepPromise(promises[index], index, result)
          }).catch(err => {
            reject(err instanceof Error ? err.message : err)
          })
        } else {
          index++
          result.push(promise)
          deepPromise(promises[index], index, result)
        }
      }

      deepPromise(promises[0], 0, result)

      resolve(result)
    })
  }
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

  static resolve (val) {
    return new MyPromise((resolveFn, rejectFn) => {
      resolveFn(val)
    })
  }

  static reject (val) {
    return new MyPromise((resolveFn, rejectFn) => {
      rejectFn(val)
    })
  }

}

// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('result')
//   }, 1000);
// })

// p1.then(res => console.log(res))

const p1 = new MyPromise((resolve, reject) => {
  resolve('first')
})

p1.then(res => {
  console.log(res)
  return new MyPromise((resolve, reject) => {
    resolve('promise second')
  })
}).then(1).then(res => {
  console.log(res)
  return 'third'
}).then(res => {
  console.log(res)
})

const p2 = new MyPromise((resolve, reject) => {
  reject('error')
})

p2.catch(err => console.log(err))

const p3 = new MyPromise((resolve, reject) => {
  resolve('result111')
})

const p4 = new MyPromise((resolve, reject) => {
  resolve('result222')
})

const p5 = new MyPromise((resolve, reject) => {
  resolve('result333')
})

MyPromise.all([p3,p4,p5]).then(res => {
  console.log('all result', res)
})

const promise1 = MyPromise.resolve(1)
const promise2 = MyPromise.resolve(2)
const promise3 = MyPromise.resolve(3)

MyPromise.allSettled([promise1,promise2,promise3]).then(res => {
  console.log(res)
})

const promise4 = MyPromise.resolve(1)
const promise5 = MyPromise.reject('reject')
const promise6 = MyPromise.resolve(3)

Promise.allSettled([promise4, promise5,promise6]).then(res => {
  console.log(res, 'resolve')
}).catch(e => {
  console.log(e)
})

