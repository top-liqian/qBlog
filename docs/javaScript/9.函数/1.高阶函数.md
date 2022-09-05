# 函数式编程

## 为什么要学习函数值编程

+ 函数值编程是随着React的流行收到越来越多的关注
+ VUe3也开始拥抱函数式编程
+ 函数式编程可以抛弃this
+ 打包过程中可以更好的利用tree shaking过滤无用的代码
+ 方便测试、方便并行处理
+ 有很多库可以帮助我们进行函数式开发： lodash、underscore、ramda

## 什么是函数式编程

函数式编程是编程范式之一，我们常听说的编程范式还有面向过程编程、面向对象编程

+ 面向对象编程的思维方式：把现实世界中的事物抽象成类和对象，通过封装、继承和多态来演示食物事件之间的联系
+ 函数式编程的思维方式：把现实世界的事物和事物之间的**联系**抽象到程序世界
  - 程序的本质：根据输入通过某种运算获得相应的输出，程序开发过程当中就是不断的输入输出的过程
  - 函数式编程重的函数指的不是程序中的函数（方法），而是数学中的函数即映射关系
  - 相同的输入始终要得到相同的输出
  - 函数试编程是用来描述数据（函数）之间的**映射**

函数式编程核心思想：函数式编程是一种编程思想，对运算过程进程抽象，把运算过程抽象成函数，可以重复使用，在使用过程中不用关心内部运算

## 函数是一等公民（First-class Function）

+ 函数可以存在变量当中
+ 函数可以作为参数
+ 函数可以作为返回值

在javaScript当中，韩式就是一个普通的对象（可以通过 new Function()），我们可以把函数存储到变量。数组当中，它还可以作为另一个函数的返回值和参数，甚至我们可以在程序运行的过程中通过new Function()来构造一个新的函数。

+ 把函数赋值给变量

```js
let fn = () => {
    console.log('First-class Function')
}

const BlogController = {
    index(post): { return Views.index(post) }
}
// 等价优化成下面的形式，赋值的是函数而不是函数的返回值
const BlogController = {
    index: Views.index
}
```

## 高阶函数 - Higer-order function

### 什么是高阶函数？

+ 函数作为另外一个函数的参数
+ 可以将函数作为另外一个函数的返回值
  
高阶函数的好处

+ 使代码更加灵活
+ 封装具有语义化，不用关心内部代码的实现逻辑

### 函数作为另外一个函数的参数

```js
// 模拟foreach
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
      fn(array(i))
    }
}
// 测试

let arr = [1,2,3]

forEach(arr, function(item) {
   console.log(item)
})

// 模拟filter
function filter(array, fn) {
    let results = []
    for (let i = 0; i < array.length; i++) {
        fn(array(i)) && results.push(array(i))
    }
    return results
}
let r = filter(arr, function(item) {
   return item % 2 === 0
})
```

### 高阶函数作为返回值

```js
function makeFn(){
    let msg = 'Hello Function'
    return function () {
        console.log(msg)
    }
}
const fn = makeFn()
makeFn() // Hello Function

makeFn()() // Hello Function
```

**给一个dom元素注册事件，只执行一次，模拟loadsah里面的once函数**

```js
function once(fn) {
    let done = false
    return function () {
        if(!done) {
            done = true
            return fn.apply(this, arguments)
        }
    }
}

let pay = once(function (money) {
    console.log(money)
})

pay(5)
pay(5)
pay(5)
pay(5)
// 只打印一次5
```

### 高阶函数的意义

+ 抽象可以帮我们屏蔽细节，只需要关注我们的目标
+ 高阶函数就是用来抽象通用的问题
+ 使代码更简洁，函数很灵活

### 常用的高阶函数

+ forEach
+ map
+ filter
+ every
+ some
+ find/findIndex
+ reduce
+ sort
+ ...

