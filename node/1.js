
// 文件使用node来执行，node会把文件当成一个模块，此时this为{}
console.log(this)
!(function () {
  console.log(this === global)
})()


console.log(__dirname)  // 当前文件执行时的路径，文件夹，绝对路径
console.log(__filename) // 当前文件执行时自己的路径，文件，绝对路径

// console.log(process)
console.log(process.platform) // win32 or darwin
console.log(process.chdir)    // 改变工作目录，类似cd功能
console.log(process.cwd())    // 当前工作目录
console.log(process.env)      // 执行代码时设置的环境变量，set/export
console.log(process.argv)     // 执行代码时传入的参数[执行node所在的文件，当前执行的文件，...其他参数]
// 作用：cli -> 交互式需要用户传入参数
// commander args的node包就是做这个的

console.log(process.nextTick) // 当前执行栈的低部 优先级比较高

// process.argv 的参数解析
let argv = process.argv.slice(2).reduce((memo,current,index,arr) => {
  if(current.startsWith('--')) {
    memo[current.slice(2)] = arr[index+1]
  }
  return memo
},{})


// 模块化规范：commonjs，amd，cmd，es模块，systemjs
// 1.为什么要模块化
  // -为了解决命名冲突问题，- 单例模式，不能完全解决，调用很复杂
  // -用文件拆分 + iife自执行函数来解决 - 导致请求的问题，依赖问题
// umd 兼容amd，cmd和commonjs，不支持es模块
// 现在打包：umd + es6Module
// commonjs规范：一个文件就是一个模块，导出module.exports，导入require
  // -基于文件读写的，如果依赖了某个文件，会进行文件的读取
  // -动态的，根据条件去读取某个模块，无法做 tree-shaking
// es6规范：一个文件就是一个模块，导出export，导入import
  // -基于请求，每次引用一个模块，浏览器会发起请求
  // -静态的，提前确定好依赖的模块
  // -靠webpack编译，把依赖进行打包，使用对象进行管理，可以做 tree-shaking
// 2.模块规范
  // 每个文件都是一个模块，每个模块外面都有一个函数
  // 导出
  // 导入
// 3.模块的分类
  // 核心模块，内置模块，node的fs，http，vm...
  // 第三方模块，co...
  // 文件模块，别人引用的时候需要通过相对路径或者绝对路径引用





// script start
// async1 start
// async2
// promise1 -----
// script end
// async-next
// promise2
// setTimeout

// resolve reject 没有终止代码执行的功能
// catch中返回普通值，会作为下一次的成功
// async 返回是一个promise async函数立即执行
// await 相当于 yield + co => 调用then()方法，需要做一次延迟
// await xxx
// yyy
// xxx立即执行，下面跟的代码要包一层，相当于xxx.then(()=>{yyy})
// promise中，then方法前面的立即执行



