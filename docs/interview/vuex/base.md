# vuex相关的面试题

## 1. Vuex 为什么要分模块并且加命名空间？

因为vuex使用单一状态树，将所有的状态都集中在一个比较大的对象上面，当应用十分复杂，store对象就会变得非常的庞大，为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块，所以就会出现模块和命名空间，使模块具有更高的封装度和复用性

## 2. Vuex和单纯的全局对象有什么区别？

1. Vuex 的状态存储是响应式的，依托于Vue的发布订阅模式，vuex的所有的状态state都通过Vue.set方法处理成了响应式数据，当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

2. 不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，也可以利用vuex的插件机制来实现状态变化的跟踪


## 3. 为什么 Vuex 的 mutation 中不能做异步操作？

1. 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现 time-travel 了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难
   
2. action 可以进行一系列的异步操作，并且通过提交 mutation 来记录 action 产生的副作用（即状态变更）

## 4. action和mutation的区别

1. mutations可以直接修改state，但只能包含同步操作，同时，只能通过提交commit调用(尽量通过Action或mapMutation调用而非直接在组件中通过this.$store.commit()提交)
2. actions是用来触发mutations的，它无法直接改变state，它可以包含异步操作，它只能通过store.dispatch触发

## 5. Vuex有哪几种属性？

有五种，分别是 State、 Getter、Mutations 、Actions、 Modules

1. state => 基本数据，用来存储变量
2. getters => 从基本数据派生出来的数据，相当于state的计算属性
3. mutations => 提交更改数据的方法，同步
4. actions => 像一个装饰器，包裹mutations，使之可以异步
5. modules => 模块化Vuex，可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰，方便管理。

## 6. vuex划分模块的好处

1. 使得state的管理更加容易，在保证了store完整的状态树的同时又避免了命名冲突问题
2. 操作state会变得更加的扁平和直观

## 7. vuex如果异步的修改数据？

在action中通过dispatch分发异步请求，在异步回调的过程中使用commit提交mutation，在mutation当中修改state，使得getters对state的值进行计算封装

## 8. 在模块中，getter和mutation和action中怎么访问全局的state和getter？

1. 在getter中可以通过第三个参数rootState访问到全局的state,可以通过第四个参数rootGetters访问到全局的getter

2. 在mutation中不可以访问全局的satat和getter，只能访问到局部的state
   
3. 在action中第一个参数context中的context.rootState访问到全局的state，context.rootGetters访问到全局的getter

## 9. vuex的store特性是什么？

1. vuex是一个仓库，这个仓库内部放了很多的对象，其中state就是数据源的存放地，在vuex内部将其处理成vue当中的data所以state里面存放的是数据是响应式的，vue组件从store读取数据，如果store重的数据发生改变的话，依赖的数组的组件也会发生改变

2. vuex的getters在vuex内部被处理成一个computed，具有数据缓存性

3. 显示的通过mutation以及action同步/异步的修改store的state，使得数据具有跟踪性

4. 模块命名空间的添加在保证store是一个完整的树结构的同时，使得项目的store维护更加便捷，命名也不会存在冲突的问题

## 10. vue的getters具有什么特性

vuex的getter属性核心就是将getter的每一项都转换成vue的computed属性进行计算操作，虽然在组件内部也可以做成计算属性，但是getters可以在多个组件进行复用，利用计算属性来实现缓存功能，多次取值如果值是不变的是不会重新取值的

## 11. 谈谈你对vuex的理解

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。简单来说就是：应用遇到多个组件共享状态时，使用vuex

使用场景：多个组件共享数据或者是跨组件传递数据时

vuex的流程是页面通过mapAction异步提交事件到action。action通过commit把对应参数同步提交到mutation，mutation会修改state中对应的值。最后通过getter把对应值跑出去，在页面的计算属性中，通过，mapGetter来动态获取state中的值

## 12. vue当中ajax请求代码应该是写在组件的methoss中还是vuex的actions中？

1. 如果请求来的数据是不被其他组件公用的，只是在组件内部进行使用，那就放在组件内部当中

2. 如果是被everwhere复用，就可以将请求放在action内部，方便复用

## 13. vuex的mutation的特性是什么？

