
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

### 3.组件和组件的属性
  3.1 函数式组件: 一个函数，接受一个属性对象，返回一个react元素  
  3.1.1 函数组件的渲染原理  
    1. 封装函数组件的属性对象 props  
    2. 把props传递给Welcome函数，返回一个React元素  
    3. 把这个React元素，也就是虚拟DOM渲染到真实DOM上  
```js
// 定义
function Welcome(props){
  return <h1>hello {props.name}</h1>
}
// 使用
let ele = <Welcome name="watson" />
```
  3.2 类组件: 一个类，需要一个render方法，render方法返回一个并且仅能返回一个顶级react元素  
  3.2.1 类组件的渲染原理  
    1. 封装类组件的属性对象 props  
    2. new Welcome(props)，创建类实例，传递props进去并赋值给this.props  
    3. 调用实例的render方法，得到返回的React元素  
    4. 把这个React元素，也就是虚拟DOM渲染到真实DOM上  
```js
// 定义
class Welcome extends React.Component{
  // constructor(props) {
  //   this.props = props
  // }
  render(){
    return <h1>hello {this.props.name}</h1>
  }
}
// 使用
let ele = <Welcome name="watson" />
```
  3.3 对组件属性的类型校验  
```js
import PropTypes from 'prop-types'
class Person extends React.Component{
  static PropTypes = {
    age: PropTypes.string.isRequired
  }
  render(){
    let {age,gender,position} = props
    return <h1>...</h1>
  }
}
let props = {
  age:80,
  gender:'male',
  hobby:['smoking','drinking'],
}
```














### dom diff原则
  3.1 尽量复用旧DOM（key和元素对象都一致）  对象怎么比较一致？？？  


