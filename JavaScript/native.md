
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

### 4. 用 DOM API 来实现遍历整个 DOM 树，把所有的元素的 tagName 打印出来
```ts
// 深度优先
function deepLogTagNames(parentNode){
  console.log(parentNode.tagName)
  const childNodes = parentNode.childNodes
  // 过滤没有 tagName 的节点，遍历输出
  Array.prototype.filter.call(childNodes, item=>item.tagName)
  .forEach( itemNode => deepLogTagNames(itemNode))
}
deepLogTagNames(document.body)

// 广度优先
function breadLogTagNames(root){
  const queue = [root]
  while(queue.length) {
    const currentNode = queue.shift()
    const {childNodes, tagName} = currentNode
    tagName && console.log(currentNode.tagName)
    // 过滤没有 tagName 的节点
    Array.prototype.filter.call(childNodes, item=>item.tagName)
    .forEach(itemNode => queue.push(itemNode))
  }
}
breadLogTagNames(document.body)
```