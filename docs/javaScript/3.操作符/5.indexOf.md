### indexOf

<div style="color: red;">indexOf有两种</div>

#### 一、 String.prototype.indexOf

> 返回调用它的```String```对象中第一次出现的指定值的索引，从```fromIndex```处进行搜索。如果没有找到这个值，则返回```-1```

<span style="font-weight: 600;">语法：</span> ```String.prototype.indexOf(searchValue, fromIndex)```

<span style="font-weight: 600;">参数：</span>

+ searchValue： 要被查找的字符串，没有提供这个值会被设置成```undefined```
+ fromIndex： 开始索引，任意整数，默认值为0

<span style="font-weight: 600;">返回值：</span>

+ ```searchValue```从```fromIndex```处没有被找到返回```-1```
+ ```searchValue```为```''```且```fromIndex```小于```str.length```，返回```fromIndex```值
+ ```fromIndex```大于```str.length```，返回```str.length```

手动代码实现

<span style="font-weight: 600;">解法1: 正则</span>

```js
  function sIndexOf(str, searchValue = undefined, fromIndex = 0) {
    const length = str.length
    while (searchValue.length) {
      if (fromIndex > length) return str.length
      if (fromIndex < 0) fromIndex = 0
      var reg = new RegExp(`${searchValue}`, 'ig')
      reg.lastIndex = fromIndex
      const result = reg.exec(str)
      return result ? result.index : -1
    }
    return fromIndex <= length ? fromIndex : str.length
  }
```
<span style="font-weight: 600;">解法2: 遍历</span>


#### 二、 Array.prototype.indexOf

> 回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1

<span style="font-weight: 600;">语法：</span> ```Array.prototype.indexOf(searchValue, fromIndex)```

<span style="font-weight: 600;">参数：</span>

+ searchValue： 要被查找的字符串
+ fromIndex： 开始索引，任意整数，默认值为0

<span style="font-weight: 600;">返回值：</span>

+ ```searchValue```从```fromIndex```处没有被找到返回```-1```
+ ```fromIndex```大于```str.length```，返回```-1```
+ 如果```fromIndex```是一个负值，则将其作为数组末尾的一个抵消，即```-1```从数组最后一位开始找

手动代码实现

```js
  function aindexOf (arr, searchValue, fromIndex = 0) {
    var length = arr.length

    if (fromIndex >= length || length === 0) return -1

    if (Math.abs(fromIndex) === Infinity) fromIndex = 0
    
    fromIndex = Math.max(fromIndex >= 0 ? fromIndex : length - Math.abs(fromIndex), 0);
    
    for (let i = fromIndex; i < arr.length; i++) {
      if (arr[i] === searchValue) {
        return i
      }
    }
    return -1
  } 
```
判断以上两种类型

```js
  function indexOf(items, item, fromIndex = 0) {
    let isArray = Array.isArray(items);
    let isString = Object.prototype.toString.call(items) == '[object String]';
    if (!isArray && !isString) throw new SyntaxError();
    if(isArray) return sIndexOf(items, item, fromIndex)
    else return aIndexOf(items, item, fromIndex)
 }
```

[用最简洁代码实现 indexOf 方法](https://github.com/sisterAn/JavaScript-Algorithms/issues/58)