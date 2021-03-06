## vue3 新特性 - 尤讲的
https://haokan.baidu.com/v?vid=12934700591410275932&pd=bjh&fr=bjhauthor&type=video  


### 0.vue3会带来什么
  更快 / 更小 / 更易于维护 / 更好的多端渲染支持 / 新功能

### 1.更快 - 优化技巧
  1.1 新的 Virtual DOM 实现，完全重构，初始渲染/更新提速达 100%
    1.1.1 Virtual DOM重构，优化很多细节地方，更抠性能 -> 初始渲染更新的提速最高可以翻倍
    1.1.2 结合模版编译，来提高运行时性能的技巧 -> 更多编译时的优化以减少运行时的开销
  1.2 优化的例子
    1.2.1 Component fase path: 【检查提前】 将模版编译为vNode的渲染函数的时候，在编译时区分原生元素还是组件，提供给运行时的h函数创建vNode；  
    1.2.2 Monomorphic calls: 【便于js引擎优化】 在生成这些vNode的时候，函数调用要尽可能形状一致，相同的参数列表；  
    1.2.3 【判断提前】在模版中静态分析一个元素所包含的自元素的类型，给运行时留下hint(提示)，如标记这个元素只包含一个子元素，运行时直接跳入对应只有一个子元素的处理分支，减少运行时的判断逻辑；  
  1.3 优化slot生成
```js
// template
<Comp>
  <div>{{ hello }}</div>
</Comp>

// Compiler output
render(){
  return h(Comp,null,{
    default:()=>[h('div',this.hello)]
  },16 /* compiler generated slots */)
}
```
    1.3.1 从父子组件关联更新 到 子组件更新，vue3中将slot转换成一个lazy的函数，传入子组件，由子组件决定什么时候调用，从而将hello这个数据依赖绑定在子组件上，从而完成了父子组件的依赖很好的分离，让整个应用得到一个非常精确的组件级的依赖收集；  
  1.4 静态内容提取
    1.4.1 vue2/3会检测模版是否是动态，给静态内容的元素打上‘static’标记，在之后的更新中直接复用vNnode，并且跳过比对过程；  
    1.4.2 vue3优化的部分：当一个元素它内部任意深度包含任意动态内容的时候，整个元素都无法被静态化的，但是如果这个元素本身所有的属性都是静态的，将属性对象提取出来，在之后的更新过程中，元素本身不需要比对，只需要比对children；  
  1.5 内联事件函数提取
    1.5.1 使用cache进行复用

### 2.更快 - 基于Proxy的新数据监听系统
  2.1 全语言特性支持 + 更好的性能
    2.1.1 对象属性的新添/删除
    2.1.2 数组 index/length 更改
    2.1.3 Map,Set,WeakMap,WeakSet
    2.1.4 Classes
  2.2 利用proxy减少组件实例初始化开销
    2.2.1 使用proxy，极大的减少了组件参数data/computed/props的代理，减少Object.defineProperty操作；  
    2.2.2 vue3暴露的this是组件实例的一个proxy，当获取proxy属性时，在做真正的处理；  

### 3.更小 - 便于Tree-shaking的代码结构
  3.1 就是把没有用到的代码在编译的时候扔掉，按需引入！  
  3.2 新的最小核心运行时：～10kb  

### 4.更易于维护
  4.1 ts重写，vue3全面拥抱ts，ts社区维护好；  
  4.2 内部的模块解耦，observer模块等  
  4.3 编译器重构  
    4.3.1 插件化设计  
    4.3.2 带位置信息的parser(source maps)  
    4.3.3 为更好的IDE工具链铺路  

### 5.更好的多端渲染支持
  5.1 Custom Renderer Api
```js
import {createRenderer} from '@vue/runtime-core'
const { redner } = createRenderer({
  nodeOps,   // 节点操作
  patchData  // 处理一个元素在被更新的时候它上面的属性操作
})
```
    5.1.1 @vue/runtime-core模块包含vue组件，vDom算法等，不包含与Dom相关的任何代码；  
    5.1.2 redner函数把vue组件和vDOM渲染到原生对象上面去；  

### 6.新功能
  6.1 响应式数据监听api - observable  
```js
import {observable,effect} from 'vue'
// observable注册为一个响应式的数据，用于实现跨组件的状态共享
const state = observable({
  count:0
})
// effect函数依赖响应式数据，当数据变更的时候，effect被重新执行
effect(()=>{
  console.log(`count is: ${state.count}`)
})
state.count++
```
  6.2 轻松排查组件更新的触发原因 - renderTriggered  
```js
const Comp = {
  render(props){
    return h('div',props.count)
  },
  renderTriggered(event){
    debugger
  }
}
```
  6.3 更好的ts支持，包括原生的Class和TSX  
```js
interface HelloProps{
  text?:string
}
class Hello extends Component<HelloProps>{
  count=0
  render(){
    return <div>
      {this.count}
      {this.$props.text}
    </div>
  }
}
```
  6.4 更好的警告信息  
    6.4.1 组件堆栈包含函数是组件  
    6.4.2 可以直接在警告信息中查看组件的props  
    6.4.3 在更多的警告中提供组件堆栈信息  
  
  6.5 Experimental - Hooks API  
    6.5.1 作为一种逻辑复用机制，大概率取代 mixins  
    6.5.2 github项目 Vue Hooks  
  
  6.6 Experimental - Time Slicing Support  
    6.6.1 解决重js计算的一个方案(浏览器是单线程的，大量计算会block浏览器的整个运行)：通过每16毫秒(一桢)，就yield给browser，让用户的新事件重新进来触发更新，可能导致的一些之前需要做的更新被invalid，也就不需要去做，省去一些不必要的操作  
```js
function block(){
  const s = performance.now()
  while(performance.now() - s < 1){
    // block
  }
}
```

  6.7 关于IE  
    6.7.1 会有一个专门的版本，在IE11重自动降级为旧的getter/setter机制，并对IE中不支持的用法给出警告  
    

### 7.进阶篇 - 源码剖析
  1.vue3使用ts开发，对ts支持友好
  2.源码体积优化：移除部分api（例如filter过滤器），使用tree-shaking（使用到的api进行打包，没有的就过滤掉，减轻源码体积）
  3.数据劫持优化：Proxy，性能提升
  4.编译优化：vue3实现了静态模版分析，重写diff算法
  5.CompositionAPI：整合业务代码逻辑，提取公共逻辑（vue2用mixin实现-命名冲突/数据来源不清晰）
  6.自定义渲染器：可以创建自定义的渲染器，改写vue底层渲染逻辑
  7.新增组件：Fragment，Teleport，Suspense

### 8.基础篇 - 核心知识与实战开发
  1.vue3新特性
  2.基于vite实现vue3工程化部署
  3.掌握setup和10中响应式系统api
  4.新生命周期函数和refs使用
  5.基于vue3实现知乎app开发
### 9.进阶篇 - 源码剖析
  1.手写vue3中的reactivity模块
  2.vue3的dom-diff
  3.vue3中“自定义渲染器”的实现原理
  4.vite工具实现原理
