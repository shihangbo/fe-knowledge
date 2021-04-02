
# 文档学习 https://v3.vuejs.org/guide/component-props.html#prop-types

### Composition API
#### 1.setup : 在创建组件之前执行，因此没有this，没有组件相关的本地状态、计算属性或方法  
1.1 执行时机：beforeCreate 之前  
1.2 返回值：对象，对象中的属性与data/methods进行合并，重名setup优先
1.3 参数：props-{当前组件通过props接收的所有属性组成的对象}; content-{attrs：当前标签上，没有在props中声明接收的所有属性组成的对象；emit：事件分发，向上传递，相当于this.$emit方法；}
1.4 setup中的响应式方法：ref，reactive
##### ref  
```ts
const count = ref(0)
ref是一个函数用于定义一个数据的响应式，并返回一个Ref对象  
定义一个基本类型的响应式数据  
对象中又一个value属性，可对其进行操作；模板中不需要通过.value使用  
count 的类型 Ref类型
ref内部：通过给value属性添加getter/setter来实现对数据的劫持
ref中如果放入一个对象/数组，那么这个对象/数据是经过reactive处理，转化为Proxy类型的代理对象
```
##### reactive  
```ts
const proxy = reactive(obj)
是一个函数用于定义多个数据的响应式
reacitve内部：通过使用proxy来实现对对象内部所有数据的劫持，并通过Reflect操作对象内部数据
proxy 的类型 Proxy类型
```
#### 2.比较Vue2和Vue3的响应式对比
##### vue2
```ts
核心
1.对象：通过defineProperty对对象已有属性读取和修改进行数据劫持，getter/setter
2.数组：通过重写数组方法（7个：push/shift/pop/unsift/sort/reserve/splice）实现对数组对监听和拦截

问题
1.对象直接新增或删除属性，页面不会更新
2.数组通过下标新增或替换元素，更新length，页面不会更新
```
##### vue3
```ts
核心
1.Proxy（代理）：通过代理data对象，拦截对data对任意属性操作（13种），包括属性的读写/新增/删除等
2.Reflect（反射）：动态对被代理对象的相应属性进行特定操作，提供的操作方法与proxy handlers的方法相同
```
#### 3.计算属性和监视
```ts
const c = computed(()=>{})
1.返回值：返回一个Ref类型的对象
2.参数：如果只传入一个回调函数，表示get 
       如果传入一个对象，{get(){...},set(val){...}}
```
```ts
watch(user,()=>{},{immidiate:true,deep:true})
// 用watch监视非响应式数据，监视同时多个数据
watch([()=>user.fitstName, ()=>user.lastName],()=>{})
// 不需要配置 immidiate，默认执行
watchEffect(()=>{})
```
#### 4.生命周期
```ts
1.2与3一样的生命周期              推荐使用组合式API
beforeCreate                   -> setup()
created                        -> setup()
beforeMount                    -> onBeforeMount
mounted                        -> onMounted
beforeUpdate                   -> onBeforeUpdate
updated                        -> onUpdated

2.2与3不一样的生命周期
beforeDestory -> beforeUnmount -> onBeforeUnmount
destoryed     -> unmounted     -> onUnmounted

3.组合API提供了相应的调试函数
onRenderTracked
onRenderTriggered 检查哪个依赖导致组件的重新渲染
```

#### 5.hook函数
使用组合API封装的可复用的功能函数  
优势：代码分割，高可复用性，优于mixin技术  


#### 6.toRefs
toRefs把一个响应式对象转成普通对象，该普通对象的每个property都是一个ref  
应用：当从合成函数返回响应式对象时，toRefs非常有用，这样子消费组件就可以在不丢失响应式情况下对返回对对象进行分解使用  
问题：reactive对象取出所有属性值都是非响应式对  
解决：利用toRefs可以将一个响应式reactive对象的所有原始属性转换为响应式ref属性   
```ts
  // toRefs把一个响应式对象转成普通对象，该普通对象的每个property都是一个ref  
  setup(){
    const state = toRefs({
      name: 'watson',
      age: 18
    })
    return {
      ...state
    }
  }
```
```ts
  // 当从合成函数返回响应式对象时，toRefs非常有用，这样子消费组件就可以在不丢失响应式情况下对返回对对象进行分解使用 
  function useFeature() {
    const state = reactive({
      name2: 'watson2',
      age2: 18
    })
    return {
      ...toRefs(state)
    }
  }
  setup(){
    const state = toRefs({
      name: 'watson',
      age: 18
    })
    const {name2, age2} = useFeature()
    return {
      ...state,
      name2,
      age2
    }
  }
```

