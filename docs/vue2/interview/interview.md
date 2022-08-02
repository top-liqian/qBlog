# vue2相关面试题

## 一、 说说你对spa单页面的理解，它的优缺点分别是什么？

SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

**优点：**

用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染，对服务器压力小；

**缺点：**

+ 初次加载耗时多：需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
+ 不能使用浏览器的前进后退功能，自己建立堆栈管理；
+ SEO 难度较大，由于所有的内容都在一个页面中动态替换显示

## 二、什么是MVVM？

MVVM：传统的前端会将数据手动渲染在页面上，MVVM模式不需要用户手动渲染DOM元素，而是直接将数据绑定到viewModel上面，会自动渲染数据到页面当中，试图变化会通知viewModel层更新数据，viewModel就是我们MVVM模式当中的桥梁，它就像是一个中转站负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用

1. View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建 。
2. Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。
3. ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。需要注意的是 ViewModel 所封装出来的数据模型包括视图的状态和行为两部分，而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。

MVVM 框架实现了双向绑定，这样 ViewModel 的内容会实时展现在 View 层，前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新。这样 View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一环。

## 三、style和class如何进行动态绑定？

class和style都可以通过对象和数组的语法进行动态绑定

```html
<div :class="{ active: isActive}"></div>
<div :class="['active']"></div>
<div :style="{color: 'red'}"></div>
<div :style="[{ color: red }]"></div>
```

## 四、Vue中模板编译原理？

vue中的模板template无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的HTML语法，所有需要将template转化成一个JavaScript函数，这样浏览器就可以执行这一个函数并渲染出对应的HTML元素，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。模板编译又分三个阶段，解析parse，优化optimize，生成generate，最终生成可执行函数render。

+ parse阶段：使用大量的正则表达式对template字符串进行解析，将标签、指令、属性等转化为抽象语法树AST。

+ optimize阶段：遍历AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。

+ generate阶段：将最终的AST转化为render函数字符串。

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



