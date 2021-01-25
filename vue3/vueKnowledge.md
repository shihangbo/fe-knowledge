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
  17. v-for中为什么要用key 
    1. 在patch过程中更好的利用原有元素  
    2. diff过程中，比较标签名和key  
    3. vue渲染列表时的优化策略：
        1. 在没有key的情况下或者使用索引作为key值的时候，比较修改前和修改后的虚拟dom，发现两者标签一样的时候，vue优先复用旧标签，只修改里面的内容  
        2. 当有唯一的key的时候，比较修改前和修改后的虚拟dom，发现标签一样但是key不一样，查找原有列表中时候存在一样的，有就复用（就是移动标签），没有就创建新标签  
  18. 组件渲染和更新的过程  
    1. 渲染组件时，会通过Vue.extend方法构建子组件的构造函数，并进行实例化，最终手动调用 $mount() 进行挂在  
       更新组件时，会进行 patch Vnode流程，核心是diff算法  
  19. 组件中的data为什么是一个函数，防止被公用，为什么被公用  
    1. 同一个组件被复用多次，会创建多个实例，这些实例通过组件的Ctor进行实例化，如果data是一个对象，那么所有实例都共享这个对象；为了保证组件数据的独立性，组件实例化的过程中通过data函数返回一个对象作为组件的状态  
    2. 源码解析  
      Sub.options = mergeOptions(Super.option,extendOptions) 对创建的子类，进行合并参数 merge to option objects into a new one  ->  
      strat(data)  判断childVal && typeof childVal !== 'function' 提示 warn('the data option should be a function. that returns a per-instance value in component definitions.')  ->  
      mergeDataOrFn(parentVal,childVal)  进行合并  
  20. vue中的事件绑定原理  
    1. vue的事件绑定有两种，原生 / 组件的事件绑定  
    2. 原生dom事件绑定，采用addEventListener实现  
```js
  `<div @click="fn">hello</div>`
  // 通过 vue compile 转化
  {on:{click:function($event){return fn()}}}
```
    3. 组件事件绑定，采用 $on 方法  
```js
  `<my-component @click.native="fn" @click="fn1">hello</my-component>`
  // 通过 vue compile 转化
  {nativeOn:{click:function($event){return fn($event)}},on:{click:fn1}}

  // 组件自定义事件
  // 定义
  $myComponent.on('click',()=>{})
  // 使用
  $myComponent.$emit('click')
```
    4. 组件中的nativeOn 等价与 普通元素on，组件的on进行单独处理  
    5. 源码解析  
    updateDOMListeners()  普通元素的事件处理函数 ->  
      udpateListeners(on, oldOn, add$1 ...)  ->  
      target$1.addEventListener(name,handler,capture)  普通元素绑定事件   
    updateComponentListener(vm,listeners,oldListeners) ->  组件的事件处理函数  
      udpateListeners(listeners, oldListeners, add ...)  ->  
      target.$on(event,fn)  组件绑定事件，使用发布订阅模式，调用内部的$on方法  
    6. 这边会引申出一个事件优化的问题，在循环列表元素绑定事件，不然给每个元素使用addEventListener绑定事件性能不好，一定要用事件代理方式进行优化  

  21. v-model的实现原理  
    1. 组件的v-model是 value + input方法 的语法糖，也是组件的 v-model  
    2. 还有其他的v-mode绑定：checkbox v-model / select v-model  
```html
<!-- 使用 -->
<el-checkbox :value="" @input=""></el-checkbox>
<el-checkbox v-model=""></el-checkbox>
```
    3. 源码实现  
