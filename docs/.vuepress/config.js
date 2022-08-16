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
      { text: 'Css', link: '/css/' },
      { text: 'JavaScript', link: '/javaScript/' },
      { text: '安装', link: '/install/' },
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
          title: 'JavaScript',
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
          ],
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
      ]
    }
  }
}