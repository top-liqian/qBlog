# 数组相关的面试题

## 1. 列出对数组产生副作用和没有副作用的方法
   
产生副作用的方法8种：```pop()、push() 、shift()、unshift()、reverse()、sort()、splice()、map()```

没有副作用11种：```concat()、reduce()、some()、every()、filter()、forEach()、slice()、join()、toString()、toLocaleString()、valueOf()```

## 2. 常见的类数组

document.getElementsByTagName、document.querySelectorAll、function 中的 arguments 也是类数组

## 3. 在 js 中如何把类数组转化为数组

1. Array.prototype.slice.call(arrayLike);
2. Array.prototype.splice.call(arrayLike, 0);
3. Array.prototype.concat.apply([], arrayLike);
4. Array.from(arrayLike);
   
以下几种方式需要考虑稀疏数组的转化

+ Array.prototype.filter.call(divs, (x) => 1);
+ Array.prototype.map.call(arrayLike, (x) => x);
+ Array.prototype.filter.call(arrayLike, (x) => 1);

## 4. 为什么函数的arguments参数是类数组而不是数组？如何遍历类数组?

arguments是一个对象，它的属性是从0开始依次递增的数字，还有callee和length等属性，与数组相似；但是它却没有数组常见的方法属性，如forEach, reduce等，所以叫它们类数组

1. Array.prototype.forEach.call(arguments, a => console.log(a))
2. 使用Array.from方法将类数组转化成数组
3. 使用展开运算符将类数组转化成数组

## 5. 类数组对象的定义？

一个拥有 length 属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有 arguments 和 DOM 方法的返回结果，还有一个函数也可以被看作是类数组对象，因为它含有 length 属性值，代表可接收的参数个数。

## 6. 如何生成100个元素为1的数组呢？

1. Array.from(Array(100), x => 1)
2. Array.apply(null, Array(100)).map(x => 1)
3. Array(100).fill(1)

## 7. 如何在 url 中传递数组

`a=3&a=4&a=5` 或者 `a[]=3&a[]=4&a[]=5` 或者 `a[0]=3&a[1]=4&a[2]=5`

## 8. 什么是 TypedArray? ArrayBuffer，二进制数组

## 9. js 中什么是可选链操作符，如何访问数组

`?. 操作符`，可以嵌套获取对象的属性值。通过获取对象属性获得的值可能是 `undefined 或 null` 时，可选链操作符提供了一种方法来简化被连接对象的值访问，a?.[0]

## 10. 如何过滤数组中的 falsy value

falsy value 包含：false, null, 0, "", undefined, NaN, 使用array.filter(Boolean)

## 11. 如何判断一个数组是否包含某个值 - Array.prototype.includes()

## 12. 如何判断某一个值是数组?(共5种)

+ 通过Object.prototype.toString.call()做判断 `Object.prototype.toString.call(obj).slice(8,-1) === 'Array';`
+ 通过原型链做判断 `obj.__proto__ === Array.prototype;`
+ 通过ES6的Array.isArray()做判断
+ 通过instanceof做判断 `a instanceof Array`
+ 通过Array.prototype.isPrototypeOf

## 13. 如何把一个数组 Array 转化为迭代器 Iterable

list[Symbol.iterator]()

## 14. 数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少?

几乎没有时间相差，数组是在计算机内存空间中分配一段连续的内存空间，并会记录下索引为`0`的内存地址。当需要访问索引为`10万`的数据，计算机会进行计算，先找到索引为`0`的内存地址，在此基础上 `+ 10万` 即可以拿到索引为`10万`的数据。时间复杂度为常数级别： `O(1)`，这点计算时间对于内存来讲相当于没有，所以几乎没有时间相差

## 15. Array.from() 和 Array.of() 的使用及区别？

+ Array.from()：将伪数组对象或可遍历对象转换为真数组。接受三个参数：input、map、context。input：待转换的伪数组对象或可遍历对象；map：类似于数组的 map 方法，用来对每个元素进行处理，将处理后的值放入返回的数组；context：绑定map中用到的 this。
+ Array.of()：将一系列值转换成数组，会创建一个包含所有传入参数的数组，而不管参数的数量与类型，解决了new Array()行为不统一的问题。

## 16. forEach和map方法有什么区别

+ forEach()方法会针对每一个元素执行提供的函数，对数据的操作会改变原数组，该方法没有返回值；
+ map()方法不会改变原数组的值，返回一个新数组，新数组中的值为原数组调用函数处理之后的值；

## 17. 数组具有哪一些原生方法

1. 数组和字符串的转换方法：toString()、toLocalString()、join() 其中 join() 方法可以指定转换为字符串时的分隔符。
2. 数组尾部操作的方法 pop() 和 push()，push 方法可以传入多个参数。
3. 数组首部操作的方法 shift() 和 unshift() 重排序的方法 reverse() 和 sort()，sort() 方法可以传入一个函数来进行比较，传入前后两个值，如果返回值为正数，则交换两个参数的位置。
4. 数组连接的方法 concat() ，返回的是拼接好的数组，不影响原数组。
5. 数组截取办法 slice()，用于截取数组中的一部分返回，不影响原数组。
6. 数组插入方法 splice()，影响原数组查找特定项的索引的方法，indexOf() 和 lastIndexOf() 迭代方法 every()、some()、filter()、map() 和 forEach() 方法
7. 数组归并方法 reduce() 和 reduceRight() 方法

## 18. 数组的遍历方法有哪些

| 方法 | 是否改变原数组 | 特点 | 
| - | - | - | 
| forEach() | 否 | 数组方法，不改变原数组，没有返回值 | 
| map() | 否 | 数组方法，不改变原数组，有返回值，可链式调用 | 
| filter() | 否 | 数组方法，过滤数组，返回包含符合条件的元素的数组，可链式调用 | 
| for...of | 否 | for...of遍历具有Iterator迭代器的对象的属性，返回的是数组的元素、对象的属性值，不能遍历普通的obj对象，将异步循环变成同步循环 | 
| every() 和 some() | 否 | 数组方法，some()只要有一个是true，便返回true；而every()只要有一个是false，便返回false. |
| find() 和 findIndex() | 否 | 数组方法，find()返回的是第一个符合条件的值；findIndex()返回的是第一个返回条件的值的索引值 | 
| reduce() 和 reduceRight() | 否 | 数组方法，reduce()对数组正序操作；reduceRight()对数组逆序操作 | 

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


## 16. 数组的神奇变化

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

## 17. ['1', '2', '3'].map(parseInt) what & why ?

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

## 18. for...in和for...of的区别

for…of 是ES6新增的遍历方式，允许遍历一个含有iterator接口的数据结构（数组、对象等）并且返回各项的值，和ES3中的for…in的区别如下

+ for...of 遍历获取的是对象的键值，for…in 获取的是对象的键名；
+ for...in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for...of 只遍历当前对象不会遍历原型链；
对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for...of 只返回数组的下标对应的属性值；

总结： for...in 循环主要是为了遍历对象而生，不适用于遍历数组；for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象。

## 19. JavaScript 中数组是如何存储的？

+ 同种类型数据的数组分配连续的内存空间
+ 存在非同种类型数据的数组使用哈希映射分配内存空间