# 数组相关的面试题

## 1. 列出对数组产生副作用和没有副作用的方法
   
产生副作用的方法（改变了原来的数组）：```pop()、push() 、reverse() 、shift()、unshift()、sort()、splice()、map()、```

没有副作用的方法（原来数组不变）：```concat()、join()、slice()、toString()、toLocaleString()、valueOf()、reduce()、some()、every()、filter()、forEach()```

## 2. 在 js 中如何把类数组转化为数组

类数组: 如果一个对象有 length 属性值, 则它就是类数组;

常见的类数组：这在 DOM 中甚为常见，如各种元素检索 API 返回的都是类数组，如 document.getElementsByTagName，document.querySelectorAll 等等。除了 DOM API 中，常见的 function 中的 arguments 也是类数组

如何进行转换呢？

最靠谱的3种方式

+ Array.from(arrayLike);
+ Array.apply(null, arrayLike);
+ Array.prototype.concat.apply([], arrayLike);

以下几种方式需要考虑稀疏数组的转化

+ Array.prototype.filter.call(divs, (x) => 1);
+ Array.prototype.map.call(arrayLike, (x) => x);
+ Array.prototype.filter.call(arrayLike, (x) => 1);

## 3. 如何生成100个元素为1的数组呢？

1. Array.from(Array(100), x => 1)
2. Array.apply(null, Array(100)).map(x => 1)
3. Array(100).fill(1)

## 4. 如何在 url 中传递数组

在 URL 中如何传递数组这种复杂的数据，完全取决于项目中前后端成员关于复杂数据在 URL 中传输的约定，一般情况下可以使用以下方式来传递数组

```js
a=3&a=4&a=5

a=3,4,5

a[]=3&a[]=4&a[]=5

a[0]=3&a[1]=4&a[2]=5
```

## 5. 什么是 TypedArray

ArrayBuffer，二进制数组

## 6. js 中什么是可选链操作符，如何访问数组

`?. 操作符`，可以嵌套获取对象的属性值。通过获取对象属性获得的值可能是 `undefined 或 null` 时，可选链操作符提供了一种方法来简化被连接对象的值访问

```js
const obj = { a: [1, 2], b() {} };
// 访问数组
obj?.a?.[0];
//使用方法
obj?.b?.();
```