uex的mutations的核心在于提供commit方法执行用户定义的mutations进行改变状态，commit是一个箭头函数是为了保证当前的this 当前的实例store

## 14. 使用vuex的弊端？

1. 项目的可维护性会降低，如果要修改数据，可能需要维护3个地方
2. 可读性会下降，因为一个组件内部的数据，根本看不出来是从哪里来的，此时就要做好管理
3. 增加了代码间的耦合度，大量的上传派发，会让耦合性大大的增加，vue本身采用component就是为了减少耦合，现在这样用，和组件化的初衷是相悖的
4. 页面刷新时会使state的数据初始化

## 15. 什么时候一定要用vuex

兄弟组件间存在大量通信的时候一定要用

## 16. vuex内部数据的处理流程？

页面通过mapAction异步提交事件到action，action通过commit把对应的参数同步提交到mutation，mutation会修改state对应的值，最后通过getter把对应的值跑出去，在页面的计算属性中，通股票mapGetter来动态获取state当中的值

## 17. vuex的优势？

1. vuex是一个状态管理工具，核心是响应式的数据管理
2. 一页面发生数据变化，可以动态的改变对应的页面
3. vue是单向数据流，有一个vuex来建一个”全局仓库“，可以减少很多开发时候的”传参地狱“

## 18. 你写过vuex的插件吗？

## 19. vuex插件的机制是什么？

Vuex插件就是一个函数，它接收 store 作为唯一参数。在Vuex.Store构造器选项plugins引入。 在store/plugin.js文件中写入

```js
export default function createPlugin(param){
    return store =>{
        //...
    }
}
// 然后在store/index.js文件中写入

import createPlugin from './plugin.js'
const myPlugin = createPlugin()
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

## 20. vuex使用actions时不支持多参数传递怎么办？

放在对象里面进行传递

## 21. vuex怎么知道state是通过mutation修改还是外部直接修改的？

通过$watch监听mutation的commit函数中_committing是否为true；严格模式下不允许直接修改

## 22. 怎么监听vuex数据的变化？

先用计算属性获取state、然后再通过watch进行监听

## 23. 你有使用过vuex的module吗？主要是在什么场景下使用？

把状态全部集中在状态树上，非常难以维护。按模块分成多个module，状态树延伸多个分支，模块的状态内聚，主枝干放全局共享状态，主要是在跨团队间维护公共项目中使用

## 24. 页面刷新后vuex的state数据丢失怎么解决？

vuex-persistedstate的createPersistedState()方法

## 25. 怎么样引入vuex？

1. nnpm install vuex --save
2. 在vue内部通过Vue.use(Vuex);
3. 创建 Vuex.store实例
4. 挂载在vue实例上面

## 26. Vuex中状态是对象时，使用时要注意什么？

因为对象是引用类型，复制后改变属性还是会影响原始数据，这样会改变state里面的状态，是不允许，所以先用深度克隆复制对象，再修改。

## 27. 怎么在组件中批量使用Vuex的state状态？

使用mapState辅助函数, 利用对象展开运算符将state混入computed对象中

```js
import {mapState} from 'vuex'
export default{
    computed:{
        ...mapState(['price','number'])
    }
}
```

## 28. Vuex中要从state派生一些状态出来，且多个组件使用它，该怎么做，？

使用getter属性，相当Vue中的计算属性computed，只有原状态改变派生状态才会改变。

## 29. 怎么通过getter来实现在组件内可以通过特定条件来获取state的状态？

通过让getter返回一个函数，来实现给getter传参。然后通过参数来进行判断从而获取state中满足要求的状态。

```js
const store = new Vuex.Store({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false }
        ]
    },
    getters: {
        getTodoById: (state) => (id) =>{
            return state.todos.find(todo => todo.id === id)
        }
    },
});

// 然后在组件中可以用计算属性computed通过this.$store.getters.getTodoById(2)这样来访问这些派生转态。

