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

这里我们可以进行类比： 

1. state 类比为组件的状态 
2. getters类比为组件的计算属性 
3. mutations类比为组件中的方法（可以更改组件的状态）
4. actions用于进行异步操作将结果提交给mutation

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

## 二、实现一个简易版的vuex模块

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

### 1. vuex首先在入口文件处提供install方法，当我们使用插件时默认会执行install方法并传入Vue的构造函数

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

### 2. 需要将根组件中注入的store分配给每一个组件（子组件）所以提供mixin方法

内部原理就是使用Vue.mixin方法注入beforeCreate生命周期钩子，给所有的组件增加$store属性，指向我们创建的store实例，这样在每一个自组件内部都可以使用$store

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

### 3. 实现state

vuex的state本质就是一个响应式数据，将state的每一项变成响应式数据，当数据变化会更新视图，添加状态逻辑，数据在哪里使用，就会收集对应的依赖数据

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

vuex的getter属性核心就是：将getter的每一项都转换成vue的computed属性，利用计算属性来实现缓存功能，多次取值如果值是不变的是不会重新取值的

```js
export class Store {
    constructor(options){
        this.getters = {};
        const computed = {}// 模拟一个computed对象
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

vuex的mutations的核心：提供commit方法执行用户定义的mutations进行改变状态，commit是一个箭头函数是为了保证当前的this 当前的实例store

```js
export class Store {
    constructor(options) {
        this.mutations = {};
        forEachValue(options.mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn.call(this, this.state, payload)
        });
    }
    commit = (type, payload) => { // 保证当前的this 当前的实例store，所以commit是一个箭头函数
        this.mutations[type](payload);
    }
}
```

> 面试题：为什么commit函数是一个箭头函数？或者commit怎么保证this指向实例
> 保证当前的this 当前的实例store，所以commit是一个箭头函数
> 或者：使用箭头函数

### 6. 实现actions

vuex的actions的核心：提供dispatch方法执行用户定义的actions进行改变状态，dispatch是一个箭头函数是为了保证当前的this 当前的实例store

```js
export class Store {
    constructor(options) {
        this.actions = {};
        forEachValue(options.actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this.payload);
        });
    }
    dispatch = (type, payload) => { // 同样是箭头函数
        this.actions[type](payload);
    }
}
```

> 面试题：从代码上看action和mutation是没有区别的，但是在严格模式下：dispatch和commit是有区别的

## 三、实现一个复杂逻辑的vuex具有模块机制

1. 首先我们拿到用户定义的一系列的数据，我们需要对这些数据进行处理，将这些数据格式化成一棵树，方便后续的store的父子关系的创建，提供ModuleCollection类内部递归进行register注册，从根开始进行注册，利用stack栈型结构，深度优先遍历这个数组，当前元素的父亲就是自己的前一个元素
   
```js
import ModuleCollection from './module/module-collection'
// 数据的格式化，格式化成一棵树
export class Store {
    constructor(options) {
        ...
        // 1. 将这些数据格式化成一棵树
        this._modules = new ModuleCollection(options);

        this._actions = {}; // 收集所有的sctions
        this._mutations = {}; // 收集所有的mutations
        this._wrappedGetters = {} // 收集所有的getters
        // 2. 安装模块 - 根模块的状态中要将子模块通过模块名定义在根模块上面
        installModule(this, state, [], this._modules.root);
    }
}

