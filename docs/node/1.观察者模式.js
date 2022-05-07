class Subject { // 被观察者
    constructor(name) {
        this.name = name
        this.state = '开心'
        this.observers = []
    }
    attach(observer) {
        this.observers.push(observer)
    }
    setState(newState) {
      if(newState !== this.state) {
          this.state = newState
          this.observers.forEach(it => it.update(this))
      }
    }
}

class Observer { // 观察者
   constructor(name) {
       this.name = name
   }
   update(data) {
        console.log(data.name + ':' + data.state, this.name)
   }
}

const child = new Subject('baby')

const m = new Observer('妈妈')

const f = new Observer('爸爸')

child.attach(m)
child.attach(f)

child.setState('不开心了')