// 实现 regeneratorRuntime对象
class Context {
  next=0
  done=false
  stop(){
    this.done = true
  }
}
const regeneratorRuntime = {}
regeneratorRuntime.mark = (generator)=>{
  // 源码中有一些操作，不重要
  return generator
}
regeneratorRuntime.wrap = (generator$, _mark)=>{
  let iterator = Object.create(_mark.prototype)
  let context = new Context()
  iterator.next = (args) => {
    context.sent = args
    let value = generator$(context)
    return {
      value,
      done:context.done
    }
  }
  return iterator
}

// 原始代码
function* generator() {
  let a = yield 1
  console.log(a)
  let b = yield 2
  console.log(b)
  let c = yield 3
  console.log(c)
}
let g = generator()
console.log(g.next())
console.log(g.next('11111'))
console.log(g.next('22222'))
console.log(g.next('33333'))

// babel 转译后的代码
"use strict";
var _marked = /*#__PURE__*/regeneratorRuntime.mark(generator);
function generator() {
  var a, b, c;
  return regeneratorRuntime.wrap(function generator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;
        case 2:
          a = _context.sent;
          console.log(a);
          _context.next = 6;
          return 2;
        case 6:
          b = _context.sent;
          console.log(b);
          _context.next = 10;
          return 3;
        case 10:
          c = _context.sent;
          console.log(c);
        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
var g = generator();
console.log(g.next());
console.log(g.next('11111'));
console.log(g.next('22222'));
console.log(g.next('33333'));