```js
  // 组件的v-model 自定义 通过：model属性 实现
  Vue.component('el-checkbox', {
    template: `<input type="checkbox" :checked="check" @change="$emit('change',$event.target.checked)">`,
    model: {
      prop: 'check',   // 自定义el-checkbox 默认的value名字
      event: 'change'  // 自定义el-checkbox 默认的input方法名
    },
    props: {
      check: Boolean  
    }
  })
  // 编译之后
  with(this){
    return _c('el-checkbox',{
      model: {
        value: (check),
        callback: function($$v){
          check = $$v
        },
        expression: 'check'
      }
    })
  }

  // 普通元素的v-model 通过: 指令 + value(props) + input(on) 实现
  `<input v-model="value">hello</input>`
  // 编译之后
  with(this) {
    return _c('input', {
      directives: [
        {
          name: 'model',
          rewName: 'v-model',
          value: (value),
          expression: 'value'
        }
      ],
      domProps: {
        'value': (value)
      },
      on: {
        'input': function($event){
          if($event.target.composing) return;
          value = $event.target.value
        }
      }
    })
  }
```
    4. 组件的v-model：编译之后通过model属性实现，可以通过template增加model属性进行名称的自定义   
      - genComponentModel() : data.attrs.value = 'xxx' + on[event] = callback
    5. 普通元素的v-model：不同的标签会解析出不同的内容，platforms/web/compiler/directives/model.js  
      - tag === 'select' : genSelect() : 
      - tag === 'input' && type === 'checkbox' : genCheckboxModel() : checked + change  
      - tag === 'input' && type === 'radio' : genRadioModel() : value + input / change  
      - tag === 'input' || tag === 'textarea' : genDefaultModel() : 

  22. vue中的v-html会导致什么问题  
    1. 可能导致 xss攻击  
    2. v-html 会替换掉标签内部的子元素  
    3. 源码实现  
```js
  `<div v-html="<span>hello</span>"></div>`
  // 模版编译后 
  with(this) {
    return _c('div',{
      domProps: {
        innerHTML: _s('<span>hello</span>')
      }
    })
  }
  // _s 的处理方式
  if (key === 'textContent' || key === 'innerHTML') {
    // 删除所有子元素
    if(vnode.children)  vnode.children.length = 0
    // 设置新值
    elm['innerHTML'] = cur
  }
```

  23. 父子组件 生命周期的调用顺序  
    1. 加载渲染过程 : f beforeCreate -> f created -> f beforeMounte -> c beforeCreate -> c created -> c beforeMounte -> c mounted -> f mounted  
    2. 子组件更新   : f beforeUpdate -> c beforeUpdate -> c updated -> f updated  
    3. 父组件更新   : f beroreUpdate -> f updated  
    4. 销毁过程    :  f beforeDestroy -> c beforeDestroy -> c destroyed -> f destroyed  
    5. 总体的执行顺序
      - 组件的调用顺序 先父后子，渲染完成的顺序 先子后父  
    6. 组件的渲染流程
        patch 渲染和更新调用patch方法  
        insertedVnodeQueue 收集组件的vnode  
        createElm 创建元素  
          普通元素 createChildren 递归遍历子节点 -> 这里会回到 createElm 方法 ->  
          组件    createComponent 创建组件
            调用组件 init 方法 -> 这里会回到 patch方法 渲染当前组件的内容 ->  
            initComponent 将pendingInsert 插入到自己的queue 中  
            invokeCreateHooks insertedVnodeQueue 放入当前vnode
        invokeInsertHook 1.如果是子组件，会将queue赋予给父组件的pendingInsert 上；2.如果不是patch就会一次调用insert方法；  
    6.1 insertedVnodeQueue 代表组件初始化完之后，渲染/更新函数统一暂存在 这个队列中  

  24. 通信？- 6  
    1. 父子之间：props + $on / $emit  
    2. 通过实例：$parent / $children  
    3. 调用组件：ref  
    4. 父提供数据 子消费数据：provide / inject  
    5. 跨组件通信：Event / Bus  
    6. 状态管理：Vuex  
  25. Vue 中间相同的逻辑如何抽离 / 生命周期合并规则  
    1. Vue.mixin  
      1.1 Vue.mixin 源码解析  
