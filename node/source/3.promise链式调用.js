
// Promise
// 1.是一个类，现代浏览器都支持
// 2.使用promise的时候，传入一个执行器，此执行器立即执行
// 3.当前执行器给了两个函数来描述当前promise的状态，promise有三个状态，默认等待，调用resolve进入成功态，发生异常或者调用reject进入失败态
// 4.每个promise实例都有一个then方法
// 5.promise一旦状态变化后不能改变

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
  // 相同
  if (promise2 === x) {
    return reject(new TypeError('TypeError 错误！'))
  }
  // 是promise，考虑是别人写的promise的情况
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 方式 then 通过 Object.defineProperty 定义的，通过get方法抛错
    try {
      let then = x.then
      if (typeof then === 'function') {
        // promise 调用then获取成功或者失败的结果，返回给promise2的成功和失败
        then.call(x, y => {
          resolve(y)
        }, r => {
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    // 普通值
    resolve(x)
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED

        this.onResolvedCallbacks.forEach(fn=>fn())
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED

        this.onRejectedCallbacks.forEach(fn=>fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejuect) {
    // 链式调用第一步 递归创建promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 链式调用第四步 使用异步获取 promise2
        setTimeout(() => {
          // 链式调用第二步 上一个then的结果传递给下一个then，并且兼容抛错的情况 throw new Error()
          try {
            let x = onFulfilled(this.value)
            // 链式调用第三步 核心步骤 处理x的可能性
            // x可能是promise，检测是成功还是失败 x.then
            // 如果是普通值，调用resolve
            resolvePromise(promise2, x, resolve, reject)
            // resolve(x)
          } catch (e) {
            reject(e)
          }
        },0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try{
            let x = onRejuect(this.reason)
            resolvePromise(promise2, x, resolve, reject)
            // resolve(x)
          } catch (e) {
            reject(e)
          }
        },0)
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onFulfilled()
              resolvePromise(promise2, x, resolve, reject)
              // resolve(x)
            } catch (e) {
              reject(e)
            }
          },0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try{  
              let x = onRejuect()
              resolvePromise(promise2, x, resolve, reject)
              // resolve(x)
            } catch (e) {
              reject(e)
            }
          },0)
        })
      }
    })
    return promise2
  }
}

module.exports = Promise
