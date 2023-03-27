# 接入微前端遇到的问题

## lego子应用router发生变化，$emit('sub-route-change')触发主应用路由变化，主应用下发 $emit('lego-route-change') 触发lego子应用的路由守卫，致使lego子应用内部$router.back()方法需要触发两次才可以返回