
### 1. Object.create
```ts
Object.create = function(proto, args) {
  function F(){}
  F.prototype = proto
  return new F()
}
```

### 2. Promise
```ts
// 事件环 / 订阅发布 / 递归

```

### 3. 我们现在要实现一个红绿灯，把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色，你会怎样编写这个代码呢？
```ts
function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
async function changeColor(duration,color) {
  document.getElementById('traffic-light').style.boackgroud = color
  await sleep(duration)
}
async function main() {
  while(1) {
    await changeColor(3000,'green')
    await changeColor(2000,'yellow')
    await changeColor(1000,'red')
  }
}
main()
```