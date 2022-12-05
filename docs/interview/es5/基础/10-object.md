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