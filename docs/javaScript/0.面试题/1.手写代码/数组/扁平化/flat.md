## 数组扁平化

<div style="color: red;">ES5的方式1: arr.some + concat</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12,, [13,14]]]]]

  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
```
<div style="font-weight: 600;margin-bottom:20px;">优点：可以完美的还原数组，对于[1,,2]也可以处理</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：性能不高</div>

<div style="color: red;">ES5的方式2: 正则</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12, [13,14]]]]]
  arr = JSON.stringify(arr).replace(/\[|\]/g, '').split(',')
```
<div style="font-weight: 600;margin-bottom:20px;">优点：性能好</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：对于[1,,2]会处理成[1, null, 2]</div>

<div style="color: red;">ES6的方式</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12, [13,14]]]]]
  arr.flat(Infinity)
```

<div style="font-weight: 600;margin-bottom:20px;">优点：语法简便</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：对于[1,,2]会处理成[1, 2]</div>

<div style="color: red;">ES5的方式3: 使用reduce方法</div>

```js
var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12, [13,14]]]]]

function flattenDeep (arr) {
  return Array.isArray(arr)
   ? arr.reduce((acc, cru) => [...acc, ...flattenDeep(cru)], [])
   : [arr]
}

const result = flattenDeep(arr)

console.log(result)
```

<div style="color: red;">4. 栈</div>

```js
function flatStack(arr) {
  const result = []
  const stack = [...arr]
  while(stack.length !== 0) {
    const val = stack.pop()
    if (Array.isArray(val)) {
        stack.push(...val)
    } else {
        result.unshift(val)
    }
  }
  return result
}
```

## forEach方法

```js
function flatten(arr) {
  const result = [];

  arr.forEach((i) => {
    if (Array.isArray(i))
      result.push(...flatten(i));
    else
      result.push(i);
  })

  return result;
}

// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];

flatten(problem); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

```

## 手动实现数组的flat函数

```js
function flat(arr, depth = 1) {
  return depth > 0
  ? arr.reduce((acc, cur) => {
    if(Array.isArray(cur)) {
        return [...acc, ...flat(cur, depth-1)]
    }
    return [...acc, cur]
  } , [])
  : arr
}
```