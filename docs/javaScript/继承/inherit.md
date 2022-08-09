# 继承

## 什么是继承?

继承就是一个类从另一个类获取属性和方法的过程，而不需要重复写相同的代码

## js实现继承的原理?

复制父类的属性和方法来重写子类的原型对象

## 实现继承的几种方式

### 一、原型链继承(new)

原型链继承获取父类的属性和方法：

1. ```Parent```通过this绑定，将自身的属性和方法绑定在```new```期间创建的对象上面
2. 新对象的原型是```Parent.prototype```，通过原型链就可以找到父类的属性和方法

**注意点：**

1. 构造函数如果返回一个其他对象，其他对象没有父类的`this`和`prototype`，将会导致原型链继承失败。
2. 不能使用对象字面量的形式创建原型对象，这种方式很容易在不经意间，清除/覆盖了原型对象原有的属性/方法，不该为了稍微简便一点，而使用这种写法。
3. 下面这种方式会导致函数原型对象的属性```constructor```丢失，需要手动矫正
  
```js
  function test() {}
  test.prototype = { name: '111' }
```

```js
  function Parent () {
    this.title = 'father'
  }

  Parent.prototype.father = 'this is father'

  function Son () {
    this.title = 'son'
  }

  // Parent的实例同时包含实例属性和原型属性和方法, 所以直接将实例对象直接赋值给Son的原型对象
  SonFn.prototype = new FatherFn()

  SonFn.prototype.son = 'this is son'

  SonFn.prototype.constructor = Child // 由于更改了Son实例的原型对象，所以导致原型对象的实例丢失，需要手动矫正回来

  const sonFnIntance = new SonFn()

  /*
    SonFn {
      title: 'son'
      __proto__: FatherFn: {
        title: 'father', son: 'this is son',
        __proto__: {
          father: 'this is father'
          constructor: FatherFn
          __proto__: Object
        }
      }
    }
  */

```
**原型链继承的缺点:**

1. 父类使用this声明的变量将会被共享， 如果属性是引用类型的，如果某一个实例修改了这个属性，其他的实例都会受到影响

  原因是：实例化的父类(sonFn.prototype = new fatherFn())是一次性赋值到子类实例的原型(sonFn.prototype)上，它会将父类通过this声明的属性也在赋值到sonFn.prototype上。

2. 创建子类的实例时，无法向父类构造函数传参，不够灵活，具有一定的

### 二、借用构造函数继承(call/apply即执行构造函数并且改变this的指向问题)

```js
function Father(name) {
  this.name = name
}

Father.prototype.age = 18

function Son(name) {
  Father.call(this, name)
}

const son1 = new Son('big son')

const son2 = new Son('small son')

console.log('son1, son2', son1.name, son2.name) // son1, son2 big son small son

console.log('age', son1.age) // age undefined

```

**借用构造函数继承做了什么？**

`一经call/apply调用的函数会立即执行，并在函数执行完毕行改变this的指向`

Father.call(this, ...fathParams)

1. 在子类中使用call调用父类，Father将会被立即执行，并且将Father函数的this指向Son的this。
2. 因为函数执行了，所以Father使用this声明的函数都会被声明到Son的this对象下。
3. 实例化子类，this将指向new期间创建的新对象，返回该新对象。
4. **对Father.prototype没有任何操作，无法继承。**

**借用构造函数继承的优缺点**

**优点：**

1. 可以向父类传递参数
2. 解决了原型链继承中：父类属性使用this声明的属性会在所有实例共享的问题。

**缺点：**

1. 方法在构造函数内定义了，每次创建实例的时候都会创建一遍新的方法，多占内存
2. 只能继承父类通过this声明的属性/方法，不能继承父类prototype上的属性/方法
3. 父类方法无法复用：因为无法继承父类的prototype，所以每次子类实例化都要执行父类函数，重新声明父类this里所定义的方法，因此方法无法复用

### 三、组合继承(call/apply + new)

