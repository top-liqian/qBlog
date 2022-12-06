# 深入浅出防抖函数 debounce

## 定义及解读

防抖函数 debounce 指的是某个函数在某段时间内，无论触发了多少次回调，都只执行最后一次。假如我们设置了一个等待时间 3 秒的函数，在这 3 秒内如果遇到函数调用请求就重新计时 3 秒，直至新的 3 秒内没有函数调用请求，此时执行函数，不然就以此类推重新计时。

## 原理及实现

实现原理就是利用定时器，函数第一次执行时设定一个定时器，之后调用时发现已经设定过定时器就清空之前的定时器，并重新设定一个新的定时器，如果存在没有被清空的定时器，当定时器计时结束后触发函数执行。

### 实现 1

```js
function debounce(fn, wait = 50) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () {
        fn.apply(this, args)
    }, wait)
  }
}

const betterFn = debounce(() => { console.log('防抖') }, 5000)

document.addEventListener('scroll', betterFn)
```

### 实现 2

这时候我们来改写下 debounce 函数，加上第一次触发立即执行的功能

```js
function debounce(fn, wait = 50, immediate) {
    let timer = null
    return function(...args) {
        if (timer) clearTimeout(timer)
        if (immediate && !timer) {
            fn.apply(this, args)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }
}
const betterFn = debounce(() => { console.log('防抖') }, 1000, true)

const btn = document.getElementById('btn')

btn.addEventListener('click', betterFn)
```