# generator

1. generator是一个```状态机```，内部封装了多个状态，并且generator函数会返回一个```遍历器对象```。generator调用后并不执行，而是返回一个指向内部状态的指针对象（iterator object），由于generator函数内部具有一个遍历器对象生成函数，所以返回的对象```{ value: '', done: true }```可以通过next()方法```依次遍历```generator函数内部的每一个状态。generator函数是分段执行的，yield表达式是暂停执行的标记，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。

2. 特性
  + function * gen()
  + 内部使用yield表达式

3. 使用注意事项
  + generator函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数
  + yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。
  + yield表达式如果用在另一个表达式之中，必须放在圆括号里面