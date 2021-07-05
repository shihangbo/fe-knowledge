// 观察者模式
// vue2
// 基于发布订阅

class Sub() {
  construcutor(name) {
    this.name = name
    this.observers = []
    this.newState = ''
  }
  // 订阅
  attach(o) {
    this.observers.push(o)
  }
  // 触发
  emit(newState) {
    this.observers.forEach(o => o.update(newState))
  }
  // 状态改变
  setState(newState) {
    this.newState = newState
    this.emit(newState)
  }
}

class Observer() {
  construcutor(name) {
    this.name = name
  }
  update(newState) {
    console.log('触发了', newState)
  }
}

const s = new Sub('child')
const o1 = new Observer('dad')
const o2 = new Observer('mam')
s.attach(o1)
s.attach(o2)
s.setState('我很开心')
s.setState('我不开心')