#### 7.其他组合API
1.shallowReactive  
shallowReactive：只处理对象第一层属性的响应式，也就是浅响应式  
应用场景：如果一个对象数据，结构比较深，但变化时只是外层属性变化 -> shallowReactive  
2.shallowRef  
shallowRef：只处理value的响应式，不进行对象的reactive处理  
应用场景：如果一个对象数据，后面会产生新的对象来替换 -> shallowRef  
3.readonly
4.shallowReadonly
5.toRow
6.markRow
7.toRef 与 ref 的区别
toRef为响应式对象上的某个属性创建一个ref对象，二者内部操作的是同一个数据值，更新是二者是同步的  
ref是拷贝一份新的数据值进行单独操作，更新时相互不影响  
应用：当要将某个prop的ref传递给复合函数时，toRef很有用  
8.customRef
9.provide 和 inject
实现跨层级组件间通信  

### 新组件
1.Fragment - 片段  
```ts
1.vue2中，组件必须有跟元素
2.vue3中，组件可以没有跟元素，内部会将多个标签包含在一个fragment虚拟元素中
3.好处，减少标签层级，减小内存占用
```
2.Teleport - 瞬移  
```ts
Teleport提供一个干净的方法，让组件的html在父组件界面外的特定标签（可能是body）下插入显示
```
3.Suspense - 不确定的组件  
允许应用在等待异步组件时渲染一些后备内容，提升应用的用户体验  
```ts
  //引入组件：静态 和 动态
  //vue2中动态引入组件
  const AsyncComponent2 = () => import('./AsyncComponent.vue')
  //vue3中动态引入组件
  const AsyncComponent3 = defineAsyncComponent(() => import('./AsyncComponent.vue'))
```


### 总结
```ts
//vue2 与 vue3升级
1.重写vue的响应式系统，vue3使用Proxy配合Reflect代理 替代了 vue2使用Object.defineProperty方法 实现数据的响应式
2.重写虚拟DOM
3.新加3个组件: Fragment, Teleport, Suspense
4.新的脚手架工具: vite
5.结合hook函数，整体代码布局的改变，特别是提高代码可复用性
```


### vite
```ts
1.vite 是什么？
是下一代构建工具，解决了什么问题
- 解决资源模块化的问题 - 为什么要模块化 - 前端项目越来越大，代码量越来越多，为了更好的组织项目，为了各成员之间更好的协调，使得代码组织更加规范（统一的编码方式和规则），把项目拆成模块化开发，提高效率
- ES Module的浏览器兼容性问题
- 模块文件过多导致频繁发送网络请求问题
常见的打包工具：
webpack：静态模块打包器，开发环境-如果改动任意模块，webpack需要根据资源路由解析的路径对应的资源重新编译打包，然后进行替换  
rollup：是一个js模块打包器，对代码模块使用新的标准化格式，就是更接近js语言标准打包实现，通过es6模块实现   
parcel： 
vite作为构建工具的优点：
- 插件化配置，插件拓展了rollup接口  
- 配置项，查看文档，与webpack类似 
- 开发环境的体验很好 几乎是瞬间更新
上一代有什么问题吗？
2.vite 2.0 对比 webpack开发体验
- 配置项，查看文档，与webpack类似 
- 开发环境的体验很好 几乎是瞬间更新
3.vite VS Vue-Cli
- vite在开发模式下不需要打包可以直接运行，使用的是es6模块化加载规则
- Vue-Cli 开发模式下必须对项目打包才能运行
- vite 基于缓存的热更新
- Vue-Cli 基于webpack的热更新
4.viet的基本原理与实现思路
- 开发环境不打包 http2 多路复用解决项目资源文件多次请求的问题，请求的成本降到很低  
- 开发环境不打包 vite启动的静态服务器直接想浏览器返回源文件，响应头部标识为application/javascript  
- 生产打包 
5.vite的特点
- 快速启动
- 按需编译
- 模块热更新
```