# let & const

在es5阶段我们了解到js声明变量使用的是var操作符，声明的变量会被注册到全局作用域当中use everywhere，方便使用变量的同时也带来了一些问题，如下：

1. 声明的变量没有及时回收，会污染环境
2. 定义常量十分复杂
3. 存在变量提升，维护代码较难
4. 内部代码易出错

为了解决以上问题，es6提出了let & const，下面我们将通过对比var定义变量的形式介绍let & const的特性以及优点

1. let & const 没有与预解析，不存在变量提升，必须先定义后使用

```js
  alert(a) // 12
  var a = 12
```

```js
  alert(b) // 报错
  let b = 12
```

2. let & const 在同一个作用域当中不可以重复定义变量，会报错，而var则会覆盖

```js
  var name = 'liqian'
  var name = 'zhangqian'
  console.log('name:', name) // zhangqian
  
  let age = 18
  
  let age = 14
  
  console.log('age:', age) // error:age is alreay declare
```

3. for循环当中的条件()与{}分属于父子作用域

```js
  var arr = []
  for (let i = 0; i< arr.length; i++) {
    console.log('i:', i) // 报错
  }
  
  for (let i = 0; i< arr.length; i++) {
    let i = 23
    console.log('i:', i) 
    // 23 -> 这里并不算重复定义，因为()与{}分属于父子作用域，并不算同一个作用域
  }

  for (var i = 0; i< arr.length; i++) {
    console.log('i:', i) // 0, 1, 2
  }
```

1. 数组循环输出

```js
var arr = [1,2,3,4]

for (var i = 0; i< arr.length; i++) {
    console.log('arr:', arr[i])
}
// 4 4 4 4

for (let i = 0; i< arr.length; i++) {
    console.log('arr:', arr[i])
}
// 1,2,3,4
```

**下面介绍const具有的独有特性**

1. const 定义时必须赋值

```js
  const sex
  sex = 'female' // error
  
  const address
  console.log('address:', address) // error
```

2. const 定义的常量是不可以进行修改的，引用类型则不受影响

```js

const address = '浙江省杭州市'

address = '湖南省长沙市' // error

const parent = ['father', 'mother']

parent = [] // error

parnt.push('sisiter') // ['father', 'mother', 'sister']
```

> 为了解决引用类型的常量可以修改的办法：const num = Object.freeze([1,2,3])。

#### es5实现let源码

```js
  (function () {
    var a = 1
  })()
```

#### es5实现const源码

```js
  function _const (key, value) {
    Object.defineProperty(window, key, { value, writable: false })
  }
  // 测试

  _const(obj, 1)

  console.log(obj)
```