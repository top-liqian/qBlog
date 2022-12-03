# 闭包

## 一、什么是闭包

闭包：函数和其周围状态（此法环境）的引用捆绑在一起而形成闭包。可以在另一个作用域中调用一个函数的内部函数并可以访问到该函数的作用域中的成员

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量。

闭包就是每次调用外层函数时，临时创建的函数作用域对象。因为内层函数作用域链中包含外层函数的作用域对象，且内层函数被引用，导致内层函数不会被释放，同时它又保持着对父级作用域的引用，这个时候就形成了闭包，所以闭包通常是在函数嵌套中形成的。

简单来说：

在函数 A 中还有函数 B，函数 B 调用了函数 A 中的变量，那么函数 B 就称为函数 A 的闭包。

**闭包的本质**：在JavaScript中，作用域对象是在堆中被创建的（至少表现出来的行为是这样的），函数在执行的时候会放到一个执行栈上当函数执行完毕之后就从执行栈上移除，但是堆上作用域成员因为被外部引用而不能被释放，因此内部函数依然可以访问外部函数的成员
 
## 二、怎样产生一个闭包

创建闭包最常见的方式就是在一个函数内部定义另一个函数

```js
"use strict";
function createCounter(initial) {
  var counter = initial;
  
  function increment(value) {
    counter += value;
  }
  
  function get() {
    return counter;
  }
  
  return {
    increment: increment,
    get: get
  };
}

var myCounter = createCounter(100);
console.log(myCounter.get());   // 返回 100

myCounter.increment(5);
console.log(myCounter.get());   // 返回 105
```

**闭包的作用域链包含了自身作用域，被定义所在函数作用域以及全局作用域**

## 闭包的注意事项

1. 通常函数的作用域及其所有变量在函数执行结束之后就会被销毁，但是闭包在创建了之后，这个函数作用域就会一直存在等闭包不存在了之后才会被销毁

通常情况下当函数返回没有被引用的时候，就会被垃圾回收器回收。即使两个相互引用的对象而不被第三个对象所引用，那么这两个相互引用的对象也会被回收。

但是对于闭包，即使外部函数返回了，函数对象仍会引用它被创建时的作用域对象。

![闭包-1](./closer-1.png)

单独调用increment(5)时，参数value保存在当前的作用域对象。当函数要访问counter时，没有找到，于是沿着作用域链向上查找，在createCounter(100)的作用域找到了对应的标示符，increment()就会修改counter的值。除此之外，没有其他方式来修改这个变量。闭包的强大也在于此，能够**存贮私有数据**。

![闭包-2](./closer-2.png)

定义两个函数

```js
var myCounter1 = createCounter(100);
var myCounter2 = createCounter(200);
```
关系图如下： 

![闭包-3](./closer-3.png)

myCounter1.increment和myCounter2.increment的函数对象拥有着一样的代码以及一样的属性值（name，length等等），但是它们的[[scope]]指向的是不一样的作用域对象。

1. 闭包只能取回包含函数中任何变量的最后一个值，这是因为闭包保存的是整个变量对象，而不是某个特殊变量

```js
function test() {
  var arr = []
  for (var i = 0; i < 10; i++) {
    arr[i] = function () { return i }
  }
  for (var a = 0; a < arr.length; a++) {
   console.log('arr', arr[a]())
  }
}
test() // 10个10
```

对于以上的输出并不是我们想要的，那需要我们改动一下上面的代码

```js
function test() {
  var arr = []
  for (let i = 0; i < 10; i++) {
    arr[i] = function () { return i }
  }
  for (var a = 0; a < arr.length; a++) {
   console.log('arr', arr[a]())
  }
}
test() // 0-10
```

**上述问题的原因引出一个经典的面试问题**

js闭包是如何处理父函数中let形成块级作用域中定义的变量的

> 解答：区别在于每次for循环里面都是一个单独的块极作用域，而let就是块极作用域里面声明变量，可以理解为每次执行for的时候都是一个新的i，所以在for循环的块中找，自然i不一样，可以理解为每次循环都保存了一个变量i，这个i属于对应的那次执行的块极作用域，而var是函数作用域，for循环无论执行多少次，都是去最近的堆栈里面找，而不是块中找，所以只有一个i，现在的i是10

3. 闭包中的this对象


```js
var name = 'liqian'

var obj = { 
  name: 'zhansan',
  getName: function () {
    return function () {
      return this.name
    }
   }
 }
 obj.getName()() // liqian

```

执行obj.getName()()实际上执行的是匿名函数，匿名函数的作用域指向了全局window，**匿名函数的执行函数具有全局性**

## 三、闭包的应用

1. 定义函数的私有变量和函数

```js
function Person () {
    var _name = 'xiaowa'
    return {
        getName: function () {
            return _name
        }
    }
}

const person = new Person()

console.log(person._name) // undefined

console.log(person.getName()) // xiaowa
```
   
2. 可以做计数器
3. 实现块级作用域
4. 保存内部状态
  ```js
  function cacheCalc(){
    var cache = new Map()
    return function (i){
      if(!cache.has(i)) cache.set(i,i*10)
      return cache.get(i)
    }
   }
  var calc = cacheCalc()
  console.log(calc(2)) // 20

  // 函数内部会使用 Map 保存已经计算过的结果（当然也可以是其他的数据结构），只有当输入数字没有被计算过时，才会计算，否则会返回之前的计算结果，这样就会避免重复计算。
  ```
