
// 柯里化 的 递归实现
// 分批传入参数

function sum(a,b,c,d,e) {
  return a+b+c+d+e
}

const curring = (fn, arr = []) => {
  let len = fn.length
  return function(...args) {
    let newArgs = [...arr, ...args]
    if (newArgs.length === len) {
      return fn(...newArgs)
    } else {
      return curring(fn, newArgs)
    }
  }
}

let newSum = curring(sum)

// console.log(newSum(1)(2)(3)(4)(5))
// console.log(newSum(1,2)(3)(4,5))


// 重写 isType函数
let utils = {}
function isType(typing, val){
  return Object.prototype.toString.call(val) === `[object ${typing}]`
}
let typings = ['String', 'Number', 'Boolean', 'Undefined', 'Null', 'Function', 'Array', 'Object']
typings.forEach(typing => {
  utils['is' + typing] = curring(isType)(typing)
})
console.log(utils.isString('123'))
console.log(utils.isString(123))
