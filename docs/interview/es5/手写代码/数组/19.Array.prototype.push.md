# push

push 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。

# 返回值

数组的新长度

# 注意点

改变原数组

## polyfill

```js
Array.prototype._push = function (...pushEle) {
   const pushEleLen = pushEle.length
   const length = this.length
   let i = 0

    while(i < pushEleLen) {
        this[length + i] = pushEle[i]
        i++
    }
    return this.length
}

const animals = ['pigs', 'goats', 'sheep']
animals._push('cows')

console.log(animals, animals.length) 
// ["pigs", "goats", "sheep", "cows"], 4

animals._push('chickens', 'cats', 'dogs')

console.log(animals, animals.length) 

// ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"], 7
```