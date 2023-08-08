# 浏览器相关的面试题

## 1. 在前端开发中，如何获取浏览器的唯一标识？

根据 canvas 可以获取浏览器指纹信息

绘制 canvas，获取 base64 的 dataurl
对 dataurl 这个字符串进行 md5 摘要计算，得到指纹信息
若在生产环境使用，可以使用 fingerprintjs2 (opens new window)，根据业务需求，如单设备是否可跨浏览器，以此选择合适的 component

## 2. 什么是CSRF？

CSRF (Cross-site request forgery)，跨站请求伪造，也被称为 one-click attack 或者 session riding，通过恶意引导用户一次点击劫持 cookie 进行攻击。跟跨网站脚本（XSS）相比，XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

## 3. 怎么样避免CSRF的攻击？

1. 使用 JSON API。当进行 CSRF 攻击时，请求体通过 <form> 构建，请求头为 application/www-form-urlencoded。它难以发送 JSON 数据被服务器所理解。
   
2. CSRF Token。生成一个随机的 token，切勿放在 cookie 中，每次请求手动携带该 token 进行校验。
   
3. SameSite Cookie。设置为 Lax 或者 Strict，禁止发送第三方 Cookie。

## 4. 什么是跨域？如何解决跨域（跨越的解决方案）？

`协议，域名，端口`，三者有一不一样，就是`跨域`

常见的解决方案如下：

1. iframe方案

+ 优点：跨域完毕之后DOM操作和互相之间的JavaScript调用都是没有问题的
+ 缺点：如果结果要以URL参数传递在数据量很大的时候就需要分割传递；iframe父页面和iframe本身的交互有安全性限制

2. 采用script标签的方案

+ 优点：可以直接返回json格式的数据，方便处理
+ 缺点：只接受GET请求方式

3. 图片ping

+ 优点：可以访问任何url，一般用来进行点击追踪，做页面分析常用的方法
+ 缺点：不能访问响应文本，只能监听是否响应
  
4. CORS，在服务器端设置几个响应头，如 Access-Control-Allow-Origin: *

```js
location / {
  if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' '*';  
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS'; 
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Headers' 'DNT, X-Mx-ReqToken, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type';  
    add_header 'Access-Control-Max-Age' 86400;  
    add_header 'Content-Type' 'text/plain charset=UTF-8';  
    add_header 'Content-Length' 0;  
    return 200;  
  }
}
```
5. Reverse Proxy，在 nginx/traefik/haproxy 等反向代理服务器中设置为同一域名
   
```nginx
    server {
        listen 80;
        server_name shanyue.tech;

        location / {
          # 避免非root路径404
          try_files $uri $uri/ /index.html;
        }

        # 解决跨域
        location /api {
          # 或者是 http://localhost:8080
          proxy_pass http://api.shanyue.tech;
        }
    }
```
6. 使用JSONP的方式

## 5. JSONP 的原理是什么，如何实现？

JSONP，全称 JSON with Padding，为了解决跨域的问题而出现。只能处理 GET 跨域

JSONP 基于两个原理:

+ 动态创建 script，使用 script.src 加载请求跨过跨域
+ script.src 加载的脚本内容为 JSONP: 即 PADDING(JSON) 格式

使用 JSONP 跨域同样需要服务端的支持, 在请求头部分会多一个callback=padding， 并且响应数据被 padding 包围，这就是 JSONP

```js
$ curl https://shanyue.tech/api/user?id=100&callback=padding

padding({
  "id": 100,
  "name": "shanyue",
  "wechat": "xxxxx",
  "phone": "183xxxxxxxx"
})
```

JSONP的数据处理：padding 就是处理数据的函数。我们只需要在前端实现定义好 padding 函数即可`window.padding = handleData`

简单实现一个JSONP:

```js
// 前端
function stringify (data) {
  const pairs = Object.entries(data)
  const qs = pairs.map(([k, v]) => {
    let noValue = false
    if (v === null || v === undefined || typeof v === 'object') {
      noValue = true
    }
    return `${encodeURIComponent(k)}=${noValue ? '' : encodeURIComponent(v)}`
  }).join('&')
  return qs
}

function jsonp ({ url, onData, params }) {
  const script = document.createElement('script')

  // 一、为了避免全局污染，使用一个随机函数名
  const cbFnName = `JSONP_PADDING_${Math.random().toString().slice(2)}`
  // 二、默认 callback 函数为 cbFnName
  script.src = `${url}?${stringify({ callback: cbFnName, ...params })}`
  // 三、使用 onData 作为 cbFnName 回调函数，接收数据
  window[cbFnName] = onData;

  document.body.appendChild(script)
}

// 发送 JSONP 请求
jsonp({
  url: 'http://localhost:10010',
  params: { id: 10000 },
  onData (data) {
    console.log('Data:', data)
  }
})

// node
const http = require('http')
const url = require('url')
const qs = require('querystring')

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url)
  const params = qs.parse(query)

  const data = { name: 'shanyue', id: params.id }

  if (params.callback) {
    // 服务端将要返回的字符串
    str = `${params.callback}(${JSON.stringify(data)})`
    res.end(str)
  } else {
    res.end()
  }
})

server.listen(10010, () => console.log('Done'))

// 页面调用

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script src="./index.js" type="text/javascript"></script>
  <script type="text/javascript">
  jsonp({
    url: 'http://localhost:10010',
    params: { id: 10000 },
    onData (data) {
      console.log('Data:', data)
    }
  })
  </script>
</body>
</html>
```

## 6. cookie具有那些字段？

+ path
+ domain
+ key
+ value
+ httpOnly
+ simeSite


## 301 302 304的区别

## chrome devtool 如何查看内存情况

## 在没有async await 的时候, koa是怎么实现的洋葱模型?

## 各种缓存的优先级, memory disk http2 push?

## Http 2.0和http3.0对比之前的版本, 分别做了哪些改进?


## HTTP 3.0基于udp的话, 如何保证可靠的传输?

## TCP和UDP最大的区别是什么?

UDP：无连接，不可靠传输，不使用流量控制和拥塞控制，支持一对一，一对多，多对一和多对多交互通信，采用面向报文的传输方式且首部开销小，仅8字节，适用于实时应用，例如视频会议、直播

TCP：面向连接，可靠传输（数据顺序和正确性），使用流量控制和拥塞控制，只能是一对一通信，采用面向字节流的传输方式且首部最小20字节，最大60字节，适用于要求可靠传输的应用，例如文件传输

## CSP除了能防止加载外域脚本, 还能做什么?

## 

