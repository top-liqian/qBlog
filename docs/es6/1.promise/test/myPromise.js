const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'

class Promsie {
    constructor(executor) {
        this.state = PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        const resolve = value => {
            if(this.state === 'PENDING') {
                this.state = FULLFILLED
                this.value = value
                this.onResolvedCallbacks.forEach(cb => cb())
            }
        }

        const reject = reason => {
            if(this.state === 'PENDING') {
                this.state = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(cb => cb())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        let promise2
        promise2 = new Promise((resolve, reject) => {
            if(this.state === FULLFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }

                })
            }
            if(this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }

                })
    
            }
            if(this.state === PENDING) {
    
            }

        })
        return promise2
    }

}

module.exports = Promise