function create(fn, ...args) {
  const obj = {}
  obj.__proto__ = fn.prototype
  let result = fn.call(obj, ...args)
  return typeof result === 'object' ? result : obj
}

Function.prototype.myCall = (context, ...args) => {
  if(typeof this !== 'function') {
    throw new Error()
  }
  if(context === null || context === undefined) {
    context = window
  } else {
    context = Object(context)
  }

  const mySymbol = Symbol('myKey')
  context[mySymbol] = this

  const result = context[mySymbol](...args)
  delete context[mySymbol]
  return result
}