# 接入微前端遇到的问题

## lego子应用router发生变化，$emit('sub-route-change')触发主应用路由变化，主应用下发 $emit('lego-route-change') 触发lego子应用的路由守卫，致使lego子应用内部$router.back()方法需要触发两次才可以返回


## wujie微应用接入vue-baidu-map-gl版本遇到的问题

1. vue-baidu-map-gl 在绘制多边形围栏以及折线围栏的时候会报错

原因：vue-baidu-map-gl 是在主应用当中引入的，也就意味着是在主应用顶级作用域中具有baidu-map的运行环境，因为在主子应用之间的作用域是相互隔离的，这就导致在子应用当中无法获取baidu-map相关的变量

解决方案：

2. vue3环境当中 vue-baidu-map-gl 接口返回的数据在内置围栏时没有正常展示，但是本地mock的相同数据却可以正常绘制

原因：后端接口返回的数据在vue3环境当中具有隐藏属性，导致vue-baidu-map-gl在处理的时候内部报错

解决方案：将围栏的path字段使用 JSON.parse(JSON.stringfy()) 进行转换，剔除proxy附加的一些隐藏属性和方法，就可以正常的绘制了
