# async-await

1. async函数返回的是一个promise
2. co + generator 就等于async-await的语法糖
3. 内部就是基于genertor的所以可以使用trycatch语法，如果出现异常可以通过promise.catch来进行捕获
4. generator 可以配合promise 但是需要有co开进行流程控制，promise配合async+await来实现流程控制

```js
async function async() {
    await console.log(3)
    console.log(4)
}
// 相当于

function async() {
    Promise.resolve(console.log(3)).then(() => {
      console.log(4)
    })
}
```