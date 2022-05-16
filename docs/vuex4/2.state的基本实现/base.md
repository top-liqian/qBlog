## vuex4的state的具体实现

1. 在vue3内部我们是通过 `createApp().use(store, 'my')`进行注册vuex4的，所以需要导出一个函数返回store的实例并将配置的options作为参数传递给store,即 function createApp(options) { return new Store(options) }
2. 此时我们创建Store构造函数，提供install方法以供vue3注册使用 `insatll(app, injectKey)`
   + 2.1 全局暴漏一个变量，暴漏的是store的实例，利用vue3提供的 `provide` 方法，给根app增加一个_provide，子组件会向上进行查找,即`app.provide(injectKey || storeKey, this) `
   + 2.2 vuex还兼容了以前的写法 $store.state.count，相当于 Vue.prototype.$store ` app.config.globalProperties.$store = this`
3. 我们需要创建一个响应式的state的全局变量，vue3内部创建了一个实例，提供了已经具备的响应式方法 reactive来实现响应式的变量注册 `const store = this;store._state = reactive({ data: options.state })`
   > 为什么要在reactive里面包一层data？
   >
   > 主要是因为vuex当中提供来一个replaceState的方法用来更改state(即重新赋值的问题)，如果没有data那一层需要每一次都搞一个reactive，耗费性能,如果有data就可以直接 store._state.data = xxx
4. 为了让用户可以拿到state，提供get方法 `get () { return this.state.data }`
    
```js
// vue3 main.js
import store from './store'

createApp(App).use(store, 'my').use(router).mount('#app')

// store.js

import { inject, reactive } from 'vue'

const storeKey = 'store'
class Store {
    constructor(options) {
        // 3. 我们需要创建一个响应式的state的全局变量，vue3内部创建了一个实例，提供了已经具备的响应式方法 reactive来实现响应式的变量注册
        const store = this
        /* 3.1 为什么要在reactive里面包一层data？
               主要是因为vuex当中提供来一个replaceState的方法用来更改state(即重新赋值的问题)，如果没有data那一层需要每一次都搞一个reactive，耗费性能
               如果有data就可以直接 store._state.data = xxx
        */
        store._state = reactive({ data: options.state })

    }
    // 2. 全局暴露一个install的方法，可以让vue3使用use调用
    install(app, injectKey) { // createApp().use(store, 'my')
       // 2.1. 全局暴漏一个变量，暴漏的是store的实例
       app.provide(injectKey || storeKey, this) // 给根app增加一个_provide，子组件会向上进行查找
       // 2.2. vuex还兼容了以前的写法 $store.state.count，相当于 Vue.prototype.$store
       app.config.globalProperties.$store = this
    }
    // 4. 为了让用户可以拿到state，提供get方法
    get state() {
        return this._state.data
    }
}

export function createStore(options) {
    // 1. 创建一个store的实例
    return new Store(options)
}

export function useStore(injectKey = storeKey) {
    // vue内部已经默认将inject导出来
    return inject(injectKey)
}
```