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