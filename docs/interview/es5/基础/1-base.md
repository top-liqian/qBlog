# 基础面试题

## 1. 0.1 + 0.2 为什么不等于 0.3

计算机中所有的数据都是以```二进制```存储的，所以在计算时计算机要把数据先转换成```二进制```进行计算，然后在把计算结果转换成```十进制```。

计算机是通过二进制的方式存储数据的，所以计算机计算0.1+0.2的时候，实际上是计算的两个数的二进制的和。0.1的二进制是0.0001100110011001100...（1100循环），0.2的二进制是：0.00110011001100...（1100循环），这两个数的二进制都是无限循环的数

在计算0.1+0.2时，浮点数转二进制的时候分别对整数和小数部分进行二进制转换再相加，0.1 转二进制会发生无限循环而 IEEE 754 标准中的尾数位只能保存 52 位 有效数字，所以 0.1 转二进制就会发生舍入，所以就产生了误差，所以就不等于0.3

## 2. 怎么能使 0.1 + 0.2 = 0.3

1. 转为整数计算，计算后再转回小数
2. 转成字符串相加（效率较低）

## 3. js对二进制小数的存储方式?

ECMAScript中的Number类型遵循```IEEE 754标准```,使用```64位```固定长度来表示，共有符号位（1）、指数位（11）、尾数位（52）三部分组成

## 4. Number() 的存储空间是多大？如果后台发送了一个超过最大自己的数字怎么办

Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

## 5. 二进制小数的存储为什么尾数位只有 52 位，但是要从第一个 1 后面开始保留52位 有效数字？

尾数部分的整数部分一定是一个 1,那为了充分利用 52 位 空间**表示更高的精确度**，可以把一定等于 1 的整数部分省略，52 位 都用来表示小数。
   
## 6. js的数据类型

JavaScript共有八种数据类型，分别是 Undefined、Null、Boolean、Number、String、Object、Symbol、BigInt。
其中 Symbol 和 BigInt 是ES6 中新增的数据类型：

+ Symbol 代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现的全局变量冲突的问题。
+ BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

+ 栈：原始数据类型（Undefined、Null、Boolean、Number、String）
+ 堆：引用数据类型（对象、数组和函数）

两种类型的区别在于存储位置的不同：

+ 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
+ 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：

+ 在数据结构中，栈中数据的存取方式为先进后出。
+ 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区：

+ 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
+ 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收。

## 7. 原始类型和引用类型的存储方式？

原始类型是保存在栈内存当中的具有```不可变性```，引用类型是保存在堆内存当中的复制引用类型的变量时，实际上复制的是栈中存储的地址，改变其中任何一个变量的值，另一个变量都会受到影响

## 8. 函数的参数的传递规则？

参数如果是原始类型就是按值传递的，当函数参数是引用类型时，我们同样将参数复制了一个副本到局部变量，只不过复制的这个副本是指向堆内存中的地址而已，我们在函数内部对对象的属性进行操作，实际上和外部变量指向堆内存中的值相同，但是这并不代表着引用传递

## 9. null和undefined

Undefined 和 Null 都是基本数据类型

null：表示空对象，用于赋值给一些可能会返回对象的变量，作为初始化

undefined: 表示为定义，一般变量声明了但还没有定义的时候会返回 undefined

```js
null === undefined => false
null == undefined => true
```

## 10. 给出下面题目的正确答案

```js
var str = 'string';
str.pro = 'hello';
console.log(str.pro + 'world');
```

undefindedworld, 基本包装类型创建的实例上面定义的pro属性在定义后就会立刻销毁，当执行 str.pro = 'hello' 时，实际上内部创建了一个基本包装类型的实例，然后给这个实例的 pro 属性赋值为 hello，实例创建后马上销毁了，当下一次试图获取 str.pro 的值时，又会创建一个基本包装类型的实例，显然新创建的实例时没有 pro 属性的，为 undefined，所以最后输出 undefinedworld

