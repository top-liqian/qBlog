# 浏览器相关的面试题

## 一、TCP 的 Keepalive 和 HTTP 的 Keep-Alive 是一个东西吗

这两个完全是两样不同东西，实现的层面也不同：

+ HTTP 的 Keep-Alive，是由应用层（用户态）  实现的，称为 HTTP 长连接；
+ TCP 的 Keepalive，是由 TCP 层（内核态）  实现的，称为 TCP 保活机制；

`HTTP 的 Keep-Alive原理`

Keep-Alive是建立HTTP 长连接，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。

在 HTTP 1.0 中默认是关闭的，如果浏览器要开启 Keep-Alive，它必须在请求的包头中添加：Connection: Keep-Alive

从 HTTP 1.1 开始， 就默认是开启了 Keep-Alive，如果要关闭 Keep-Alive，需要在 HTTP 请求的包头里添加：Connection:close

HTTP 长连接不仅仅减少了 TCP 连接资源的开销，而且这给 HTTP 流水线技术提供了可实现的基础

所谓的 HTTP 流水线，是客户端可以先一次性发送多个请求，而在发送过程中不需先等待服务器的回应，可以减少整体的响应时间。

`TCP的Keepalive的原理：`

定义一个时间段，在这个时间段内，如果没有任何连接相关的活动，TCP保活机制会开始作用，每隔一个时间间隔，发送一个探测报文，该探测报文包含的数据非常少，如果连续几个探测报文都没有得到响应，则认为当前的TCP连接已经死亡，系统内核将错误信息通知给上层应用程序

在linux内核可以有对应的参数可以设置保活时间、保活探测的次数、保活探测的时间间隔，一下都是默认值：

```js
net.ipv4.tcp_keepalive_time = 7200
net.ipv4.tcp_keepalive_intvl = 75
net.ipv4.tcp_keepalive_probes = 9
```

## 二、了解预检请求preflight吗？展开谈谈

## 三、介绍一下https。

## 四、知道https中的http请求怎么处理吗？

## 五、了解http2的特性吗

## 六、刚刚提到http2有服务器推送功能。http2与websocet都有服务器推送的功能，那么websocket会被http2取代吗？为什么？