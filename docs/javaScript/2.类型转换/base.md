### 显示类型转换与隐示类型转换

#### 规则

一、在 JS 中只有 3 种类型的转换

+ to string

+ to boolean

+ to number

二、对象类型的转换是不同的，但是他们都只会转换成上面 3 种类型之一

#### string类型转换

显示转换规则： String()

隐示转换规则： +运算符与其中一个元素是string类型

注意点： Symbol只能使用显示转换，隐示转换会报错  String(Symbol('symbol'))

示例：
```js
    String(123)        // '123'
    String(-12.3)      // '-12.3'
    String(null)       // 'null'
    String(undefined)  // 'undefined'
    String(true)       // 'true'
    123 + ''           // '123'
```

#### boolean类型转换

显示转换规则： Boolean()

隐示转换规则： 逻辑判断或者有逻辑运算符时被触发（|| && !）

注意点： 逻辑运算符（比如 || 和 &&）是在内部做了 boolean 类型转换，但实际上返回的是原始操作数的值，即使他们都不是 boolean 类型

示例：
```js
    Boolean('')           // false
    Boolean(0)            // false  
    Boolean(-0)           // false
    Boolean(NaN)          // false
    Boolean(null)         // false
    Boolean(undefined)    // false
    Boolean(false)        // false
    Boolean({})             // true
    Boolean([])             // true
    Boolean(Symbol())       // true
    !!Symbol()              // true
    Boolean(function() {})  // true
```

#### number类型转换

显示转换规则： Number()

隐示转换规则：

1. 比较操作（>, <, <=, >=）

2. 按位操作（| & ^ ~）

3. 算数操作（- + * / %）， 注意: 当 + 操作存在任意的操作数是 string 类型时，不会触发 number 类型的隐式转换

4. 一 元 + 操作

5. 非严格相等操作（== 或者 !== ），注意: == 操作两个操作数都是 string 类型时，不会发生 number 类型的隐式转换

注意点：

1. 当将一个字符串转换为一个数字时，引擎首先删除前尾空格、\n、\t 字符，如果被修剪的字符串不成为一个有效的数字，则返回 NaN。如果字符串为空，则返回 0

2. Number() 方法对于 null 和 undefined 的处理是不同的， null 会转换为 0, undefined 会转换为 NaN

3. 不管是显式还是隐式转换都不能将 Symbol 类型转为 number 类型，当试图这样操作时，会抛出错误
```js
    Number(Symbol('my symbol'))    // TypeError is thrown
    +Symbol('123')                 // TypeError is thrown
```

4. 当将 == 应用于 null 或 undefined 时，不会发生数值转换。null 只等于 null 或 undefined，不等于其他任何值
 
5. NaN 不等于任何值，包括它自己  NaN === NaN  // false

示例：
```js
    Number(null)                   // 0
    Number(undefined)              // NaN
    Number(true)                   // 1
    Number(false)                  // 0
    Number(" 12 ")                 // 12
    Number("-12.34")               // -12.34
    Number("\n")                   // 0
    Number(" 12s ")                // NaN
    Number(123)                    // 123
```

#### object类型转换

隐示转换规则：当涉及到对象的操作比如：[1] + [2,3]，引擎首先会尝试将 object 类型转为原始类型，然后在将原始类型转为最终需要的类型，而且仍然只有 3 种类型的转换：number, string, boolean

1.  boolean 类型的转换，任何非原始类型总是会转换成 true,无论对象或数组是否为空

2. 对象通过内部 [[ToPrimitive]] 方法转换为原始类型，该方法负责数字和字符串转换

通常上 [[ToPrimitive]] 算法如下：

a. 如果输入的值已经是原始类型，直接返回这个值

b. 输入的值调用 toString() 方法，如果结果是原始类型，则返回

c. 输入的值调用 valueOf() 方法，如果结果是原始类型，则返回

d. 如果上面 3 个步骤之后，转换后的值仍然不是原始类型，则抛出 TypeError 错误

大多数 JS 内置对象类型的 valueOf() 返回这个对象本身，其结果经常被忽略，因为它不是一个原始类型。所以大多数情况下当 object 需要转换成 number 或 string 类型时最终都调用了 toString() 方法。

当运算符不同时，[[ToPrimitive]] 方法接受的转换类型参数也不相同。当存在 == 或者 + 运算符时一般会先触发 number 类型的转换再触发 string 类型转换。

#### 联系
```js
    1. true + false  // 1 + 0 => 1
    2. 12 / '6'      // 12 / 6 => 2
    3. "number" + 15 + 3   // 'number153'
    4. 15 + 3 + "number"   // '18number'
    5. [1] > null    // '1' > 0 = true
    6. "foo" + + "bar"  // 'foo' + (+ 'bar') => 'foo' + NaN => 'fooNaN'
    7. 'true' == true // NaN == 1 => false
    8. 'false' == false  // NaN == 0 => false
    9. null == '' // false
    10. !!"false" == !!"true" // true == true => true
    11. ['x'] == 'x' // 'x' == 'x' => true
    12. [] + null + 1  // '' + null + 1 => 'null1'
    13. 0 || "0" && {} // false || true && {} => {}
    14. [1,2,3] == [1,2,3] // 地址比较，不同 => false
    15. {} + [] + {} + [1] // {} - 块声明忽略 +[] + {} + [1] => 0 + {} + [1] => 0 + '[object object]' + 1 => '0[object Object]1' 
    16. ! + [] + [] + ![]  // !(+[]) + [] + ![] => true + '' + false => 'truefalse' 
    17. new Date(0) - 0  // 0 - 0 => 0
    18. new Date(0) + 0 // 'Thu Jan 01 1970 02:00:00 GMT+0200 (EET)0'
```