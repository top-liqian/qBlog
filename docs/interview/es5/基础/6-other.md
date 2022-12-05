# 面试题合集

## 1. 如何裁剪图片 (情景：选择头像)

使用canvas进行

```js
var path = 'https://static-zh.wxb.com.cn/customer/form/2020/11/1758696796d.jpg'
function clipImage(path){
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')
    img.src = path
    img.setAttribute("crossOrigin",'Anonymous')
    img.onload = function (){
        ctx.drawImage(this,0,0,200,100)
        console.log(canvas.toDataURL())
    }
}
clipImage(path)
```

## 2. 有没有遇到 js 捕捉不到异常堆栈信息的情况

网络错误，就捕捉不到

## 3. 使用 js 实现一个 lru cache 

```js
// 可以借助Map实现

class LRUCache {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.limit) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

// ["LRUCache","put","put","get","put","get","put","get","get","get"]
// [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
const lruCache = new LRUCache(2);
lruCache.put(1, 1);
lruCache.put(2, 2);
const res1 = lruCache.get(1);
lruCache.put(3, 3);
const res2 = lruCache.get(2);
lruCache.put(4, 4);
const res3 = lruCache.get(1);
const res4 = lruCache.get(3);
const res5 = lruCache.get(4);

console.log(res1, res2, res3, res4, res5);
// 1 undefined undefined 3 4
```

## 4. 有没有做过裁剪头像图片的需求，如何实现

clip-path: circle(40%)

## 5. js 如何全部替代一个子串为另一个子串

```js
str.split('foo').join('bar')
str.replaceAll('foo', 'bar') // 在 ESNext 中，目前支持性不好
```

## 6. 浏览器的剪切板中如何监听复制事件

```html
<input oncopy="cb" />
```

```js
document.querySelector("p").oncopy = cb;
document.oncopy = cb;

document.querySelector("p").addEventListener("copy", cb);
document.addEventListener("copy", cb);
```

## 7. v8 是如何执行一段 JS 代码的

v8在执行一段JS代码的过程中使用了`Parser（解析器）、Ignition（解释器） 和TurboFan（编译器）`

+ 1. Parser将源代码生成抽象语法树：在Chrome中开始下载Javascript文件后，Parser就会开始并行在单独的线程上解析代码，可以在下载完成后仅几毫秒内完成，并生成AST，AST是把代码结构化成树状结构表示，这样做是为了更好的让编译器或者解释器理解
+ 2. Ignition（解释器）生成字节码，也就是小型的构建块，些构建块组合到一起构成任何JavaScript功能，字节码比机器码占用更小的内存。字节码不能够直接在处理器上运行，需要通过解释器将其转换为机器码后才能执行。
  - Register Optimizer： 主要是避免寄存器不必要的加载和存储；
  - Peephole Optimizer： 寻找直接码中可以复用的部分，并进行合并；
  - Dead-code Elimination： 删除无用的代码，减少字节码的大小
  通过上面三个过程的优化进一步减小字节码的大小并提高性能，最后Ignition执行优化后的字节码。
+ 3. 执行代码及优化：Ignition执行上一步生成的字节码，并记录代码运行的次数等信息，如果同一段代码执行了很多次，就会被标记为 “HotSpot”（热点代码），然后把这段代码发送给 编译器TurboFan，然后TurboFan把它编译为更高效的机器码储存起来，等到下次再执行到这段代码时，就会用现在的机器码替换原来的字节码进行执行，这样大大提升了代码的执行效率。
另外，当TurboFan判断一段代码不再为热点代码的时候，会执行去优化的过程，把优化的机器码丢掉，然后执行过程回到Ignition。

## 8. 如何实现页面文本不可复制

```js
// 1. css： user-select: none;
// 2. javascript
document.body.onselectstart = (e) => {
  e.preventDefault();
};

document.body.oncopy = (e) => {
  e.preventDefault();
};
```

## 9. 异步加载 JS 脚本时，async 与 defer 有何区别

在正常情况下，即` <script> `没有任何额外属性标记的情况下，有几点共识

+ JS 的脚本分为加载、解析、执行几个步骤，简单对应到图中就是 fetch (加载) 和 execution (解析并执行)
+ JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染，因此 JS 一般放到最后头

而 defer 与 async 的区别如下:

1. 相同点: 异步加载 (fetch)
2. 不同点:
  + async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析；
  + defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)，但会在事件 DomContentLoaded 之前

## 10. 前端如何实现文件上传功能

```html
<input type="file" ref="referenceUpload" @change="onUpload"></input>
<button type="primary" style="margin: 0px 0px 0px -83px;">上传文件</button>
```

读取文件内容 `FileReader API`

```js
function readBlob(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result);
    };
    reader.readAsText(blob);
  });
}

const readBlob = (blob) => new Response(blob).text();
```

## 11. 简单介绍以下浏览器中的 module

```html
<script type="module">
```

模块自动使用严格模式，需要使用 defer 属性，模块会自动延迟加载

## 12. 解构赋值一个数组，a 取第一项默认值为 3，c 取剩下的值组成数组

```js
const list = [1, 2, 3, 4, 5];
const [a = 3, ...c] = list;
```

## 13. 什么是媒体查询，JS 可以监听媒体查询吗

美中媒体类型都具有各自不同的属性，根据不同的媒体类型的媒体特性设置不同的展示风格

js 也支持媒体查询，window.matchMedia()方法