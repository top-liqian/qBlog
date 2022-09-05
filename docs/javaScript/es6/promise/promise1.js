const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor (exector) {
    this._status = PENDING
    this._value = null

    this.resolveQueue = []
    this.rejectQueue = []

    const _resolve = (val) => {
      const run = () => {
        if(this._status !== PENDING) return
        this._status = FULFILLED
        this._value = val
        while(this.resolveQueue.length) {
          const callback = this.resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }

    const _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return
        this._status = REJECTED
        this._value = val
        while(this.rejectQueue.length) {
          const callback = this.rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }

    exector(_resolve, _reject)
  }

  then(resolveFn, rejectFn) {
    return new Promise((resolve, reject) => {
      typeof resolveFn !== 'function' ? resolveFn = value => value : null
      typeof rejectFn !== 'function' ? rejectFn = value => value : null

      const fulfilledFn = val => {
        try {
          const x = resolveFn(val)
          x instanceof Promise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error instanceof Error ? error.message : error)
        }
      }

      const rejectedFn = val => {
        try {
          const x = rejectFn(val)
          x instanceof Promise ? x.then(resolve, reject) : reject(x)
        } catch (error) {
          reject(error instanceof Error ? error.message : error)
        }
      }

      switch(this._status) {
        case PENDING:
          this.resolveQueue.push(fulfilledFn)
          this.rejectQueue.push(rejectedFn)
          break;
        case FULFILLED:
          fulfilledFn(this._value)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }

  catch(errorFn) {
    this.then(null, errorFn)
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = []

      const deepPromise = (promise, index, result) => {
        if(index > promises.length -1) {
          return result
        }

        if (typeof promise.then === 'function') {
          promise.then(val => {
            index++
            result.push(val)
            deepPromise(promises[index], index, result)
          }).catch((error) => {
            reject(error instanceof Error ? error.message : error)
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
}

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