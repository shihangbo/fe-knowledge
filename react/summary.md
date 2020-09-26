
# vue3的设计过程

### 1.react 和 react-dom
  1.1 react元素 的本质是一个普通的js对象   
  1.2 react-dom会保证浏览器中的DOM与react生成的js元素 保持一致  
  1.3 react元素 都是不可变对象  
  1.4 react元素 只会更新必要的部分，dom diff  
```js
function createElement(type,config={},...children){
  return {
    type,
    props:{...config,children}
  }
}
var element = createElement('h1',{id:'title'},'hello',createElement('h2',null,'world'))
console.log(element)
```

### 2.JSX表达式
  2.1 在JSX中任意使用表达式，表达式要放在大括号里  
```js
let name = 'watson'
// 写法一
let element =  <h1 id='title'>hello {name}</h1> //jsx - babel - createElement函数
// 写法二
let element = React.createElement('h1',{id:'title'},'hello',createElement('h2',null,'world')) // 直接写
```

### 3.dom diff原则
  3.1 尽量复用旧DOM（key和元素对象都一致）  对象怎么比较一致？？？  
