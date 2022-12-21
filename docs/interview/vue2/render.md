# vue渲染相关的面试题

## 一、vue渲染流程

1. 初始化数据
2. 将模版进行编译生成ast
3. 将ast转换成render函数
4. 执行render函数创建虚拟dom
5. 生成真实的dom
6. 渲染在页面上

## 二、vue为什么采用异步渲染？

vue的数据更新是采用组件级别的更新策略，如果同一个组件内部的数据多个变化，如果不采用异步更新的策略，那么每次更新数据，视图都会跟着一起更新，消耗性能，vue会讲同一个组件的watcher的更新过滤在一起，在合适的时机一起更新

主要操作是：dep.notify()通知watcher进行数据更新，然后依次调用watcher的update方法，

通过queueWatcher方法将多个属性依赖的相同的watcher整合成一个（每一个watcher都有一个id，相同id的整合在一起，主要是预防多次更新）

最后通过nextTick方法异步清空watcher队列

vue会在数据更新了之后，再去异步更新视图，提高了性能。

## 三、template预编译是什么？

对于 Vue 组件来说，模板编译只会在组件实例化的时候编译一次，生成渲染函数之后在也不会进行编译。因此，编译对组件的 runtime 是一种性能损耗。而模板编译的目的仅仅是将template转化为render function，这个过程，正好可以在项目构建的过程中完成，这样可以让实际组件在 runtime 时直接跳过模板渲染，进而提升性能，这个在项目构建的编译template的过程，就是预编译。

## 4. vue 是怎么解析template的? template会变成什么?


## 5. 如何解析指令? 模板变量? html标签

vue2当中定义了大量的正则匹配规则，

## 6. 用过vue 的render吗? render和template有什么关系？