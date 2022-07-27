# 渲染的核心包runtime-core

runtime-core不关心运行平台，用于生成dom以及渲染，依赖响应式包 @vue/reactivity以及公共库@vue/shared，其内部就是用的响应式的原理来做的

## h函数

h函数直接重载，不同的参数决定了不同的功能

1. 元素 内容
2. 元素 属性 内容
3. 元素 属性，多个儿子
4. 元素 儿子/ 元素（只要不是文本节点，都会把儿子转换成数组）
5. 元素 空属性 多个儿子

## createVNode

h函数内部本质上是调用了createVNode方法

该方法用法比较固定
**createVNode('h1', {}, ['hello', 'world'])**

1. vue2与vue3对于儿子节点的**类型判断**有区别

vue2当中主要是通过判断儿子的类型（包括数 组、字符串、__v_isKeepAlive、__v.suspsned、或者是一个函数）来决定有何操作

vue3则是通过打tag的方式来直接判断child的类型，也就是将当前的虚拟节点 和自己儿子的虚拟节点映射起来，也就是实现权限组合（本质是位运算）

**权限组合的最佳实现方式**： 位运算 + &操作，如果 a & b > 0说明具备这个类型，通过｜= 操作来进行整体标识

```ts
export const enum ShapeFlags {
    ELEMENT = 1 // 1
    FUNCTION_COMPONENT = 1 << 1 // 2
    STATEFUL_COMPONENT = 1 << 2 // 4
}

ELEMENT & FUNCTION_COMPONENT > 0 // 说明存在这个类型
shapeFlag = ELEMENT
shapeFlag |= FUNCTION_COMPONENT // 1 + 2 = 3
```

2. 标记的好处

+ diff算法的时候可以明确针对哪种类型可以diff，提高性能
+ 减少不必要的重复对比，造成代码冗余

3. 原理总结

+ 首先根据元素的类型来进行标识当前的元素的类型tag
+ 创建一个vnode节点，这个节点的数据跟真实的节点的属性是一样的
+ 然后给元素的儿子元素根据不同的类型进行打tag，child的类型无疑是两种，一种是文本类型，一种是数组类型，表示同意主要是使用位运算当中的|=操作

```js
export function isVNode(value: any){
    return value ? value.__v_isVNode === true : false
}
export const createVNode = (type,props,children = null)=>{
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT:0;
    const vnode = {
        __v_isVNode: true,
        type,
        props,
        key: props && props['key'],
        el: null,
        children,
        shapeFlag // 标识自己
    }
    if(children){ // 通常走到这里一般是儿子数组要么就是文本类型
        let type = 0;
        if(Array.isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }else{
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlag |= type
        // 如果shapeFlag为9 说明元素中包含一个文本
        // 如果shapeFlag为17 说明元素中有多个子节点
    }
    return vnode;
}
```

4. 总结

vue总共是有两部分组成

+ 编译时（将模版变异成render函数 complier-dom complier-core），返回的依然是虚拟节点
+ 运行时 就是将虚拟节点变成（真实的节点），runtime-dom提供domapi，runtime-core（虚拟节点），runtime-core基于reactivity内部是用响应式的原理来做的
  
