# 移动端布局方案

1. 最简单最直接的方案就是直接用百分比设置元素的尺寸，我们用百分比设置元素大小可以实现元素尺寸的自适应，但是无法实现字体大小的自适应，而且尺寸转化为百分比计算很麻烦，还有就是元素尺寸的高很难相对屏幕宽度设置百分比，针对某种特殊场景可以使用的方案

2. rem是现在主流的移动端自适应布局方案

## rem布局解析

rem是一个相对单位，1rem等于html元素上字体设置的大小。我们只要设置html上font-size的大小，就可以改变rem所代表的大小。这样我们就有了一个可控的统一参考系。
接下来就需要解决两类问题：

1. 设置rem单位所代表的尺寸大小和屏幕宽度成正比，有三种方案

+ 媒体查询, 设定每种屏幕对应的font-size：`@media screen and (min-width:240px) { html: { font-size: 9px; } }`

+ js设置html的font-size大小: `document.documentElement.style.fontSize = document.documentElement.clientWidth / 750 + 'px';`

+ 使用vw设置，vw也是一个相对单位，100vw等于屏幕宽度: `html: { font-size: 10vw;}`

媒体查询方案容易遗漏不同屏幕尺寸设置的字体，vw具有兼容性问题，目前最合适的就是js的方式

2. 单位换算

+ 设置特殊的html的font-size,使rem和标注稿上px容易换算，比如把我们的html的font-size设置成1px，这样1rem就等于1px，因为我们标注稿750px，是基于二倍屏的，1个css单位等于2个实际单位，所以我们的font-size设置为0.5px，这样我们设置尺寸时，rem和标注稿的px，就是1比1映射的

```js
document.documentElement.style.fontSize = document.documentElement.clientWidth / 750 + 'px';
```

+ 通过css预编译或者webpack插件，实时计算 比如，我们将html根元素设置为16px，标注稿上有一个div元素宽度为100px,我们在scss中可以这样写

```scss
$rem: 32rem;

div{
	width: 100/$rem;
}
```