# 常见浏览器JS对象常见API及其用法

## 什么是浏览器对象模型

BOM： browser object model，浏览器提供了独立于内容的、可以与浏览器窗口进行滑动的对象结构，就是浏览器提供的API

其主要对象有：

1. window对象是BOM的核心，是js访问浏览器的接口，也是ES规定的global对象
2. location对象：提供当前窗口中加载的文档有关的信息和一些导航功能，既是window对象属性，也是document的对象属性，location.href
3. navigation对象：获取浏览器的系统信息 
4. screen对象：用来表示浏览器窗口外部的显示器的信息等 screenHeight, screenWidth
5. history对象： 用来保存用户上网的历史信息,
   
### window对象
window对象既是整个浏览器对象模型的核心，其扮演既是接口又是全剧对象的角色

1. alert(): 弹一个警告的弹窗，接受一个string参数window.alert('lllll')；调用会阻断浏览器接下去的代码，样式较为丑陋

2. confirm(): 相对于alert多了两个按钮，一个是确认一个是取消

3. prompt(): 先是一个对话框，对话框中包含一条文字信息，用来提示用户输入文字，具有一个返回值即用户输入的内容; 适用于于用户有简单交互的弹窗场景

```js
  const result = window.prompt('请输入你想输入的内容')
```

4. open()：可以打开一个新的浏览器窗口

```js
  window.open('htttp://www.baidu.com')
```

5. onerror()：常用于各种基础类库，比如全局捕获错误，上报sentry
   
```js
  window.onerror = e => console.log(e)

  // react class -> componentDidCatch 约等于 window.onerror
```
6. setTimeout(func, time): 适用于轮询接口
   
7. setInterval(func, time): 可以应用轮询接口，但是有影响，比如现在是10分4秒，窗口挂后台了，10分6秒窗口激活，func会瞬间执行6次

8. 窗口位置

  + screenLeft: 窗口相对于屏幕左边的位置 // 兼容IE，chrome，safari
  + screenX：窗口相对于屏幕左边的位置 // 兼容firefox
  + screenTop：窗口相对于屏幕上边的位置 // 兼容IE，chrome，safari
  + screenY：窗口相对于屏幕上边的位置 // 兼容firefox
  + moveBy(x,y) // 相对移动，window.moveBy(10, -10); 向右移动10px，向上移动10px
  + moveTo(x,y) // 绝对移动，

9. 窗口大小
  + innerWidth：获得可视区域的宽度，适用于非IE浏览器，兼容IE版本则需要使用 document.body.clientWidth
  + innerHeight：获得可视区域的高度，适用于非IE浏览器，兼容IE版本则需要使用 document.body.clientHeight

  + outerWidth：获取浏览器窗口本身的尺寸
  + outerHeight

  + resizeTo(width, height)
  + resizeBy(width, height)
   
### Location对象

例如：访问的地址为 http://192.168.8.91:8080/search?name=aaaa&age=18
1. hash
2. host: 获得域名`www.baidu.com`
3. hostname:
4. `href`: location.href = 'www.baidu.com', 会跳转链接，但是会在当前页面历史栈中push一个新纪录，`可以`点击浏览器返回键回到上一页
5. `replace`：location.replace = 'www.baidu.com', 会跳转链接，但是会清空当前历史栈，然后push一个新纪录，`不可以`点击浏览器返回键回到上一页
6. pathname：获得得到 `search`
7. port：端口`8080`
8. protocol：返回协议 `http`
9. `search`：get请求所带的参数`?name=aaaa&age=18`

### Navigation 对象

navigation 接口表示用户代理的状态和标识，允许脚本查询它和注册自己进行一些活动

appCodeName // 当前浏览器的名称 Mozilla

onLine // 当前时候网络状态安好

appVersion // 上报浏览器版本


### History对象

history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起，history对象是用窗口的浏览历史，用文档和文档状态列表的形式表示

1. go()： 跳转，number，history.go(-1) // 返回上一页 history.go(1) // 返回下一页
2. back()：history.back() === history.go(-1)
3. forward(): 前进
4. length：当前存有的历史记录的数量
   
### 面试题：

1. vue有几种路由
2. location.href 和llocation.replace 有什么区别？如果不期望用户可以返回上一页，用哪个api
3. 如何获取浏览器的可视区域？如果保证兼容性
4. setTimeout和setInterval的区别，如果钥匙轮询，需要怎么写
5. history.go(-2) 和history.back()区别

## 浏览器事件模型

浏览器事件模型当中的过程主要分为3个阶段：捕获规程、目标阶段、冒泡过程

捕获规程是自顶向下

冒泡过程是自底向上的

### 监听对象-addEventListener

```js
  const element = document.getElementById('element')
  element.addEventListener('click', e => {
    console.log(e.target.nodeName, e.currentTarget.nodeName)
  }, true | false)
```
`第三个参数`代表着是否在`捕获阶段`执行

默认值是`false`, 意义是不再捕获阶段执行，而是在冒泡阶段执行

true 代表在捕获阶段执行

```js
// e.target.nodeName 当前实际点击的元素 span，也就是说目标对象就是e.taregt
// e.currentTarget.nodeName 绑定事件监听的对象, window的根结点是undefined
```

### 阻止对象传播

1. `e.stopPropagation()`: 阻止事件传播，**同时阻止捕获和冒泡的传播**

  如果给window对象监听对象，并进行阻断事件传播，那么只会触发window的监听

  ```js
    window.addEventListener('click', e=> {
      e.stopPropagation()
      console.log(e.taregt.nodeName, e.currentTarget.nodename)
    }, true)

    parent..addEventListener('click', e=> {
      console.log(e.taregt.nodeName)
    }, true)

    // 在捕获阶段监听只会输出 window undefined
    // 在冒泡阶段监听就没有关系，因为在冒泡阶段，window是最顶层对象，本身就是最后一个触发
  ```
