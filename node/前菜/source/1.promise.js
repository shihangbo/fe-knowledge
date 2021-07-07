
// Promise
// 1.是一个类，现代浏览器都支持
// 2.使用promise的时候，传入一个执行器，此执行器立即执行
// 3.当前执行器给了两个函数来描述当前promise的状态，promise有三个状态，默认等待，调用resolve进入成功态，发生异常或者调用reject进入失败态
// 4.每个promise实例都有一个then方法
// 5.promise一旦状态变化后不能改变

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejuect) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejuect(this.reason)
    }
  }
}

module.exports = Promise
