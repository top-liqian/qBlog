# 阅读源码过程中产生的面试题

## 一、webpack打包出来的代码为什么会有很多一个字母的变量？

即：例如说 __webpack_require__.r = () => {}，为什么webpack内部的打包代码具有很多的一个字母的形式？

> 主要是为了减少打包之后的代码体积，对象，函数的形参都可以在代码压缩阶段可以压缩成一个字母，但是对象的属性不能进行压缩，所以在定义的过程中就直接定义成一个字母，至于为什么对象的属性不能压缩是因为压缩之后影响调用

## 二、webpack如何识别这是一个esmodule还是一个commonjs

> webpack检测如果代码里面具有import或者export语句，那么就会被认定为esmodule模块，其他的都是commonjs模块

## 三、 webpack当中的commonjs需要转换吗？

不需要，原来是什么样的打包之后就是什么样

## 四、为什么webpack在打包的过程当中提供require.n函数？

> 答：首先require.n函数内部实现是判断该模块是否是esmodule，在require一个模块的时候我们并不知道这个require进来的模块是esmodule还是commonjs，因为这两种的取值方式是不一样的，esmodule取得是exports.default而commonjs是取exports
> 
>  require.n = (exports) => (exports && exports.__esModule ? () => exports.default : () => exports)

## 五、npx,webpack,npm run build这三者之间的关系？

> + npx是webpack5新增加的命令，指可以在本地不安装软件包的基础上可以执行相应的命名 npx webpack 等价于 npm i webpack;npm run build
> + webpack是编译的核心包，webpakc-cli是webpack的命令行工具
> + npm run build => webpack-cli里面的webpack命令，webpack命令会调用webpack核心包去进行编译


## 八、什么是模块id，什么是chunkId？

## 九、源码当中chunk和assets之间的关系
    
> assets是一个对象，每一个chunk会成为assets的一个{ key: value },而每一个assets的属性会对应一个文件file，assets是可有可无的一个中间状态


