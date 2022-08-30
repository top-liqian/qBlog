# watch的源码解析 + 实现

+ watch虽然也是一个compositionApi， 但是并没有在vue的响应式模块上
+ watch如果监测的是一个对象，是没有办法拿到新值和旧值的， vue2也是这样
+ vue3当中如果watch监控的是一个对象，默认就是深度监测
+ 如果watch的是对象的某一个属性的话，需要写成函数的形式 **watch(() => state.age, (newValue, oldValue) => {})**
+ 尽量不要直接使用watch一个obj的形式，默认会递归访问对象的所有属性，所以不建议使用，对性能不友好

+ 1. 首先判断watch的属性source是否是**响应式**，如果是响应式提供get方法返回所有经**traverse函数**递归过后的值，如果source是一个function，就直接赋值给get方法

```js

export function isReactive(value){
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

// 对value进行访问，这样稍后执行effect的时候，会默认取值，就会收集依赖
function traverse(value,seen = new Set()){
    if(!isObject(value)){
        return value
    }
    if(seen.has(value)){
        return value;
    }
    seen.add(value);
    for(const k in value){ // 递归访问属性用于依赖收集
        traverse(value[k],seen)
    }
    return value
}

function watch(source, cb) {
    let get
    if(isReactive(source)) {
        get = () => traverse(source)
    } else if(isFunction(source)) {
        get = source
    }
}
```

+ 2. 创建一个**effect**函数，用来收集**source**当中的所有的属性**let effect = new ReactiveEffect(get, job)**, 并且默认会调用run方法执行get函数，此时source作为了第一次的oldValue，**oldValue = effect.run()**

+ 3. 与此同时还提供了job函数，主要用来执行watch的回调函数cb，并且提供newValue和oldValue，newValue主要是当数据发生变化的时候重新调用effect的run方法，就会获得最新的值

```js
const job = () => {
    let newValue = effect.run()
    cb(newValue, oldValue)
    oldValue =  newValue
}
```

+ 4. 提供cleanup函数，用来消除副作用函数，在cleanup当中可以随便定义中断监听的条件，如果在watch当中根据条件的变化反复调用接口，其实是以最后一次的调用结果为准，此时可以在cleanup接口当中定义条件，来决定只渲染最后一次的结果，需要注意的是**下一次watch执行钱调用的是上一次注册的cleanup回调函数**

```js
let cleanup;
let onCleanup = (fn) =>{
    cleanup = fn;
}

const job = () => {
    let newValue = effect.run()
    if(cleanup) cleanup(); // 下次watch执行前调用上次注册的回调
    cb(newValue, oldValue, onCleanup)
    oldValue =  newValue
}
```

+ 5. watch中回调执行时机 **immediate**
  
```js
export function watch(source,cb,{immediate} = {} as any){
	const effect = new ReactiveEffect(getter,job) // 创建effect
    if(immediate){ // 需要立即执行，则立刻执行任务
        job();
    }
    oldValue = effect.run(); 
}
```

# 完整watch函数的代码

```js
// 
export function isReactive(value){
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

function watch(source, cb, immediate) {
    let get
    if(isReactive(source)) {
        get = () => source
    } else if(isFunction(source)) {
        get = source
    }
    let oldValue
    let cleanup;
    let onCleanup = (fn) =>{
        cleanup = fn;
    }

    const job = () => {
        let newValue = effect.run()
        if(cleanup) cleanup(); // 下次watch执行前调用上次注册的回调
        cb(newValue, oldValue, onCleanup)
        oldValue =  newValue
    }

    let effect = new ReactiveEffect(get, job)

    if(immediate)  job()

    oldValue = effect.run()
}
```