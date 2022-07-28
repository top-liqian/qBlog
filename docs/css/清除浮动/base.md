# 清除浮动

一般不含包裹属性的div内部有浮动元素的话，那么这个浮动元素会让此div的高度塌陷。

```html
<style>

</style>
<div class="box">
  <img class="l" src="mm1.jpg" />
</div>
```

## 解决办法

1. ::after + content(目前适用于所有浏览器的通用写法)

兼容性： IE8+和其他所有现代浏览器
IE6/IE7： 使用IE私有的zoom缩放属性让div远离浮动的破坏

```css
.fix { *zoom:1; }
.fix::after{ 
    display: block; 
    content:"clear"; 
    height:0; 
    clear:both; 
    overflow:hidden;
    visibility:hidden;
}
```