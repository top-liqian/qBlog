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