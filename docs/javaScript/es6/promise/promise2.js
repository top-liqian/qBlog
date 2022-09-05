const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Rejected = 'rejected'

class MyPromise {
  constructor(exector) {
    this._status = Pending
    this._value = null

    this._resolveQueue = []
    this._rejectQueue = []

    const _resolve = value => {
      const run = () => {
        if(_status !== Pending) return 
        this._status = Fulfilled
        this._value = value

        while(this._resolveQueue.length) {
          const callback = this._resolveQueue.shift()
          callback(value)
        }
      }

      setTimeout(run)
    }

    const _reject = value => {
      const run = () => {
        if(_status !== Pending) return 
        this._status = Rejected
        this._value = value

        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(value)
        }
      }

      setTimeout(run)
    }

    exector(_resolve, _reject)
  }

  then(resolveFn, rejectFn) {
    return new MyPromise((resolve, reject) => {
      typeof resolveFn === 'function' ? resolveFn = value => value : null
      typeof rejectFn === 'function' ? rejectFn = value => value : null

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
        case Pending:
          this._resolveQueue.push(fulfilledFn)
          this._resolveQueue.push(rejectedFn)
          break;
        case Fulfilled:
          fulfilledFn(this._value)
          break;
        case Rejected:
          rejectedFn(this._value)
          break;
      }
    })
  }

  catch(errorFn) {
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

      deepPromise(promises[0], index, result)
      resolve(result)
    })
  }
}