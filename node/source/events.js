
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(en, cb) {
    // 添加属性
    if (!this.events) this.events = {}
    // 逻辑
    this.events[en] ? this.events[en].push(cb) : this.events[en] = [cb]
  }
  emit(en, ...args) {
    this.events[en] && this.events[en].forEach(cb => cb(args))
  }
  off(en, cbn) {
    this.events && this.events[en] && (this.events[en] = this.events[en].filter(cb => cb !== cbn && cb.l !== cbn))
  }
  once(en, cb) {
    // this.on(en, cb)
    // cb()
    // this.off(en, cb)
    const one = () => {
      cb()
      this.off(en, one)
    }
    // 自定义属性关联
    one.l = cb
    this.on(en, one)
  }
}

module.exports = EventEmitter