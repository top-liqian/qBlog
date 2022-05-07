const Promise = require("./promise-other");

function withAbort(userPromise) {
    let abort
    let innerPromise = new Promise((resolve, reject) => { abort = reject })
    let p = Promise.race([innerPromise, userPromise])
    p.abort = abort
    return p
}

let p = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('success')
    }, 1000)
})

p = withAbort(p)

p.then((data) => {
    console.log(data)
}, reason => {
    console.log(reason)
})

setTimeout(() => {
    p.abort('失败了，超时了')
})