## 11. 字符串是基本数据类型,基本类型是没有方法的，但为什么字符串还有很多方法

因为创建字符串的过程实际上是创建String类的过程，在String类上具有很多方法，所以字符串会继承自String

## 12. symbol 有什么用处

+ 可以用来表示一个独一无二的变量防止命名冲突。
+ 利用 symbol 不会被常规的方法（除了 Object.getOwnPropertySymbols 外）遍历到，所以可以用来模拟私有变量。
+ 用来提供遍历接口，布置了 symbol.iterator 的对象才可以使用 for···of 循环，可以统一处理数据结构。调用之后回返回一个遍历器对象，包含有一个 next 方法，使用 next 方法后有两个返回值 value 和 done 分别表示函数当前执行位置的值和是否遍历完毕。
+ Symbol.for() 可以在全局访问 symbol

## 13. NaN 是什么，用 typeof 会输出什么？

Not a Number，表示非数字，typeof NaN === 'number'

## 14. 列举 Number、String、Array、Object、Promise 有哪些 API

### Number
+ Number.isNaN()
+ Number.isInteger()
+ Number.isInfinite()
+ Number.isSafeInteger()
+ Number.prototype.toFixed()
  
### String
+ String.fromCharCode()
+ String.raw()
+ String.prototype.charAt()
+ String.prototype.charCodeAt()
+ String.prototype.concat()
+ String.prototype.startsWith()
+ String.prototype.endsWith()
+ String.prototype.includes()
+ String.prototype.indexOf()
+ String.prototype.lastIndexOf()
+ String.prototype.charAt()
+ String.prototype.charCodeAt()
+ String.prototype.trim()
+ String.prototype.trimStart()
+ String.prototype.trimEnd()
+ String.prototype.repeat()
+ String.prototype.replace()
+ String.prototype.slice()
+ String.prototype.split()
+ String.prototype.sub+ String()
+ String.prototype.padStart()
+ String.prototype.padEnd()
+ String.prototype.search()
+ String.prototype.match()
+ String.prototype.toLowerCase()
+ String.prototype.toUpperCase()
### Array
+ Array.isArray()
+ Array.from()
+ Array.of()
+ Array.prototype.slice()
+ Array.prototype.splice()
+ Array.prototype.sort()
+ Array.prototype.reverse()
+ Array.prototype.indexOf
+ Array.prototype.lastIndexOf()
+ Array.prototype.includes()
+ Array.prototype.push()
+ Array.prototype.pop()
+ Array.prototype.shift()
+ Array.prototype.unshift()
+ Array.prototype.map()
+ Array.prototype.reduce()
+ Array.prototype.forEach()
+ Array.prototype.filter()
+ Array.prototype.every()
+ Array.prototype.some()
+ Array.prototype.flat()
+ Array.prototype.flatMap()
+ Array.prototype.toString()
### Object
+ Object.create()
+ Object.assign()
+ Object.defineProperties()
+ Object.defineProperty()
+ Object.keys()
+ Object.values()
+ Object.entries()
+ Object.fromEntries()
+ Object.is()

## 15. Number.isNaN 与 globalThis.isNaN 有何区别

```js
Number.isNaN(NaN);
isNaN(NaN);

Number.isNaN("NaN");
isNaN("NaN");
```

Number.isNaN('NaN') 是 false，其他都是 true

## 16. 如何判断一个数值为整数

```js
// ES6
Number.isInteger(num);

// ES5
if (!Number.isInteger) {
  Number.isInteger = function (num) {
    return typeof num == "number" && num % 1 == 0;
  };
}
```

## 17. 什么是安全整数，如何判断一个整数是安全整数

一个安全整数是一个符合下面条件的整数：

可以准确地表示为一个 IEEE-754 双精度数字,其 IEEE-754 表示不能是舍入任何其他整数以适应 IEEE-754 表示的结果。

