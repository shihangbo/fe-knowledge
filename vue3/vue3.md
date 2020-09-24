## vue3 新特性
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
  6.1 响应式数据监听api  
