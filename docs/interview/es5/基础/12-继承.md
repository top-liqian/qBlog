## 1. ES5/ES6 的继承除了写法以外还有什么区别？

> 1. ES5的继承机制实际上先创建子类实例对象，然后在将父类的属性和方法绑定在子类上，通过apply/call的方式；（ES5先创建子类，在实例化父类并添加到子类this中）但是ES6的继承机制是先创建父类的实例对象this（即先调用super方法），然后再用子类的构造函数修改this（ES6先创建父类，在实例化子集中通过调用super方法访问父级后，在通过修改this实现继承）。
> 2. ES5的继承时通过原型或构造函数机制来实现；.ES6通过class关键字定义类，类之间通过extends关键字实现继承，里面有构造方法constructor，子类必须在constructor方法中调用super方法，否则新建实例报错。因为子类没有自己的this对象，而是继承了父类的this对象，然后对其进行加工。如果不调用super方法，子类得不到this对象。

## 2. class继承都做些什么？es6继承的本质

1. 将子类Child的__proto__属性指向了父类的Parent
2. 子类的原型对象Child.prototype的__proto__属性指向了父类的原型对象Parent.prototype
3. 通过关键字super调用（实际上类似于使用call/apply执行父类的构造函数并且改变this的指向), 使得子类具有父类的方法与属性

## 3. ES5有几种继承的方式

1. 原型链继承(new)
2. 借用构造函数继承(call/apply即执行构造函数并且改变this的指向问题)
3. 组合继承(call/apply + new)
4. 原型式继承(Object.create())
5. 寄生继承
6. 寄生组合式继承

## 4. ES6新增的继承方式

class

## 5. 为什么⼀定要通过桥梁的⽅式让 Child.prototype 访问到Parent.prototype？直接 Child.prototype = Parent.prototype 不⾏吗？

不可以，在给 Child.prototype 添加新的属性或者⽅法后，Parent.prototype 也会随之改变

## 6. ES6 的 class 继承用 ES5 如何实现？

```js
function Parent1 (name) {
  this.name = name
}

Parent1.prototype.sayHello = function() {
  console.log('hello')
}

Parent1.prototype.getName = function() {
  return this.name
}

function Child1 (name, age) {
  Parent1.call(this, name) // 这步相当于super
  this.age = age
}

function initProto (Child, Parent) {
  Child.prototype = Object.create(Parent.prototype)

  Child.prototype.constructor = Child

  Child.__proto__ = Parent

}

initProto(Child, Parent)

Child1.prototype.sayAge = function () {
  console.log('my age is ' + this.age);
  return this.age;
}

let parent1 = new Parent('parent')

let child1 = new Child('child', 18)

const hello1 = parent.sayHello()
const name1 = parent.getName()

const childName1 = child.getName()
const childAge1 = child.sayAge()

console.log('parent1', name1)
console.log('child1', childName1, childAge1)
```