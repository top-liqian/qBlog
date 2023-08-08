# vue3的设计思想以及理念

## 1. vue3的设计思想

在保留Vue2的特色的同时，个人认为从以下三方面来讲：

1. 模块拆分：Vue3.0更注重模块上的拆分，在2.0中无法单独使用部分模块。需要引入完整的Vuejs(例如只想使用使用响应式部分，但是需要引入完整的Vuejs)， Vue3中的模块之间耦合度低，模块可以独立使用
2. 重写了很多api：vue3通过函数式声明，，可以解决Vue2中很多方法挂载到了实例中导致没有使用也会被打包（还有很多组件也是一样）。vue3可以通过构建工具Tree-shaking机制实现按需引入，减少用户打包后体积
3. 扩展能力强： Vue3允许自定义渲染器，不会发生以前的事情，改写Vue源码改造渲染方式

## 2. vue3框架简介

vue3依旧是声明式的框架

命令式框架更注重的是过程，声明式的框架不需要关注实现，只需要按照要求往里面填写代码即可

## 3. vue3的架构设计

Vue3源码采用 monorepo 方式进行管理，将模块拆分到package目录中

![vue2项目结构](./../assets/vue3-intro.png)

Vue3源码采用Typescript来进行重写 , 对Ts的支持更加友好（Vue2 采用Flow来进行类型检测）

## 4. vue3内部构建工具

开发环境采用esbuild

```js
const { build } = require('esbuild')
const { resolve } = require('path')
const args = require('minimist')(process.argv.slice(2));

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

const outputFormat = format.startsWith('global')// 输出的格式
    ? 'iife'
    : format === 'cjs'
        ? 'cjs'
        : 'esm'

const outfile = resolve( // 输出的文件
    __dirname,
    `../packages/${target}/dist/${target}.${format}.js`
)

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: { // 监控文件变化
        onRebuild(error) {
            if (!error) console.log(`rebuilt~~~~`)
        }
    }
}).then(() => {
    console.log('watching~~~')
})
```
生产环境采用rollup打包

```js
// rollup.config.js
import path from 'path';
// 获取packages目录
const packagesDir = path.resolve(__dirname, 'packages');
// 获取对应的模块
const packageDir = path.resolve(packagesDir, process.env.TARGET);
// 全部以打包目录来解析文件
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve('package.json'));
const name = path.basename(packageDir); // 获取包的名字

// 配置打包信息
const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    global: {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    }
}
// 获取formats
const packageFormats = process.env.FORMATS &&  process.env.FORMATS.split(',');
const packageConfigs =  packageFormats || pkg.buildOptions.formats;

import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve'
import tsPlugin from 'rollup-plugin-typescript2'

function createConfig(format,output){
    output.sourcemap = process.env.SOURCE_MAP;
    output.exports = 'named'; 
    let external = []
    if(format === 'global'){ 
        output.name = pkg.buildOptions.name
    }else{ // cjs/esm 不需要打包依赖文件
        external = [...Object.keys(pkg.dependencies || {})]
    }
    return {
        input:resolve('src/index.ts'),
        output,
        external,
        plugins:[
            json(),
            tsPlugin(),
            commonjs(),
            nodeResolve()
        ]
    }
}
// 开始打包把
export default packageConfigs.map(format=> createConfig(format,outputConfigs[format]));
```

```js
// build.js
const fs = require('fs');
const execa = require('execa')
const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true;
});
async function runParallel(source, iteratorFn) {
    const ret = [];
    for (const item of source) {
        const p = Promise.resolve().then(() => iteratorFn(item))
        ret.push(p);
    }
    return Promise.all(ret)
}
async function build(target) {
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            `TARGET:${target}`
        ],
        { stdio: 'inherit' }
    )
}
runParallel(targets, build)
```