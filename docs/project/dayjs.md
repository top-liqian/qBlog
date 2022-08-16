# 在使用dayjs过程中注意点

1. 计算两个日期之间的差值

```js
const now = dayjs().format('YYYY-MM-DD')

return dayjs(now).diff('2022-08-15', 'day')

```