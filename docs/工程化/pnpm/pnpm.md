# pnpm

pnpm 是一款现代包管理工具

## 优点

1. 节省磁盘空间

当使用 npm 或 Yarn 时，n个项目依赖同一个依赖包，硬盘上就会保存该相同依赖包的副本n次。然而，如果是使用 `pnpm 依赖包`将被`存放在一个统一的位置`。

对于同一依赖包需要使用不同的版本，pnpm只会多缓存两个版本的差异文件，不会因为一个文件的修改而保存依赖包的 所有文件

不会占用`额外的硬盘空间`, 所有文件都保存在硬盘上的统一的位置。当安装软件包时，其包含的所有文件都会硬链接自此位置

2. 安装包速度快

在多数场景下，速度是其他的包管理器的2-3倍

3. 非扁平 node_modules 结构

当使用 npm 安装依赖包时，所有软件包都将被提升到 node_modules 的 根目录下，会产生`幽灵依赖、不确定性、依赖分身`

+ 幽灵依赖: 未在package.json里面定义，而是存在其他包的子依赖，被扁平化提升到了node_modules里面
+ 不确定性： 同样的 package.json 文件，install 依赖后可能不会得到同样的 node_modules 目录结构，A 依赖 B@1.0，C 依赖 B@2.0，在 package.json 安装 B 依赖，究竟应该提升 B 的 1.0 还是 2.0？就有两种情况了，所以不确定
+ 依赖分身： 相同版本的依赖被重复安装

pnpm 则是通过使用符号链接的方式仅将项目的直接依赖项添加到 node_modules 的根目录下。既保证了安全性，又解决了非法访问依赖、不确定性、重复安装的问题。