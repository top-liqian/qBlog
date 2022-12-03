### 详解call，apply，bind

#### 语法

```js
  fun.call(thisArg, param1, param2, ...)
  fun.apply(thisArg, [param1,param2,...])
  fun.bind(thisArg, param1, param2, ...)
```

#### 返回值

+ call/apply：调用有指定```this```值和```参数```的函数的```结果```
+ bind：返回fun的拷贝，并拥有指定的this值和初始参数
  
#### 参数

```thisArg(可选):```

+ fun的this指向thisArg对象
+ 非严格模式下：thisArg指定为null，undefined，fun中的this指向window对象.
+ 严格模式下：fun的this为undefined
+ 值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象，如 String、Number、Boolean

```param1,param2(可选): 传给fun的参数。```

+ 如果param不传或为 null/undefined，则表示不需要传入任何参数.
+ apply第二个参数为数组，数组内的值为传给fun的参数。

```调用call/apply/bind的必须是个函数```

call、apply和bind是挂在```Function对象```上的三个方法,只有函数才有这些方法。

只要是函数就可以，比如: ```Object.prototype.toString```就是个函数，我们经常看到这样的用法：```Object.prototype.toString.call(data)```

#### 核心理念

call/apply/bind的核心理念：```借用方法```，括号里面的对象借用括号外的，借助已实现的方法，改变方法中数据的this指向，减少重复代码，节省内存。

例如： obj1.set.call(obj2, '借用') obj2借用obj1的set方法

#### 区别：

##### 一、call/apply与bind的区别

call/apply改变了函数的this上下文后马上执行该函数，返回fun的执行结果

bind则是返回改变了上下文后的函数,不执行该函数，返回fun的拷贝，并指定了fun的this指向，保存了fun的参数

##### 二、call与apply的唯一区别 --- 传参不同

apply是第2个参数，这个参数是一个数组：传给fun参数都写在数组中，apply是以a开头，它传给fun的参数是Array，也是以a开头的
call从第2~n的参数都是传给fun的。

##### 注意点

调用call/apply/bind的必须是个函数：

call、apply和bind是挂在Function对象上的三个方法,只有函数才有这些方法。

#### 手撸代码：

##### 一、call

思路：

1. 根据call的规则设置上下文对象,也就是this的指向。
2. 通过设置context的属性,将函数的this指向隐式绑定到context上
3. 通过隐式绑定执行函数并传递参数。
4. 删除临时属性，返回函数执行结果
   
```js
  Function.prototype.myCall = function (context, ...args) {
    if (typeof this !== 'function') {
      throw new TypeError('error')
    }

    if (context === null || context === undefined) {
      context = window
    } else {
      // 值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
      context = Object(context)
    }

    // 有跟上下文对象的原属性冲突的风险,考虑兼容的话,还是用尽量特殊的属性
    const mySymbolKey = Symbol('linshi')

    context[mySymbolKey] = this

    const result = context[mySymbolKey](...args)

    delete context[mySymbolKey]

    return result
  }
```
##### 二、apply

思路：

+ 传递给函数的参数处理，不太一样，其他部分跟call一样。
+ apply接受第二个参数为类数组对象, 这里用了JavaScript权威指南中判断是否为类数组对象的方法。

```js
  Function.prototype.myApply = function (context) {
    if (typeof this !== 'function') {
      throw new TypeError('error')
    }

    if (context === null || context === undefined) {
      context = window
    } else {
      context = Object(context)
    }

    function isArguments (o) {
      if (
        o &&
        typeof o === 'object' &&
        isFinite(o) &&
        o.length >= 0 &&
        o.length < 4294967296 &&
        o.length === Math.floor(o.length)
      ) {
        return true
      } else {
        return false
      }
    }

    const mySymbol = Symbol('shahshas')
    context[mySymbol] = this
    
    let result
    let args = arguments[1]
    
    if (args) {
      if (!Array.isArray(args) && !isArguments(args)) {
        throw new TypeError('error')
      } else {
        args = Array.from(args)
        result = context[mySymbol](...args)
      }
    } else {
      result = context[mySymbol]()
    }
    delete context[mySymbol]

    return result
  }
```

##### 三、bind

思路：
  1. 拷贝源函数:
    + 通过变量储存源函数
    + 使用Object.create复制源函数的prototype给fToBind
  2. 返回拷贝的函数
  3. 调用拷贝的函数：
    + new调用判断：通过instanceof判断函数是否通过new调用，来决定绑定的context
    + 绑定this+传递参数
    + 返回源函数的执行结果

```js
  Function.prototype.myBind = function (objThis, ...params) {
    const thisFn = this; // 存储源函数以及上方的params(函数参数)
    // 对返回的函数 secondParams 二次传参
    let fToBind = function (...secondParams) {
        const isNew = this instanceof fToBind // this是否是fToBind的实例 也就是返回的fToBind是否通过new调用
        const context = isNew ? this : Object(objThis) // new调用就绑定到this上,否则就绑定到传入的objThis上
        return thisFn.call(context, ...params, ...secondParams); // 用call调用源函数绑定this的指向并传递参数,返回执行结果
    };
    if (thisFn.prototype) {
        // 复制源函数的prototype给fToBind 一些情况下函数没有prototype，比如箭头函数
        fToBind.prototype = Object.create(thisFn.prototype);
    }
    return fToBind; // 返回拷贝的函数
};
```

[出处：call，apply，bind](https://juejin.im/post/5d469e0851882544b85c32ef)