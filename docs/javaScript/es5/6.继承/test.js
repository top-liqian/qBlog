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