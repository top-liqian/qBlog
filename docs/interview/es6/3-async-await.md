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

```js
const getData = () => new Promise(resolve => setTimeout(() => resolve('data'), 1000));

function* testG() {
  const data = yield getData();
  console.log('data: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
}

function asyncToGen(genFunction) {
  // 返回的是一个新的函数
  return function (...args) {
    // 先调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = genFunction.apply(this, args)
    // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, args) {
        let genResult
        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          genResult = gen[key](args)
        } catch (error) {
          reject(error)
        }
        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = genResult

        // 如果已经完成了 就直接resolve这个promise
        // 这个done是在最后一次调用next后才会为true
        // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
        // 这个value也就是generator函数最后的返回值
        if (done) {
          resolve(value)
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回 { value: Promise, done: false } 的结构，
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(value).then(val => {
            step('next', val)
          }, (error) => {
            step('throw', error)
          })
          // value这个promise被resove的时候，就会执行next
          // 并且只要done不是true的时候 就会递归的往下解开promise
          // 对应gen.next().value.then(value => {
          //    gen.next(value).value.then(value2 => {
          //       gen.next()
          //
          //      // 此时done为true了 整个promise被resolve了
          //      // 最外部的test().then(res => console.log(res))的then就开始执行了
          //    })
          // })
          // 如果promise被reject了 就再次进入step函数
          // 不同的是，这次的try catch中调用的是gen.throw(err)
          // 那么自然就被catch到 然后把promise给reject掉啦
        }
      }
      step('next')
    })
  }
}

const gen = asyncToGen(testG);
gen().then(res => console.log(res));
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