2. `e.stopImmediatePropagation()`: 如果有多个相同类型的事件监听函数绑定在了同一个元素上，当这个类型的事件触发的时候，她们会按照被添加的顺序执行

  ```js

    parent..addEventListener('click', e=> {
      console.log('parent click1')
    })

    parent..addEventListener('click', e=> {
      console.log('parent click2')
    })

    parent..addEventListener('click', e=> {
      console.log('parent click3')
    })

    // parent click1; parent click2; parent click3;

    parent..addEventListener('click', e=> {
      e.stopImmdiatePropagation()
      console.log('parent click1')
    })

    parent..addEventListener('click', e=> {
      console.log('parent click2')
    })

    parent..addEventListener('click', e=> {
      console.log('parent click3')
    })
    // parent click1
  ```

### 阻止默认行为

`e.preventDefault()`： 阻止浏览器标签的一些默认行为，比如说a标签

```js
// html
<a href="" id="a"/>

// js

const a = document.getElementById('a')

a.addEventListener('click', e => {
  console.log('1111')
  e.preventDefault()
})
// 1111
// 点击之后阻断了跳转操作
```

### 兼容性

+ attachEvent: 兼容IE7、IE8；不支持第三个参数来控制在哪个阶段发生，默认是绑定在冒泡阶段

+ addEventListener: 兼容firefox、chrome、IE、Safari、opera、不兼容IE7、IE8

### 绑定事件的运用以及封装一个多浏览器绑定事件函数

1. 大家常见的一个面试题ul + li，点击每个li alert对应的索引

  ```js
    const ul = document.getElementById("ul")

    ul.addEventListener('click', function(e) {
      const target = e.target
      if (target.tagName.toLowerCase() === 'li') {
          const liList = this.querySelectorAll("li")
          const index = Array.prototype.indexOf.call(liList, target)
          alert(`内容为${target.innerHTML}, 索引为${index}`);
      }
    })
  ```
  2. 封装一个多浏览器的绑定事件函数

    ```js
      class BomEvent {
        constructor(element) {
          this.element = element
        }
     
        addEventListener(type, handler) {
          if (this.element.addEventListener) {
            this.element.addEventListener(type, handler)
          } else if(this.element.attachEvent){
            this.element.attachEvent(`on${type}`, function () {
              handler.call(element)
            })
          } else {
            this.element['on' + type] = handler
          }
        }

        removeEvent(type, handler) {
          if (this.element.removeEventListener) {
            this.element.removeEventListener(type, handler)
          } else if(this.element.detachEvent){
            this.element.detachEvent(`on${type}`, function () {
              handler.call(element)
            })
          } else {
            this.element['on' + type] = null
          }
        }
      }

      function stopPropagation(e) {
        if (e.stopPropagation) {
          e.stopPropagation()
        } else {
          e.cancelBubble = true // IE
        }
      }
    ```
### 面试题：

1. 浏览器事件模型包括几个阶段
2. addEventListener 的第三个参数是做什么用的
3. 如何阻止嵌套的元素，点击最内部的元素如何能保证不触发外部的元素的点击事件
4. 捕获和冒泡各自的特征是什么
5. 如果写一个兼容版的事件函数
6. IE中如何阻止冒泡
7. 大家常见的一个面试题ul + li，点击每个li alert对应的索引

## 浏览器事件模型 - ajax及fetch API详解

### XMLHttpRequest

```js
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "http://www.baidu.com")
  xhr.onreadystatechange = function () {
    if (xhr.status === 200) {
      console.log('done')
    } else {
      console.log('error')
    }
  }
  xhr.send()
```

### fetch

1. 默认不带cookie
2. 错误不会reject
3. 不支持超时设置
4. 需要借用AbortController来终止fetch

```js
  fetch('https://www.baidu.com', {
    methods: 'GET'
  })
    .then(res => res.json())
    .then(res => console.log('res', res))
    .catch(error => console.error(error))
  // 错误不会reject.fetch.catch不会捕获4xx，5xx的错误，只会在网络环境出现问题的时候才会进入

  // 错误不会reject解决办法

  fetch('https://www.baidu.com', {
    methods: 'GET'
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        console.log('4xx')
      }
    })
    .then(res => console.log('res', res))
    .catch(error => console.error(error))
  
  // 不支持超时设置解决办法

  function fetchTimeout(url,options, timeout = 3000) {
    return new Promise((resolve, reject) => {
      fetch(url, options).then(resolve).catch(reject)
      setTimeout(reject, timeout)
    })
  }

  // fetch原生不支持中断请求解决办法

  const controller = new AbortController()

  fetch('http://www.baidu.com', {
    method: 'GET',
    signal: controller.signal
  })
    .then(res => res.json())
    .then(res => console.log('res', res))
    .catch(error => console.error(error))
  
  controller.abort()

```

### 常见的浏览器请求/响应头/错误码解析

### request header 请求头

1. :method - 请求方式 post
2. :path - 请求地址，相当于location.pathname
3. :scheme - 
4. accept
5. accept-encoding
6. accept-control
7. cookie
8. origin
9. referer
10. user-agent

### response header

1. access-control-allow-credential
2. access-control-allow-origin
3. content-encoding
4. content-type
5. date
6. set-cookie
7. status