5. 函数柯里化
   
## 四、闭包的优缺点

**优点**

1. 缓存。将变量隐藏起来不被 GC 回收
   
2. 实现柯里化。利用闭包特性完成柯里化。

**缺点**

1. 内存消耗。闭包产生的变量无法被销毁。

2. 性能问题。由于闭包内部变量优先级高于外部变量，所以需要多查找作用域链的一个层次，一定程度影响查找速度。

## 五、柯里化

柯里化（Currying）是把接受多个参数的函数转变为单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。

+ 当一个函数有多个参数的时候可以先传递一部分参数调用它（这部分参数永远不变）
+ 然后返回一个新的函数接受剩余的参数，返回结果

**简单来说：**

+ 通过闭包管理
+ 支持链式调用
+ 每次运行返回一个 function

即：通过将多个参数换成一个参数，每次运行返回新函数的技术

### 1. 柯里化好处

+ 参数复用

+ 提前确认

+ 延迟运行

### 2. 实现 add(1)(2)(3)

```js
// 实现一个 add 方法，使计算结果能够满足以下预期
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
```

```js
function add () {
  const numberList = Array.from(arguments);
  
  // 进一步收集剩余参数
  const calculate = function() {
    numberList.push(...arguments);
    return calculate;
  }

  // 利用 toString 隐式转换，最后执行时进行转换
  calculate.toString = function() {
    return numberList.reduce((a, b) => a + b, 0);
  }

  return calculate;
}

// 实现一个 add 方法，使计算结果能够满足以下预期
console.log(add(1)(2)(3)); // 6
console.log(add(1, 2, 3)(4)); // 10;
console.log(add(1)(2)(3)(4)(5)); // 15;
```

### 3. 题目：实现compose(foo, bar, baz)('start')

```js
function foo(...args) {
  console.log(args[0]);
  return 'foo';
}
function bar(...args) {
  console.log(args[0]);
  return 'bar';
}
function baz(...args) {
  console.log(args[0]);
  return 'baz';
}

function compose() {
  // 闭包元素 - 函数列表
  const list = Array.from(arguments);

  // 闭包元素 - 函数列表执行位置
  let index = -1;

  // 闭包元素 - 上一个函数的返回
  let prev = '';

  // 返回闭包函数
  const doNext = function() {
    index++; // 索引值累加
    // 一开始没有上一个元素时，获取第二个括号的值
    if (!prev) {
      prev = arguments[0];
    }
    // 设置前一个结果为当前函数返回
    prev = list[index](prev);
    // 递归调用
    if (index < list.length - 1) {
      doNext(index + 1);
    }
  };

  // 第一次返回闭包函数
  return doNext;
}

compose(foo, bar, baz)('start');
```

### lodash中的柯里化函数

**_.curry(func)**

+ 功能：创建一个函数，该函数接收一个或者多个func的参数，如果func所需要的参数都被提供则执行func并返回执行的结果。否则继续返回该函数并等待接收剩余的参数
+ 参数：需要柯里化的参数
+ 返回值：柯里化之后的函数

### 柯里化案例

1. 提取字符串中的空白字符

```js
''.match(/\s+/g)

const match = reg => (str => str.match(reg))
const matchSpace = match(/\s+/g)
console.log(matchSpace('helloword')) // null
console.log(matchSpace('hello word')) // ['']
```

2. 提取数组中的空白字符

```js
const match = reg => (str => str.match(reg))
const haveSpace = match(/\s+/g)
const _filter = func => (arr => arr.filter(func))
console.log(_filter(haveSpace)(['helloword', 'hello word']))
```

### 模拟实现_.curry(func)方法

```js
function curry(func) {
  return function curriedFn(...args) {
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return func(...args)
  }
}
```

### 总结

+ 柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数
+ 这是一种对函数参数的缓存
+ 让函数变得更灵活，让函数的粒度更小
+ 可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能

## 六、闭包相关的面试题

1. 输出下面的结果

```js
function fun(n, o) {
  console.log(o)
  return {
    fun: function (m) {
      return fun(m, n)
    }
  }

}
var a = fun(0) // undefiend
a.fun(1) // 0
a.fun(2) // 0
a.fun(3) // 0
var b = fun(0).fun(1).fun(2).fun(3) // undefiend 0 1 2
var c = fun(0).fun(1) // undefiend 0
c.fun(2) // 1
c.fun(3) // 1

```

2. 输出结果

```js
function test() {
  var n = 4399;

  function add() {
    n++;
    console.log(n);
  }

  return {
    n,
    add
  };
};

var result = test();
var result2 = test();

result.add(); // 输出啥
result.add(); // 输出啥

console.log(result.n); // 输出啥

result2.add(); // 输出啥

// 4400 4401 4399 4400
```

3. 输出结果
  
```js
function Foo() {
  var i = 0;
  return function() {
    console.log(i++);
  }
}

var f1 = Foo();
var f2 = Foo();

f1();
f1();
f2();

// 0 1 0
```

4. 闭包是什么时候被销毁的？
   
当它不被任何其他的对象引用的时候。