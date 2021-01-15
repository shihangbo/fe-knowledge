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
7. watch中 deep:true 的实现
  