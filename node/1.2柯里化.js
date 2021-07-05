/*
  函数的判断
1.typeof 判断类型，不能区分对象
2.constructor 判断构造函数 对象是Object，数组是Array，- 应用：深拷贝
3.instanceof 判断A是否是B的实例 - 原理：while循环，判断原型链上有没有这个属性
4.Object.prototype.toString.call() 
*/

// 柯里化 - 暂存变量
// 典型应用场景：类型判断


function isType(typing) {
  return function(val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
  }
}

// 让方法更具体一些 isNumber isString
let utils = {}
let typings = ['String', 'Number', 'Boolean', 'Undefined', 'Null', 'Function', 'Array', 'Object']
typings.forEach(typing => {
  utils['is' + typing] = isType(typing)
})

console.log(utils.isNumber(123))
console.log(utils)