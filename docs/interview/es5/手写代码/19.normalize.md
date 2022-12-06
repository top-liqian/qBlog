# 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据 - 阿里

问题描述：

字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。

示例一: 'abc' --> { value: 'abc' }

示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

解法1: 正则匹配使用reduce方法

```js
const str1 = 'abc'
const str2 = '[abc[bcd[def]]]'


function normalize(str) {
    let obj = {}
    let flag = null
    const setValue = function (obj = {}, value) {
        obj.value = value
        return obj
    }
    str.replace(/([a-z])+/g, ($1) => {
        if (flag !== null) {
            flag.children = {}
        }
        flag = setValue(flag === null ? obj : flag.children, $1)
    })

    return obj
}

const result1 = normalize(str1)
const result2 = normalize(str2)

console.log('result', result1, result2)
```

解法2： string通过split转换成数组进行reduce

```js
const str1 = 'abc'
const str2 = '[abc[bcd[def]]]'


const normalize = (str) => {
    let result = {}
    str.split(/\[|\]/g).filter(Boolean).reduce((obj, value, index, arr) => {
        obj.value = value
        if (index !== arr.length - 1) {
            console.log('obj', obj)
            return obj.children = {}
        }
    }, result)

    return result
}

const result1 = normalize(str1)
const result2 = normalize(str2)

console.log('result', result1, result2)
```