```js
  function Parent(name) {
    this.name = name
  }

  Parent.prototype.age = 18

  Parent.prototype.getName = function () {
    return this.name
  }

  function Son (name) {
    Parent.call(this, name)
  }

  Son.prototype = new Parent()

  const son1 = new Son('big son')

  const son2 = new Son('small son')

  console.log('son1, son2', son1.name, son2.name) // son1, son2 big son small son

  console.log('age', son1.age) // age 18

  console.log(son1.getName === son2.getName) // true

```

**借用构造函数继承的优缺点**

**优点：完整继承(又不是不能用)**

1. 类通过`this`声明属性/方法被子类实例共享的问题(原型链继承的问题) 每次实例化子类将重新初始化父类通过`this`声明的属性，实例根据原型链查找规则，每次都会
2. 父类通过`prototype`声明的属性/方法无法继承的问题(借用构造函数的问题)。

**缺点：**

1. 调用了两次父类的构造函数，导致父类通过this声明的属性/方法，生成两份的问题, 造成了一定的性能消耗, 导致内存占⽤过多
2. 原型链上下文丢失：子类和父类通过prototype声明的属性/方法都存在于子类的prototype上

### 四、原型式继承(Object.create())

这种方法并没有使用严格意义上构造函数，而是借助原型基于已有函数创建新的对象

**手动实现一个Object.create()**

```js
  function create (obj) {
    function A () {}
    A.prototype = obj; // 将被继承的对象作为空函数的prototype
    return new A();  // 返回new期间创建的新对象,此对象的原型为被继承的对象, 通过原型链查找可以拿到被继承对象的属性
  }
```
![继承](./inherit-1.png)

#### 原型之间的继承

```js
function Parent () {
}
function Child () {}

let childPrototype = Child.prototype
let childPrototypeProto = Child.prototype.__proto__
let parentPrototype = Parent.prototype

// 方法一
childPrototypeProto = parentPrototype
// 父类构造器原型作为子类构造器原型(ChildPrototype)的对象原型(ChildPrototypeProto)

// 方法二
childPrototype = Object.creat(parentPrototype)
// Object.create返回一个对象，其__proto__指向传入的参数，也就实现返回的对象继承参数对象

// 方法三
Object.setPrototype(childPrototype, parentPrototype)
// 直接设置参数1的原型(__proto__)为参数2
```

**优点：** 继承可以让原型链丰富，根据需求定制不同的原型链，不会存在内存浪费的情况，原型只会保留一份，用到的时候调用就行还能节省空间

**缺点：** 原型的引用类型属性会在各实例之间共享

### 五、寄生继承

其实就是在原型式继承得到对象的基础上，在内部再以某种方式来增强对象，然后返回

```js
function createAnother(original) {
	var clone = object(original);
	clone.sayHi = function() {
		alert("hi");
	};
	return clone;
}
```

**优点：** 寄生式继承在主要考虑对象而不是自定义类型和构造函数的情况下非常有用

**缺点：** 寄生式继承为对象添加函数不能做到函数复用，因此效率降低

### 六、寄生组合式继承

组合继承是JS中最常用的继承模式，但其实它也有不足，组合继承无论什么情况下都会调用两次超类型的构造函数，并且创建的每个实例中都要屏蔽超类型对象的所有实例属性。

寄生组合式继承就解决了上述问题，被认为是最理想的继承范式

```js
function Parent(name) {
  this.name = name
}

function Child(name, age) {
  Parent.apply(this, name)
  this.age = age
}

function createObject (o) {
    function F() {}
    F.prototype = o
    return new F()
}

function _inherite (Parent, Child) {
  Child.prototype = createObject(Parent.prototype)

  Child.prototype,constructor = Child

  Child.__proto__ = Parent

}

_inherite(Parent, Child)

Child.prototype.getAge = function () {
  return this.age
}

let child = new Child('child', 38)

console.log(child.getAge()); // 38
```


### 七、 class继承

#### ES6 extends 继承做了什么操作

我们先看看这段包含静态方法的 ES6 继承代码：

