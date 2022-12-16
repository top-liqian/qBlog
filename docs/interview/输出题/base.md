# 输出题目

## 1. 输出 为什么

```js
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
```

## 2. 输出 为什么

```js
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
 
async function async2() {
  console.log('3');
}
 
console.log('4');
 
setTimeout(function() {
    console.log('5');
}, 0);  
 
async1();
 
new Promise(function(resolve) {
    console.log('6');
    resolve();
  }).then(function() {
    console.log('7');
});
 
console.log('8');
```

## 3. 输出

```js
console.log(typeof typeof typeof null);
console.log(typeof console.log(1));
```

## 4. 输出

```js
setTimeout(function () {
  console.log(1);
}, 100);

new Promise(function (resolve) {
  console.log(2);
  resolve();
  console.log(3);
}).then(function () {
  console.log(4);
  new Promise((resove, reject) => {
    console.log(5);
    setTimeout(() =>  {
      console.log(6);
    }, 10);
  })
});
console.log(7);
console.log(8)
```

## 5. 作用域

```js
var a=3;
  function c(){
    alert(a);
  }
 (function(){
  var a=4;
  c();
 })();
```

## 6. 输出

```js
  function Foo(){
    Foo.a = function(){
      console.log(1);
    }
    this.a = function(){
      console.log(2)
    }
  }

  Foo.prototype.a = function(){
    console.log(3);
  }

  Foo.a = function(){
    console.log(4);
  }

  Foo.a();
  let obj = new Foo();
  obj.a();
  Foo.a();
```

## 7. JSON.stringfy

```js
const obj = {
  a: 3,
  b: 4,
  c: null,
  d: undefined,
  get e() {},
};
JSON.stringfy(obj)

// {"a":3,"b":4,"c":null }  对其中的 undefined，function 将在 JSON.stringify 时会忽略掉
```

## 8. Array(100).map(x => 1) 结果是多少

Array(100) 将会创建一个稀疏数组 (sparse array)，即不存在真实元素，节省内存空间。在控制台上显示为 [empty]

正因为没有元素，所以它也不会有 map 操作，所以 Array(100).map(x => 1) 仍然返回为 [empty]

## 9. 关于块级作用域，以下代码输出多少，在何时间输出

```js
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000 * i);
}

for (var i = 0; i < 5; i++) {
  setTimeout(console.log, 1000 * i, i);
}
```
var 声明的变量是在函数作用域或者全局作用域的，在第一种方式中，由于 setTimeout 是异步执行，且它是从闭包中获取 i 变量，由于 i 是在函数/全局作用域中声明的，所以 5 次循环中 i 不断被赋值，最后 i 的值为 5，执行的结果为连续的 5 个 5。

在第二种方式中，通过给 setTimeout 的回调函数传参的方式，保存了每次循环中 i 的值，因此执行结果符合预期

let 声明的变量是在块级作用域(花括号)中的，因此可以认为每次执行循环语句块中的 i 变量是互相独立的，所以执行结果也符合预期

## 10. 关于词法作用域，判断以下代码输出

```js
var scope = "global scope";
function checkScope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}

checkScope()(); // local scope
```

## 11. 输出以下代码运行结果

```js
1 + "1"

2 * "2"

[1, 2] + [2, 1]

"a" + + "b"
```

```js
11 // + 符号如果存在string则是字符串拼接

4 // * 符号如果左右两侧不是number 则调用Number()转换成number进行相乘

1,22,1 // Javascript中所有对象基本都是先调用valueOf方法，如果不是数值，再调用toString方法

aNaN // 后面的+号被是为一元运算符， 调用Number方法转换出NaN，进行拼接
```

加号作为一元运算符时，其后面的表达式将进行`ToNumber`(参考es规范)的抽象操作

+ true -> 1
+ false -> 0
+ undefined -> NaN
+ null -> 0
+ ’字符串‘ -> 字符串为纯数字时返回转换后的数字（十六进制返回十进制数），否则返回`NaN`
+ 对象 -> 通过T`oPrimitive`拿到基本类型值，然后再进行`ToNumber`操作 `+{valueOf: ()=> 5}  // 5`  `+{} -> NaN`

## 12. 请写出如下代码的打印结果

```js
var name = 'Tom';
(function() {
if (typeof name == 'undefined') {
  name = 'Jack';
  console.log('Goodbye ' + name);
} else {
  console.log('Hello ' + name);
}
})();
```

1. 首先在进入函数作用域当中，获取name属性 
2. 在当前作用域没有找到name 
3. 通过作用域链找到最外层，得到name属性 
4. 执行else的内容，得到Hello Tom

```js
Hello Tom
```

## 13. 请写出如下代码的打印结果

```js
var name = 'Tom';
(function() {
if (typeof name == 'undefined') {
  var name = 'Jack';
  console.log('Goodbye ' + name);
} else {
  console.log('Hello ' + name);
}
})();
```
1. var name = 'Jack'会变量提升至就近function的最上层
2. typeof name == 'undefined'
3. Goodbye Jack

```js
Goodbye Jack
```

## 14. 分别写出如下代码的返回值

```js
String('11') == new String('11');
String('11') === new String('11');
```

```js
String('11') == new String('11').toString() // true
String('11') === new String('11') // 相当于 '11' === {"11"} false
```

## 15. 请写出如下代码的打印结果

```js
function Foo() {
  Foo.a = function() {
   console.log(1)
  }
  this.a = function() {
   console.log(2)
  }
}

Foo.prototype.a = function() {
  console.log(3)
}

Foo.a = function() {
  console.log(4)
}

Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```

```js
4 2 1
```

## 16. 写出如下代码的打印结果

```js
function changeObjProperty(o) {
  o.siteUrl = "http://www.baidu.com"
  o = new Object()
  o.siteUrl = "http://www.google.com"
} 
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl);
```

```js
"http://www.baidu.com"

webSite被传进changeObjProperty函数当中，先被赋值"http://www.baidu.com"
后面o又指向了新的地址，被重新赋值，但是函数的行参是值传递，原来的引用还在
所以webSite.siteUrl 访问的是原对象，打印出"http://www.baidu.com"
```

## 17. 输出以下代码运行结果

```js
// example 1
var a = {}, b = '123', c = 123;  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);

---------------------
// example 2
var a = {}, b = Symbol('123'), c = Symbol('123');  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);

---------------------
// example 3
var a = {}, b = {key:'123'}, c = {key:'456'};  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);
```

```js
a = { '123': 'c' }  答案：'c'
a = { Symbol('123'): 'b',  Symbol('123'): 'c' }  答案：'c'
a = { '[object Object]': 'c' }  答案：'c'
```

+ 对象的键名只能是字符串或者Symbol类型
+ 其他类型的都会被转换成字符串
+ 对象转字符串默认会调用toString方法


## 18. 输出下面的值

```js
var a = { name: "Sam" };
var b = { name: "Tom" };
var o = {};
o[a] = 1;
o[b] = 2;
console.log(o[a]);
```
2， 对象不能使用对象当作键值，所以会执行toString操作，o[a] 就相当于 o['[object Object]']，所以两次赋值都是相同的键值，所以返回2