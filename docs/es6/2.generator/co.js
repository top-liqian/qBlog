const fs = require('fs').promises
const path = require('path')

function* read () {
   const name = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8')
   const age = yield fs.readFile(path.resolve(__dirname, data), 'utf8')
   return age
}

function co(it) {
    return new Promise((resolve, reject) => {
        function next(data = ''){
            let { value, done } = it.next(data)
            if(!done) {
                Promise.resolve(value).then((data) => {
                    next(data)
                },reject)
            }else{
                resolve(value)           }
        }
        next()
    })
}

co(read()).then(data => {
    console.log(data)
})