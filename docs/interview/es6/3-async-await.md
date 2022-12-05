# async/await

## 手写实现

async的执行原理: 自动执行generator函数, 内部封装了一个promise

```js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

export default function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
```

## 如何使用 async/await 实现 Promise.all 的效果

实现不了，一个是串行操作，一个是并行操作，async/await并不能真正意义上模拟Promise.all

```js
const all = (list) => {
    const res = new Promise((resolve, reject) => {
        let length = list && list.length
        let count = 0
        let result = []
        if(!list || list.length === 0) {
            resolve(result)
        }
        list.forEach(async (item, index) => {
            try {
                const res = await item
                result[index] = res
                count ++
                if(count === length) {
                    resolve(result)
                }
            } catch(err) {
                reject(err)
            }
        });
    })
    return res
}
```