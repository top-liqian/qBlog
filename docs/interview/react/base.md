# react 相关面试题

## React 中的 setState 为什么需要异步操作？

+ 保持内部一致性：props 的更新是异步的，因为re-render父组件的时候，传入子组件的props才变化；为了保持数据一致，state也不直接更新，都是在flush的时候更新
+ 将state的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 DONM，那么它将带来巨大的性能消耗
+ 立即更新回来视觉上的不适应，比如在页面打开时候，多个请求发布导致频繁更改Loading 状态，会导致 Loading 图标闪烁

## 什么时候setState会进行同步操作？

只要你进入了 react 的调度流程，那就是异步的。只要你没有进入 react 的调度流程，那就是同步的。什么东西不会进入 react 的调度流程？ setTimeout setInterval ，直接在 DOM 上绑定原生事件等。这些都不会走 React 的调度流程，你在这种情况下调用 setState ，那这次 setState 就是同步的。 否则就是异步的。

## React 官方对于setState特定情况下进行同步操作的优化方案是什么？


## React 中 setState 后想要拿到更新的state值应该怎么处理？

基于React的快照模式，每一次setState都会生成新的快照，但旧的快照，只能取到旧值

1. 通过变量存储新值直接使用，不使用state的值

2. 通过层层传递值的行为来搞

3. 通过setState(state => { …state, [key]: any })这种形式来搞

通用解决方案：

1. ahooks的useReactive，可以完美解决此问题(底层用了Proxy，与Vue3同样问题，不支持IE)

2. 复用uesRef缓存值方案，也可以解决上述问题（写得麻烦，但至少没兼容性问题，根据自己需求进行选择）

```js
function Index() {
  const [state, setState] = useState({ a: 1, b: 2 })
  const stateRef = useRef(state)
  stateRef.current.state = state
  /** 需要使用到state值的时候，统一从stateRef.current进行取 **/
}

```

## React 在语法层面可以做哪些性能优化？

解题思路

PureComponent + Redux + immutable-js / immutability-helper
Redux ->  Redux Toolkit
组件库按需加载
动态 Ployfill
Tree Shaking
路由懒加载
Hooks useCallback
React Fragments
构建函数中的事件 bind 处理
避免使用内联样式属性
JSX 中合理控制条件渲染的范围（避免无谓的重复渲染）
key
保持 state 中数据必响应的特性