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