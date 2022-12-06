# string相关的面试题

## 1. 如何判断字符串包含某个子串

```js
String.prototype.includes();

String.prototype.IndexOf = function (searchValue, fromIndex) {
  const string = this;
  const len = string.length;

  // 默认值为 0
  let n = fromIndex | 0;
  // 如果 fromIndex 的值小于 0，或者大于 str.length ，那么查找分别从 0 和str.length 开始
  let k = n <= 0 ? 0 : n >= len ? len : n;
  while (k < len) {
    const subStr = string.substring(k, k + searchValue.length);
    if (subStr === searchValue) {
      return k;
    }
    k++;
  }
  return -1;
};

console.log("hello world".IndexOf("ll") + "/" + "hello world".indexOf("ll"));
console.log(
  "hello world".IndexOf("ll", -1) + "/" + "hello world".indexOf("ll", -1)
);
console.log(
  "hello world".IndexOf("or", -6) + "/" + "hello world".indexOf("or", -6)
);
console.log(
  "hello world".IndexOf("wo", 12) + "/" + "hello world".indexOf("wo", 12)
);
```

## 2. 使用 JS 如何生成一个随机字符串

```js
const random = (n) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + n);

random();
// => "c1gdm2"
random();
// => "oir5pp"
```

## 3. 如何把字符串全部转化为小写格式

```js
// ES5
const convert = (str) => str.replace(/[A-Z]/g, (l) => l.toLowerCase());

// ES6
String.prototype.toLowerCase()
```