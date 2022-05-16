# mutations&actions的基本实现

1. mutations 通过commit进行同步修改变量，actions通过 dispatch进行异步修改变量, 其本质在于发布订阅模式
2. 创建两个空对象store._mutations & store._actions，采用Object.create(null)的形式，主要是为了创建不具有原型链的控对象，提高性能,将配置的mnutions以及actions组装成发布模式，在提供commit和dispatch实现订阅模式
3. 提供commit方法并采用剪头函数的写法，用意在于用户是采用解构的方式进行调用，普通函数this指向会出现问题，所以采用顶级作用域的剪头函数
4. 提供dispatch方法采用剪头函数的写法，用意在于用户是采用解构的方式进行调用，普通函数this指向会出现问题，所以采用顶级作用域的剪头函数

```js
import { inject, reactive } from 'vue'

export function forEachValue (obj,fn) {
   Object.keys(obj).forEach(key => fn(obj[key], key))
}

const storeKey = 'store'
class Store {
    constructor(options) {
        const store = this
        store._state = reactive({ data: options.state })
        const _getters = store.getters // { getters: function }
        forEachValue(_getters, function (fn, key) {
            Object.defineProperties(store.getters, key, {
                get: () => fn(store.state)
            })

        })
        /* 1. mutations 通过commit进行同步修改变量，actions通过 dispatch进行异步修改变量
           其本质在于发布订阅模式
           2. 创建两个空对象store._mutations & store._actions，采用Object.create(null)的形式，主要是为了创建不具有原型链的控对象，提高性能
              将配置的mnutions以及actions组装成发布模式，在提供commit和dispatch实现订阅模式
        */

       store._mutations = Object.create(null)
       store._actions = Object.create(null)

       const mutations = options.mutations
       const actions = options.actions

       forEachValue(mutations, function (mutation, key) { // 2.1目前commit('count', 1)当中，支持穿一个参数
            store._mutations[key] = (payload) => {
                mutation.call(store, store.state, payload)
            }
       })

       forEachValue(actions, function (action, key) { // 2.2 目前dispatch({ commit }, payload)当中，支持穿一个参数
            store._actions[key] = (payload) => {
                action.call(store, store, payload)
            }
        })
    }
    // 3. 提供commit方法

    commit = (type, payload) => { // 3.1 此处书写剪头函数的用意在于用户是采用解构的方式进行调用，普通函数this指向会出现问题，所以采用顶级作用域的剪头函数
        this._mutations[type](payload)
    }
    // 4. 提供dispatch方法
  
    dispatch = (type, payload) => { // 4.1 此处书写剪头函数的用意在于用户是采用解构的方式进行调用，普通函数this指向会出现问题，所以采用顶级作用域的剪头函数
        this._actions[type](payload)
    }

    install(app, injectKey) {
       app.provide(injectKey || storeKey, this)
       app.config.globalProperties.$store = this
    }
    
    get state() {
        return this._state.data
    }


}

export function createStore(options) {
    return new Store(options)
}

export function useStore(injectKey = storeKey) {
    return inject(injectKey)
}
```
