# 数组去重

1. es6方法的Set

```js
const unique = arr => [...new Set(arr)]
```

2. ES5的reduce

```js
const unique1 = arr => {
    return arr.reduce((pre, cru, index, arr) => {
        if (!pre.includes(cru)) pre.push(cru)
        return pre
    }, [])
}
```

3. ES5的filter

```js
const unique2 = arr => arr.filter((el, index, array) => array.indexOf(el) === index)
```

4. 正则匹配

```js
const unique3 = arr => {
    let array = []
    const str = arr.sort().join('')
    str.replace(/(\s|\S)/g, (_, $1) => { 
        if (!array.includes($1)) array.push($1) 
    })
    return array
}
```

5. 利用哈希表数据结构记录出现过的数据

```js
const unique4 = arr => {
    let obj = {}
    let array = []
    for (let i = 0; i < arr.length; i++) {
        if (!(arr[i] in obj)) array.push(arr[i])
        obj[arr[i]] = arr[i]
    }
    return array
}

// 时间复杂度: O(n), n 为数组元素个数
// 空间复杂度: O(n)
```

6. 利用有序数组去重，使用快慢指针的放法
```js
const unique6 = arr => {
    arr.sort()
    let i = 0
    let j = 1
    while(i < arr.length) {
        if (arr[i+1] !== arr[i]) {
            arr[j] = arr[i+1]
            j += 1
        }
        i += 1
    }
    return arr.slice(0, j-1)
}

// 时间复杂度: O(n*logn)
// 空间复杂度: O(1)
```