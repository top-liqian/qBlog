# css相关的面试题

## 一、盒子模型

### 1. 盒模型宽度计算

普通的盒模型： `box-sizing: content-box;`， width只包含内容宽度 `offsetWidth = (width + padding + border)`

怪异盒模型： `box-sizing: border-box;`， `width = offsetWidth = (width + padding + border)`

### 2. margin纵向重叠

margin纵向重叠取重叠区最大值，不进行叠加

### 3. margin的负值问题

margin-top：元素会向上移动
margin-left：元素会向左移动
margin-right: 右侧元素左移，自身不受影响
margin-bottom: 下侧元素上移，自身不受影响

### 4. BFC是什么? 哪些属性可以构成一个BFC呢?

块级格式化上下文，一块独立渲染的区域，内部元素的渲染不会影响边界以外的元素

形成BFC的条件：

1. float不设置成none
2. position是absolute或者fixed
3. overflow 不是visible
4. display是flex 或者 inline-block
5. 应用清除浮动

### 5. float

### 6. 手写clearfix

一般不含包裹属性的div内部有浮动元素的话，那么这个浮动元素会让此div的高度塌陷。

```css
/* 1. 父级定义伪类 目前适用于所有浏览器的通用写法 */
.clearfix::after { content: ''; display: table; clear: both; }
.clearfix { *zoom: 1; /* 兼容IE6/7浏览器 */ }

/* 2. 父级标签 overflow */
.clearfix { overflow: hidden; }

/* 2. 添加空的div标签 */
.clearfix { clear: both; }
```

### 7. 样式单位

1. em: 相对于自身字体大小的单位
2. rem: 相对于html标签字体大小的单位
3. vh： 相对于视口高度大小的单位， 20vh == 视口高度/10020
4. vw: 相对于视口宽度大小的单位，20vh == 视口宽度/10020

## 二、重排（回流）、重绘和合成

回流⼀定触发重绘，重绘不⼀定触发回流，重绘开销⼩，回流代价⾼


### 1. 重排（回流）

渲染树中部分或者全部元素的尺寸、结构或属性变化，浏览器就重新渲染部分或全部文档

触发回流的操作行为：
1. 初次渲染
2. 窗口大小改变（resize事件）
3. 元素属性、尺寸、位置、内容改变
4. 元素字体大小发生变化
5. 添加/删除可见dom元素
6. 激活css伪类（如 hover）
7. 查询某些属性/调用某些方法，会刷新渲染队列，如果要使用最好将值缓存起来
   + clientWidth、clientHeight、clientTop、clientLeft
   + offsetWidth、offsetHeight、offsetTop、offsetLeft
   + scrollWidth、scrollHeight、scrollTop、scrollLeft
   + getComputedStyle
   + getBoundingClientRect
   + scrollTo

### 2. 重绘

某些元素的样式如颜色改变，但是不影响它在文档流中的位置，浏览器会对元素重新绘制，不再执行布局阶段，直接进入绘制阶段

### 3. 如何进行绘制优化

1. 最小化重绘和重排：样式集中处理，使用添加新样式类名
2. 使用absolute或者fixed脱离文档流
3. 开启GPU加速，利用css属性transform opacity will-change等，tansform属性不会触发重绘和重排，使浏览器为元素创建⼀个GPU图层，这使得动画元素在⼀个独立的层中进行渲染，当元素内容没有改变就没必要进⾏渲染
4. 使用visibility替换display:none，前者重绘，后者回流
5. 尽量不使用table布局
6. 动画实现酥服越快，回流次数越多，也可以选择使⽤requestAnimationFrame
7. 通过documentFragment创建⼀个DOM⽂档⽚段，在它上⾯批量操作DOM，完成后再添加到文档中，只触发⼀次回流

## 三、垂直居中

1. 元素定宽定高
   + absolute + margin：0 auto；
   + absolute + calc
   + 利用绝对定位 + 设置 left和top 50% + margin-left和margin-top 以子元素一半宽高进行负值赋值
