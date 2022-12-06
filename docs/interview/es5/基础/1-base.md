# 基础面试题

## 1. 0.1 + 0.2 为什么不等于 0.3

计算机中所有的数据都是以```二进制```存储的，所以在计算时计算机要把数据先转换成```二进制```进行计算，然后在把计算结果转换成```十进制```。

在计算0.1+0.2时，浮点数转二进制的时候分别对整数和小数部分进行二进制转换再相加，0.1 转二进制会发生无限循环而 IEEE 754 标准中的尾数位只能保存 52 位 有效数字，所以 0.1 转二进制就会发生舍入，所以就产生了误差，所以就不等于0.3

## 2. js对二进制小数的存储方式?

ECMAScript中的Number类型遵循```IEEE 754标准```,使用```64位```固定长度来表示，共有符号位（1）、指数位（11）、尾数位（52）三部分组成

## 3. 二进制小数的存储为什么尾数位只有 52 位，但是要从第一个 1 后面开始保留52位 有效数字？

尾数部分的整数部分一定是一个 1,那为了充分利用 52 位 空间表示更高的精确度，可以把一定等于 1 的整数部分省略，52 位 都用来表示小数。

## 4. Number() 的存储空间是多大？如果后台发送了一个超过最大自己的数字怎么办

Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

## 5. 怎么能使 0.1 + 0.2 = 0.3

1. 转为整数计算，计算后再转回小数
2. 转成字符串相加（效率较低）
   
## 6. js的数据类型

原始类型 - 栈内存（被引用或拷贝时，会创建一个完全相等的变量）

+ number：包含所有可能的数字类型，+Infinity, -Infinity, NAN等
+ string：包含所有有限的字符集合，一串表示文本值的字符序列
+ boolean：有两个值（true， false）
+ Null：只包含一个值null, 表示空对象指针
+ Undefined：只有自己一个值undefined
+ Symbol(ES2016)：用来表示唯一的对象的键值，一种实例是唯一且不可改变的数据类型
+ bigInt(ES2010)：如今已经被chrome支持
  
对象复杂类型 - 堆内存（存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。）

+ Object: 从逻辑上来讲，对象是属性的结合，并且每个属性要么是数据属性，要么就是迭代器访问属性

引用数据类型（Object）又分为如下这几种常见的类型：

+ Array - 数组对象
+ RegExp - 正则对象
+ Date - 日期对象
+ Math - 数学函数
+ Function - 函数对象

## 7. 原始类型和引用类型的存储方式？

原始类型是保存在栈内存当中的具有```不可变性```，引用类型是保存在堆内存当中的复制引用类型的变量时，实际上复制的是栈中存储的地址，改变其中任何一个变量的值，另一个变量都会受到影响

## 8. 函数的参数的传递规则？

参数如果是原始类型就是按值传递的，当函数参数是引用类型时，我们同样将参数复制了一个副本到局部变量，只不过复制的这个副本是指向堆内存中的地址而已，我们在函数内部对对象的属性进行操作，实际上和外部变量指向堆内存中的值相同，但是这并不代表着引用传递

## 9. null和undefined

null：表示被赋值过的对象，刻意把一个对象赋值为null，故意表示其为空，不应有值。NUmber(null) === 0

undefined: 表示“缺少值”，即此处应有一个值，但还没有定义, NUmber(undefined) === NAN

所以 null === undefined => false

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