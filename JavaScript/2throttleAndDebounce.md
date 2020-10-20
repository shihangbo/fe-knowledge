
## 防抖和节流

### 1.概述
  防抖和节流可以说是一对好基友，也是前端面试的手写热点考题。防抖和节流其实都是在规避频繁触发回调导致大量计算，从而影响页面发生抖动甚至卡顿。简单的说将多次回调比如页面点击或ajax调用变为一次。防抖和节流的区别在于以第一次为准还是最后一次为准。  
### 2.防抖 debounce - 调用多次，只【最后一次】调用有效
  1.应用场景：输入框补全提示，只需要每两秒补全一次  
  2.测试用例  
```js
  it('节流throttle',(done)=>{
    const {throttle} = require('./index')
    const mockFn = jest.fn()
    const fn = throttle(mockFn,10)
    fn(1)
    fn(2)
    setTimeout(()=>{
      const calls = mockFn.mock.calls
      expect(calls.length).toBe(1)
      expect(calls[0][0]).toBe(1)
      done()
    },50)
  })
```
  3.功能实现  
```js
  var debounce = (fn,delay) => {
    let timer
    return (...args) => {
      if(timer){
        clearTimeout(timer)
      }
      timer = setTimeout(()=>{
        fn.apply(this,args)
      },delay)
    }
  }
```
  4.功能实现（高级函数版）
```js
  var debounce = (method, context, delay) => {
    clearTimeout(method.id)
    method.id = setTimeout(function() {
      method.call(context)
    }, delay ? delay : 300)
  }
```

### 3.节流 throttle - 调用多次，只【第一次】调用有效
  1.应用场景：多次点击提交按钮，只需提交最后一次，又如拖拽改变窗口大小触发resize事件，最优一次的调用才有意义  
  2.测试用例  
```js
  it('节流throttle',(done)=>{
    const {debounce} = require('./index')
    const mockFn = jest.fn()
    const fn = debounce(mockFn,10)
    fn(1)
    fn(2)
    setTimeout(()=>{
      const calls = mockFn.mock.calls
      expect(calls.length).toBe(1)
      expect(calls[0][0]).toBe(2)
      done()
    },50)
  })
```
  3.功能实现（版本1）  
```js
var throttle = (method,delay) => {
  let t_start = 0
  let real_delay = delay || 300 // 默认300ms
  return (...args) => {
    let t_curr = +Data.now()
    if(t_curr>t_start+real_delay){
      t_start = t_curr
      fn.apply(this, args)
    }
  }
}
// throttle(fn,300)
```