# CSS设置居中的方案总结

## 一、水平居中

### 行内元素

```html
<div class="p">
    <span class="c"></span>
</div>
```

1. `text-align: center`

### 块级元素

```html
<div class="p">
    <span class="c"></span>
</div>
```

1. `margin: auto; text-align: center`

## 二、垂直居中

### 行内元素

1. 当行文字或者图片垂直居中: `height: 100px; line-height: 100px;`

### 块级元素

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