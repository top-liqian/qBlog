# 手写一个简单版本的vue3遇见的问题

1. proxy为什么要搭配 Reflect 一起使用？
   

2. 解决 reactive(obj) !== reactive(obj)的问题

使用缓存策略

3. 防止一个对象被重复代理


## effect函数

1. 为了解决effect内部嵌套effect的情况，最一开始的时候提供调用栈的概念，现在采用树概念的父节点

```js
effect(() => { // e1
    console.log(state.name) // state => e1
    effect(() => { // e2
        console.log(state.age) // state => e2
    })
    console.log(state.address) // 此时state.address找不到指向 state = ?
})
```

2. 在effect内部调用Math.random函数，就会反复触发effect，导致内存爆栈
   
   解决办法：通过判断两次effect是否一致来解决

```js
effect(() => {
    state.age = Math.random()
    console.log(state.age)
})

setTimeout(() => {
    state.age++
})
```

3. effect函数返回runner的目的

是为了让用户可以自己控制渲染逻辑

```js
const runner = effect(() => {
    console.log(state.age)
})

runner.effect.stop()

setTimeout(() => {
    state.age++
    runner()
})
```

4. 多次更改属性的行为在vue3中如何进行批处理？

采用新开微任务队列的方式


5. computed的原理

computed接受两个参数， getter & setter

计算属性本身就是一个effect，具有两个参数，一个是用户的方法，一个会把用户的方法存进去但是不会执行，用户一旦取值啦就会命中get方法， 

6. watch的原理

7. 怎么区分是来自于template当中的取值，还是js当中的取值

具有标识位 -> **__v_isRef**

8. computed和watch的区别

+ computed和watch都是基于effect
+ computed中具备缓存的dirty，依赖的值变化了会执行effect，此时更改dirty属性，计算属性还会收集依赖，watch就是数据变化了触发内部的scheduler
+ computed也是ref，也可以用在模版上，但是watch不能用在模版上，只能在业务逻辑中使用 onCleanup