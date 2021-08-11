

1. MVVM
  - view-DOM元素，ViewModel-vue帮我做了(监听数据/操作DOM/DOM指令等)，Model-数据
2. 响应式数据的原理
  - vue2 `Object.defineProperty()`
  - 源码中的流程，在initData时，会给data中的属性使用OD重新定义getter和setter，(对象走walk，数组走observeArray，当页面获取属性时（执行属性的getter方法，depend()），会进行依赖收集(当前组件的watcher)，如果属性发生变化（执行属性的setter方法，notify()）会通知依赖进行更新操作(更新操作是异步的，为什么/如何实现)
  - 应用的设计模式：订阅/发布模式，函数切片模式
  - 实现中的优化：针对大对象/大数组，如果只是展示性的，应该减少依赖的收集
3. 如何检测数组的变化
  - observeArray进行原型链重写（`target.__proto__ = arrayMethods = Object.create(Array.prototype)`），并指向自己定的数组原型方法
  - 重写Array原型的7个常用操作数组的方法：`push/unshfit/pop/shift/splice/reserve/sort`
  - 当调用这些方法的时候，先执行Array原生方法，如果是push/unshfit/splice判断时候需要对新数据进行监听，然后手动通知视图更新
  - 对数据的每一项进行监听 执行observe方法
4. 为何Vue采用异步渲染
  - 前提：vue2是组件级别的更新，一个组件可能有很多个依赖属性
  - 性能考虑
  - 执行notify，通知watcher进行更新操作，依次调用update方法，queueWatcher会根据watcher.id去重放到queue队列中，最后nextTick异步清空队列
5. nextTick原理
  - 原理：nextTick方法使用事件循环机制（宏任务和微任务）
  - 微任务：每次主线程执行完，清空微任务，promise，MutationObserver
  - 宏任务：当微任务执行完，队列中第一个宏任务进入主线程，setImmediate，setTimeout，点击事件，script，ajax...
  - 怎么处理多次调用 nextTick：都会执行
6. computed原理
  - computed 也是一个watcher，具备缓存，只当依赖的属性发生变化时才会执行方法
  - 源码：initComputed方法，创建的watcher具备lazy=true dirty=true，默认不执行，然后将计算属性定义到实例上(defineComputed，vm['计算属性']，通过OB且重新定义的computedGetter方法，可真正获取当前computed属性的值)，当依赖属性创建并取值时，才执行方法，执行的时候会根据依赖属性是否变化，进行判断是否重新执行方法重新取值
7. watch原理
  - computedWatcher计算属性：lazy=true dirty=true
  - 渲染watcher：queueWatcher(this)，aync=true
  - userWatcher 用户自定义 `vm.$watch('watson', ()=>{})`
    - `initWatch() -> $watch -> new Watcher() -> deep=true && traverse(value) 递归遍历数组对象的所有属性`
8. method原理
  - 方法用到模版上，每次视图更新都会执行
9. computed，watch比较
  - 计算属性是同步执行的默认不执行，计算属性的watcher比普通watcher先执行；
  - 为什么computed没有deep:true属性，因为计算属性使用在模版中{{}}，在模版中的数据会调用JSON.stringify()，JSON.stringify里面是一个对象的话，会默认对对象里的属性进行取值
  - watch默认先执行，有deep:true属性，将对象里面的所有属性进行依赖收集
  - 源码中有写：user watchers > render watchers
10. 生命周期
  - 最佳实践 - 每个生命周期可以做什么
    - beforeCreate：
    - created：实例化完成，获取vm属性和方法，watch/event事件回调，【未挂载】，ssr时请求数据请求
    - beforeMount：
    - mounted：挂载完成，获取vm.$el，请求ajax
    - beforeUpdate：数据更改，虚拟DOM重新渲染之前，为了不附加重新渲染，在这里进一步更改状态
    - updated：禁止更改数据，ssr不被调用
    - beforeDestory：实例销毁之前，清除定时器，清除原生绑定，清除$on
    - destoryed：实例和所有子实例销毁完成，ssr不被调用
11. 