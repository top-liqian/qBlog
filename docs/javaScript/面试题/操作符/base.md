# 操作符相关的面试题

## 一、typeof和instanceof的区别

1. typeof 会返回一个运算数的基本类型，instanceof 返回的是布尔值

2. instanceof 可以准确判断引用数据类型，但是不能正确判断原始数据类型

3. typeof 虽然可以判断原始数据类型（null 除外），但是无法判断引用数据类型（function 除外）

## 二、typeof为什么检测null的时候会是object？

因为js在开发初期为了性能而使用低位1-3位存储变量的类型信息，约定000开头为对象，而null的二进制刚好设置为全0，因此直接被当做了对象来看待，这是一个历史问题bug

## 三、typeof document.all === undefined

在 V8 中，每一个 Javascript 对象都有一个与之关联的 Map 对象，Map 对象描述 Javascript 对象类型相关的信息，类似元数据
Map 对象主要使用 16 bit 的 instance_type 字段来描述对应 Javascript 对象的类型

undefined 的 is_undetectable bit 是 1

document.all 的 is_undetectable 也是 1

所以才会有 typeof document.all 等于 undefined 的不合理情况

## 四、 typeof 1/0 等于什么和为什么？

由于`typeof`运算符优先级高于除法，所以会先执行`typeof 1`, 返回`'number'`。然后执行 '`number' / 0`的操作。此时会隐式调用`Number`转型函数将`'number'`转换成`NaN`。最后执行`NaN / 0`的操作。此时会返回`NaN`  所以结果是`NaN`
。

## 五、NaN 是什么，用 typeof 会输出什么？

Not a Number，表示非数字，typeof NaN === 'number'

## 六、 new 一个函数发生了什么？

1. 创建一个新的对象`F`
2. 这个新对象的`__proto__`属性指向构造函数的`prototype`,即`F.__proto__ = Fun.prototype`
3. 执行构造函数`Fun`，使用指定的参数调用构造函数`Fun`，并将 this 绑定到新创建的对象
4. 构造函数如果有返回值，如果返回`原始值`即没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)（例如 return 1） 那么这个返回值将`没有`任何意义，还是会返回`F`
5. 构造函数如果返回一个`对象`，那么这个对象就会被正常`引用`，返回其他对象会导致获取不到构造函数的实例，很容易因此引起意外的问题！
6. 返回的对象将作为构造函数的实例

## 七、new 一个构造函数，如果函数返回 return {} 、 return null ， return 1 ， return true 会发生什么情况？

如果函数返回一个对象，那么new 这个函数调用返回这个函数的返回对象，否则返回 new 创建的新对象

