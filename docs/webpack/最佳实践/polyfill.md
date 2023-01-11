# polyfill的最佳配置方式

## 项目当中的配置写法

```js
const path = require('path')
const HtmlWebpckPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        targets: {
                            "browsers": ["IE 10"]
                        },
                        presets: [
                            ["@babel/preset-env", {
                                useBuiltIns: 'usage',
                                corejs: { version: 3 }
                            }]
                        ],
                        plugins: [
                            ["@babel/plugin-transform-runtime", {
                                corejs: false,
                                helpers: true,
                                regenerator: false
                            }]
                        ]
                    }
                }
            }
    
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
// useBuiltIns: false  400 KiB 把polyfill全量引入，不考虑浏览器兼容性
```

如果是业务项目开发，不会有别人引用该项目，所以可以useBuiltIns：‘usage’方式,按照浏览器兼容需求和实际使用情况来按需引入polyfill，污染了全局，但是节省了空间，同时借用"@babel/plugin-transform-runtime"的helper辅助函数，进一步减少体积。

## 类库代码

```js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
   mode: 'development',
   devtool: false,
   entry: './src/index.js',
   output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'main.js'
   },
   module: {
       rules: [
           {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                   loader: 'babel-loader',
                   options: {
                       targets: {
                           "browsers": ["IE 10"]
                       },
                       presets: [
                           //@babel/preset-env只转换语法，不要提供polyfill
                           ["@babel/preset-env", {
                               useBuiltIns: false
                           }]
                       ],
                       plugins: [
                           ["@babel/plugin-transform-runtime", {
                               corejs: { version: 3 },//不污染全局作用域
                               helpers: true,
                               regenerator: true //不污染全局作用域
                           }]
                       ]
                   }
               }
           }
       ]
   },
   plugins: [
       new HtmlWebpackPlugin({
           template: './src/index.html'
       })
   ]
};
// useBuiltIns: false  400 KiB 把polyfill全量引入，不考虑浏览器兼容性
```