# 数组相关的面试题

## 1. 列出对数组产生副作用和没有副作用的方法
   
产生副作用的方法（改变了原来的数组）：```pop()、push() 、reverse() 、shift()、unshift()、sort()、splice()、map()、```

没有副作用的方法（原来数组不变）：```concat()、join()、slice()、toString()、toLocaleString()、valueOf()、reduce()、some()、every()、filter()、forEach()```

## 2. 在 js 中如何把类数组转化为数组

类数组: 如果一个对象有 length 属性值, 则它就是类数组;

常见的类数组：这在 DOM 中甚为常见，如各种元素检索 API 返回的都是类数组，如 document.getElementsByTagName，document.querySelectorAll 等等。除了 DOM API 中，常见的 function 中的 arguments 也是类数组

如何进行转换呢？

最靠谱的3种方式

+ Array.from(arrayLike);
+ Array.apply(null, arrayLike);
+ Array.prototype.concat.apply([], arrayLike);

以下几种方式需要考虑稀疏数组的转化

+ Array.prototype.filter.call(divs, (x) => 1);
+ Array.prototype.map.call(arrayLike, (x) => x);
+ Array.prototype.filter.call(arrayLike, (x) => 1);

## 3. 如何生成100个元素为1的数组呢？

1. Array.from(Array(100), x => 1)
2. Array.apply(null, Array(100)).map(x => 1)
3. Array(100).fill(1)

## 4. 如何在 url 中传递数组

在 URL 中如何传递数组这种复杂的数据，完全取决于项目中前后端成员关于复杂数据在 URL 中传输的约定，一般情况下可以使用以下方式来传递数组

```js
a=3&a=4&a=5

a=3,4,5

a[]=3&a[]=4&a[]=5

a[0]=3&a[1]=4&a[2]=5
```

## 5. 什么是 TypedArray

ArrayBuffer，二进制数组

## 6. js 中什么是可选链操作符，如何访问数组

`?. 操作符`，可以嵌套获取对象的属性值。通过获取对象属性获得的值可能是 `undefined 或 null` 时，可选链操作符提供了一种方法来简化被连接对象的值访问

```js
const obj = { a: [1, 2], b() {} };
// 访问数组
obj?.a?.[0];
//使用方法
obj?.b?.();
```

## 7. 如何过滤数组中的 falsy value

falsy value 包含：false, null, 0, "", undefined, NaN

```js
   array.filter(Boolean)
```

## 8. 如何判断一个数组是否包含某个值

```js
   Array.prototype.includes();
```

## 9. 如何判断某一个值是数组

```js
const isArray = Array.isArray || list => ({}).toString.call(list) === '[object Array]'

a instanceof Array

arr.proto === Array.prototype

Array.prototype.isPrototypeOf(arr)

```

## 10. 如何把一个数组 Array 转化为迭代器 Iterable

```js
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const it = list[Symbol.iterator]();

it.next();
```

## 11. 数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少?

几乎没有时间相差，数组是在计算机内存空间中分配一段连续的内存空间，并会记录下索引为`0`的内存地址。

当需要访问索引为`10万`的数据，计算机会进行计算，先找到索引为`0`的内存地址，在此基础上 `+ 10万` 即可以拿到索引为`10万`的数据

时间复杂度为常数级别： `O(1)`，这点计算时间对于内存来讲相当于没有，所以几乎没有时间相差

## 12. 数组的神奇变化

```js
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
``` 
答案：

array 1: length=5 last=[j,o,n,e,s] 

array 2: length=5 last=[j,o,n,e,s]

数组的`reverse`方法会影响原数组，普通的`arr2 = arr1`是浅复制，所以`arr1`和`arr2`的值是一样的

## 13. ['1', '2', '3'].map(parseInt) what & why ?

```js
const arr = ['1', '2', '3'].map(parseInt)

const arr1 = ['10','10','10','10','10'].map(parseInt);

console.log('arr', arr) // [1, NAN, NAN]

console.log('arr1', arr1) // [10, NAN, 2, 3, 4]
```

**解析：**

parseInt(string, radix), 解析一个字符串参数，并返回一个指定基数的整数 

string是要解析的值，如果不是字符串会先执行toString操作，radix的取值范围在于2-36，

注意： 在radix为 undefined，或者radix为 0 或者没有指定的情况下，JavaScript 作如下处理：

+ 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).
+ 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），ECMAScript 5 规定使用10
+ 如果字符串 string 以其它任何值开头，则基数是10 (十进制)

## 14. 输出下面代码的结果

```js
let unary = fn => val => fn(val)
let parse = unary(parseInt)
console.log(['1.1', '2', '0.3'].map(parse))
```

答案：[1,2,0]

```js
// 上述代码相当于以下代码片段，parseInt只接受了一个参数，所以是取整操作
let unary = (fn) => {
  return (val) => {
    return fn(val)
  }
}

let parse = unary(parseInt)

console.log(['1.1', '2', '0.3'].map(parse))

// [1,2,0]
```

## 15.请说出以下题目的答案chrome

```js
  let obj = {
    age: 18,
    foo: function (func) {
      func()
      arguments[0]()
    }
  }

  var age = 10
  function getAge () {
    console.log(this.age)
  }
  obj.foo(getAge)
```

答案：

```js
  10 
  // 此时getAge()作为函数参数进行传递会造成this的隐式绑定丢失，此时this指向全局对象window，所以输出10

  undefined 
  // 此时arguments = [function getAge() {}], 执行arguments[0]()相当于取数组的第一项进行执行，此时this指向数组对象，但是数组上面并没有age变量，所以输出undefined
```

arguments 伪数组

arguments参数是传递给函数的所有参数的集合(类数组结构)，也就是常说的伪数组

不管你的函数是否具有形参，arguments都会获取到你调用函数时传递的所有实参

特点：arguments只存在于普通函数中，window全局下和箭头函数中都不存在

