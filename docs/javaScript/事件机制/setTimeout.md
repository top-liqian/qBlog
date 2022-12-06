# 介绍 setTimeout 实现机制与原理，手写一个实现

## setTimeout实现机制与原理

setTimeout方法就是一个定时器，用来指定某个函数在多少毫秒之后以后执行，它会返回一个整数id，用来标识定时器编号，你也可以通过这个id取消定时器

```js
  const timeId = setTimeout(function () {
    console.log('i am a timeout')
  }, 1000)
  console.log('timeId', timeId)
```

setTimeout具有三个参数：setTimeout(function[, delay, arg1, arg2, ...]);

1. 第一个参数用来表示一个被延迟执行的函数
2. 第二个参数用来表示延迟时间，可选的，默认是0
3. 第三个参数用来向延迟函数传递参数

setTimeout返回值：

返回值是一个数字，这个成为 timeoutID ，可以用于取消该定时器

## 手动实现一个setTimeout

```js
let setTimeout = (fn, timeout, ...args) => {
  // 初始当前时间
  const start = +new Date()
  let timer, now
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    // 再次运行时获取当前时间
    now = +new Date()
    // 当前运行时间 - 初始当前时间 >= 等待时间 ===>> 跳出
    if (now - start >= timeout) {
      fn.apply(this, args)
      window.cancelAnimationFrame(timer)
    }
  }
  window.requestAnimationFrame(loop)
}

function showName(){ 
 console.log("Hello")
}
let timerID = setTimeout(showName, 1000);
```

> 注意：JavaScript 定时器函数像 setTimeout 和 setInterval 都不是 ECMAScript 规范或者任何 JavaScript 实现的一部分。 定时器功能由浏览器实现，它们的实现在不同浏览器之间会有所不同

setTimeout 在浏览器中的实现

浏览器渲染进程中所有运行在主线程上的任务都需要先添加到消息队列，然后事件循环系统再按照顺序执行消息队列中的任务。

在 Chrome 中除了正常使用的消息队列之外，还有另外一个消息队列，这个队列中维护了需要延迟执行的任务列表，包括了定时器和 Chromium 内部一些需要延迟执行的任务。所以当通过 JavaScript 创建一个定时器时，渲染进程会将该定时器的回调任务添加到延迟队列中。

源码中延迟执行队列的定义如下所示：

DelayedIncomingQueue delayed_incoming_queue;

当通过 JavaScript 调用 setTimeout 设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数 showName 、当前发起时间、延迟执行时间，其模拟代码如下所示：

```js
struct DelayTask{ 
 int64 id； 
 CallBackFunction cbf; 
 int start_time; 
 int delay_time;
};
DelayTask timerTask;
timerTask.cbf = showName;
timerTask.start_time = getCurrentTime(); //获取当前时间
timerTask.delay_time = 200;//设置延迟执行时间
```

创建好回调任务之后，再将该任务添加到延迟执行队列中，代码如下所示：

delayed_incoming_queue.push(timerTask)

现在通过定时器发起的任务就被保存到延迟队列中了，那接下来我们再来看看消息循环系统是怎么触发延迟队列的。

```js
void ProcessTimerTask(){
  //从delayed_incoming_queue中取出已经到期的定时器任务
  //依次执行这些任务
}

TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  for(;;){
    //执行消息队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);
    
    //执行延迟队列中的任务
    ProcessDelayTask()

    if(!keep_running) //如果设置了退出标志，那么直接退出线程循环
        break; 
  }
}
```

从上面代码可以看出来，我们添加了一个 ProcessDelayTask 函数，该函数是专门用来处理延迟执行任务的。这里我们要重点关注它的执行时机，在上段代码中，处理完消息队列中的一个任务之后，就开始执行 ProcessDelayTask 函数。ProcessDelayTask 函数会根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程。通过这样的方式，一个完整的定时器就实现了。

设置一个定时器，JavaScript 引擎会返回一个定时器的 ID。那通常情况下，当一个定时器的任务还没有被执行的时候，也是可以取消的，具体方法是调用 clearTimeout 函数，并传入需要取消的定时器的 ID 。如下面代码所示：clearTimeout(timer_id) 其实浏览器内部实现取消定时器的操作也是非常简单的，就是直接从 delayed_incoming_queue 延迟队列中，通过 ID 查找到对应的任务，然后再将其从队列中删除掉就可以了。

## setTimeout实现setInterval

```js
function myInterval(fn,interval,...args) {
  let context=this
  setTimeout(()=>{
     fn.apply(context,args)
     myInterval(fn,interval,...args)//别忘了为它传入参数
  }, interval)
}

myInterval((num)=>console.log(num),500,10)
```