```js
  class Parent {
    constructor(name) {
      this.name = name
    }

    sayHello() {
      console.log('hello')
    }

    getName() {
      return this.name
    }
  }

  class Child extends Parent {
    constructor(name, age) {
      super(name);
      this.age = age;
    }
    sayAge() {
      console.log('my age is ' + this.age);
      return this.age;
    }
  }

  let parent = new Parent('parent')

  let child = new Child('child', 18)

  const hello = parent.sayHello()
  const name = parent.getName()

  const childName = child.getName()
  const childAge = child.sayAge()

  console.log('parent', name)
  console.log('parent', childName, childAge)
```

其中这段代码里有两条原型链，一个继承语句同时存在两条继承链：一条实现属性继承，一条实现方法的继承

```js
class A extends B{}
A.__proto__ === B;  //继承属性
A.prototype.__proto__ == B.prototype;//继承方法
```

```js
// 构造器
const a = Child.__proto__ === Parent
const b = Parent.__proto__ === Function.prototype
const c = Function.prototype.__proto__ === Object.prototype
const d = Object.prototype.__proto__ === null
// 实例

const e = child.__proto__ === Child.prototype
const f = Child.prototype.__proto__ === Parent.prototype
const g = Parent.prototype.__proto__ === Object.prototype
const h = Object.prototype.__proto__ === null

console.log(a,b,c,d,e,f,g,h)
// true true true true true true true true
```

综上所述，我们可以知道`ES6extends继承`，主要就是：

1. 将子类Child的__proto__属性指向了父类的Parent
2. 子类的原型对象Child.prototype的__proto__属性指向了父类的原型对象Parent.prototype
3. 通过关键字super调用（实际上类似于使用call/apply执行父类的构造函数并且改变this的指向), 使得子类具有父类的方法与属性

`2-3点`都完全符合ES5当中的`组合寄生式继承`，但是第一点并没有实现， 那问题来了，什么可以设置`__proto__`属性呢？

`new操作符， Obejct.create, Object.setPrototypeOf`都可以设置`__proto__`

ES6 的 class 继承用 ES5 如何实现？

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
#### es5和es6继承的区别

> 1. ES5的继承机制实际上先创建子类实例对象，然后在将父类的属性和方法绑定在子类上，通过apply/call的方式；（ES5先创建子类，在实例化父类并添加到子类this中）但是ES6的继承机制是先创建父类的实例对象this（即先调用super方法），然后再用子类的构造函数修改this（ES6先创建父类，在实例化子集中通过调用super方法访问父级后，在通过修改this实现继承）。
> 2. ES5的继承时通过原型或构造函数机制来实现；.ES6通过class关键字定义类，类之间通过extends关键字实现继承，里面有构造方法constructor，子类必须在constructor方法中调用super方法，否则新建实例报错。因为子类没有自己的this对象，而是继承了父类的this对象，然后对其进行加工。如果不调用super方法，子类得不到this对象。

## 如何继承Date对象

使用经典的寄生组合式继承的写法遇到了报错信息

`consol报错 TypeError: this is not a Date object.`

关键是：由于调用的对象不是Date的实例，所以不允许调用，就算是自己通过原型继承的也不行

### 为什么不能实现继承

1. 从MDN上可以明确看到，`JavaScript的日期对象`只能通过`JavaScript Date`作为`构造函数`来`实例化`。
2. v8引擎底层代码中有限制，如果调用对象的[[Class]]不是Date，则抛出错误

so：要调用Date上方法的实例对象必须通过Date构造出来，否则不允许调用Date的方法

[如何继承Date对象？](https://juejin.cn/post/6844903550636523533#heading-9)

## 面试题：

1. ES5有几种继承的方式
2. es6继承的本质
3. 为什么⼀定要通过桥梁的⽅式让 Child.prototype 访问到Parent.prototype？直接 Child.prototype = Parent.prototype 不⾏吗？
  答：不可以，在给 Child.prototype 添加新的属性或者⽅法后，Parent.prototype 也会随之改变
4. ES6 的 class 继承用 ES5 如何实现？
5. es5和es6继承的区别
6. 如何继承Date对象

