# Object相关的面试题

## 1. Object.keys 与 Object.getOwnPropertyNames() 有何区别

+ Object.keys: 列出可枚举的属性值
+ Object.getOwnPropertyNames: 列出所有属性值(包括可枚举与不可枚举)

## 2. 实现一个 inherits 函数进行继承

```js
function inherits(SuperType, SubType) {
  const pro = Object.create(SuperType.prototype);
  pro.constructor = SubType;
  SubType.prototype = pro;
}
function SuperType(friends) {
  this.friends = friends;
}
SuperType.prototype.getFriends = function () {
  console.log(this.friends);
};
function SubType(name, friends) {
  this.name = name;
  SuperType.call(this, friends);
}
inherits(SuperType, SubType);
SubType.prototype.getName = function () {
  console.log(this.name);
};

const tom = new SubType("tom", ["jerry"]);
tom.getName();
// 'tom'
tom.getFriends();
// ['jerry']
tom.friends.push("jack");
tom.getFriends();
// ['jerry', 'jack']
```

## 3. Object.is 与全等运算符(===)有何区别

Object.is()在===基础上特别处理了NaN,-0,+0，保证-0与+0不相等，但NaN与NaN相等

## 4. 在 JS 中如何监听 Object 某个属性值的变化

```js
let handler = {
  get: (obj,prop) => {
    return obj[prop]
  },
  set: (obj,prop,value) => {
    obj[prop] = value
  }
}

const proxy = new Proxy(obj, handler)
```

## 4. JS 如何检测到对象中有循环引用

```js
const a = {
  a: 1,
  c: 3
}

const b = {
  a: a,
  c: 3
}
a.b = b;

//JSON.stringify(a);

const keyMap = new Map();
keyMap.set(a, "1");
keyMap.set(b, "2");
function circle(target) {
  const keys = Object.keys(target);
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = target[key];
    if(keyMap.has(val)) {
      return true
    } else {
      keyMap.set(val, key)
      if(typeof val === 'object') {
        circle(val)
      }
    }
  }
  return false;
}
console.log(circle(a))
```

## 5. 如何遍历一个对象

1. Reflect.ownKeys({ a: 3, b: 4})
2. Object.keys({ a: 3, b: 4 })
3. for...in
4. object.entries({ a: 3, b: 4 })
5. 普通对象可以通过添加一个Symbol.iterator属性，实现使用 for of 遍历

```js
const obj = { a: 1, b: 2, c: 3 };

obj[Symbol.iterator] = function () {
  let i = 0;
  const keys = Object.keys(this);
  return {
    next: () => {
      return i <= keys.length - 1
        ? { value: this[keys[i++]], done: false }
        : { value: undefined, done: true };
    },
  };
};

for (let item of obj) {
  console.log(item);
}
```

## 如何遍历对象的属性？

+ 遍历自身可枚举的属性（可枚举、非继承属性）：Object.keys() 方法,该方法会返回一个由给定对象的自身可枚举属性组成的数组。
+ 遍历自身的所有属性（可枚举、不可枚举、非继承属性）：Object.getOwnPropertyNames()方法，该方法会返回一个由指定对象的所有自身属性组成的数组
+ 遍历可枚举的自身属性和继承属性：for ... in ...

## 如何判断两个对象是否相等？

1. Object.is(obj1, obj2)，判断两个对象都引用地址是否一致，true 则一致，false 不一致
2. 判断两个对象内容是否一致，思路是遍历对象的所有键名和键值是否都一致
① 判断两个对象是否指向同一内存
② 使用 Object.getOwnPropertyNames 获取对象所有键名数组
③ 判断两个对象的键名数组是否相等
④ 遍历键名，判断键值是否都相等

```js
function isObjValueEqual(a, b) {
  // 判断两个对象是否指向同一内存，指向同一内存返回 true
  if (a === b) return true;
  // 获取两个对象的键名数组
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  // 判断两键名数组长度是否一致，不一致返回 false
  if (aProps.length !== bProps.length) return false;
  // 遍历对象的键值
  for (let prop in a) {
    // 判断 a 的键名，在 b 中是否存在，不存在，直接返回 false
    if (b.hasOwnProperty(prop)) {
      // 判断 a 的键值是否为对象，是对象的话需要递归；
      // 不是对象，直接判断键值是否相等，不相等则返回 false
      if (typeof a[prop] === 'object') {
        if (!isObjValueEqual(a[prop], b[prop])) return false;
      } else if (a[prop] !== b[prop]){
        return false
      }
    } else {
      return false
    }
  }
  return true;
}
```
## 对象创建的方式有哪些？

一般使用字面量的形式直接创建对象，但是这种创建方式对于创建大量相似对象的时候，会产生大量的重复代码。

1. 第一种是工厂模式，工厂模式的主要工作原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。但是它有一个很大的问题就是创建出来的对象无法和某个类型联系起来，它只是简单的封装了复用代码，而没有建立起对象和类型间的关系。
2. 第二种是构造函数模式。js 中每一个函数都可以作为构造函数，只要一个函数是通过 new 来调用的，那么就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的 prototype 属性，然后将执行上下文中的 this 指向这个对象，最后再执行整个函数，如果返回值不是对象，则返回新建的对象。因为 this 的值指向了新建的对象，因此可以使用 this 给对象赋值。构造函数模式相对于工厂模式的优点是，所创建的对象和构造函数建立起了联系，因此可以通过原型来识别对象的类型。但是构造函数存在一个缺点就是，造成了不必要的函数对象的创建，因为在 js 中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的。
3. 第三种模式是原型模式，因为每一个函数都有一个 prototype 属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此可以使用原型对象来添加公用属性和方法，从而实现代码的复用。这种方式相对于构造函数模式来说，解决了函数对象的复用问题。但是这种模式也存在一些问题，一个是没有办法通过传入参数来初始化值，另一个是如果存在一个引用类型如 Array 这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例。
4. 第四种模式是组合使用构造函数模式和原型模式，这是创建自定义类型的最常见方式。因为构造函数模式和原型模式分开使用都存在一些问题，因此可以组合使用这两种模式，通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用。这种方法很好的解决了两种模式单独使用时的缺点，但是有一点不足的就是，因为使用了两种不同的模式，所以对于代码的封装性不够好。
5. 第五种模式是动态原型模式，这一种模式将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。这一种方式很好地对上面的混合模式进行了封装。
6. 第六种模式是寄生构造函数模式，这一种模式和工厂模式的实现基本相同，我对这个模式的理解是，它主要是基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不用修改原来的构造函数，也达到了扩展对象的目的。它的一个缺点和工厂模式一样，无法实现对象的识别。

##  JavaScript有哪些内置对象?

js 中的内置对象主要指的是在程序执行前存在全局作用域里的由 js 定义的一些全局值属性、函数和用来实例化其他对象的构造函数对象。一般经常用到的如全局变量值 NaN、undefined，全局函数如 parseInt()、parseFloat() 用来实例化对象的构造函数如 Date、Object 等，还有提供数学计算的单体内置对象如 Math 对象。

