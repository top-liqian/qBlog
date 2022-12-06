# 阿里异步串行编程题：按照以下要求，实现 createFlow 函数

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => console.log("c"))]);

createFlow([
  () => console.log("a"),
  () => console.log("b"),
  subFlow,
  [() => delay(1000).then(() => console.log("d")), () => console.log("e")],
]).run(() => {
  console.log("done");
});

// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
```

按照上面的测试用例，实现 createFlow：

+ flow 是指一系列 effects 组成的逻辑片段。
+ flow 支持嵌套。
+ effects 的执行只需要支持串行。

**解题思路**：

createFlow接受以下几种类型的参数

1. 普通函数 `() => console.log("a")`
2. 异步函数 `delay`
3. 嵌套函数 `subFlow`
4. 数组函数 `[() => delay(1000).then(() => console.log("d")), () => console.log("e")]`

**针对以上参数书写如下**:

**步骤一**: createFlow支持串行，所以将所有的参数扁平化

```js
function createFlow(effects = []) {
  const queue = [...effects.flat()]
}
```

**步骤二**: run方法执行，createFlow不是自己直接执行，而是通过调用run方法才可以

```js
function createFlow(effects = []) {
  const queue = [...effects.flat()]

  const run = function (cb) {
    for(let task of queue) {
    }
    if (cb) cb()
  }
  return {
      run
  }
}
```

**步骤三**: 因为存在异步函数并且需要串行等待，所以使用async/await方法

```js
function createFlow(effects = []) {
  const queue = [...effects.flat()]

  const run = async function (cb) {
    for(let task of queue) {
        await task()
    }
    if (cb) cb()
  }
  return {
      run
  }
}
```

**步骤四**: 支持嵌套
```js
function createFlow(effects = []) {
  const queue = [...effects.flat()]
  const run = async function(cb) {
    for(let task of queue) {
      if(task.isFlow) {
        await task.run()
      } else {
        await task()
      }
    }
    if(cb) cb()
  }
  return {
    run,
    isFlow: true
  }
}
```