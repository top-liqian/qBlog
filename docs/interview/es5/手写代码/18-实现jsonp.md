# 手动实现jsonp

```js
function jsonp(url, params_obj, callback) {
    //创建一个供后端返回数据调用的函数名
    let funcName = 'jsonp_' + Data.now() + Math.random().toString().substr(2, 5)

    //将参数拼接成字符串
    if (typeof params === 'object') {
        Object.keys(params).forEach((el, index) => {
            params += `${index === 0 ? '?' : '&'}${el}=${params[el]}`
        })
    }

    //在html中插入<script>资源请求标签
    let script = document.createElement('script')
    script.src=`${url}?${params}&callback=${funcName}`
    document.body.appendChild(script)

    //在本地设置供后端返回数据时调用的函数
    window[funcName]= data =>{
        callback(data)

        delete window[funcName]
        document.body.removeChild(script)
    }
}

//使用方法
jsonp('http://xxxxxxxx',{ id:123 }, data => {
 //获取数据后的操作
})
```