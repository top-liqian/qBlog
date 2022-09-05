# proxy

## proxy的介绍

proxy用于修改某些操作的默认行为，也可以理解为在目标对象之前架设一层拦截，外部所有的访问都必须经过这层拦截，因此提供了一种机制，可以对外部的访问进行过滤与修改。

### proxy语法

const proxy = new Proxy(target, handler)

### proxy参数

+ target：要拦截的目标对象
+ handler：用来定制拦截操作的对象

### proxy的具体handler api介绍

#### 一、handler.get ---

<details>
<summary>展开</summary>

语法: handler.get: (target, prop, receiver) => {}

参数:

+ target：目标对象
+ prop： 对象的属性
+ receiver：代理或代理的对象

作用：

+ 属性拦截
+ 继承属性的拦截

`不变式：如果目标对象是不可写的，不可配置的自身属性，则为属性报告的值必须与相应目标对象属性的值相同`

例子：

```js
  var proxy = new Proxy({}, {
    get: (obj, prop, receiver) => {
      console.log('obj + prop: ', obj, prop)
      return 10
    },
  })
  proxy[a]

  var obj = {}
  
  Object.defineProperty(obj, 'a', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: 24,
  })

  var proxy1 = new Proxy(obj, {
    get: (obj, prop) => {
      return 24 // 不报错
      /* return 10 // 报错 */
    }
  })
  
  proxy1.a
  proxy1.b
```

</details>

**<summary>**

#### 二、handler.set --- 设置属性值陷阱

<details>
<summary>展开</summary>

语法： handler.set: (target, prop, value, receiver) => {}

参数:

+ target：目标对象
+ prop： 对象的属性
+ value: 要设置的属性的新值
+ receiver：代理或代理的对象

返回值：

返回一个Boolean类型的值，true代表设置成功

例子：

```js
  var proxy = new Proxy({}, {
    get: (obj, prop, receiver) => {
      console.log('obj + prop: ', obj, prop)
      return obj[prop]
    },
    set: (obj, prop, value, receiver) => {
      obj[prop] = value * 2
      return true
    }
  })
  
  proxy.a = 10

  console.log('proxy.a: ', proxy.a)
```

</details>

**<summary>**

#### 三、handler.has --- in操作员的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { has: (target, prop) => {} })

参数：

+ target：目标对象
+ prop： 属性值

返回值： 返回一个Boolean类型值

作用：

+ 属性拦截
+ 继承属性拦截

</details>

**<summary>**

#### 四、handler.apply --- 函数调用的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { apply: (target, thisArg, argumentsList) => {} })

参数：

+ target：目标对象
+ thisArg：this调用的参数
+ argumentsList： 调用的参数列表

作用：

+ proxy(...args)
+ Function.prototype.apply() 和 Function.prototype.call()

例子

```js
  var proxy = new Proxy(function () {}, {
    apply: (target, thisArg, argumentsLists) => {
      return argumentsLists[0] + argumentsLists[1]
    }
  })

  proxy(1,2,3)
```

</details>

**<summary>**

#### 五、handler.construct --- new运算符的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { construct: (target, argumentsList, newTarget) => {} })

参数：

+ target: 目标对象的构造函数
+ argumentsList：参数列表
+ newTarget：最初被称为p上面的构造函数, Proxy

返回值：返回一个对象

例子：

```js
  var proxy = new Proxy(function () {}, {
    construct: (target, argumentList, newTarget) => {
      console.log('target, newTarget',target, newTarget)
      return { value: argumentList[0] * 10 }
    }
  })

  console.log(new proxy(1).value)
```

</details>

**<summary>**

#### 六、handler.ownkeys --- Reflect.ownKeys()的陷阱

<details>
<summary>展开</summary>

语法：const proxy = new Proxy({}, { ownkeys: function (target) {} })

参数：目标对象

返回值：返回一个可枚举对象

用途拦截：

+ Object.getOwnPropertyNames()
+ Object.getOwnPropertySymbols()
+ Object.keys()
+ Reflect.ownKeys()

例子

```js
  var obj = {
    name: 'liqian',
    age: 18,
    sex: 'male',
  }
  var proxy = new Proxy(obj, {
    ownKeys: (target) => {
      console.log('target', target)
      return {name: 1}// ['a', 'b', 'c']
    }
  })

  console.log(Object.getOwnPropertyNames(proxy))
```

</details>

**<summary>**

#### 七、handler.deleteProperty --- delete的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { deleteProperty: (target, property) => {} })

参数：

+ target：目标对象
+ property：待删除的属性

返回值： 返回一个Boolean类型的标识符

```js
  var obj = {
    name: 'liqian',
    age: 18
  }

  var proxy = new Proxy(obj, {
    deleteProperty: (target, property) => {
      if (property in target) {
        console.log('这里有这个属性，已经删除了！')
        delete target[property]
        return true
      } else {
        console.log('这里没有这个属性')
        return false
      }
    }
  })

  delete proxy.age
  delete proxy.sex
```

</details>

**<summary>**

#### 八、handler.defineProperty --- Object.defineProperty()的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { defineProperty: (target, property, descriptor) => {} })

参数：

+ target： 目标对象
+ property： 定义的属性
+ descriptor：定义或修改的属性的描述符

返回值：

返回一个Boolean指示是否已成功定义该属性

用途：

+ Object.defineProperty()
+ Reflect.defineProperty()

例子：

```js
  var obj = {}
  var proxy = new Proxy(obj, {
    defineProperty: (target, property, desrciptor) => {
      console.log('called: ', property)
      return true
    }
  })
  Object.defineProperty(proxy, 'a', { configurable: true, writable: true, value: 20 })
```

</details>

**<summary>**

#### 九、handler.isExtensible --- Object.isExtensible()的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { isExtensible: (target) => {} })

参数：

+ target：目标对象

返回值：

Boolean值

作用：

+ Object.isExtensible()
+ Reflect.isExtensible()

例子：

```js
  const proxy = new Proxy({}, {
    isExtensible: (target) => {
      return true
    }
  })

  Object.isExtensible(proxy)
```

</details>

**<summary>**

#### 十、handler.preventExtensions --- Object.preventExtensions()的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { preventExtensions: (target) => {} })

参数：

+ target：目标对象

返回值：

Boolean值

作用：

+ Object.preventExtensions()
+ Reflect.preventExtensions()

例子：

```js
  const proxy = new Proxy({}, {
    preventExtensions: (target) => {
      Object.preventExtensions(target)
      return true
    }
  })

  Object.preventExtensions(proxy)
```

</details>

**<summary>**

#### 十一、handler.getPrototypeOf --- Object.getPrototypeOf()的陷阱

<details>
<summary>展开</summary>

语法： const proxy = new Proxy({}, { getPrototypeOf: (target) => {} })

参数：

+ target：目标对象

返回值：

对象或者是null

作用：

+ Object.getPrototypeOf()
+ Reflect.getPrototypeOf()
+ __proto__
+ Object.prototype.isPrototypeOf()
+ instanceof

例子：

```js
  const obj = {};
  const proto = {};
  const handler = {
    getPrototypeOf(target) {
      console.log(target === obj);   // true
      console.log(this === handler); // true
      return proto;
    }
  };

  const p = new Proxy(obj, handler);
  console.log(Object.getPrototypeOf(p) === proto);
```

</details>

**<summary>**

#### 十二、handler.setPrototypeOf --- Object.setPrototypeOf()的陷阱

#### 十三、handler.getOwnPropertyDescriptor --- Object.getOwnPropertyDescriptor()