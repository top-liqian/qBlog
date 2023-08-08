# typescript相关的面试题

## 1. 什么是typescript

是强类型的javascript的超集，支持es6语法，支持面向对象编程的概念，不能直接在浏览器上进行运行，需要编译器编译成纯javascript进行运行

## 2. 为啥要使用ts？

增加了静态类型，可以让开发人员编写脚本的时候检测错误，使得代码质量更好，可以避免一些低级的代码问题

## 3. ts比js的好处？

避免手写的变量名写错，类型一定程度上相当于接口文档，IDE可以自动填充比较有利于开发

## 4. const和readonly的区别

const 和 readonly: const可以防止变量的值被修改，readonly可以防止变量的属性被修改。

## 5. 枚举和常量枚举的区别？

常量枚举只能使用常量枚举表达式，并且不同于常规的枚举，它们在编译阶段会被删除。 

常量枚举成员在使用的地方会被内联进来。 之所以可以这么做是因为，常量枚举不允许包含计算成员。

## 6. 接口和类型别名的区别？

接口和类型别名两者都可以用来描述对象或函数的类型。与接口不同，类型别名还可以用于其他类型，如基本类型（原始值）、联合类型、元组。

## 7. ts当中的any

任意内容，主要是不希望类型检查器对这些值进行检查可以直接通过编译

## 8. 

## 1. typescript 实现一个字符串类型去左侧空格

```js
type A = "   Hello world!   ";
type B = LeftTrim<A>; //  'Hello world!   '
```

## typescript is这个关键字是做什么呢?

## 3. typescript 相比 JavaScript 的优点是什么

## 4. Typescript 类型了解过吗，infer 是做什么的，实现一个 Pick 和一个 Omit
## typescript is这个关键字是做什么呢?

## ts中undefined和void类型的区别

1. 如果一个函数返回undefined，是可以赋值给void的

```js
function a():void {
    return undefined
}
```
