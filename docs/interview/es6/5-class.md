# class相关的面试题

## 在 ES6 Class 中，super 的过程中做了什么？

本质就是 call（this）

```js
class Super { constructor() { do something } }

class Sub extends Super {
    constructor() {
        super();
    }
}

//  =========等价于=========

function Super() {
  //do something
}

function Sub() {
  Sub.prototype.__proto__ = Super.prototype; //extends
  Super.call(this); //constructor中的super
  //但是其实这个地方严格讲是有问题的
  //在使用ES6 class的时候，constructor并不负责创建成员函数
  //但是在用Constructor function时，一个function要管所有的
  //成员变量和函数的创建。
  //而Super里的所有东西都释放到当前上下文this中是不合适的
  //会出现命名冲突之类的
  //babel的具体的实现要比这个复杂很多。

  //do something else
}
```