let fs = require('fs').promises; // 新版本 10 版本新增的 
let path = require('path')
let Promise = require('./promise-other')

const p1 = fs.readFile(path.resolve(__dirname, 'name.txt'),'utf8')
const p2 = fs.readFile(path.resolve(__dirname, 'age.txt'),'utf8')

// Promise.all([p1,p2,1,2]).then(data=>{
//     console.log(data);
// });

Promise.allSettled([p1,p2,1,2]).then(data=>{
    console.log(data);
});