computed: {
    getTodoById() {
        return this.$store.getters.getTodoById
    },
}
mounted(){
    console.log(this.getTodoById(2).done)//false
}
```

## 30. 怎么在组件中批量给Vuex的getter属性取别名并使用

mapGetters 传递一个对象进行设置别名

```js
import {mapGetters} from 'vuex'
export default{
    computed:{
        ...mapGetters({
            myTotal:'total',
            myDiscountTotal:'discountTotal',
        })
    }
}
```

## 31. Vuex中action通常是异步的，那么如何知道action什么时候结束呢？

在action函数中返回Promise，然后再提交时候用then处理

```js
actions:{
    SET_NUMBER_A({commit},data){
        return new Promise((resolve,reject) =>{
            setTimeout(() =>{
                commit('SET_NUMBER',10);
                resolve();
            },2000)
        })
    }
}
this.$store.dispatch('SET_NUMBER_A').then(() => {
  // ...
})
```

## 32. Vuex中有两个action，分别是actionA和actionB，其内都是异步操作，在actionB要提交actionA，需在actionA处理结束再处理其它操作，怎么实现？

利用ES6的async和await来实现。

```js
actions:{
    async actionA({commit}){
        //...
    },
    async actionB({dispatch}){
        await dispatch ('actionA')//等待actionA完成
        // ... 
    }
}
```

## 33. 在模块中，getter和mutation接收的第一个参数state，是全局的还是模块的？

第一个参数state是模块的state，也就是局部的state。

## 34. 在组件中怎么访问Vuex模块中的getter和state,怎么提交mutation和action？

1. 直接通过this.$store.getters和this.$store.state来访问模块中的getter和state。
   
2. 直接通过this.$store.commit('mutationA',data)提交模块中的mutation。
   
3. 直接通过this.$store.dispatch('actionA,data')提交模块中的action。

## 35. 怎么在带命名空间的模块内提交全局的mutation和action？

将 { root: true } 作为第三参数传给 dispatch 或 commit 即可

```js
this.$store.dispatch('actionA', null, { root: true })
this.$store.commit('mutationA', null, { root: true })
```

## 36. 怎么在带命名空间的模块内注册全局的action？

```yaml
actions: {
    actionA: {
        root: true,
        handler (context, data) { ... }
    }
}
```

## 37. 组件中怎么提交modules中的带命名空间的moduleA中的mutationA？

```kotlin
this.$store.commit('moduleA/mutationA',data)
```

## 38. 怎么使用mapState，mapGetters，mapActions和mapMutations这些函数来绑定带命名空间的模块？

首先使用createNamespacedHelpers创建基于某个命名空间辅助函数

```js
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapActions } = createNamespacedHelpers('moduleA');
export default {
    computed: {
        // 在 `module/moduleA` 中查找
        ...mapState({
            a: state => state.a,
            b: state => state.b
        })
    },
    methods: {
        // 在 `module/moduleA` 中查找
        ...mapActions([
            'actionA',
            'actionB'
        ])
    }
}
```

## 39. Vuex的严格模式是什么,有什么作用,怎么开启？

在严格模式下，无论何时发生了状态变更且不是由 mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到

在Vuex.Store 构造器选项中开启,如下

```js
const store = new Vuex.Store({
    strict:true,
})
```

## 40. 在v-model上怎么用Vuex中state的值？

需要通过computed计算属性来转换

```js
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```

## 41. 在Vuex插件中怎么监听组件中提交mutation和action？

1. 用Vuex.Store的实例方法subscribe监听组件中提交mutation
2. 用Vuex.Store的实例方法subscribeAction监听组件中提交action 在store/plugin.js文件中写入

```js
export default function createPlugin(param) {
    return store => {
        store.subscribe((mutation, state) => {
            console.log(mutation.type)//是那个mutation
            console.log(mutation.payload)
            console.log(state)
        })
        // store.subscribeAction((action, state) => {
        //     console.log(action.type)//是那个action
        //     console.log(action.payload)//提交action的参数
        // })
        store.subscribeAction({
            before: (action, state) => {//提交action之前
                console.log(`before action ${action.type}`)
            },
            after: (action, state) => {//提交action之后
                console.log(`after action ${action.type}`)
            }
        })
    }
}
```

## 42. 在组件中多次提交同一个action，怎么写使用更方便。

使用mapActions辅助函数,在组件中这么使用

```js
methods:{
    ...mapActions({
        setNumber:'SET_NUMBER',
    })
}
```

## 43. 在组件中多次提交同一个mutation，怎么写使用更方便

使用mapMutations辅助函数,在组件中这么使用

```js
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
```