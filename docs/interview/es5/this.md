# this

## 1. 你觉得js里this的设计怎么样? 有没有什么缺点啥的

## 2. function 和 箭头函数的定义有什么区别? 导致了在this指向这块表现不同

## 3. 导致js里this指向混乱的原因是什么?

## 4. this指向

```js
var name = '123';

var obj = {
	name: '456',
	print: function() {
		function a() {
			console.log(this.name);
		}
		a();
	}
}

obj.print();
```

## 5. this指向

```js
const obj = {
	fn1: () => console.log(this),
	fn2: function() {console.log(this)}
}

obj.fn1(); // window
obj.fn2(); // obj

const x = new obj.fn1();
const y = new obj.fn2();
```