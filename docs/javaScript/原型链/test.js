function F() {}

var f = new F();

const flag1 = F.prototype.constructor === F // true

const flag2 = F.prototype.__proto__ === Object.prototype // true

const flag3 = F.__proto__ === Function.prototype // true 作为函数才会有的__proto__属性

const flag4 = Function.prototype.__proto__ === Object.prototype // true

const flag5 = Object.prototype.__proto__ === null // true


console.log(flag1, flag2, flag3, flag4, flag5, flag6)