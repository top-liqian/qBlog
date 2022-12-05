# 工程化相关的面试题

## 1. 有没有用 npm 发布过 package，如何发布？

1. 注册 npm 账号 https://www.npmjs.com/
2. 本地通过命令行 npm login 登陆
3. 进入到项目目录下（与 package.json 同级），在 package.json 中指定发布文件、文件夹
4. 执行 npm publish --registry=https://registry.npmjs.org/ 即可发布

## 2. js 代码压缩 minify 的原理是什么

通过 AST 分析，根据选项配置一些策略，来生成一颗更小体积的 AST 并生成代码。

目前前端工程化中使用 terser (opens new window)和 swc (opens new window)进行 JS 代码压缩，他们拥有相同的 API。

常见用以压缩 AST 的几种方案如下:

1. 去除多余字符: 空格，换行及注释，一般来说中文会占用更大的空间，多余的空白字符会占用大量的体积，如空格，换行符，另外注释也会占用文件体积。当我们把所有的空白符合注释都去掉之后，代码体积会得到减少
2. 压缩变量名：变量名，函数名及属性名，缩短变量的命名也需要 AST 支持，不至于在作用域中造成命名冲突。
3. 解析程序逻辑: 编译预计算