```js
Vue.mixin = function(mixin) {
  this.options = mergeOptions(this.options, mixin) // 将定义的属性合并到组件中
  return this
}
//strats 保存各种合并策略 data watch computed lifeCycle ...
function mergeOptions(parent, child) {
  if (!child._base) {
    // 递归合并 extends
    // 递归合并 mixin
  }
  // 合并属性和生命周期
  const options = {}
  let key
  for(key in parent){
    mergeField(key)
  }
  for(key in child) {
    mergeField(key)
  }
  function mergeField(key){
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key],child[key],vm,key)
  }
  return options

}
```
    2. 生命周期合并规则  
```js
  // 定义生命周期的合并规则
  LIFECYCLE_HOOK.forEach(hook => {
    strats[hook] = mergeHook
  })
  function mergeHook(parentVal,childVal) {
    // 父子都有 父.concat(子)
    // 子有 父没有，返回子
    // 子没有 父有，返回父
  }
  // 执行 ：循环数组，依次执行 mixin的先执行
```
  26. 为什么使用异步组件，什么场景下使用
    1. 遇到组件打包出来的结果很大，使用异步组件（刚开始不用加载，通过异步的方式进行加载）  
    2. import() 语法  
```js
  // 用法
  components: {
    addCustomerSchedule: (resolve) => import(../components/AddCustomer)
  }
  // 原理 - 异步组件是一个函数 新版本提供了返回对象的形式
  // 1.组件创建过程中 调用 Ctor = resolveAsyncComponent(asyncFactory, baseCtor)方法，并且asyncFactory马上执行，并不会马上返回结果，即undefined，渲染一个注释  
  // 2.当异步组件加载之后，成功调resolve/失败调reject，resolve会执行forceRender 强制更新，再次调用 resolveAsyncComponent 函数，直接返回成功或者失败的 Promise，进行组件的创建和渲染  
```

  27. 什么是作用域插槽 插槽和作用域插槽的区别  
    1. 插槽：渲染组件时，会拿对应的slot属性的节点进行替换操作 - 插槽的作用域为父组件  
    1.1 插槽元素对应的vnode在父组件中，当组件使用slot标签时，用父组件对应的vnode进行替换操作  
    1.2 源码解析  
```js
  // 父组件
  `<my-component>
    <div slot="header">node</div>
  </my-component>`
  // 编译之后
  with(this){
    return _c('my-component',[
      _c('div', {
        attrs: {
          'slot': 'header'
        },
        slot: 'header'
      }, [_v('node')])
    ])
  }
  // my-component 子组件
  `<div>
    <slot nam="header"></slot>
  </div>`
  // 编译之后  
  // _t = renderSlot
  with(this){
    return _c('div',[
      _t('header')
    ])
  }
```
    2. 作用域插槽：在解析的时候不会作为组件的子节点，而是解析成函数，当子组件渲染时，会调用此函数进行渲染 - 插槽的作用域为子组件  
    2.1 作用域插槽的内容 会被 编译成一个函数存在与父组件的vnode中，当子组件真正渲染的时候，才会执行这个函数，由子组件渲染成真实元素  
    2.2 源码解析  
