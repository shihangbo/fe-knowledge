// 发布订阅：核心把多个事件暂存起来，最后一次全部执行
// 接耦合

const events = {
  _events = [],
  on(fn) {
    this._events.push(fn)
  },
  emit(data) {
    this._events.forEach(fn => fn(data))
  }
}