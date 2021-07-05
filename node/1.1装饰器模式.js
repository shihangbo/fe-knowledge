// 拓展函数 - 使用高级函数
// 典型应用场景：before / after函数实现


// 装饰器模式，切片模式
// this 使用闭包实现
function core (args) {
  console.log('core...', args)
}

Function.prototype.before = function (beforeFn) {
  // this = core
  // 闭包：定义函数的作用域 和 调用的作用域 不一致
  return (...args) => { // 箭头函数没有this，没有argumens，没有prototype
    beforeFn()
    this(args)
  }
}

let newFn = core.before(() => {
  console.log('core before...')
})

newFn(1,2,3)