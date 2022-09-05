# Functor - 函子

## 函子

+ 容器：包含值和值的变形关系
+ 函子：是一个特殊的容器，通过一个普通的对象来实现，该对象具有map方法，map方法可以运行一个函数对值进行处理,永远不会对外部公布，如果想要对函子维护的值进行处理，就调用函子的map方法，并且map方法返回一个函子对象，所以就可以对函子维护的值进行不断的链式处理

```js
class Container {
    constructor(value) {
       this._value = value
    }
    map(fn) {
        return new Container(fn(this._value))
    }
}

let r = new Container(5)
.map(x => x + 1)
.map(x => x * x)

console.log(r) // Container { _value: 36 }
```

封装一下

```js
class Container {
    static of(value) {
        return new Container(value) 
    }
    constructor(value) {
       this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}

let r = Container.of(5)
    .map(x => x + 1)
    .map(x => x * x)

console.log(r) // Container { _value: 36 }
```

## 总结

+ 函数式编程的运算不直接操作值，而是由函子完成
+ 函子就是一个实现了map契约的对象
+ 我们可以把函子想像成一个盒子，这个盒子里封装了一个值
+ 想要处理盒子里的值，我们就需要给盒子的map方法传递一个处理值得函数（纯函数），有这个函数来对值进行处理
+ 最终map方法返回一个包含新值的盒子（函子）

## 解决一些问题

