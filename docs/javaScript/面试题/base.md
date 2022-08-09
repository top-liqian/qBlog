# javascript基础面试题

## 一、js的数据类型有那些？

number、string、boolean、undefined、null、object

symbol(ES6新增的)、BigInt(ES2020)

object类型包括了： Array、Function、Date、RegExp

## 二、JS的整数是怎么表示的？

通过Number类型来表示的，遵循IEEE754标准，通过64位来表示一个数字，1（符号位） + 11（指数位） + 52（小数部分有效位） = 64

最大的安全数字是 Math.pow(2, 53) - 1，相对于16进制

## 三、Number的存储空间是多大？如果后台发了一个超过最大自己的数字怎么办？

Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

## 