# vue-router相关的面试题


## 一、vue-router 路由模式有几种？

vue-router 有 **3** 种路由模式：**hash、history、abstract**，对应的源码如下所示：

```js
switch (mode) {
  case 'history':
	this.history = new HTML5History(this, options.base)
	break
  case 'hash':
	this.history = new HashHistory(this, options.base, this.fallback)
	break
  case 'abstract':
	this.history = new AbstractHistory(this, options.base)
	break
  default:
	if (process.env.NODE_ENV !== 'production') {
	  assert(false, `invalid mode: ${mode}`)
	}
}
```

其中，3 种路由模式的说明如下：

+ hash:  使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；

+ history :  依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；

+ abstract :  支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

## 二、能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？

1. hash的实现原理

早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如https://www.word.com#search，它的 location.hash 的值为 '#search'：

路由模式的实现主要是基于下面几个特性：

+ URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送，不能做seo优化
  
+ hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用  JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；

+ 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。
  
```js
window.addEventListener("hashchange", () => {
  // 把改变后的url地址栏的url赋值给data的响应式数据current，调用router-view去加载对应的页面
  this.data.current = window.location.hash.substr(1);
});
```

2. history的实现原理

HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：**history.pushState() 和 history.repalceState()**, 需要特定浏览器去支持，这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，**pushState**是新增一个历史记录，**repalceState**是直接替换当前的历史记录，如下所示：

```js

window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);

```

不过这种模式还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，就需要前端自己配置 404 页面。

路由模式的实现主要基于存在下面几个特性：

+ pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
  
+ 我们可以使用 popstate  事件来监听 url 的变化，从而对页面进行跳转（渲染）；
  
+ history.pushState() 或 history.replaceState() 不会触发 popstate 事件，浏览器不会向后端发送请求，这时我们需要手动触发页面跳转（渲染）。popstate 事件的执行是在点击浏览器的前进后退按钮的时候，才会被触发

上面两个方法应用于浏览器的历史记录栈，在当前已有的 back()、forward()、go()方法的基础之上，这两个方法提供了对历史记录进行修改的功能，当这两个方法执行修改时，只能改变当前地址栏的 url，但浏览器不会向后端发送请求，也不会触法 popstate 事件的执行。

## 三、在vue项目中如何获取页面的hash变化？

1. `window.onhashchange` 监听hash事件 `window.addEventListener('hashChange', () => {})`

2. 通过 `watch:{ $route:{ handler(newVal,oldVal){ }, deep:true } }`

## 四、hash和history的区别

| 差异点| hash | history |
| -------- | ---------------------------- | ----------------- | 
| url 显示 | 有#，很 low | 无#，好看 | 
| 回车刷新 | 可以加载到 hash 值对应页面 | 一般情况 404 掉了 | 
| 支持版本 | 支持低版本浏览器和 IE 浏览器 | HTML5 新出的 API |

+ 一般场景下，hash 和 history 都可以，除非你更在意颜值，# 符号夹杂在 URL 里看起来确实有些不太美。如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

+ Vue-router 另外，根据 Mozilla Develop Network 的介绍，调用 history.pushState() 相比于直接修改 hash，存在以下优势:

  - pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中

  - pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串

## 四、什么是前端路由？

前端路由是在保证只有一个HTML页面的情况下，通过对每个视图展示形式匹配一个特殊的url来实现所谓的切换效果。不会重新向服务端发送请求，也不会跳转页面。无论是刷新、前进、还是后退，都可以通过特殊url实现。

## 五、vue-router 路由钩子函数是什么（有哪几种导航守卫）？执行顺序是什么？

钩子函数包括：全局守卫、路由守卫、组件守卫

+ 全局前置/钩子函数：beforeEach、beforeResolve、afterEach
+ 路由独享守卫：beforeEnter
+ 组件守卫：beforeRouteEnter、 beforeRouteUpdate、 beforeRouteLeave

完整导航流程：

1. 导航被触发
2. 在失活的组件里面调用 beforeRouteLeave 守卫
3. 调用全局的 beforeEach 守卫
4. 在重用的组件内部调用 beforeRouteUpdate 守卫（2.2+）
5. 在路由配置中调用 beforeEnter
6. 解析异步组件路由
7. 在被激活的组件内部调用 beforeRouteEnter
8. 调用全局的 beforeResolve守卫（2.5+）
9. 导航被确认
10. 调用全局的afterEach钩子
11. 触发DOM更新
12. 调用 beforeRouteEter 守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入

## 六、vue-router 动态路由是什么？有什么问题？

假如我们有一个组件，针对不同的id接口返回的数据是不一样的，但是都要使用这个组件进行渲染，那么我们就可以在vue-router的路由路径中使用动态路径参数的形式来达到这个效果，其中有两种方式

1. params方式

+ 路由定义： 
  - 在App.vue当中 <router-link :to="`/user/${userId}`" replace>用户</router-link>
  - 在index.js当中  { path: '/user/:userId', component: User}

+ 路由跳转
  - <router-link :to="{name: 'Users', params: { userId: 123}}"></router-link>
  -  this.$router.push({name: 'Users', params: { userId: 123} })
  -  this.$router.push('/user/' + 123)
+ 参数获取 this.$route.params

2. query方式

+ 路由定义
  - <router-link :to="{ path: '', query: { }}"></router-link>
  - 点击事件 this.$router.push({ path: '', query: {}})
+ 跳转方法
  - <router-link> to name
  - <router-link> to path
  - this.$router.push name
  - this.$router.push path
  - this.$router.push('/user?userId' + id)
+ 参数获取 this.$route.query

### params方式和query方式的区别

+ query方式 name、path都可以使用 params方式 只能用name
+ query更加类似ajax当中的get穿参数、params更类似于post，query在浏览器地址栏当中显示参数，params不显示
+ query刷新不会丢失query里面的数据、params刷新会丢失params的数据

## 七、$route和$router的区别?

+ $router为VueRouter实例，想要导航到不同URL，则使用$router.push方法

+ $route为当前router跳转对象，里面可以获取name、path、query、params等

## 八、Vue-Router 的懒加载如何实现

把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件

```js
const List = () => import('./index.vue')
```

原理：

## 九、编程式路由导航 与 声明式路由导航

1. 编程式路由导航： 即写 js 的方式
   
   + this.$router.push: 相当于点击路由链接(可以返回到当前路由界面）队列的方式（先进先出）
   + this.$router.replace：用新路由替换当前路由(不可以返回到当前路由界面) --> 栈的方式（先进后出）
   + this.$router.back():请求(返回)上一个记录路由
   + this.$router.go(-1):请求(返回)上一个记录路由
   + this.$router.go(1): 请求下一个记录路由
2. 声明式路由导航： 即 <router-link>

```html
<router-link to='xxx' tag='li'>  To PageB  </router-link>
```   
<router-link> 会默认解析成 a 标签，可以通过 tag 属性指定它解析成什么标签

## 前端History路由配置 nginx