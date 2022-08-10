# 变量相关的面试题

## 一、js的数据类型有那些？

number、string、boolean、undefined、null、object

symbol(ES6新增的)、BigInt(ES2020)

object类型包括了： Array、Function、Date、RegExp

## 二、JS的整数是怎么表示的？

通过Number类型来表示的，遵循IEEE754标准，通过64位来表示一个数字，1（符号位） + 11（指数位） + 52（小数部分有效位） = 64

最大的安全数字是 Math.pow(2, 53) - 1，相对于16进制

## 三、Number的存储空间是多大？如果后台发了一个超过最大自己的数字怎么办？

Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

## 四、symbol 有什么用处

可以用来表示一个独一无二的变量防止命名冲突。但是面试官问还有吗？我没想出其他的用处就直接答我不知道了，还可以利用 symbol 不会被常规的方法（除了 Object.getOwnPropertySymbols 外）遍历到，所以可以用来模拟私有变量。
主要用来提供遍历接口，布置了 symbol.iterator 的对象才可以使用 for···of 循环，可以统一处理数据结构。调用之后回返回一个遍历器对象，包含有一个 next 方法，使用 next 方法后有两个返回值 value 和 done 分别表示函数当前执行位置的值和是否遍历完毕。
Symbol.for() 可以在全局访问 symbol


