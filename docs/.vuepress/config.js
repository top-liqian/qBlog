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
            { title: 'js执行上下文&作用域', path: '/javaScript/执行上下文和作用域/executionContext' },
            { title: '闭包', path: '/javaScript/闭包/base' },
            { title: '原型链', path: '/javaScript/原型链/base' },
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