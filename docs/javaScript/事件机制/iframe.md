### 项目实战中的iframe的关注点

#### 项目内嵌外部第三方页面
> 前提条件是第三方页面已经没有开发小伙伴进行维护了，所以一切操作都只有项目的开发人员即我进行改动，所以跨域问题的解决方法则由ngnix转发作为中间层，
  前端开发则是配置webpack的proxy选项进行本地开发。以下内容成立的前提条件为nginx转发已经生效，忽略了跨域问题。

页面制定区域而引入iframe
```html
  <iframe name="iframe" id="iframe" width="100%" height="720" scrolling="scrolling" @load="init"></iframe>
  <script>
    function init() {
      // 获得当前iframe的id
      const iframe = document.getElementById('iframe')
      // 拿到内嵌页面的全局
      const iframeWindow = iframe.contentWindow
      // 拿到内嵌页面全局的contentWindow时可以调用内嵌页面暴露出来的方法进行改写
    }
  </script>
  
```
#### 内嵌页面较多302页面跳转的解决方法
前置nginx处理302，利用lua模块
##### 一、调用接口302使用nginx配置更改location
例如访问 http://localhost:8080/api/a 接口session失效会导致接口302 header.Location = http://www.baidu.com<br>
实际上访问 http://192.168.0.0:8081/api/a 接口session失效会导致接口302 header.Location = localhost:8080/login
```
location /api/ {
    header_filter_by_lua_block {
        local url = ngx.header.Location
        if url then
          ngx.header.Location = 'localhost:8080/login'
        end
    }
    proxy_pass http://192.168.0.0:8081
}
```
##### 二、调用接口302使用nginx配置更改host
例如访问 http://localhost:8080/api/a 接口session失效会导致接口302 header.Location = http://www.baidu.com/aaa<br>
实际上访问 http://192.168.0.0:8081/api/a 接口session失效会导致接口302 header.Location = localhost:8080/aaa
```
location /api/ {
    proxy_set_header Host localhost:8080
    proxy_pass http://192.168.0.0:8081
}
```