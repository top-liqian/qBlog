# JSON.stringify

## 简介

**JSON.stringify()**方法将一个 JavaScript 对象或值转换为 JSON 字符串，如果指定了一个 replacer 函数，则可以选择性地替换值，或者指定的 replacer 是数组，则可选择性地仅包含数组指定的属性。

##  语法

JSON.stringify(value[, replacer [, space]])

+ value：将要序列化成 一个 JSON 字符串的值。
+ replacer可选: 
  1. 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
  2. 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
  3. 如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。
+ space可选: 
  1. 指定缩进用的空白字符串，用于美化输出（pretty-print）；
  2. 如果参数是个数字，它代表有多少的空格；上限为10。
  3. 该值若小于1，则意味着没有空格；
  4. 如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
  5. 如果该参数没有提供（或者为 null），将没有空格。

## 返回值

一个表示给定值的JSON字符串。

+ 当在循环引用时会抛出异常TypeError ("cyclic object value")（循环对象值）
+ 当尝试去转换 **BigInt** 类型的值会抛出**TypeError **("BigInt value can't be serialized in JSON")**（BigInt值不能JSON序列化）**

## 9大特性要记住

### 特性一

1. undefined、任意的函数以及symbol值，出现在非数组对象的属性值中时在序列化过程中会被忽略
2. undefined、任意的函数以及symbol值出现在数组中时会被转换成 null。
3. undefined、任意的函数以及symbol值被单独转换时，会返回 undefined

```js
const s = { name: 'li', age: undefined, sex: 'femal', getName(name) { return name }, SymbolName: Symbol('li')}

console.log(JSON.stringify(s)) // '{"name": "li", "sex": "femal"}'

console.log(JSON.stringify([1, undefined, function getName(name) { return name }, Symbol('li') ])) // '["1", null, null, null]'

console.log(JSON.stringify(Symbol(1)) // undefined
```

### 特性二

**布尔值、数字、字符串**的**包装对象**在序列化过程中会自动转换成对应的原始值。

```js
console.log(JSON.stringify([new String('string'), new Number(1), new Boolean('1')])) // '["string", 1, true]'
```

### 特性三

所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们

```js
console.log(JSON.stringify({
  [Symbol('lq')]: 'lq'}
)) 
// '{}'
console.log(JSON.stringify({
  [ Symbol('lq') ]: 'lq',
}, (key, value) => {
  if (typeof key === 'symbol') {
    return value
  }
}))
// undefined
```

### 特性四

**NaN和Infinity格式的数值及null**都会被当做 null

### 特性五

转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。

```js
const s = {
    name: 'li',
    toJSON() {
        return 'this is real tostringify' 
    }
}
console.log(JSON.stringify(s)) // "this is real tostringify"
```

### 特性六

Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。

```js
const d = new Date()
console.log(d.toJSON()) // 2021-10-05T14:01:23.932Z
console.log(JSON.stringify(d)) // "2021-10-05T14:01:23.932Z"
```

### 特性七

```js
let cyclicObj = {
  name: '前端胖头鱼',
}

cyclicObj.obj = cyclicObj

console.log(JSON.stringify(cyclicObj))
// Converting circular structure to JSON
```

### 特性八

其他类型的对象，包括 **Map/Set/WeakMap/WeakSet**，仅会序列化可枚举的属性

```js
let enumerableObj = {}

Object.defineProperties(enumerableObj, {
  name: {
    value: '前端胖头鱼',
    enumerable: true
  },
  sex: {
    value: 'boy',
    enumerable: false
  },
})

console.log(JSON.stringify(enumerableObj))
// '{"name":"前端胖头鱼"}'
```

### 特性九

当尝试去转换 BigInt 类型的值会抛出错误

```js
const alsoHuge = BigInt(9007199254740991)

console.log(JSON.stringify(alsoHuge))
// TypeError: Do not know how to serialize a BigInt
```

## 手写一个JSON.stringify

```js
function jsontoStringify(data) {
    // 判断对象是否存在循环引用

    const isCyclic = (obj) => {
        let detected = false
        const stackSet = new Set()

        const detect = (obj) => {
            // 不是对象类型的话，可以直接跳过
            if (obj && typeof obj != 'object') {
                return
            }
            if (stackSet.has(obj)) {
                return detected = true
            }
    
            stackSet.add(obj)
    
            for(let key in obj) {
                // 对obj下的属性进行挨个检测
                if (obj.hasOwnProperty(key)) {
                    detect(obj[key])
                }
            }
            // 平级检测完成之后，将当前对象删除，防止误判
            stackSet.delete(obj)
        }
        detect(obj)
        return detected
    }

    // 特性1：对于包含循环引用的对象（对象之间相互引用，造成无限循环）使用这个方法的时候会抛出错误
    if(isCyclic(data)) {
        throw new Error('Convering circular structure to JSON')
    }

    // 特性2: 对于BigInt类型的数据进行转换的过程中会抛出错误
    if (typeof data === 'bigint') {
        throw new Error('Do not konw how to trun to bigint')
    }

    const type = typeof data
    const commonKeys = ['undefined', 'symbol', 'function']
    const getType = s => Object.prototype.toString.call(s).replace(/\[object (.*?)\]/g, '$1').toLowerCase()

    // 非对象
    if (type !== 'object' || data === null) {
        let result = data
        // 特性3: 对于NAN，null，Infinity执行该方法时都会被转换成null
        if([NaN, null,  Infinity].includes(data)) {
            result = null
        } else if(commonKeys.includes(type)) { // 特性4: 'undefined', 'Symbol', 'function'单独转换的时候会返回undefined
            return undefined
        } else if (type === 'string') {
            result = `"${data}"`
        }
        return String(result)
    } else if (type === 'object') {
        // 特性5: 如果对象具有toJSON函数，函数的返回值就是要序列化的值
        // 特性6: 对于日期date调用了toJSON将其转换成了字符串，相当于执行了Date.toISOString，因此会被当作 字符串处理
        if (data.toJSON) {
            return jsontoStringify(data.toJSON())
        } else if (Array.isArray(data)) {
            // 特性4: 'undefined', 'Symbol', 'function在数组当中会被转换成null
            let result = data.map(it => commonKeys.includes(typeof it) ? 'null' : jsontoStringify(it))
            return `[${result}]`.replace(/'/g, '"')
        } else {
            // 特性7: number，string， boolean的包装对象在序列化的过程中会自动转换成其原始值
            if (['number', 'boolean'].includes(getType(data))) {
                return String(data)
            } else if(getType(data) === 'string') {
                return `"${data}"`
            } else {
                let result = []
                // 特性8: 对于Map/Set/WeakMap/WeakSet，只会序列化可枚举类型
                Object.keys(data).forEach(key => {
                    // 特性9: 对于Symbol类型的值即使使用replacer函数进行值的替换，序列化的过程中仍然会忽略掉
                    if(typeof key !== 'symbol') {
                        const value = data[key] 
                        // 特性4: 'undefined', 'Symbol', 'function在非数组对象当中会被忽略
                        if (!commonKeys.includes(typeof value)) {
                            result.push(`"${key}":${jsontoStringify(value)}`)
                        }
                    }
                })
                return `{${result}}`.replace(/'/g, '"')
            }
        }

    }
}
```