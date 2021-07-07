
// co 执行 返回promise：co().then()
function co(it) {
  return new Promise((resolve,reject) => {
    // 异步的迭代 只能用递归方法
    function next(data) {
      let {value,done} = it.next(data)
      if (done) {
        resolve(value)
      } else {
        Promise.resolve(value).then(next,reject)
      }
    }
    next()
  })
}


// async await 的实现：generator + co 语法糖