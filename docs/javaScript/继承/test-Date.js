function MyDate() {
    Date.apply(this, arguments)
    this.name = 'MyDate'
}

function createObject (o) {
    function F() {}
    F.prototype = o
    return new F()
}

function _inherite (MyDate, Date) {

    MyDate.prototype = createObject(Date.prototype)

    MyDate.prototype,constructor = MyDate

    MyDate.__proto__ = Date

}

_inherite(MyDate, Date)

MyDate.prototype.getName = function () {
    return this.name
}

let date = new MyDate()

console.log(date.getTime());

// 自此之上存在的问题：consol报错 TypeError: this is not a Date object.

// 关键是：由于调用的对象不是Date的实例，所以不允许调用，就算是自己通过原型继承的也不行

