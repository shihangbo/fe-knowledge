
/*
* time: 20210702
* 1.发布订阅/观察者模式
* 2.promise核心，使用promise编程，特点：解决链式调用 和 同步并发问题
* 3.手写promise
* 4.面试题
* 5.拓展：all，race，async await，* yield
*/

let Promise = require('./source/2.promise异步')

// 简易版
// let promise = new Promise((resolve, reject) => {
//   console.log('promise')
//   throw new Error('我失败了')
//   reject('失败')
//   resolve('成功')
// })
// console.log('========')

// promise.then((val) => {
//   console.log('success', val)
// }, (err) => {
//   console.log('fail', err)
// })

// 异步版
let promise = new Promise((resolve, reject) => {
  console.log('promise')
  // 异步
  setTimeout(() => {
    resolve('成功')
  })
})
console.log('========')

// 当用户调用then方法的时候，promise可能为等待态
promise.then((val) => {
  console.log('success1', val)
}, (err) => {
  console.log('fail', err)
})

promise.then((val) => {
  console.log('success2', val)
}, (err) => {
  console.log('fail', err)
})