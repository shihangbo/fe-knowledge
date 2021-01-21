## vue 知识点

### 1.MVVM
1. MVC  
  1. java jsp ajax jquery -> html / js / css
  2. vue / react -> template / 预处理css / all in js
  3. 单页面应用spa -> View(tempalte DOM), ViewModel(data binding / dom listener), Model(数据 data)
2. 响应式数据的原理  
  1. vue2
    1. Object.defineProperty
    2. 默认在Vue在初始化数据时，会给data中的属性使用Object.defineProperty重新定义getter/setter；当页面取值时，会进行依赖收集（收集当前组件的watcher），如果属性发生变化通知相关依赖进行更新操作；
    3. 源码解读：  
      initData 初始化data数据->  
      new Observer(value) 观测数据->  
      this.walk(value) 对象处理->  
      defineReactive 循环对象属性 定义响应式->  
      Object.defineProperty 重新定义getter/setter  
  2. vue2 数组是如何检测变化的  
    1. 使用函数劫持的方式，重写数组方法，7个，push/pop/shift/unshift/reverse/splice/sort  
    2. vue将data中的数组，进行了原型链重写，指向自己定义的数组原型方法，当调用数组api时，可以通知依赖更新，如果数组中包含着引用类型，会对数组中的引用类型再次进行监控  
    3. 源码解读：  
      initData 初始化data数据->  
      new Observer(value) 观测数据->  
      protoAugment(value,arrayMethods) 重新数组方法，target.__proto__ = arrayMethods->  
      observeArray 深度观察数组中的每一项->  
    4. 缺陷
      1. 不行使用下标操作数组  
      2. ...
  3. vue3 - Proxy
3. Vue为何采用异步渲染
  0. vue是组件级更新
  1. 为了性能考虑，vue会在本轮数据更新后，再去异步更新视图  
  2. 源码解读：  
    dep.notify 通知watcher进行更新操作->  
    subs[i].update() 依次调用watcher的update->  
    queueWatcher 将watcher去重放到队列中->  
    nextTick(flushSchedulerQueue) 异步清空watcher队列  
4. nextTick 实现
  1. 只要使用了宏任务和微任务，通过事件循环机制实现异步操作  
  2. 多次调用 nextTick，会将方法存入队列 等待timerFunc执行  
  3. 源码解读：  
    callbacks.push(cb) 将方法存入队列->  
    pending 多次调用nextTick的控制阀门->  
    timerFunc() Promise / MutationObserver / setImmediate / setTimeout->  
    返回promise  
5. Vue中Computed
  1. 默认的computed也是一个watcher，并且具备缓存，只要当依赖当属性发生变化时才会更新；  
  1.1 做了一个dirty 实现缓存机制 watcher.dirty为true，执行watcher.evaluate，不然直接返回watcher.value  
  1.2 computed的更新机制，首先默认不会执行，当用户取值的时候第一次计算值并且收集依赖，当依赖变化时将当前依赖的computed watcher的dirty设置为true，当用户再次取值时重新计算返回结果，当依赖没有发生变化当情况下(dirty为false)取值，直接返回缓存结果；  
  1.3 lazy是watcher当一个计算属性的标识  
  2. 源码解读：  
    initState(vm) 初始化 ->
    initComputed(vm, opts.computed) 初始化computed->  
    new Watcher() lazy:true,默认dirty:true,默认watcher不执行（不执行用户方法）->  
    defineComputed 将属性定义到实例上Object.defineProperty(vm,key,sharedPropertyDefinition) ->  
    createComputedGetter 创建getter当取值时会执行此方法 ->  
    当用户取值 ->
    dirty为false 返回上次计算当结果；dirty为true watcher.evaluate 计算结果，计算时会进行依赖收集，dirty更改为false  
6. computed watch method 的区别
  1. method 如果将方法用在模版上，只要属性变化触发视图渲染，就重新执行方法，性能开销比较大  
  2. watch 
7. watch 对象中的 deep:true 的实现  
  1. 当用户指定 watch 中的deep属性为true时，会对对象中的每一项进行求值，此时会将当前watcher存入到对应属性的依赖中，这样对象中的属性发生变化时会通知数据更新；  
  2. 源码解读：  
    initWatch(vm,watch) 初始化watch ->
    createWatcher(vm, expOrFn, ..) 核心方法调用$watch ->  
    vm.$watch(expOrFn, ...) new Watcher() 创建一个用户user watcher ->  
    立即执行取值，进行依赖收集 value=this.get()，如果deep为true，执行traverse(value)循环取值  
