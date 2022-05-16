# vuex4的基本使用以及原理解析

## 一、基础概念

+ state：组件中的data
+ getter：计算属性，vuex4当中他并没有实现计算属性的功能
+ mutation：可以更改状态，必须是同步更改的，只能通过mutation更改状态
+ action：异步更改，可以调用其他的action，或者调用mutation
+ modules: state空间

使用方法：

```html
<script> 
export default {
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  setup() {
    const store = useStore()
    function add() {
       store.commit('add', 1)
    }
    function asyncAdd() {
        store.dispatch('asyncAdd', 1)
    }
    return {
        count: computed(() => store.state.count),
        double: computed(() => store.getters.double)
        add,
        asyncAdd,
    }
  }
}
</script>
```

## 二、vuex4的核心原理

主要利用vue3实例提供的`provide`和`inject`方法来实现,父组件注册provide的变量，自组件通过inject拿到父组件注册的变量
