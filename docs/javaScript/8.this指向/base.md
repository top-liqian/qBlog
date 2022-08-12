### this的那点事儿

#### this的四种绑定规则 - 默认，隐式，显示，new，箭头函数


1. **默认绑定： 在非严格模式下，this指向全局对象`window`， 在严格模式下，this指向`undefined`**

  所以：对于默认绑定来说，`决定this绑定对象的是函数体是否处于严格模式`，严格指向undefined，非严格指向全局对象。

  + 开启了严格模式，只是说使得函数内的this指向undefined，它并不会改变全局中this的指向。

  + 另外，它也不会阻止全局变量被绑定到window对象上。

2. **隐式绑定：函数在调用位置，是否具有上下文对象，如果有，this就会隐式的绑定在这个对象上**

   ` 注意： `

    1. this指向`最后一层`调用函数的对象即就近原则 `obj1.obj2.foo() => 此时this指向obj2`

    2. 隐式绑定丢失：实际上就是在函数调用的过程中并`没有上下文对象`，只是对函数的引用，就会造成隐式绑定丢失，此时`this指向全局对象`
   
      有两种情况容易发生隐式丢失问题：

      + 使用另一个变量来给函数取别名
      + 将函数作为参数传递时会被隐式赋值，回调函数丢失this绑定

    3. `回调函数`的隐式绑定丢失 `test(obj2.foo)`

```js
  function foo() {
      console.log(this.a);
    }
    var a = "Oops, global";
    let obj2 = {
      a: 2,
      foo: foo
    };
    let obj1 = {
      a: 22,
      obj2: obj2
    };
    obj2.foo(); // 2 this指向调用函数的对象
    obj1.obj2.foo(); // 2 this指向最后一层调用函数的对象
    
    // 隐式绑定丢失
    let bar = obj2.foo; // bar只是一个函数别名 是obj2.foo的一个引用
    bar(); // "Oops, global" - 指向全局

```

3. **显示绑定： 在某个对象上面强制绑定this ，使用call,apply, bind方法**

   `注意`

   1. 传入的不是对象：传入原始值（string,number,boolean） 将传入的原始值转换成为对象

   2. 传入null， undefined，call，apply，call将会将其忽略，this绑定方式采用默认的方式

4. **new绑定: 使用函数调用的过程中，this会自动绑定在new期间创建的对象上**

    `在js中，实际上并不存在所谓的'构造函数'，只有对于函数的'构造调用'`

    **new操作符做了什么**

    1. 创建了一个全新的对象

    2. 对这个对象执行[[ prototype ]]连接

    3. **这个新对象会绑定到函数调用的this**

    4. 如果函数没有返回其他的东西，那么new表达式中的函数调用会自动返回这个新对象
```js
    function foo(a) {
    this.a = a; // this绑定到bar上
    }
    let bar = new foo(2);
    console.log(bar.a); // 2
```

#### **this四种绑定规则的优先级**

显示 > 隐式 > 默认

new > 隐式 > 默认

new 与 显示 不能相比较，报错


#### **箭头函数的this指向不会使用上述的四条规则**

1. 箭头函数继承于上层第一个不是箭头函数的this的指向

2. 箭头函数一旦绑定的了上下文你就不会改变

```js
    function foo() {
      return () => {
      console.log(this.a);
      };
    }
    let obj1 = {
      a: 2
    };
    let obj2 = {
      a: 22
    };
    let bar = foo.call(obj1); // foo this指向obj1
    bar.call(obj2); // 输出2 这里执行箭头函数 并试图绑定this指向到obj2
```
#### **this相关的面试题**

1. 题目一
   
  ```js
    var a = 10;
    function foo () {
      console.log(this.a)
    }
    foo();
  ```
  答案： ```10  this -> window```

2. 题目二
   
  ```js
    "use strict";
    var a = 10;
    function foo () {
      console.log('this1', this)
      console.log(window.a)
      console.log(this.a)
    }
    console.log(window.foo)
    console.log('this2', this)
    foo();
  ```
  答案： ``` f foo(){ ... } window{ ... } undifend 10 报错 Uncaught TypeError: Cannot read property 'a' of undefined```