2. 元素不定宽高
   + 利用绝对定位 + 设置 left和top 50%  + transform：translate(-50%, -50%)
   + line-height: initial
   + writing-mode: vertical-lr 改变文字的显示方向
   + 使用flex + align-item: center;
   + grid + align-items
3. 内联元素
   + 单行文本父元素确认高度 height === line-height
   + 多行文本父元素确认高度 display: table-cell; vertical-align:middle

4. 块级元素

   1. `display: flex; align-items: center;`, 不适用IE浏览器
      
   2. 绝对定位`position: absolute; left: 0; right: 0; top: 0; bottom: 0;`+ `margin: auto;`, 不适用移动端使用, 但是对IE友好

   3. 父元素 `display: table;`、子元素 `display: table-cell; vertical-align: middle;`

   4. 父元素 `display: table-cell; vertical-align: middle;`
      
   5. 多行文字垂直居中：父元素 `display: table-cell; vertical-align: middle;` 子元素 `display: inline-block;vertical-align: middle;`

   6. child固定尺寸使用绝对定位：父元素 `position: relative;` 子元素 `position: absolute; height: 20px; width: 20px; top: 50%;left: 50%; margin-top: -10px;margin-left: -10px;`

   7. 元素尺寸不定：父元素 `position: relative;` 子元素 `position: absolute; top: 50%;left: 50%; transform: translate(-50%, -50%);`

   8. 利用伪元素： 父元素 `text-align: center;` 子元素 `display: inline-block; vertical-align: middle;` 父元素的伪类 `.p::before {content: ''; height: 100%; display: inline-block; vertical-align: middle;}`

   9. child固定尺寸使用计算属性calc: `width: 100px;height: 100px;  padding: -webkit-calc((100% - 100px) / 2);  padding: -moz-calc((100% - 100px) / 2);  padding: -ms-calc((100% - 100px) / 2); padding: calc((100% - 100px) / 2); background-clip: content-box;`

   10. 改成块内元素：`display: inline-block; vertical-align: middle;`

## 四、水平居中

+ absolute + margin：0 auto；
+ 利用绝对定位 + 设置 left和top 50%  + transform：translate(-50%, -50%)
+ flex
+ grid 

## 五、垂直水平居中

1. flex
2. 绝对定位的方式
3. grid布局方式 `.container { display: grid; place-content: center; }`

## 六、文本溢出

### 1. 单行省略

```css
.ellisple { 
   overflow: hidden; 
   white-space: nowrap; /* 设置⽂本不换⾏ */
   text-overflow: ellipsis; /** 对象内⽂本ფ出时显示... */
}
```

### 2. 多行省略

```css
.ellisple {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}
```

## 七、z-index

### 1. 父子级z-index层级关系

1. 当父元素设置了z-index,无论子元素设多小都会浮在父元素上面
2. 父元素的z-index >= 兄弟组件的z-index， 子元素z-index比父元素同级组件高，会浮在所有元素上面
3. 父元素的z-index < 兄弟组件的z-index, 子元素z-index无论多高都会在最下面

### 2. z-indexde压盖顺序

1. 只有定位元素(position属性明确为absolute、fixed或relative)可使⽤z-index
2. 如果z-index值相同，html结果在后⾯的ܴ盖֘在前⾯的
3. ⽗⼦都有z-index，⽗亲z-index数值⼩时，⼉⼦数值再⼤也没用

## 八、margin和padding的值为百分比

当 padding padding 属性值为百分⽐的时候，如果⽗元素有宽度，相对于⽗元素宽度，如果没有，找其⽗辈元素的宽度，均没设宽度时，相对于屏幕的宽度。

为什么是相对width？

正常流中的⼤多数元素都会⾜够⾼以包含其后代元素（包括外边距），如果⼀个元素的上下外边距时⽗元素的 height 的百分数，就可能导致⼀个⽆限循环，⽗元素的 height 会增加，以适应后代元素上下外边距的增加，⽽相应的，上下外边距因为⽗元素 height 的增加也会增加，如此循环。

## 九、link和@import的区别

