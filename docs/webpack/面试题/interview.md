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

## 六、插件有执行顺序吗？

> 不同的hook，触发的顺序就是hooks触发的顺序，webpack具有自己规定好的钩子执行顺序
> 
> 同一个hook，就是注册的顺序
   
## 七、webpack内部使用的babel吗？

> 不是，使用的是acorn

## 八、什么是模块id，什么是chunkId？

## 九、源码当中chunk和assets之间的关系
    
> assets是一个对象，每一个chunk会成为assets的一个{ key: value },而每一个assets的属性会对应一个文件file，assets是可有可无的一个中间状态

## 十、loader和plugins的区别？

>  + loader加载器，默认情况下webpack原生只能解析js或者json文件，对于一些其他文件的解析就会用到loader进行处理，loader可以使我们在import或者load模块的时候预处理文件，loader可以将文件从不同语言如ts转换成js或者将内联图像转换成data url，所以loader使webpack具有了加载和解析非js文件的能力；loader是在module的rules当中进行配置，作为模块的解析规则而存在；类型是数组对象，内部描述了对于什么类型的文件（test）使用什么相应的loader（use/loader）进行解析还有使用的参数options；
> 
>  + plugin插件机制，plugin可以拓展webpack的功能，让webpack具有更多的灵活性，pligin主要在于从文件的打包优化和压缩到重新定义环境变量，功能强大到处理各种各样的任务；核心在于plugin会监听webpack的运行生命周期期间会广播出很多事件，在合适的时机通过webpack的API改变输出结果；plugin在plugins里面单独配置，类型是数组，每一项都是plugin的实例对象，参数都是通过构造参数传入的

## 十一、引入自定义loade的三种方式？

```js
// 1. 在webpack.config.js当中配置alias

module.exports = {
    resolveLoader: {
        alias: {
            'babel-loader': path.resolve('./loaders/babel-loader.js')
        }
    }
}

// 2. 在webpack.config.js当中配置modules

module.exports = {
    resolveLoader: {
        modules: [path.resolve('./loaders'), 'node_modules']
    }
}

// 3. 使用loader的绝对路径

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use:[path.resolve('./loaders/babel-loader.js')]
            }
        ]
    }
}
```

## 十二、loader的返回值是固定的吗？是返回js的源代码还是返回ast语法树？

最左边的loader返回的必须是源代码，因为它的返回值是给webpack，webpack要用它来生成ast树

其他的loader的返回值没有要求，可以是任意内容，但是必须是下一个loader能处理的内容

## 十三、url-loader和file-loader的区别？

url-loader是在file-loader的基础上增加了配置项 `limit`，小于limit设置的数值的时候url-loader将文件转换成base64的形式，反之和url-loader的功能一样

## 14. css-loader的作用

css-loader是处理css当中的`@import`语法以及`url('./images/logo.png)`语法

## 15. less-loader的作用

是将less的语法转换成css语法

## 16. style-loader的作用

把css变成一个JS脚本，脚本就是动态创建一个style标签，并且把这个style标签插入到HTML里的header