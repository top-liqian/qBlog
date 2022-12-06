# 深入浅出节流函数 throttle

## 定义

函数节流指的是某个函数在`一定时间间隔内`（例如 3 秒）只执行一次，在这` 3 `秒内 无视后来产生的函数调用请求，也不会延长时间间隔。`3 `秒间隔结束后第一次遇到新的函数调用会触发执行，然后在这新的` 3 `秒内依旧无视后来产生的函数调用请求，以此类推。

## 原理及实现

函数节流非常适用于函数被频繁调用的场景，例如：`window.onresize()` 事件、`mousemove` 事件、`上传进度`等情况。使用` throttle API `很简单，那应该如何实现 throttle 这个函数呢？

1. 第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差（Xms） ，如果是则执行，并更新上次执行的时间戳，如此循环。

2. 第二种方法是使用定时器，比如当 scroll 事件刚触发时，打印一个 hello world，然后设置个 1000ms 的定时器，此后每次触发 scroll 事件触发回调，如果已经存在定时器，则回调不执行方法，直到定时器触发，handler 被清除，然后重新设置定时器。

```js
// 第一种实现方式，利用闭包保存着上次执行时间，每次触发 throttle 函数时判断当前时间和 previous 的时间差，如果这段时间差小于等待时间，那就忽略本次事件触发。如果大于等待时间就把 previous 设置为当前时间并执行函数 fn。
function throttle (fun, wait = 50) {
  let previous = 0
  return function (...args) {
    let currentTime = +new Date() 
      if (currentTime - previous > wait) {
        previous = currentTime
        fun.apply(this, args)
      }
  }
}

const betterFn = throttle(() => {
  console.log('fn 函数执行了')
}, 5000)

setInterval(betterFn, 10)
```

## 加强版throttle

现在考虑一种情况，如果用户的操作非常频繁，不等设置的延迟时间结束就进行下次操作，会频繁的清除计时器并重新生成，所以函数 fn 一直都没办法执行，导致用户操作迟迟得不到响应。

有一种思想是将「节流」和「防抖」合二为一，变成加强版的节流函数，关键点在于「 wait 时间内，可以重新生成定时器，但只要 wait 的时间到了，必须给用户一个响应」。这种合体思路恰好可以解决上面提出的问题。

```js
function throttlePlus(fn, wait = 50) {
  // previous 是上一次执行 fn 的时间
  // timer 是定时器
  let previous = 0, timer = null
  
  // 将 throttle 处理结果当作函数返回
  return function (...args) {
    
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = +new Date()
    // debugger
    // ------ 新增部分 start ------ 
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if (now - previous < wait) {
    	 // 如果小于，则为本次触发操作设立一个新的定时器
       // 定时器时间结束后执行函数 fn 
       if (timer) clearTimeout(timer)
       timer = setTimeout(() => {
          previous = now
        	fn.apply(this, args)
        }, wait)
    // ------ 新增部分 end ------ 
      
    } else {
       // 第一次执行
       // 或者时间间隔超出了设定的时间间隔，执行函数 fn
       previous = now
       fn.apply(this, args)
    }
  }
}

const betterFn = throttlePlus(() => { console.log('防抖') }, 5000)

const btn = document.getElementById('btn')

btn.addEventListener('click', betterFn)
```