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
    then() {
        if(this)
    }

}

module.exports = Promise