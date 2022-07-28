# Vue面试题

## 1. 请说一下响应式数据的理解？

在vue2当中，对象内部通过defineReactive方法，使用Object.defineProperty将属性进行劫持（只会劫持已经存在的属性），多层对象是通过递归来实现劫持，数组则是通过重写数组方法来实现。内部依赖收集是由于每个属性都拥有自己的dep属性，存放他所依赖的watcher，当属性变化后会通知自己对应的watcher去更新，所以如果对象层级过深，性能就会差；
在实际的使用过程中不需要响应数据的内容不要放到data中，也可以使用Object.freeze() 去冻结数据

在vue3当中则是使用proxy来实现响应式数据

快速mock

```js
let state = { count: 0 };
// app.innerHTML = state.count;

// 1.将数据变成响应式数据
let active;
function defineReactive(obj) {
    for (let key in obj) {
        let value = obj[key];
        let dep = [];
        Object.defineProperty(obj, key, {
            get() {
                if (active) {
                    dep.push(active);
                }
                return value;
            },
            set(newValue) {
                value = newValue;
                dep.forEach(fn => fn());

            }
        });
    }
}
defineReactive(state);
const watcher = (fn) => {
    active = fn;
    fn();
    active = null;
}
watcher(() => {
    app.innerHTML = state.count;
});
watcher(() => {
    console.log(state.count)
});
```

## 2. Vue如何检测数组变化？

数组考虑性能原因没有用defineProperty对数组的每一项进行拦截，而是选择重写数组（push,shift,pop,splice,unshift,sort,reverse）方法进行重写。

在Vue中修改数组的索引和长度是无法监控到的。需要通过以上7种变异方法修改数组才会触发数组对应的watcher进行更新。数组中如果是对象数据类型也会进行递归劫持。

如果想更改索引更新数据, 可以通过Vue.$set()来进行处理, 其核心内部用的是splice方法

快速Mock:

```js
let state = [1,2,3];
let originArray = Array.prototype;
let arrayMethods = Object.create(originArray);

function defineReactive(obj) {
    arrayMethods.push = function (...args) {
        originArray.push.call(this,...args);
        render();
    }
    obj.__proto__ = arrayMethods;
}
defineReactive(state);

function render(){
    app.innerHTML = state;
}
render();
state.push(4)
```

## 3. Vue中模板编译原理？

本质上是将template转换成render函数

- 1. 将template模板转换成ast语法树 - parserHTML

- 2. 对静态语法做静态标记 - markUp

- 3. 重新生成代码 - codeGen

模板引擎的实现原理就是**new Function + with**来进行实现的

快速Mock:

```html
<script src="./node_modules/vue-template-compiler/browser.js"></script>
<script>
    let { ast, render } = VueTemplateCompiler.compile('<div>hello world</div>');
    console.log(ast, render);
    const fn = new Function(render);
    console.log(fn.toString());
</script>
```

4. 生命周期钩子是如何实现的?

Vue的生命周期钩子就是回调函数而已，当创建组件实例的过程中会调用对应的钩子方法

内部主要是使用callHook方法来调用对应的方法。核心是一个发布订阅模式，将钩子订阅好（内部采用数组的方式存储），在对应的阶段进行发布！

快速Mock:

```js
function mergeHook(parentVal, childValue) {
    if (childValue) {
        if (parentVal) {
            return parentVal.concat(childValue);
        } else {
            return [childValue]
        }
    } else {
        return parentVal;
    }
}
function mergeOptions(parent, child) {
    let opts = {};
    for (let key in child) {
        opts[key] = mergeHook(parent[key], child[key]);
    }
    return opts;
}
function callHook(vm, key) {
    vm.options[key].forEach(hook => hook());
}
function Vue(options) {
    this.options = mergeOptions(this.constructor.options, options);

    callHook(this, 'beforeCreate');
}
Vue.options = {}
new Vue({
    beforeCreate() {
        console.log('before create')
    }
})
```