```js
  // 父组件
  `<app>
    <div slot-scoped="msg" slot="footer">{{msg.a}}</div>
  </app>`
  // 编译之后
  // 作用域插槽的内容 会被 编译成一个函数
  // _u = resolveScopedSlots
  with(this){
    _c('app',{
      scopedSlots: _u([
        {
          key: 'footer',
          fn: function(msg){
            return _c('div',{},[_v(_s(msg.a))])
          }
        }
      ])
    })
  }
  // 子组件
  `<div>
    <slot name="footer" a="1" b=2"></slot>
  </div>`
  // 编译之后  
  with(this){
    return _c('div',[
      _t('footer',null,{
        a:'1',
        b:'2'
      })
    ])
  }
```
  28. keep-alive 的理解  
    1. 实现组件的缓存，当组件切换是不会对当前组件进行卸载  
    2. 两个属性：include / exclude  
    3. 两个生命周期：activated / deactivated  
    4. 一个算法：LRU算法（最近最久未使用法：把最近渲染放在列表最后面，删除从第0个开始）  
    5. 实现原理  
      5.1 内部维护一个缓存列表
  29. 编码优化  
    1. 精简data中的数据，比如定时器就不要放data了，比如只渲染的数据可以使用 Object.freeze 冻结  
    2. v-for的时候使用事件代理，同时key保证唯一性，优化diff性能  
    3. spa页面采用keep-alive缓存组件  
    4. 拆分组件，提高复用性，增加代码可维护性，较少不需要的渲染  
    5. 适当的使用v-if替代v-show  
    6. 合理使用路由懒加载，异步组件  
    7. 尽量采用runtime运行时版本  
    8. 数据持久化问题（防抖，截流）  

  30. vue加载性能优化  
    1. 第三方模块按需加载 babel-plugin-component  
    2. 滚动到可视区域动态加载 https://tangbc.github.io/vue-virtual-scroll-list  
    3. 图片懒加载 https://github.com/hilongjw/vue-lazyload.git  
  31. 用户体验  
    1. app-skeleton 骨架屏  
    2. app-shell app壳  
    3. pwa serviceworker  
  32. seo优化  
    1. 预渲染插件 prerender-spa-plugin  
    2. ssr服务端渲染  
  33. 打包优化  
    1. 使用cdn的方式加载第三方模块  
    2. 多线程打包 happypack  
    3. splitChunks 抽离公共文件  
    4. sourceMap 生成  
  34. 缓存，压缩  
    1. 客户端缓存、服务端缓存  
    2. 服务端gzip 压缩  

  35. vue3 的改进 （这个题没有水平）  
    1. ts  
    2. 支持 Composition api，解决了mixin的缺陷，vue2代码的紊乱的问题  
    3. proxy  
    4. diff算法更新，只更新vdom的绑定了动态数据的部分  
  
  36. 实现hash路由和history路由
    1. onhashchage
    2. history.pushState
  
  37. vue-router 中导航守卫有哪些  
    1. runQueue  
    


拓展
1. 渲染watcher  
2. 计算watcher  
3. 用户watcher  
4. v-for的实现：通过一个 function函数 实现的  
5. 关于template的转化路径  
template -> ast树 -> codegen() -> render函数 -> 内部调用_c方法 -> 虚拟DOM  
6. vue将template转换为ast使用的是jquery之父写一个ast解析库 http://erik.eae.net/simplehtmlparser/simplehtmlparser.js  
7. 组件复用：创建多个相同的组件，多次 创建组件的实例  
8. Object.create(), 字面量创建, new Object() 之间的区别
    Object.create() 创建带有指定原型对象和属性的新对象；两个参数：(proto,propertiesObject)，proto - 新创建对象的原型对象，即提供新对象的__proto__属性，propertiesObject - 参照Object.defineProperties()的第二个参数，定义其可枚举属性和修改的属性描述符对象，即数据描述符(value,writable,configurable,enumerable)和访问器描述符(get,set,configurable,enumerable)  
    字面量创建 和 new Object() 创建的新对象是继承了Object对象原型的对象；字面量创建 - 最简洁的写法；
9. 为什么new Vue(data:{})中的data是一个对象：因为项目中只会实例化一次Vue；  
10. vue中的发布订阅 $on $emit
  $on: 维护一个队列 {a: [fn1,fn2,fn3,...]}  
```js
  vm._events[event].push(fn)
```
  $emit: 找到event对应的队列，执行他  
```js
  let cbs = vm._events[event]
  for(let i=0,l=cbs.length;i<l;i++){
    invokeWithErrorHandling(cbs[i], vm, ...)
  }
```
11. 生命周期是怎么合并的  
12. LRU算法实现  
13. 动态区域加载原理：判断可视区域，加载数据的上一屏/当前屏/下一屏  
14. 图片懒加载：根据图片onload事件，判断可视区域，先预加载图片，再加载原图片的过程  
