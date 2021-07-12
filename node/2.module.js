
// fs path vm 内置模块
const fs = require('fs');
// 同步
let file = fs.readFileSync('./node/1.js', 'utf8')
console.log(file)
// 同步报错 检测文件是否存在
let exists = fs.existsSync('./node/1.js')
console.log(exists)
// 异步
fs.readFile('./node/1.js', 'utf8', (err, data) => {
  console.log(data)
})


const path = require('path')
console.log(path.resolve('a', 'b')) // 默认采用当前工作目录，process.cwd()
console.log(path.resolve(__dirname, 'a', 'b')) // 当前文件所在的目录
console.log(path.join('a', 'b')) // 路径拼接
console.log(path.extname('a.js')) // 拓展名
console.log(path.basename('a.js', '.js')) // 文件名字
console.log(path.relative('a/b/c/1.js', 'a')) // 获取相对路径
console.log(path.dirname('a/b/c')) // 获取当前文件或者目录的，父级目录，__dirname的实现


// const vm = require('vm')
// 如果使用js实现一个沙箱环境
  // 1.快照，执行前记录信息，执行后还原信息
  // 2.proxy实现

// node里面的执行环境

// global.xxx
// 模块 上下文
  // function(exports,module,require,__dirname,__filename){var a = 100}
  // vm.runInThisContext
// vm.runInNewContext

// node中 require的实现
  // 读取文件
  // 包装为一个函数
  // 通过runInThisContent转成js语法
  // 调用


// node 中如何加载模块
  // 1.require方法 -> Module.prototype.require 方法
  // 2.Module._load 加载模块
  // 3.Module._resolveFilename 方法就是把路径变成绝对路径，添加后缀名(.js .json)
  // 4.new Module 拿到绝对路径创造一个模块，this.id exports={}
  // 5.module.load 对模块进行加载
  // 6.根据文件后缀 Module._extensions['.js'] 做策略加载
  // 7.用的是同步读取文件 fs.readFileSync
  // 8.组装成函数，并且让函数执行，指定 this 为 module.exports
  // 9.返回 module.exprts
