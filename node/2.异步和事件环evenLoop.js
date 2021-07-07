
// 事件循环: 检测js主线程执行栈是否为空，如果为空，从事件队列中取出一个来执行。
// 宏任务: 只有一个，script脚本，界面渲染，定时器(setTimeou setInterval)，事件，ajax，setImmediate，MessageChannel等。
// 微任务: 微任务之后，渲染页面，promise.then，mutationObserver, process.nextTick，在执行完毕后，浏览器会检测是否重新渲染，浏览器刷新频率大约16.66ms。
// 每次循环都会执行一个宏任务，并清空对应的微任务，每次循环完毕后，浏览器都要检查是否渲染，如果需要才进行渲染页面。


// 例子1
document.body.style.background = 'red'
console.log(1)
Promise.resolve().then(() => {
  console.log(2)
  document.body.style.background = 'yellow'
})
console.log(3)
// 132 黄

// 例子2
document.body.style.background = 'red'
console.log(1)
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(2)
    document.body.style.background = 'yellow'
  })
},0)
console.log(3)
// 132 (红)黄  根据浏览器的刷新频率，可能有红，也可能没有

// Promise1 setTimeout1 Promise2 setTImeout2