```

```js
/** 这是我们想要的结果，本质就是将一个数组转化成一棵树
 * this.root = {
 *    _raw: '根模块'
 *    _children: {
 *        a: {
 *           _raw: 'a模块',
 *           _children: {
 *              c: {...}
 *           }
 *        },
 *        b: {
 *           _raw: 'b模块',
 *           _children: {
 *              d: {...}
 *           }
 *        }
 *     }
 * }
*/
import { forEachValue } from '../util'
export default class ModuleCollection {
    constructor(options) {
        this.register([], options) // 从根开始进行注册，利用stack栈型结构，当前元素的父亲就是自己的前一个元素
    }
    register(path, rootModule) { // 遍历的方式：深度优先遍历
        let newModule = { // 格式化之后的结果
            _raw: rootModule, // 用户定义的原来的模块
            _children: {}, // 模块的儿子
            state: rootModule.state // 当前模块的state
        };
        if (path.length == 0) { // 根模块
            this.root = newModule;
        } else {
            let parent = path.slice(0,-1).reduce((memo,current)=>{
                return memo._children[current];
            },this.root);
            parent._children[path[path.length-1]] = newModule;
        }
        if (rootModule.modules) { // 如果当前的组件内部还有modules模块的区分，那么就递归创建register这个模块
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module);// 拼接自己的名字即[a, b]
            })
        }
    }
}
```

2. 安装模块，将根模块的状态中要将子模块通过模块名定义在根模块上面，其中包括states、getters、actions、mutations，对模块进行安装操作，进行一系列的操作，vuex可以动态的添加模块，所以采用Vue.set方法将其转换成vue的响应式数据，state本身定义的数据是不是响应式的，也是通过Vue.set方法将其转换成响应式的做到实时更新，所有的模块都会进行递归处理，并且为了方便处理抽离出模块类提供公共的处理方法

```js
function installModule(store, rootState, path, module) {
    // 对当前模块进行操作
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current];
        }, rootState);
        Vue.set(parent, path[path.length - 1], module.state);
    }
    // 下面的操作在于收集所有的action、mutations、getters、并且对儿子进行递归处理
    module.forEachMutation((mutation, key) => {
        store._mutations[key] = (store._mutations[key] || []);
        store._mutations[key].push((payload) => {
            mutation.call(store, module.state, payload);
        });
    });
    module.forEachAction((action, key) => {
        store._actions[key] = (store._actions[key] || []);
        store._actions[key].push(function(payload) {
            action.call(store, this, payload);
        });
    });
    // 模块中getter的名字重复了会进行覆盖
    module.forEachGetter((getter, key) => {
        store._wrappedGetters[key] = function() {
            return getter(module.state);
        }
    });
    // 如果有孩子就递归加载模块
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })
}
```
```js
export default class Module { // 模块类
    constructor(rawModule) {
        this._children = {};
        this._rawModule = rawModule;
        this.state = rawModule.state
    }
    getChild(key) { // 拿到一个孩子
        return this._children[key]
    }
    addChild(key, module) { // 添加一个孩子
        this._children[key] = module
    }
    forEachMutation(fn) { // 遍历mutation
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn)
        }
    }
    forEachAction(fn) { // 遍历action
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.actions, fn)
        }
    }
    forEachGetter(fn) { // 遍历getter
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn)
        }
    }
    forEachChild(fn) { // 遍历孩子
        forEachValue(this._children, fn);
    }
}
```

3. 对dispatch和action方法进行重写

```js
class Store {
    constructor(options) {},
    commit = (type, payload) => {
    this._mutations[type].forEach(fn => fn.call(this, payload));
    }
    dispatch = (type, payload) => {
       this._actions[type].forEach(fn => fn.call(this, payload));
    }
}

```

4. 将所有的子模块的状态安装在父模块的状态上，也就是将状态和getters都定义在当前的实例vm上面

```js
export class Store {
    constructor(options) {
      resetStoreVM(this, state); // 第三步
    }
}
// 将状态和getters都定义在当前的vm上面
function resetStoreVM(store, state) {
    const computed = {};
    store.getters = {};
    const wrappedGetters = store._wrappedGetters
    forEachValue(wrappedGetters, (fn, key) => {
        computed[key] = () => {
            return fn(store.state);
        }
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key] // 去计算属性上面去取值
        })
    });
    store._vm = new Vue({
        data: {
            $$state: state,
        },
        computed
    });
}
```

5. 实现命名空间

怎么进行订阅空间：在修改的时候本身的命名前面就有一个命名空间的前缀，所以我们在绑定属性的时候就进行命名空间的拼装，即`'/a/changeAge'`然后进行保存即可

```js
import { forEachValue } from '../util';
import Module from './module';
export default class ModuleCollection {
    getNamespace(path) { // 返回前缀
        let module = this.root // 从根模块开始找起
        return path.reduce((namespace, key) => {
            module = module.getChild(key); // 不停的去找当前的模块，这个模块是自己定义的（也就是儿子）
            console.log(module)
            return namespace + (module.namespaced ? key + '/' : '') // 如果这个儿子上面具有namespaced，那就进行拼装，一直找
        }, '');
    }
}
export default class Module {
    get namespaced(){ // 判断当前的属性是否具有命名空间属性
        return !!this._rawModule.namespaced;
    }
}
```

在绑定属性是增加命名空间：

```js
function installModule(store, rootState, path, module) {
    let namespace = store._modules.getNamespace(path); // 拿到当前的命名空间的拼装字符串
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current];
        }, rootState);
        Vue.set(parent, path[path.length - 1], module.state);
    }
    module.forEachMutation((mutation, key) => {
        store._mutations[namespace + key] = (store._mutations[namespace + key] || []);
        store._mutations[namespace + key].push((payload) => {
            mutation.call(store, module.state, payload);
        });
    });
    module.forEachAction((action, key) => {
        store._actions[namespace + key] = (store._actions[namespace + key] || []);
        store._actions[namespace + key].push(function(payload) {
            action.call(store, this, payload);
        });
    });
    module.forEachGetter((getter, key) => {
        store._wrappedGetters[namespace + key] = function() {
            return getter(module.state);
        }
    });
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })
}
```

6. 注册模块

```js
registerModule(path,rawModule){
    if(typeof path == 'string') path = [path];
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, rawModule.rawModule);
    // 重新设置state, 更新getters
    resetStoreVM(this,this.state);
} 
```

实现模块的注册，就是将当前模块注册到_modules中

```js
function resetStoreVM(store, state) {
+   let oldVm = store._vm;
    const computed = {};
    store.getters = {};
    const wrappedGetters = store._wrappedGetters
    forEachValue(wrappedGetters, (fn, key) => {
        computed[key] = () => {
            return fn(store.state);
        }
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        })
    });
    store._vm = new Vue({
        data: {
            $$state: state,
        },
        computed
    });
    if(oldVm){
+      Vue.nextTick(() => oldVm.$destroy())
    }
}
```

销毁上次创建的实例

### 四、插件机制

插件机制原理：用户在初始化的过程中会传递进来一个plugins的数组，内部存放用户自定义的全部的插件，然后依次执行，store内部需要提供一个subscribe的订阅函数，当store维护的数据一发生变化的时候就会执行这个函数并且去替换store维护的状态

### 1. 插件的使用方式

```js
// 高阶函数
function persists(store) { // 每次去服务器上拉去最新的 session、local
    let local = localStorage.getItem('VUEX:state');
    if (local) {
        store.replaceState(JSON.parse(local)); // 会用local替换掉所有的状态
    }
    // 内部提供订阅函数，每次发生变化就会执行
    store.subscribe((mutation, state) => {
        // 这里需要做一个节流  throttle lodash
        localStorage.setItem('VUEX:state', JSON.stringify(state));
    });
}

