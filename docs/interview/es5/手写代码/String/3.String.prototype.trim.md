# 手动实现字符串去除空格 - trim()

trim() 方法会从一个字符串的两端删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR等）。

trim() 方法返回一个从两头去掉空白字符的字符串，并不影响原字符串本身。

```js
const str = '   lala    lala    '

function myTrim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

const result = myTrim(str)

console.log('result', result)
```

标准写法如下：

```js
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
```

# 手动去除字符串中所有的空格

```js
const str = '   lala    lala    '

function myTrim1(str) {
    return str.replace(/[\s\uFEFF\xA0]*/g, '')
}

const result = myTrim1(str)

console.log('result', result)
```