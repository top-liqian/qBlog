## 1. 介绍一下vue的响应式系统

vue内部借鉴了mvvm框架的思想，当数据模型data变化时，页面视图会得到响应更新，其原理对data的getter/setter方法进行拦截（Object.defineProperty/proxy），利用发布订阅者模式，在getter方法中进行订阅，在setter方法中发布通知，让所有订阅者完成响应。vue会为数据模型data的每一个属性都新建一个订阅中心作为发布者，对于监听器watcher，计算属性computed、视图渲染template/render三个角色作为订阅者，对于监听器watcher，会直接订阅观察监听的属性，对于计算属性computed和视图渲染template/render，如果内部执行获取了data的某一个属性值，就会执行这个属性的getter方法，然后自动完成对该属性的订阅，当属性被修改的税后，就会执行这个属性的setter方法，从而完成这个属性的发布通知，通知所有的订阅者进行更新

源码对应；在initData函数当中初始化用户传入的数据，内部通过new Observer来对属性进行观测，调用walk方法对对象进行处理，本质是调用了 defineReactive 来循环对象属性定义响应式变化


## 5、vue事件绑定原理

每一个vue实例都是一个`event bus`，当子组件被创建的时候，父组件将事件传递给子组件，子组件初始化的时候会有一个`$on`方法将事件注册到内部，在需要的时候使用`$emit`触发函数，而对于原生`native`事件，使用`addEventListener`绑定在真实的`dom`元素上面

## 6. slot是什么？有什么作用？原理是什么？

slot又名插槽，是vue的内容分发机制，组件内部的模版引擎使用slot元素作为承载分发内容的出口。插槽作为子组件的一个模版元素标签，而这一个标签时候显示，以及怎么显示是由父组件进行决定的。slot又分为三类，默认插槽，具名插槽以及作用域插槽

+ 默认插槽：当slot没有指定name属性值得时候一个默认显示插槽，一个组件只有一个匿名插槽
+ 具名插槽：带有具体名字的插槽，也就是一个带有name属性值的slot，一个组件可以出现多个具名插槽
+ 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染插槽

实现原理：当子组件cm实例化之后，获取到父组件传入的slot标签的内容，存档在vm.$slot当中，默认插槽是vm.$slot.default，具名插槽为vm.$slot.xxx，xxx是插槽名称，当组件执行渲染函数时，遇到slot标签，使用$slot中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可以称该插槽为作用域插槽

## 11. 介绍一下vue的diff算法？

在新老虚拟dom对比时

+ 首先，对比节点本身，判断是否为同一节点，如果不为同一节点，则删除该节点重新创建节点进行替换
+ 如果为相同节点，进行patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
+ 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
+ 匹配时，找到相同的子节点，递归比较子节点

在diff中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n^3)降低值O(n)，也就是说，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。


## 19. 在vue.js中如何实现路由嵌套

路由嵌套会将其他组件渲染到该组件内，而不是使整个页面跳转到router-view定义组件渲染的位置，要进行页面跳转，要将页面渲染到根组件内。首先实例化根组件，在根组件中定义组件渲染容器，然后，挂载路由，当切换路由时，将会切换整个页面。

## 20. 什么情况下会产生片段实例?

## 库 & 框架

+ 库是将代码集合成一个产品,库是我们调用库中的方法实现自己的功能，比如 react
+ 框架则是为解决一类问题而开发的产品,框架是我们在指定的位置编写好代码，框架帮我们调用，比如渐进式框架vue

## MVC 和 MVVM 区别

+ 传统的 MVC 指的是：用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染
+ MVVM: 传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁.

> Vue并没有完全遵循MVVM模型，只是借鉴了MVVM的思想，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信，而vue可以直接不通过ViewModel来操作视图