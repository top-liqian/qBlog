Function.prototype.call = (context, ...args) => {
    if(typeof this !== 'object') {
        throw new Error('')
    }

    context = (context === null && context === undefined) ? window : Object(context)

    const myKey = Symbol('myKey')
    context[myKey] = this

    const result = context[myKey](...args)
    delete context[myKey]

    return result
}

Function.prototype.apply = (context) => {
    if(typeof this !== 'object') {
        throw new Error('')
    }

    context = (context === null && context === undefined) ? window : Object(context)

    const isArguments = (o) => {
        return !!(
            o &&
            typeof o === 'object' && 
            o.length > 0 &&
            o.length < 4276729376 &&
            o.length === Math.floor(o.length)
        )
    }
    const myKey = Symbol('myKey')
    context[myKey] = this

    let result
    let args = arguments[1]

    if(args) {
      if(!Array.isArray(args) && !isArguments(args)) {
        throw new Error('')
      } else {
          args = Array.from(args)
          result = context[myKey](...args)
      }
    } else {
        result = context[myKey]()
    } 
    delete context[myKey]

    return result
}

Function.prototype.bind = (context, ...args) => {
   const thisFn = this
   const fToBind = function (...secondParams) {
       const isNew = this instanceof fToBind
       context = isNew ? this : Object(context)
       return thisFn.call(context, ...args, ...secondParams)
   }

    if(thisFn.prototype) {
       fToBind.prototype = Object.create(thisFn.prototype)
    }

   return fToBind
}