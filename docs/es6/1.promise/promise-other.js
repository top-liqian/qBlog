const PENDING = "PENDING";
const SUCCESS = "FULFILLED";
const FAIL = "REJECTED";

function isPromise(value){
    if(typeof value === 'function' || (typeof value === 'object' && value !== null)){
        if(typeof value.then === 'function'){
            return true;
        }
    }
    return false;
}

function resolvePromise(promise2, x, resolve, reject) {
    // 解析promise2和x之间的关系，来判断promise2是走成功还是走失败
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called;
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {
        resolve(x)
    }
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = value => {
            if(isPromise(value)){ // resolve的结果是一个promise
                return value.then(resolve,reject); // 那么会让这个promise执行，将执行后的结果在传递给 resolve或者reject中
             }
            if (this.status === PENDING) {
                this.value = value;
                this.status = SUCCESS;
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        };
        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = FAIL;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        }
        let promise2;
        promise2 = new Promise((resolve, reject) => {
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

    static resolve(data) {
        return new Promise((resolve, reject) => {
            resolve(data)
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
}
// 希望测试一下这个库是否符合我们的promise A+规范
// promises-aplus-tests
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

Promise.prototype.finally = function (final) {
    console.log('this', this)
    return this.then((value) => {
        return Promise.resolve(final()).then(() => value )
    }, reason => {
        return Promise.resolve(final()).then(() => { throw reason })
    })
}

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

Promise.race = function (values) {
    return new Promise((resolve, reject) => {
        values.forEach(item => {
            Promise.resolve(item).then(resolve, reject)
        })
    })
}

module.exports = Promise
