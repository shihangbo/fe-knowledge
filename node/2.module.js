
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