// promise的静态方法
let Promise = require('./3.promise链式调用.js')

Promise.resolve(new Promise((resolve,reject) => {
  setTimeout(() => {
    reject(100)
  },1000)
})).then(data => {
  console.log(111, data)
}, err => {
  console.log(222, err)
})