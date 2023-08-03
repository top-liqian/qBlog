# 一、什么是webpack

webpack是JavaScript的一个静态模块打包器，将很多文件当作一个整体，通过分析文件之间的依赖关系，最终打包成一个或多个静态资源文件

webpack主要实现以下功能：
+ 将不是js的其他语言转换成浏览起能够识别的语言
+ 通过对代码压缩，图片压缩、文件合并等方式来减小文件体积，加快页面加载速度
+ 将多个模块合并为一个文件，减少 HTTP 请求的数量
+ 按需加载依赖的模块
+ 可以通过插件来实现不同项目的需求

## webpack-cli

webpack-cli主要用于打包、编译、生成配置文件，构建多页应用等等

# 二、 webpack打包

##  2.1 入口 entry

entry：webpack打包的入口文件，告诉webpack从哪里开始进行打包

extry：可以是一个对象、一个字符串、一个数组

```js
module.exports = {
  entry: './src/index.js',
  entry: ['./src/entry1.js','./src/entry2.js'],
  entry:{
    app: './src/index.js',
  }
}
```

## 2.2  output

output: 指定Webpack打包后输出的文件和路径,告诉 Webpack 打包后的文件应该放在哪个目录下以及如何命名

output: 对象包含多个属性
   + path：指定了打包文件的输出路径，绝对路径
   + filename：定了打包后的文件名，可以包含路径信息

```js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    }
}
```

## 2.3 loader

loader: 将非js模块的转换成webpack可以处理的有效模块

使用loader就是要在webpack.config.js当中配置loader规则，loader规则由两部分组成：test用来匹配条件，use用来指定转换方式

```js
 module: {
   rules: [{ test: /\.css$/, use: ['style-loader','css-loader'] }]
 }
```

## 2.4 plugin

plugin: 拓展webpack功能，支持定制，可以在webpack打包过程中做一些额外的事儿，比如说优化

常见的 html-webpack-plugin：根据模版生成HTML文件