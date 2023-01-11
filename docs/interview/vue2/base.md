## 库 & 框架

+ 库是将代码集合成一个产品,库是我们调用库中的方法实现自己的功能，比如 react
+ 框架则是为解决一类问题而开发的产品,框架是我们在指定的位置编写好代码，框架帮我们调用，比如渐进式框架vue

## MVC 和 MVVM 区别

+ 传统的 MVC 指的是：用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染
+ MVVM: 传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁.

> Vue并没有完全遵循MVVM模型，只是借鉴了MVVM的思想，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信，而vue可以直接不通过ViewModel来操作视图

## Vue 单页应用与多页应用的区别

+ SPA单页面应用（SinglePage Web Application），指只有一个主页面的应用，一开始只需要加载一次js、css等相关资源。所有内容都包含在主页面，对每一个功能模块组件化。单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
+ MPA多页面应用 （MultiPage Application），指有多个独立页面的应用，每个页面必须重复加载js、css等相关资源。多页应用跳转，需要整页资源刷新。

![](./assets/base-1.png)

## 介绍一下vue的响应式系统

vue内部借鉴了mvvm框架的思想，当数据模型data变化时，页面视图会得到响应更新，其原理对data的getter/setter方法进行拦截（Object.defineProperty/proxy），利用发布订阅者模式，在getter方法中进行订阅，在setter方法中发布通知，让所有订阅者完成响应。vue会为数据模型data的每一个属性都新建一个订阅中心作为发布者，对于监听器watcher，计算属性computed、视图渲染template/render三个角色作为订阅者，对于监听器watcher，会直接订阅观察监听的属性，对于计算属性computed和视图渲染template/render，如果内部执行获取了data的某一个属性值，就会执行这个属性的getter方法，然后自动完成对该属性的订阅，当属性被修改的税后，就会执行这个属性的setter方法，从而完成这个属性的发布通知，通知所有的订阅者进行更新

源码对应；在initData函数当中初始化用户传入的数据，内部通过new Observer来对属性进行观测，调用walk方法对对象进行处理，本质是调用了 defineReactive 来循环对象属性定义响应式变化

