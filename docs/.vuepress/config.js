module.exports = {
  title: '晴卿的学习之路',
  description: '高级前端开发工程师的养成之路',
  head: [
    // add jquert and fancybox
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }],
    ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css' }]
  ],
  dest: './docs/.vuepress/dist',
  ga: '',
  evergreen: true,
  themeConfig: {
    logo: '/home.png',
    nav: [
      { text: 'interview', link: '/interview/' },
      { text: 'Css', link: '/css/' },
      { text: 'JavaScript', link: '/javaScript/' },
      { text: '安装', link: '/install/' },
      { text: '前端工程化', link: '/工程化/' },
      {
        text: 'Languages',
        items: [
          { text: 'Chinese', link: '/language/chinese' },
          { text: 'English', link: '/language/english' }
        ]
      },
      { text: 'External', link: 'https://www.baidu.com' },
    ],
    sidebarDepth: 2,
    sidebar: {
      '/interview/': [
        {
          title: 'ES5',
          collapable: true,
          children: [
            {
              title: '基础面试题',
              collapable: true,
              children: [
                { title: '基础面试题1',  path: '/interview/es5/基础/1-base.md' },
                { title: '事件相关',  path: '/interview/es5/基础/2-base.md' },
              ]
            },
            {
              title: '手写代码',
              collapable: true,
              children: [
                { 
                  title: '手写数组源码', 
                  children: [
                    { title: 'Array.isArray',  path: '/interview/es5/手写代码/数组/1.Array.isArray.md' },
                    { title: 'Array.prototype.flat',  path: '/interview/es5/手写代码/数组/2.Array.prototype.flat.md' },
                    { title: 'Array.prototype.reduce',  path: '/interview/es5/手写代码/数组/3.Array.prototype.reduce.md' }
                  ]
                }, 
                { 
                  title: '手写String源码', 
                  children: [
                    { title: 'String.prototype.trim',  path: '/interview/es5/手写代码/String/1.String.prototype.trim.md' }
                  ]
                }, 
                { title: '实现call/apply/bind',  path: '/interview/es5/手写代码/1.call-apply-bind.md' },
                { title: '深拷贝',  path: '/interview/es5/手写代码/2.deepclone.md' },
                { title: '防抖/节流',  path: '/interview/es5/手写代码/3.throtle-debounce.md' },
                { title: 'isEqual',  path: '/interview/es5/手写代码/4.isEqual.md' },
                { title: 'lodash.get',  path: '/interview/es5/手写代码/5.lodash.get.md' }, 
                { title: 'compose',  path: '/interview/es5/手写代码/6.compose.md' },
                { title: 'shuffle',  path: '/interview/es5/手写代码/7.shuffle.md'},
                { title: 'lodash.sample',  path: '/interview/es5/手写代码/8.lodash.sample.md' }, 
                { title: 'lodash.sampleSize',  path: '/interview/es5/手写代码/9.lodash.sampleSize.md' },
                { title: 'lodash.maxBy',  path: '/interview/es5/手写代码/10.lodash.maxBy.md'}
              ]
            },
          ]
        },
        {
          title: 'ES6',
          collapable: true,
          children: [
            {
              title: '手写代码',
              collapable: true,
              children: [ 
                { title: '实现let-const',  path: '/interview/es6/手写代码/1.let-const.md' },
              ]
            }
          ]
        }
      ],
      '/css/': [
        {
          title: 'CSS',
          collapable: true,
          children: [
            { title: '元素居中', path: '/css/元素居中/base' },
            { title: '清除浮动', path: '/css/清除浮动/base' },
            { title: '布局', path: '/css/布局/mobile-terminal' },
          ],
        }
      ],
      '/javaScript/': [
        {
          title: 'ES5',
          collapable: true,
          children: [
            { title: '变量', path: '/javaScript/1.变量/variable' },
            { title: '类型转换', path: '/javaScript/2.类型转换/base' },
            { title: '操作符 - new', path: '/javaScript/3.操作符/1.new' },
            { title: '操作符 - typeof', path: '/javaScript/3.操作符/2.typeof' },
            { title: '操作符 - instanceof', path: '/javaScript/3.操作符/3.instanceof' },
            { title: '操作符 - constructor', path: '/javaScript/3.操作符/4.constructor' },
            { title: '操作符 - indexOf', path: '/javaScript/3.操作符/5.indexOf' },
            { title: '操作符 - 全相等', path: '/javaScript/3.操作符/6.===' },
            { title: '操作符 - Object.is', path: '/javaScript/3.操作符/7.Object.is' },
            { title: 'js执行上下文&作用域', path: '/javaScript/4.执行上下文和作用域/base' },
            { title: '原型与原型链', path: '/javaScript/5.原型链/base' },
            { title: '继承', path: '/javaScript/6.继承/inherit' },
            { title: '闭包', path: '/javaScript/7.闭包/base' },
            { title: 'this', path: '/javaScript/8.this指向/base' },
            { 
              title: '函数', 
              children: [
                { title: '深拷贝', path: '/javaScript/9.函数/7.深拷贝.md' },
              ] 
            },
          ],
        },
        {
          title: 'ES6',
          collapable: true,
          children: [
            { title: '变量', path: '/javaScript/1.变量/variable' },
          ]
        }
      ],
      '/install/': [
        {
          title: '安装',
          collapable: true,
          children: [
            { title: 'node安装', path: '/install/node-install' },
          ],
        }
      ],
      '/工程化/':[
        {
          title: 'git',
          collapable: true,
          children: [
            { title: 'git', path: '/工程化/git/base.md' },
          ],
        },
        {
          title: 'npm',
          collapable: true,
          children: [
            { title: 'install原理', path: '/工程化/npm/install原理.md' },
          ],
        },
        {
          title: 'pnpm',
          collapable: true,
          children: [
            { title: 'pnpm简介', path: '/工程化/pnpm/pnpm.md' },
          ],
        },
      ]
    }
  }
}