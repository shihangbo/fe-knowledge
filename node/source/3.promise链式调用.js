
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
          // 确保返回的一定是promise的resolve 或者 reject 或者 普通值
          resolvePromise(promise2, y, resolve, reject)
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
      // resolve 里面 返回promise 的处理
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
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
    // 处理 参数为空 的情况，即穿透 .then().then().then()
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v=>v
    onRejuect = typeof onRejuect === 'function' ? onRejuect : err=>{throw err}
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

  // 没有成功的失败方法
  catch(errorFn) {
    return this.then(null, errorFn)
  }

  // 静态方法
  static resolve(value) {
    return new Promise((resolve,reject) => {
      resolve(value)
    })
  }
  static reject(value) {
    return new Promise((resolve,reject) => {
      reject(value)
    })
  }
  // Promise.all([p1,p2]) 所有成功才返回成功，能拿到所有的结果，有一个失败就失败了
  static all(promises) {
    return new Promise((resolve,reject) => {
      let result = []
      let times = 0
      const processSuccess = (i, data) => {
        result[index] = data
        if (++times === promises.length) {
          resolve(result)
        }
      }
      for(let i=0;i<promises.length;i++) {
        let p = promises[i]
        if (p && typeof p.then === 'function') {
          p.then(data => {
            processSuccess(i, data)
          }, reject)
        } else {
          processSuccess(i, p)
        }
      }
    }) 
  }
  // finally(cb) 无论失败或者成功都能执行

  // Promise.race([p1,p2]) 有一个成功或者失败就采用他的结果，如图片加载，加载超时
  static race(promises) {
    return new Promise((resolve,reject) => {
      for(let i=0;i<promises.length;i++) {
        let p = promises[i]
        if (p && typeof p.then === 'function') {
          p.then(resolve,reject)
        } else {
          resolve(p)
        }
      }
    })
  }

  // Promise.allSettled([p1,p2]) 可以获取所有结果，无论里面的p成功还是失败

  // Promise.any([p1,p2]) 其中一个成功就会走成功，返回当前成功的值，都失败了才会走失败

  // promisify 将一个异步方法转成promise的形式，给node使用的

}

// 延迟对象， 减少一层套用
Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve,reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise
