# getter计算属性的实现

1. 导出一个循环遍历对象的方法

```js
export function forEachValue (obj,fn) { // 用法 forEachValue({a: 1,b: 2}, function (value, key) {})
   Object.keys(obj).forEach(key => fn(obj[key], key))
}
```

2. 由于getter里面存储的都是函数，我们需要将这个函数的返回值依次添加到getter当中，实现响应式，即可以采用 $store.getter.double进行调用,所以利用1中提供的遍历对象的方法，依次执行getter的方法，并将其定义在store.getter的对象上

```js
class Store {
    constructor(options) {
        const store = this
        store._state = reactive({ data: options.state })
        /* 2. 由于getter里面存储的都是函数，我们需要将这个函数的返回值依次添加到getter当中，实现响应式，即可以采用 $store.getter.double进行调用
              所以利用1中提供的遍历对象的方法，依次执行getter的方法，并将其定义在store.getter的对象上
        */
        const _getters = store.getters // { getters: function }
        forEachValue(_getters, function (fn, key) {
            Object.defineProperties(store.getters, key, {
                // 2.1 这种写法存在性能问题，很好的解决办法是采用vue的computed，
                // 但是vue3.1并不能使用computed，主要是因为当组件销毁是会移除computed属性, vue3.2可以使用
                get: () => fn(store.state)
            })

        })
    }
}
```

**存在的问题： 这种写法存在性能问题，很好的解决办法是采用vue的computed，但是vue3.1并不能使用computed，主要是因为当组件销毁是会移除computed属性, vue3.2可以使用**