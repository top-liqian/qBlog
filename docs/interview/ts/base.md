# typescript相关的面试题

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