1. 语法不同
2. @import是 CSS 提供的语法规则，只有导⼊样式表的作⽤；link是HTML提供的标签，不仅可以加载 CSS ⽂件，还可以定义 RSS、rel 连接属性等
3. 加载顺序： 加载⻚⾯时，link标签引⼊会和 html 同时加载；⽽ @import 引⼊的 CSS 将在⻚⾯加载完毕后被加载。
4. 兼容性区别：@import是 CSS2.1 才有的语法，可在 IE5+ 才能识别；link标签作为 HTML 元素，不存在兼容性问题
5. DOM的操作性：可以通过 JS 操作 DOM ，插⼊link标签来改变样式；由于 DOM ⽅法是基于⽂໩的，⽆法使⽤@import的⽅式插⼊样式。
6. 权重：link⽅式的样式权重⾼于@import的权重

## 十、src和href的区别

src：⽤于替换当前元素，指向的内容将会嵌⼊到文档中当前标签所在位置；在请求 src资源时会将其指向的资源下载并应⽤到文档内；当浏览器解析到该元素时，浏览器会对这个⽂件进⾏解析，编译和执⾏，从⽽导致整个⻚⾯加
载会被暂停，类似于将所指向资源嵌⼊当前标签内。这也是为什么将js 脚本放在底部⽽不是头部。

href：⽤于在当前⽂档和引⽤资源之间确⽴联系；指向网络资源所在位置，建⽴和当前元素（锚点）或当前文档（链接）之间的链接，浏览器遇到 href 就会并⾏下载资源并且不会停⽌对当前文档的处理。 

src 代表这个资源是必备的，必不可少的，最终会嵌⼊到⻚⾯中，⽽ href 是资源的链接

## 十一、scss的理解

1. scss支持属性嵌套
2. 支持定义变量
3. 支持混合语法 定义@mixin， 在属性中使用@include
4. 支持继承 @extend .A

## 十二、HTML⻚⾯中 id 和 class 有什么区别？

1. id唯一、目前浏览器也支持多个相同id能够正常展示买单时通过js操作DOM就会出现问题，class可以反复使用
2. id主要用于区分不同结构和内容，class作为一个样式可以应用到任何结构和内容
   
## 十三、隐藏元素的方法

1. display: none：渲染树不会包含该渲染对象，因此该元素不会在⻚⾯中占据位置，也不会响应绑定的监听事件。
2. visibility: hidden：元素在⻚⾯中仍占据空间，但是不会响应绑定的监听事件。
3. opacity: 0：将元素的透明度设置为0，以此来实现元素的隐藏。元素在⻚⾯中仍然占据空间，并且能够响应元素绑定的监听事件。
4. position: absolute：通过使⽤绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
5. z-index: 负值：来使其他元素֘覆盖该元素，以此来实现隐藏。
6. clip/clip-path：使⽤元素裁剪⽅法来实现元素的隐藏，这种⽅法下，元素仍在⻚⾯中占据位置，但是不会响应绑定的监听事件。
7. transform: scale(0,0)：将元素缩放为0，来实现元素的隐藏。这种⽅法下，元素仍在⻚⾯中占据位置，但是不会响应绑定的监听事件

## 十四、display: none与 visibility: hidden的区别

1. 是否在渲染数中：display 会让元素完全从渲染树中消失，渲染时不会占据任何空间；visibility则相反
2. 继承性：display是⾮继承属性，⼦孙节点会随着⽗节点从渲染树消失，通过修改子孙节点的属性也⽆法显示；visibility相反，⼦孙节点消失是由于继承了hidden，通过设置 visibility: visible可以让子孙节点显示；
3. 修改常规文档中元素的 display 通常会造成文档的重排，但是修改 visibility 属性只会造成本元素的重绘

## 十五、使chrome支持12px以下的文字

1. 使用zoom：50% / 0.5;
2. 使用 -webkit-transform: scale(0.3)

## 十六、flex布局

## 十七、postion属性大概讲一下, static是什么表现? static在文档流里吗?

## 十八、css 三列等宽布局如何实现? flex 1是代表什么意思？分别有哪些属性?