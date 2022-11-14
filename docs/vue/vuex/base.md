# vuex原理分析

## 一.Vuex基本使用及用法

vuex是vue的状态管理工具,为了更方便实现多个组件共享状态

```js
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    age: 28
  },
  getters: {
    getAge(state) {
      return state.age + 10;
    }
  },
  mutations: {
    changeAge(state, payload) {
      state.age += payload
    }
  },
  actions: {
    changeAge({
      commit
    }, payload) {
      setTimeout(() => {
        commit('changeAge', payload);
      }, 1000);
    }
  }
})
```

这里我们可以进行类比： state 类比为组件的状态 ，getters类比为组件的计算属性 ， mutations类比为组件中的方法（可以更改组件的状态），actions用于进行异步操作将结果提交给mutation

```html
<div id="app">
    我的年龄是: {{this.$store.state.age}}
    <br />
    年龄是: {{this.$store.getters.getAge}}
    <br />
    <!-- dispatch对应的action -->
    <button @click="$store.dispatch('changeAge',3)">过一会增加年龄</button>
    <!-- commit 对应的mutation -->
    <button @click="$store.commit('changeAge',5)">立即增加年龄</button>
</div>
```

这个$store属性是通过根实例传入的

```js
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
```

内部会将store属性挂载在每个实例上命名为$store,这样所有组件都可以操作同一个store属性

## 实现vuex模块

提供入口文件，默认导出Store类和install方法

```js
import { Store, install } from './store';

export default {
    Store,
    install
}
export {
    Store,
    install
}
```

### 1. install方法

```js
// 入口文件的核心就是导出所有写好的方法
import applyMixin from './mixin'
let Vue;
export class Store {// 容器初始化
    constructor(options){}
}

export const install = (_Vue) =>{
    Vue = _Vue;
    applyMixin(Vue);
}
```
当我们使用插件时默认会执行install方法并传入Vue的构造函数

### 2. 需要将根组件中注入的store分配给每一个组件（子组件）所以提供mixin方法

```js
const applyMixin = (Vue) => {
    Vue.mixin({ // 内部会将生命周期拍平成一个数组
        beforeCreate: vuexInit // 给所有的组件增加$store属性，指向我们创建的store实例
    })
}

function vuexInit() {
    const options = this.$options;
    if (options.store) {  // 根
        // 给根实例增加$store属性
        this.$store = options.store;
    } else if (options.parent && options.parent.$store) {
        // 给组件增加$store属性
        this.$store = options.parent.$store;
    }
}
export default applyMixin
```

将store实例定义在所有的组件实例上

### 3. 实现state

添加状态逻辑，数据在哪里使用，就会手机对应的依赖数据

```js
export class Store {
    constructor(options){
        let state = options.state; // 数据变化会更新视图（采用vue的核心原理依赖收集）
        this._vm = new Vue({
            data:{ // 在vue当中，属性如果时通过$开头的，默认就不会将这个属性挂载在实例vm上的
                $$state:state, // 会将$$state的对应的对象，都通过defineProperty来进行属性劫持
            }
        });
    }
    get state(){ // 属性访问器
        return this._vm._data.$$state
    }
}
```

将用户传入的数据定义在vue的实例上 （这个就是vuex核心）产生一个单独的vue实例进行通信，这里要注意的是定义$开头的变量不会被代理到实例上

### 4. 实现getters

处理getters属性，具有缓存的computed，getters是带有缓存的，多次取值如果值是不变的是不会重新取值的

```js
export class Store {
    constructor(options){
        this.getters = {};
        const computed = {}
        forEachValue(options.getters, (fn, key) => {
            computed[key] = () => {
                return fn(this.state);
            }
            Object.defineProperty(this.getters,key,{
                get:()=> this._vm[key]
            })
        });
        this._vm = new Vue({
            data: {
                $$state: state,
            },
            computed // 利用计算属性实现缓存
        });
    }
}

```

### 5. 实现mutations

```js
export class Store {
    constructor(options) {
        this.mutations = {};
        forEachValue(options.mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn.call(this, this.state, payload)
        });
    }
    commit = (type, payload) => {
        this.mutations[type](payload);
    }
}
```

### 6. 实现actions

```js
export class Store {
    constructor(options) {
        this.actions = {};
        forEachValue(options.actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this,payload);
        });
    }
    dispatch = (type, payload) => {
        this.actions[type](payload);
    }
}
```

## 实现模块机制

1.格式化用户数据

```js
import ModuleCollection from './module/module-collection'
this._modules = new ModuleCollection(options);
```

```js
import { forEachValue } from '../util'
export default class ModuleCollection {
    constructor(options) {
        this.register([], options)
    }
    register(path, rootModule) {
        let newModule = {
            _raw: rootModule,
            _children: {},
            state: rootModule.state
        };
        if (path.length == 0) {
            this.root = newModule;
        } else {
            let parent = path.slice(0,-1).reduce((memo,current)=>{
                return memo._children[current];
            },this.root);
            parent._children[path[path.length-1]] = newModule;
        }
        if (rootModule.modules) {
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module);
            })
        }
    }
}
```

2. 抽离模块类