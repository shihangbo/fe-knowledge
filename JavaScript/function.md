
## Function 函数

- 闭包       ：产生一个封闭作用域，内层函数访问到外层函数的作用域变量
- 纯函数     ：无副作用，相同输入相同输出，可缓存，可测试
            ：最佳实践：可缓存，确定输入和输出对应关系并缓存(cache对象实现)
- 柯里化     ：curry，让参数依次传递
```js
function curry(fn){
  let len = fn.length
  let curried = (...args) => {
    // 闭包变量 args
    if (args.length < len) {
      return (...rest) => curried(...args, ...rest)
    }
    return fn(...args)
  }
  return curried
}

```
- 组合
- Pointfree
- 函子