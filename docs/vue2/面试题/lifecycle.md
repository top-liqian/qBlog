# 生命周期相关的面试题

## 一、谈谈你对 Vue 生命周期的理解？

+ 1. 生命周期是什么？

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程

+ 2. 各个生命周期的作用

1. beforeCreate：组件实例被创建之初，组件的属性生效之前，在这个阶段只有默认的生命周期函数以及默认的事件，在当前阶段data，methods、computed以及watch上的数据和方法都不能被访问
2. created：组件实例已经完全创建，属性也绑定，但真实 **dom** 还没有生成，**\$el** 还不可用，当前阶段已经完成了数据监测，data和methods都已经初始化好了，也就是可以使用数据、更改数据，但是在这里修改的数据不会触发updated函数。可以做一些初始数据的获取，在当前阶段无法与DOM进行交互，如果非要想，可以通过vm.$nextTick来访问DOM
3. beforeMount：在挂载开始之前被调用，相关的 **render** 函数首次被调用，在这之前template模版已经导入渲染函数编译；而当前**虚拟dom**已经创建完成，即将开始渲染。在此时如果你想要修改**DOM**不会触发**updated**
4. mounted：在挂载完成之后发生，**el**被新创建的 **vm.\$el** 替换，并挂载到实例上去之后调用该钩子，在当前阶段，真实的dom挂载完毕，数据完成双向绑定，可以访问到真实的dom节点，使用 **$refs** 属性对dom进行操作
5. beforeUpdate：在更新之前，发生在 **虚拟DOM** 打补丁之前，也就是响应式数据更新，虚拟dom重新渲染之前被触发，可以在当前阶段**更改数据**，不会造成重新渲染
6. updated：发生在更新完成之后，当前阶段组件dom已经更新完成
7. beforeDestory：发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这个时候进行收尾工作，如果清除定时器
8. destroyed：发生在实例销毁之后，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁

如果使用组件的 **keep-alive** 功能时，增加两个周期：

+ activated在keep-alive组件激活时调用；

+ deactivated在keep-alive组件停用时调用。

`<keep-alive>`包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。`<keep-alive>`是一个抽象组件，它自身不会渲染一个DOM元素，也不会出现在父组件链中。

+ 3. 生命周期示意图

![生命周期示意图](./assets/lifeCycle.png)

## 二、Vue 的父组件和子组件生命周期钩子函数执行顺序？

Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：

1. 加载渲染过程
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted


2. 子组件更新过程
   
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated


3. 父组件更新过程
   
父 beforeUpdate -> 父 updated


4. 销毁过程
   
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

## 三、在哪个生命周期内调用异步请求？

可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面 loading 时间；
ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## 四、在什么阶段才能访问操作DOM？

在钩子函数 mounted 被调用前，Vue 已经将编译好的模板挂载到页面上，所以在 mounted 中可以访问操作 DOM。

## 五、父组件可以监听到子组件的生命周期吗？

可以分为两种方式

1. 子组件在**mounted**函数当中通过 **this.$emit('mounted')**触发父组件的事件, 父组件监听到子组件挂载 **mounted** 就绑定处理事件 **@mounted="something"**

2. 在父组件引用子组件时通过 @hook 来监听 **@hook:mounted="doSomething"**, 其它的生命周期事件也可以通过hook的方式

## 六、生命周期钩子是如何实现的?

Vue的生命周期钩子就是回调函数而已，当创建组件实例的过程中会调用对应的钩子方法

内部主要是使用callHook方法来调用对应的方法。核心是一个发布订阅模式，将钩子订阅好（内部采用数组的方式存储），在对应的阶段进行发布！

快速Mock:

```js
function mergeHook(parentVal, childValue) {
    if (childValue) {
        if (parentVal) {
            return parentVal.concat(childValue);
        } else {
            return [childValue]
        }
    } else {
        return parentVal;
    }
}
function mergeOptions(parent, child) {
    let opts = {};
    for (let key in child) {
        opts[key] = mergeHook(parent[key], child[key]);
    }
    return opts;
}
function callHook(vm, key) {
    vm.options[key].forEach(hook => hook());
}
function Vue(options) {
    this.options = mergeOptions(this.constructor.options, options);

    callHook(this, 'beforeCreate');
}
Vue.options = {}
new Vue({
    beforeCreate() {
        console.log('before create')
    }
})
```

## 七、在初始化状态的时候vue实例上面的方法按照什么样的顺序加载

props -> methods -> data -> computed -> watch

## 八、vue模版当中的优先级？

render > template > el