
const EventEmitter = require('./source/events')

function create(proto) {
  function Fn(){}
  Fn.prototype = proto
  return new Fn()
}

function Girl(){
  // EventEmitter.call(this)
}
// 继承原型属性
// 1. setPrototypeOf(Child.prototype, Father.prototype)
// 2. Object.create()
Girl.prototype = create(EventEmitter.prototype)
// 继承实例属性
// 原型链继承 Child.prototype = new Father(); var c1 = new Child();
// ...

let girl = new Girl()

function cry(args) {
  console.log('哭', args)
}
girl.on('失恋', cry)
girl.on('失恋', (args) => {
  console.log('吃', args)
})
function shopping(args) {
  console.log('逛街', args)
}
girl.once('失恋', shopping)

setTimeout(() => {
  girl.off('失恋', shopping)
  girl.emit('失恋', 'lalala', 'bibibi')
  girl.off('失恋', cry)
  girl.emit('失恋', 'lalala', 'bibibi')
}, 1000)


