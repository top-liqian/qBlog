# Generator =》 生成器函数

```js

function * main () {
    const users = yield ajax('/api/get')
    console.log(users)
}

const g = main()

const result = g.next()

result.value.then(data => {
   g.next(data)
})

```

```js
function * main () {
    const users = yield ajax('/api/get')
    console.log(users)

    const urls = yield ajax('/api/get')
    console.log(urls)

    const others = yield ajax('/api/get')
    console.log(others)

    const noOthers = yield
}

const g = main()

function handlerResult (result) {
  if (result.done) return

  result.value.then(data => {
      handlerResult(g.next(data))
  })
}

handlerResult(g.next)
```