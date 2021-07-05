
/*
* time: 20210702
* 1.发布订阅/观察者模式
* 2.promise核心，使用promise编程
* 3.手写promise
* 4.面试题
* 5.拓展：all，race，async await，* yield
*/

// Promise
// 1.是一个类，现代浏览器都支持
// 2.使用promise的时候，传入一个执行器，此执行器立即执行
// 3.当前执行器给了两个函数来描述当前promise的状态，promise有三个状态，默认等待，调用resolve进入成功态，发生异常或者调用reject进入失败态
// 4.每个promise实例都有一个then方法
// 5.promise一旦状态变化后不能改变