const store = new Vuex.Store.({
    plugins: [
        persists // 持久化存储上一次vuex的数据
   ]
})

```

### 2. 实现插件机制

store内部需要实现subscribe、replaceState方法

```js
// 1. 依次执行用户传递进来的plugins内部的插件
class Store {
    constructor(options) {
        let _subscribers = []
        options.plugins.forEach(plugin => plugin(this));
    }
    // 2. 提供subscribe方法存放用户定义的cb
    subscribe(fn){
       	this._subscribers.push(fn);
    }
    // 3. 替换状态
    replaceState(state){
       	this._vm._data.$$state = state;
    }
}
```

store内部只有更改mutation才可以更改页面上的状态，所以需要取最新状态当调用mutation时传入最新状态

```js
function getState(store, path) {
    let local = path.reduce((newState, current) => {
        return newState[current]; 
    }, store.state);
    return local
}
module.forEachMutation((mutation, key) => {
    store._mutations[namespace + key] = (store._mutations[namespace + key] || []);
    store._mutations[namespace + key].push((payload) => {
    mutation.call(store, getState(store,path), payload);
    });
});
```

## 五、辅助函数

1. mapState实现
   
```js
const mapState = arrList => {
  let obj = {};
  for (let i = 0; i < arrList.length; i++) {
    let stateName = arrList[i];
    obj[stateName] = function() {
      return this.$store.state[stateName];
    };
  }
  return obj;
};
```

2. mapGetters实现

```js
const mapGetters = arrList => {
  let obj = {};
  for (let i = 0; i < arrList.length; i++) {
    let getterName = arrList[i]
    obj[getterName] = function() {
      return this.$store.getters[getterName];
    };  
  }
  return obj;
};

```

3. mapMutations实现

```js
const mapMutations = mutationList=>{
    let obj = {};
    for (let i = 0; i < mutationList.length; i++) {
        let type = mutationList[i]
        obj[type] = function(payload){
            this.$store.commit(type,payload);
        }
    }
    return obj
}
```

4. mapActions实现

```js
const mapActions = actionList=>{
    let obj = {};
    for (let i = 0; i < actionList.length; i++) {
        let type = actionList[i]
        obj[type] = function(payload){
            this.$store.dispatch(type,payload);
        }
    }
    return obj
}
```

## 六、区分mutation和action

```js
this._committing = false;
 _withCommitting(fn) {
    let committing = this._committing;
    this._committing = true; // 在函数调用前 表示_committing为true
    fn();
    this._committing = committing;
}

if (store.strict) {
    // 只要状态一变化会立即执行,在状态变化后同步执行
    store._vm.$watch(() => store._vm._data.$$state, () => {
        console.assert(store._committing, '在mutation之外更改了状态')
    }, { deep: true, sync: true });
}
```
> 严格模式下增加同步watcher，监控状态变化

```js
store._withCommitting(() => {
    mutation.call(store, getState(store, path), payload); // 这里更改状态
})
```

只有通过mutation更改状态，断言才能通过

```js
replaceState(newState) { // 用最新的状态替换掉
    this._withCommitting(() => {
        this._vm._data.$$state = newState;
    })
}

store._withCommitting(() => {
    Vue.set(parent, path[path.length - 1], module.state);
})
```

> 内部更改状态属于正常更新,所以也需要用_withCommitting进行包裹