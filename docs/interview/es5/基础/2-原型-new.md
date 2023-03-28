# 一、原型与原型链

## 1. 对原型、原型链的理解

当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针指向构造函数的 prototype 属性对应的值，这个指针就是对象的原型。构造函数的prototype属性包含了所有实例所共享的属性和方法，现在浏览器中都实现了proto属性来访问这个原型，可以通过Object.getPrototypeOf方法来获取对象的原型。

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，这样就形成了一个原型查找链条，也就是原型链。原型链的尽头一般来说都是 Object.prototype，所以这就是新建的对象为什么能够使用 toString() 等方法的原因。

**特点：** JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会继承这一改变。

## 2. 如何获得对象非原型链上的属性？

使用后`hasOwnProperty()`方法来判断属性是否属于原型链的属性

## 3. 原型链的终点是什么？如何打印出原型链的终点？

原型链的终点是null   Object.prototype.__proto__

# 二、new相关的面试题

## 1. new操作符的实现原理

（1）首先创建了一个新的空对象
（2）设置原型，将对象的原型设置为函数的 prototype 对象。
（3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
（4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象

```js
function create (fn, ...args) {
    if(typeof fn !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    // create.target = fn; --- unkown
    let obj = {}
    Object.setPrototypeOf(obj, fn.prototype)
    // 使用指定的参数调用构造函数`Fun`，并将 this 绑定到新创建的对象
    let result = fn.apply(obj, args)
    return result instanceof Object ? result : obj
}
```
## 2. 关于 new，判断以下代码输出

```js
function F () {
 this.a = 3;
 return { a: 4 }
}
const f = new F();
console.log(f.a);
```

答案：输出 4 new 操作符，默认返回 this 对象。如果手动指定返回对象，则 new 出来的实例指向的是 return 的对象，而不是 this
