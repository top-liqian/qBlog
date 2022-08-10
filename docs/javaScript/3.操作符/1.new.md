# new 操作符

## 理解new做了些什么

1. 创建一个新的对象`F`
2. 这个新对象的`__proto__`属性指向构造函数的`prototype`,即`F.__proto__ = Fun.prototype`
3. 执行构造函数`Fun`，使用指定的参数调用构造函数`Fun`，并将 this 绑定到新创建的对象
4. 构造函数如果有返回值，如果返回`原始值`即没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)（例如 return 1） 那么这个返回值将`没有`任何意义，还是会返回`F`
5. 构造函数如果返回一个`对象`，那么这个对象就会被正常`引用`，返回其他对象会导致获取不到构造函数的实例，很容易因此引起意外的问题！
6. 返回的对象将作为构造函数的实例

## new的作用

1. new通过构造函数创建出来的实例可以访问到`构造函数`内部的属性
2. new通过构造函数创建出来的实例可以访问到`构造函数原型链`内部的属性
3. 构造函数如果返回`原始值`（例如 return 1） 那么这个返回值将`没有`任何意义，如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象。
4. 构造函数如果返回一个`对象`，那么这个对象就会被正常`引用`，就访问不到构造函数内部以及原型链当中的属性了

### new操作符的原生实现

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

[出处：重学 JS 系列：聊聊 new 操作符](https://juejin.im/post/5c7b963ae51d453eb173896e)