8. Vue组件的生命周期
  1. 8个生命周期钩子：beforeCreate created beforeMount mounted beforeUpdate updated beforeDestroy destroyed  
  2. 开发中常用到的：
    created：实例创建完成，请求数据  
    mounted：实例挂在完成，DOM操作  
    beforeUpdate：更新状态的最后时机  
    update：执行依赖于DOM的操作，transition  
    beforeDestory：优化操作，清空定时器 解除绑定等  
  3. 源码解读：  
    Vue core/instance/index.js line:8 ->  
      initMixin(Vue)              1.初始化_init方法  
      stateMixin(Vue)             2.初始化$set $delete $watch  
      eventsMixin(Vue)            3.初始化 vue中的 $on $emit事件  
      lifecycleMixin(Vue)         4.初始化 _update方法  
      renderMixin(Vue)            5.初始化 _render方法  
    this._init() 调用_init()方法 初始化 vue的整个流程 core/instance/index.js line:16 ->  
      initLifecycle(vm)           1.初始化组件的父子关系  
      initEvents(vm)              2.初始化组件事件  
      initRender(vm)              3.初始化slot，$createElement方法  
      callHook(vm, beforeCreate)  4.生命周期 beforeCreate - 无法获取实例的数据  
      initInjections(vm)          5.解析inject  
      initState(vm)               6.初始化状态 响应式数据在这里完成  / method / watcat  
      iniProvide(vm)              7.解析provide  
      callHook(vm, created)       8.生命周期 created - 获取数据  
    - 判断有el，执行vm.$mount方法  ->  
    - 判断有模版，将模版转换成render函数，mount.call() 调用runtime的mount方法 platform/web/entry-runtime-with-compiler line:82 ->  
    - $mount 挂在组件 platform/web/runtime/index.js line:42 ->  
    - mountComponent 进行组件挂载 core/instance/lifecycle/index.js line:141 ->  
    callHook(vm, 'beforeMount')  生命周期 beforeMount方法  ->  
    vm._update(vm, _render) 初次渲染和更新  ->  
    callHook(vm, 'mounted') 生命周期 mounted方法 ->  
    flushSchedulerQueue 当页面变化时触发 生命周期 beforeUpdate updated core/observer/scheduler.js line:71 ->  
    当调用$destroy时触发 生命周期 beforeDestroy destroyed core/instance/lifecycle/index.js line
    :91 ->  
  9. ajax请求放在哪个生命周期中  
    1. 单页应用：created / mounted 都可以，区别就是 created不能获取dom节点，mounted是可以获取到的  
    2. 服务端渲染：不支持mounted方法，因此只能在created中请求  
  10. 何时需要使用 beforeDestroy  
    1. 组件使用了$on方法  
    2. 清楚定时器  
    3. 解除原生事件绑定 scroll mousemove ...  
  11. 模版编译原理  
    1. 将模版转化成 ast树,parseHTML()   
    2. 优化树,generate()  
    3. 将ast树 生成 render函数  
```js
  // 模版引擎的实现原理
  let render = `with(this){return ${code}}`
  let renderFn = new Function(render)
```
  12. Vue中 v-if 和 v-show 的区别
    1. v-if 如果条件不成立 不会渲染当前节点的dom元素，源码通过 三元判断 实现  
```js
  `<div v-if="true"><span v-for="i in 3">hello</span></div>`
  // 通过 vue compile 转化成 render函数，即模版引擎
  with(this) {
    return (true)
      ? _c('div', _l(3, funciton(){
          return _c('span', [_v('hello')])
        }), 0)
      : _e()
  }
```
    2. v-show 切换当前dom元素的显示和隐藏，源码 编译成指令 directive 实现  
```js
  `<div v-show="true"></div>`
  // 通过 vue compile 转化成 render函数，即模版引擎
  with(this) {
    return _c('div', {
      directives: [
        {
          name: 'show',
          rawName: 'v-show',
          value: (true),
          expression: 'true'
        }
      ]
    })
  }
```
  13. 为什么v-for 和 v-if 不能连用
    1. vue中 v-for的处理优先级比 v-if高一些，同时存在的时候首先处理 v-for，在处理 v-if  
```js
  `<div v-if="false" v-for="i in 3">hello</div>`
  // 通过 vue compile 转化成 render函数，即模版引擎
  with(this) {
    return _l(3, funciton(){
        return ((false) 
          ? _c('div', [_v('hello')])
          : _e())
      })
  }
```
  14. 用vnode来描述DOM结构
```js
  // 返回虚拟dom
  export function vnode(tag,data,key,children,text) {
    return {
      tag,
      data,
      key,
      children,
      text
    }
  }

  // 转化成虚拟DOM
  function _c(tag,data,...children){
    let key = data.key
    delete data.key
    children = children.map(child => {
      if(typeof child === 'object'){
        return child
      }else {
        return vnode(undefined,undefined,undefined,undefined,child)
      }
    })
    return vnode(tag,data,key,children)
  }
```
  15. diff算法的时间复杂度  
    1. 两个树完全的diff算法是一个时间复杂度为o(n3)，vue进行优化将时间复杂度转换为o(n)，只比较统计不开绿跨级的问题。  
       在前端中，很少回跨域层级进行DOM元素的移动  
  16. 简述vue中diff算法原理  
    1. 先同级比较，再子节点比较  
    2. 处理一方有子节点，一方无子节点的情况  
    3. 处理都有子节点的情况
       1. 头跟头比 i++       -> 开头插入  
       2. 尾跟尾比 l--       -> 结尾插入  
       3. 头跟尾比 i++ l--   -> 正序  
       4. 尾跟头比 i-- l++   -> 倒序  
       5. 递归 循环拿新节点匹配老节点，如果匹配到直接移动老节点到老节点开始到前面，如果匹配不到将新节点插入到老节点开始的前面；循环结束若老节点还有剩余，删除移除所有老节点  -> 乱序  








拓展
1. 渲染watcher  
2. 计算watcher  
3. 用户watcher  
4. v-for的实现：通过一个 function函数 实现的  
5. 关于template的转化路径  
template -> ast树 -> codegen() -> render函数 -> 内部调用_c方法 -> 虚拟DOM  
6. vue将template转换为ast使用的是jquery之父写一个ast解析库 http://erik.eae.net/simplehtmlparser/simplehtmlparser.js  
