# 为什么 setTimeout 有最小时延 4ms ?

setTimeout并不是由ECMAScript进行维护的，而是由 host environment 提供的，根据规范可以知道

+ 如果设置的timeout小于0，则设置成0
+ 如果setTimeout的嵌套层级超过了五层，并且 timeout 小于 4ms，则设置 timeout 为 4ms

各大浏览器的厂商对于setTimeout都有自己的设计，以常见的chrome为例， 在不满足嵌套层级的情况下，最小延迟时间设置为 1ms。至于为什么要设置 minimumInterval = 4ms，是因为chromemium希望设置更低的延迟时间（他们希望可以达到亚毫秒级别），但是由于一些网站对于setTimeout的不良使用（纽约时报），过小的延迟时间会造成CPU-spinning，而 CPU spinning 的后果是计算机没有办法进入睡眠模式（低功耗模式），也就是耗电非常的快。所以chromium做了些 benchmark 测试，选定了 4ms 作为其 minimumInterval。

不同浏览器的最低时延会不一致，比如 chrome 的最低时延是 1ms。而如果 timer 嵌套层级很多，那么最低时延是 4ms。具体嵌套层级的阈值不同浏览器也不一致，HTML Standard 当中是 >5，chrome 当中是 >=5。

# 究竟是HTML standard 先做出的设定，还是 Chromium 这种浏览器厂商先做出的设定？

windows 默认情况下的 timer resolution 是 10-15.6ms，也就是说最开始浏览器的 timer 依赖于操作系统层面的 timer resolution，换到 setTimeout 当中来讲，设定的最小延迟至少会是 10ms，随着时代的变迁，cpu的性能也在不断的变化，但是对于timer resolution却没有改变，浏览器厂商（chrome）认为默认计时器影响了网页的表达（ 10-15.6ms 时间过于长），对于浏览器内部来讲，如果 clock tick 很长，意味着浏览器会休眠很长的时间，从某一方面导致浏览器的性能下降。chrome 团队选取了和 Flash 和 Quicktime 同样的 API 来替代系统默认的 timer resolution

# 追求低延迟为什么不设置0ms？

如果浏览器允许 0ms，会导致 JavaScript 引擎过度循环，也就是说如果浏览器架构是单进程的，那么可能网站很容易无响应。因为浏览器本身也是建立在 event loop 之上的，如果速度很慢的 JavaScript engine 通过 0ms timer 不断安排唤醒系统，那么 event loop 就会被阻塞。那么此时用户会面对什么情况呢？同时遇到 CPU spinning 和基本挂起的浏览器，没有任何响应

# JavaScript中setTimeout的实现原理

javascript是单线程执行的，无法同时执行多个任务，当一段代码正在执行的时候，所有的后续的任务都必须进行等待，形成一个队列，，当前任务执行完毕之后在从队列当中取出一个任务进行执行，也就是阻塞式运行。如果代码中设定了一个 setTimeout，那么浏览器便会在合适的时间，将代码插入任务队列，如果这个时间设为 0，就代表立即插入队列，但不是立即执行，仍然要等待前面代码执行完毕。所以 setTimeout 并不能保证执行的时间，是否及时执行取决于 JavaScript 线程是拥挤还是空闲。

# 手写一个setTimeout时间为0ms的计时器

1. 由于setTimeout是宏任务，所以利用postMessage起了一个宏任务去执行回调

```js
(function() {
	var timeouts = [];
	var messageName = "zero-timeout-message";
	// Like setTimeout, but only takes a function argument.  There's
	// no time argument (always zero) and no arguments (you have to use a closure)
	function setZeroTimeout(fn) {
		timeouts.push(fn);
		window.postMessage(messageName, "*");
	}
	function handleMessage(event) {
		if (event.source == window && event.data == messageName) {
			event.stopPropagation();
			if (timeouts.length > 0) {
				var fn = timeouts.shift();
				fn();
			}
		}
	}

	window.addEventListener("message", handleMessage, true);

	// Add the one thing we want added to the window object.
	window.setZeroTimeout = setZeroTimeout;
})();

// test

console.log(1)
setTimeout(() => { console.log(2)}, 0)
setZeroTimeout(() => {console.log(3)}, 0)
new Promise((resolve) => resolve(4)).then(res => console.log(res))
console.log(5)
```

2. MessageChannel允许我们创建一个新的消息通道，并通过它的两个MessagePort属性发送数据，MessageChannel提供端口的概念，实现端口之间的通信，比如worker/iframe之间的通信。MessageChannel产生的是宏任务

```js
(function() {
	const channel = new MessageChannel();
	function setMessageChannelTimeout(fn) {
		channel.port2.postMessage(null);
	}
	channel.port1.onmessage = function() {
		test();
	};
	let i = 0;
	const start = Date.now();
	function test() {
		if(i++ &lt; 100) {
			setMessageChannelTimeout(test);
		}
	}
	setMessageChannelTimeout(test);
})();
```

3. async/await，但不是完全意义上的setTimeout，因为 async/await产生的是微任务

```js
(function() {
	async function setAsyncTimeout(fn) {
		Promise.resolve().then(fn);
	}
	let i = 0;
	const start = Date.now();
	async function test() {
		if (i++ &lt; 100) {
			await setAsyncTimeout(test);
		} else {
			console.log('setAsyncTimeout执行时间:', Date.now() - start);
		}
	}
	setAsyncTimeout(test);
})();
```

4. queueMicrotask，queueMicrotask这个api可以添加一个微任务，使用比较简单，直接传递一个回调函数即可，根据规范文档的说明，大多数情况下，推荐使用requestAnimationFrame()和requestIdleCallback()等api，因为queueMicrotask会阻塞渲染，在很多时候都不是一种好的实践。具体实现如下：

```js
(function() {
	function setZeroTimeout(fn) {
		queueMicrotask(fn);
	}
	let i = 0;
	const start = Date.now();
	function test() {
		if(i++ &lt; 100) {
			setZeroTimeout(test);
		} else {
			console.log('setZeroTimeout执行时间:', Date.now() - start);
		}
	}
	setZeroTimeout(test);
})();
```
