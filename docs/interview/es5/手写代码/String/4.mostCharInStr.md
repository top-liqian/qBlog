# 一个字符串里出现最多的字符是什么，以及出现次数?

```js
const str = 'dsfshkgfareasfd'
const str1 = '11122222255555555'
const str2 = '                 11122222255555555'


function mostCharInStr(str) {
  const s = str.split('')
  const map = new Map()
  let max = 0 
  let char = null

  for(let i = 0; i < s.length; i++) {
    const result = map.get(s[i])
    char = result >= max ? s[i] : char
    max = result >= max ? result + 1 : max
    map.set(s[i], result ? result + 1 : 1)
  }

  return { max, char }
}

function mostCharInStr1(str) {
  const s = str.split('').sort().join('')
  let max = 0
  let char = null

  s.replace(/(\w)\1+/g, function($0, $1, $2){
    console.log($0, $1, $2)
    if (max < $0.length) {
        max = $0.length
        char = $1
    };
  });
  return { max, char }
}

const result = mostCharInStr(str)
const result1 = mostCharInStr(str1)
const result2 = mostCharInStr(str2)

const r = mostCharInStr1(str)

console.log(result, result1, result2)

console.log(r)
```