```js
Number.MAX_SAFE_INTEGER 是最大安全整数，Number.isSafeInteger() 用来判断一个数值是否为安全整数。
```

## 18. 实现二进制与十进制的互相转化的两个函数

```js
function integerToBin(num) {
  // 64
  const result = [];
  while (num / 2) {
    next = num % 2;
    num = Math.floor(num / 2);
    result.unshift(next);
  }
  return result;
}

function fractionalToBin(num) {
  const result = [];
  let i = 0;
  while (num !== 0 && i < 54) {
    num = num * 2;

    next = num >= 1 ? 1 : 0;
    num = num % 1;
    i++;
    result.push(next);
  }
  return result;
}

function decToBinary(num) {
  // 1.5
  const [int, fraction] = String(num)
    .split(/(?=\.)/)
    .map((x, i) => {
      return i === 0 ? integerToBin(x) : fractionalToBin(x);
    });
  return [int, fraction];
}

function binToDec(num) {
  const [_int, _fraction] = String(num).split(".");
  const int = _int.split("").reduceRight((acc, x, i) => {
    return acc + x * 2 ** i;
  }, 0);
  const fraction = _fraction
    ? _fraction.split("").reduce((acc, x, i) => {
        return acc + x * 2 ** -(i + 1);
      }, 0)
    : 0;
  return `${int}${fraction ? "." + fraction.toString().slice(2) : ""}`;
}

console.log(16, integerToBin(16), Number(16).toString(2));
console.log(18, integerToBin(18), Number(18).toString(2));
console.log(0.5, fractionalToBin(0.5), Number(0.5).toString(2));
console.log(0.1, fractionalToBin(0.1), Number(0.1).toString(2));
console.log(1.1, decToBinary(1.1), Number(1.1).toString(2));

console.log(7.875, decToBinary(7.875), Number(7.875).toString(2));
console.log("111.111", binToDec("111.111"), parseInt("111.111", 2));
```

## 19. 什么是原码、补码与反码

+ 原码:
+ 反码: 反码按位取反
+ 补码: 正数和 0 的补码就是该数字本身，负数的补码则是反码加一

## 20. && 运算符能做什么

逻辑与， 采用短路来防止不必要的工作，在其操作数中找到第一个虚值表达式并返回它，如果没有找到任何虚值表达式，则返回最后一个真值表达式

## 21. || 运算符能做什么

逻辑或，在其操作数中找到第一个真值表达式并返回它。这也使用了短路来防止不必要的工作。在支持 ES6 默认函数参数之前，它用于初始化函数中的默认参数值。

## 22. 将字符串转换为数字的方法

+号是将字符串转换为数字的最快方法，因为如果值已经是数字，它不会执行任何操作。****

## 23.es6中的声明

声明方式：`var` `let` `const` `class` `function` `import`

1. var

使用var定义的变量注册在全局作用域当中

2. let，const

使用let定义的变量注册在块级作用域当中，只能被当前作用域所访问到

let声明变量后可以立即赋值也可以使用时赋值

const声明必须赋值

不允许重复声明

不会变量提升，未定义使用会报错

暂时性死区，使用前必须先定义

3. function

function用来声明函数，注册在全局环境，会变量提升

## 24. 数据类型检测的方式有哪些？

1. typeof：其中数组、对象、null都会被判断为object，其他判断都正确
2. instanceof： instanceof只能正确判断引用数据类型，而不能判断基本数据类型，其内部运行机制是判断在其原型链中能否找到该类型的原型，instanceof 运算符可以用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性
3. constructor：constructor有两个作用，一是判断数据的类型，二是对象实例通过 constrcutor 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，constructor就不能用来判断数据类型了
4. Object.prototype.toString.call()：使用 Object 对象的原型方法 toString 来判断数据类型

## 25. obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样，这是为什么？

这是因为toString是Object的原型方法，而Array、function等类型作为Object的实例，都**重写了toString方法**。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串…），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object原型上的toString方法。

## 