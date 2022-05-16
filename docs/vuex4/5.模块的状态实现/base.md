# 模块的状态实现

## modules的使用

```js
// store.js

modules: {
    aCount: {
      namespaced: true, // 这是一个全新的子模块，不会和其他的mutations合并
      state: {
        count: 0,
      },
      mutations: {
        add(state, payload) {
          state.count += payload
        }
      },
    },
    bCount: { ... },
}

// app.vue
<template>
    <div>
        <div>aCount {{aCount}}</div>
        <div>bCount {{bCount}}</div>
        <button @click="$store.commit('aCount/add', 1)">change aCount</button>
        <button @click="$store.commit('bCount/add', 1)">change bCount</button>
    </div>
</tempalte>
<script>
export default {
    setup() {
        return {
            aCount: computed(() => store.state.aCount.count),
            bCount: computed(() => store.state.bCount.count),
        }
    }
}
</script>
```