3. 题目三
   
  ```js
    let a = 10
    const b = 20

    function foo () {
      console.log(this.a)
      console.log(this.b)
    }
    foo();
    console.log(window.a)
  ```
  答案： ```undefined undefined undefined```

4. 题目四
   
  ```js
    var a = 1
    function foo () {
      var a = 2
      console.log(this)
      console.log(this.a)
    }

    foo()
  ```
  答案： ```window， 1```

5. **题目五**
   
  ```js
    var a = 1
    function foo () {
      var a = 2
      function inner () { 
        console.log(this.a) // 即使在inner里面，但是this还是指向的window
      }
      inner()
    }
    foo()
  ```
  答案： ``` 1 ```

6. **题目六**
   
  ```js
    function foo () {
      console.log(this.a)
    }
    var obj = { a: 1, foo }
    var a = 2
    obj.foo()
  ```
  答案： ``` 1 ```

7. **题目7**
   
  ```js
    function foo () {
      console.log(this.a)
    };
    var obj = { a: 1, foo };
    var a = 2;
    var foo2 = obj.foo;

    obj.foo();
    foo2();
  ```
  答案： ``` 1 2```

8. **题目8**
   
  ```js
    function foo () {
      console.log(this.a)
    };
    var obj = { a: 1, foo };
    var a = 2;
    var foo2 = obj.foo;
    var obj2 = { a: 3, foo2: obj.foo }

    obj.foo();
    foo2();
    obj2.foo2();

  ```
  答案： ``` 1 2 3```

9. **题目9**
   
  ```js
    function foo () {
      console.log(this.a)
    }
    function doFoo (fn) {
      console.log(this)
      fn()
    }
    var obj = { a: 1, foo }
    var a = 2
    doFoo(obj.foo)

  ```
  答案： ```window{} 2```

9. **题目9**
   
  ```js
    function foo () {
      console.log(this.a)
    }
    function doFoo (fn) {
      console.log(this)
      fn()
    }
    var obj = { a: 1, foo }
    var a = 2
    var obj2 = { a: 3, doFoo }

    obj2.doFoo(obj.foo)

  ```
  答案： ```obj2 3```  回答错误，正确结果为``` { a:3, doFoo: f } 2 ```
  ```原因：如果你把一个函数当成参数传递到另一个函数的时候，也会发生隐式丢失的问题，且与包裹着它的函数的this指向无关。在非严格模式下，会把该函数的this绑定到window上，严格模式下绑定到undefined。```

10. **题目10**
  ```js
    function foo () {
      console.log(this.a)
    }
    var obj = { a: 1 }
    var a = 2

    foo()
    foo.call(obj)
    foo.apply(obj)
    foo.bind(obj)
  ```
  答案： ```2 1 1```

11. **题目11**
  ```js
      var obj1 = {
        a: 1
      }
      var obj2 = {
        a: 2,
        foo1: function () {
          console.log(this.a)
        },
        foo2: function () {
          setTimeout(function () {
            console.log(this)
            console.log(this.a)
          }, 0)
        }
      }
      var a = 3

      obj2.foo1()
      obj2.foo2()
  ```
  答案： ```2 window{} 3```

12. **题目12**
  ```js
    var obj1 = {
      a: 1
    }
    var obj2 = {
      a: 2,
      foo1: function () {
        console.log(this.a)
      },
      foo2: function () {
        setTimeout(function () {
          console.log(this)
          console.log(this.a)
        }.call(obj1), 0)
      }
    }
    var a = 3
    obj2.foo1()
    obj2.foo2()
  ```
  答案： ```2 { a: 1 } 1```

13. **题目13**
  ```js
    var obj1 = {
      a: 1
    }
    var obj2 = {
      a: 2,
      foo1: function () {
        console.log(this.a)
      },
      foo2: function () {
        function inner () {
          console.log(this)
          console.log(this.a)
        }
        inner()
      }
    }
    var a = 3
    obj2.foo1()
    obj2.foo2()
  ```
  答案： ```2 ```

出处：
[js中关于this绑定机制的解析](https://juejin.im/post/5b3715def265da59af40a630#comment)