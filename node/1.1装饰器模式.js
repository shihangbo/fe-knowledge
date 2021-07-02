
// 装饰器模式，切片模式
function core () {
  console.log('core...')
}

Function.prototype.before = function (beforeFn) {
  // this = core
  return () => {
    beforeFn()
    this()
  }
}

let newFn = core.before(() => {
  console.log('core before...')
})

newFn()