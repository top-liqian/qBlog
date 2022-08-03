# 指令相关的面试题

## 一、v-show和v-if有什么区别？

v-if是真正的条件渲染，因为他会确保在切换的过程中条件块内的事件监听和自组件适当的被销毁和重建；也是具有惰性的，如果初始的渲染条件为假的情况就什么都不做，直到条件第一次变成真的时候才会开始渲染条件块

v-show：基于css的diaplay属性进行切换，不管初始条件是什么，元素都会渲染

v-if适合很少改变条件，切换条件场景小的情况；v-show则是适用于频繁切换条件和场景

## 二、v-model 的原理？

我们在 vue 项目中主要使用 v-model 指令在表单 input、textarea、select 等元素上创建双向数据绑定，我们知道 v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

1. text 和 textarea 元素使用 value 属性和 input 事件；
   
2. checkbox 和 radio 使用 checked 属性和 change 事件；
   
3. select 字段将 value 作为 prop 并将 change 作为事件。

以input表单为例

```js
<input v-model='something'>
    
相当于

<input v-bind:value="something" v-on:input="something = $event.target.value">
```

## 三、在vue中说说你知道的自定义指令

自定义指令两种：
1. 一种`全局自定义指令`，vue.js对象提供了`directive`方法，可以用来自定义指令，directive方法接收两个参数，一个是`指令名称`，另一个是`函数`；
2. 第二种是`局部自定义指令`，通过组件的`directives`属性定义。

指令定义对象可以提供如下几个钩子函数:
1. bind：只调用一次，指令第一次绑定到元素时调用 bind(el, bindings, vnode, oldVode)
2. inserted：被绑定元素插入父节点时调用 inserted(el)
3. update：所在组件的 VNode 更新时调用,组件更新前状态 update(el)
4. componentUpdated：所在组件的 VNode 更新时调用,组件更新后的状态
5. unbind：只调用一次，指令与元素解绑时调用。

## 四、vue.js中常用的4种指令

+ v-if判断对象是否隐藏；

+ v-for循环渲染；

+ v-bind绑定一个属性（可以简写为：）

+ v-model实现数据双向绑定（支持.trim .number修饰符）
  
其他存在的一些指令

+ v-once 渲染一次（可以用作优化，但是使用的频率很少）
  
+ v-html 将字符串转换成dom插入到标签当中（可能会导致xss攻击问题，并且覆盖子元素）
  
+ v-show不满足是dom隐藏（不可以使用在template标签上面）
  
+ v-on 可以简写成@给元素绑定事件（常用修饰符.stop .prevent .self .once .passive）

## 五、v-for和v-if连用的问题

v-for会比v-if的优先级高一些，如果连用的话会把v-if给每一个元素都添加一下，会造成性能问题（使用计算属性优化）

```js
with(this) { 
  return _l((3), function (i) { return (false) ? _c('div', [_v("hello")]) : _e() }) 
}
```

## 六、v-for当中的key属性的作用是什么？

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。Vue 的 diff 过程可以概括为：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex 和 newStartIndex、newEndIndex，它们会新节点和旧节点会进行两两对比，即一共有4种比较方式：newStartIndex 和oldStartIndex 、newEndIndex 和  oldEndIndex 、newStartIndex 和 oldEndIndex 、newEndIndex 和 oldStartIndex，如果以上 4 种比较都没匹配，如果设置了key，就会用 key 再进行比较，在比较的过程中，遍历会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较。

所以 Vue 中 key 的作用是：key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

+ 更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。
  
+ 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快


## 七、实现一个v-lazy自定义插件

## 八、vue.js中标签如何绑定事件

v-on/@语法糖