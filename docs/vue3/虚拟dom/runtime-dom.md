# vue3的渲染器 runtime-dom

runtime-dom 主要是用来提供domapi，依赖runtime-core（虚拟节点）

1. 为什么提供渲染器？

主要是为了用户方便扩展，vue中内置了节点操作可以直接使用

```js
const { render, h } = VueruntimeDOM
render(h('h1', 'hello world!', app))
```

2. 渲染器并没有支持多平台

3. 创建一个元素节点、创建一个文本节点、节点的增删改查、获取父子关系、设置文本

```js
    export const nodeOps = {
       createElement(tagName) {
           return document.createElement(tagName)
       },
       createTextNode(text) {
           return document.createTextNode(text)
       },
       insert(element, container, anchor = null) {
           // 当anchor为null时，insertBefore相当于appendChild
           return container.insertBefore(element, anchor)
       },
       remove(child) {
           const parent = child.parentNode
           if (parent) parent.removeChild(child)
       },
       querySelector(selectors) {
           return document.querySelector(selectors)
       },
       parentNode(child) { // 获取父节点
           return child.parentNode
       },
       nextSibling(child) { // 获取兄弟元素
           return child.nextSibling
       },
       setText(element, txt) { // 给文本节点设置内容
           element.nodeValue = txt
       },
       setElementText(element, txt) { // 给元素节点设置内容 innerHTML
           element.textContent = txt
       }
   }
```

4. 节点属性操作 - patchProps

5. 属性操作样式

```js
function patchStyle(el, prev, next) { // 更新style
    const style = el.style;
    for (const key in next) { // 用最新的直接覆盖
        style[key] = next[key]
    }
    if (prev) {
        for (const key in prev) {// 老的有新的没有删除
            if (next[key] == null) {
                style[key] = null
            }
        }
    }
}
```

6. 操作类名

```js
function patchClass(el, value) { // 根据最新值设置类名
    if (value == null) {
        el.removeAttribute('class');
    } else {
        el.className = value;
    }
}
```

7. 绑定事件函数的技巧
   
如果每次绑定的事件不同，为了避免重复的解绑和重新绑定，可以绑定一个固定的函数，内部决定使用某一种函数即可

```js
function createInvoker(preValue) {
    // 这个地方需要调用 才会执行 invoker.value
    const invoker = (e) =>  invoker.value(e)
    // 后续只需要修改value的引用就可以，达到调用不同的逻辑
    invoker.value = preValue
    return invoker
}
```

8. 操作事件的原理
   
+ 首先创建一个缓存 el._vei
+ 判断是否具有缓存的操作事件
+ 如果具有缓存事件且具备新的事件值需要对其进行换绑
+ 如果不具备缓存事件但是具有新的事件值，将事件绑定到invoker.value（即调用**createInvoker**函数）上并且进行缓存invoker，然后添加事件 **addEventListener**
+ 如果不具备新的事件值，但是之前绑定过， 就需要删除老的事件 **reomveEventlisterner**,并且缓存invoker清空
  
```js
function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {})

    const exitingInvoker = invokers[eventName]

    if (exitingInvoker && nextValue) {
        exitingInvoker.value = nextValue
    } else {
        // 不存在缓存的情况下
        const eName = eventName.slice(2).toLowerCase()
        if (nextValue) {
            // 默认会将第一次的函数绑定到invoker.value上
            const invoker = createInvoker(nextValue)
                // el._vei = { onclick: invoker }
            invokers[eventName] = invoker
            el.addEventListener(eName, invoker)
        } else if (exitingInvoker) { // 如果没有新的值但是之前绑定过，就需要删除掉
            el.removeEventListener(eName, exitingInvoker)
            invokers[eventName] = null // 缓存invoker清空
        }
    }
}
```

9. 操作其他属性

setAttribute 以及 removeAttribute