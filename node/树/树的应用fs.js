

// 异步递归创造目录 - 回调函数
// const fs = require('fs')
// function mkdir(pathStr, cb) {
//   let pathList = pathStr.split('/')
//   let index = 1
//   function r(err){
//     if (err) return cd(err)
//     if (index === pathList.length + 1) return cb()
//     let currentPath = pathList.slice(0, index++).join('/')
//     fs.stat(currentPath, (err) => {
//       if (err) {
//         fs.mkdir(currentPath, r)
//       } else {
//         r()
//       }
//     })
//   }
//   r()
// }
// mkdir('a/b/c/d', (err) => {
//   if (err) return console.log(err)
//   console.log('创建成功')
// })


// 异步递归创造目录 - es6
// fs.



// 删除目录
// fs.rmdir fs.mrdirSyc
// fs.readdir
// fs.stat isFile isDirectory
// fs.unlink fs.rename
// 串行 - 回调函数
// 并发 - async await