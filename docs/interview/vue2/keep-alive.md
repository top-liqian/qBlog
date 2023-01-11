# keep-alive相关的面试题

## vue 的keep-alive的作用是什么？（谈谈你对keep-alive的理解）
如果需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

keep-alive有以下三个属性：

+ include 字符串或正则表达式，只有名称匹配的组件会被匹配；
+ exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存；
+ max 数字，最多可以缓存多少组件实例。

注意：keep-alive 包裹动态组件时，会缓存不活动的组件实例。

## keep-alive的流程

主要流程

+ 判断组件 name ，不在 include 或者在 exclude 中，直接返回 vnode，说明该组件不被缓存。
+ 获取组件实例 key ，如果有获取实例的 key，否则重新生成。
+ key生成规则，cid +"∶∶"+ tag ，仅靠cid是不够的，因为相同的构造函数可以注册为不同的本地组件。
+ 如果缓存对象内存在，则直接从缓存对象中获取组件实例给 vnode ，不存在则添加到缓存对象中。 
+ 最大缓存数量，当缓存组件数量超过 max 值时，清除 keys 数组内第一个组件。
  
## keep-alive的实现原理

keep-alive 具体是通过 cache 数组缓存所有组件的 vnode 实例。当 cache 内原有组件被使用时会将该组件 key 从 keys 数组中删除，然后 push 到 keys数组最后，以便清除最不常用组件。

keep-alive的实现步骤：

1. 获取 keep-alive 下第一个子组件的实例对象，通过他去获取这个组件的组件名
2. 通过当前组件名去匹配原来 include 和 exclude，判断当前组件是否需要缓存，不需要缓存，直接返回当前组件的实例vNode
3. 需要缓存，判断他当前是否在缓存数组里面：
   + 存在，则将他原来位置上的 key 给移除，同时将这个组件的 key 放到数组最后面（LRU）；
   + 不存在，将组件 key 放入数组，然后判断当前 key数组是否超过 max 所设置的范围，超过，那么削减未使用时间最长的一个组件的 key
4. 最后将这个组件的 keepAlive 设置为 true

## keep-alive 本身的创建过程和 patch 过程

缓存渲染的时候，会根据 vnode.componentInstance（首次渲染 vnode.componentInstance 为 undefined） 和 keepAlive 属性判断不会执行组件的 created、mounted 等钩子函数，而是对缓存的组件执行 patch 过程∶ 直接把缓存的 DOM 对象直接插入到目标元素中，完成了数据更新的情况下的渲染过程。

组件的首次渲染∶ 判断组件的 abstract 属性，才往父组件里面挂载 DOM

判断当前 keepAlive 和 componentInstance 是否存在来判断是否要执行组件 prepatch 还是执行创建 componentlnstance

prepatch 操作就不会在执行组件的 mounted 和 created 生命周期函数，而是直接将 DOM 插入

## LRU （least recently used）缓存策略

LRU 缓存策略∶ 从内存中找出最久未使用的数据并置换新的数据。
LRU（Least rencently used）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是 "如果数据最近被访问过，那么将来被访问的几率也更高"。 最常见的实现是使用一个链表保存缓存数据，详细算法实现如下∶

+ 新数据插入到链表头部
+ 每当缓存命中（即缓存数据被访问），则将数据移到链表头部
+ 链表满的时候，将链表尾部的数据丢弃。

## keep-alive的生命周期

对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。