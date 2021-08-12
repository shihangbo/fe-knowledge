
```js
  let total = 10000
  let timer = Data.now()
  for(let i=0;i<total;i++) {
    let li = document.createElement('li')
    li.innerHTML = i
    container.appendChild(li)
  }
  // js执行时间
  let jsRunTimer = Date.now() - timer
  console.log(jsRunTimer)    // 907ms
  // 浏览器渲染时间
  setTimeout(() => {
    let renderTimer = Date.now() - timer - jsRunTimer
    console.log(renderTimer) // 7190ms
  })
```

## 长列表优化策略 - 分片
- 分片：根据数据大小划分，每次加载固定的数量
- 无法解决页面存在大量dom元素的问题，页面卡顿
- 实现每次加载50条
```js
  let total = 10000
  let index = 0 // 偏移量
  let id = 0    // 记录渲染个数
  function next() {
    index += 20
    if (index < total) {
      // requestAnimationFrame 宏任务，可以配合浏览器刷新频率
      requestAnimationFrame(() => {
        let fragment = document.createDocumentFragment()
        for(let i=0;i<index;i++) {
          let li = document.createElement('li')
          li.innerHTML = id++
          fragment.appendChild(li)
        }
        container.appendChild(fragment)
        next()
      })
    }
  }
  next()
```

## 长列表优化策略 - 虚拟列表
- 虚拟列表：只渲染当前可视区域
- 
```js
```


