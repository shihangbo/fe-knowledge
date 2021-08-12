

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
11. 模版编译原理 - 把模版变成render函数
  - vue源码模版引擎的实现原理三步 baseCompile方法
  - 第一步：将模版转化成ast(抽象语法树，描述html语法的对象)：`const ast = parse(template.trim(), options)`
        主要通过正则匹配出标签/属性/{{}}模版语法/指令等描述html的元素，返回一个ast对象
  - 第二步：将ast生成js代码：`const code = generate(ast, options)`
        主要遍历ast对象用字符串拼接的方式生成可供js执行的字符串，返回这个字符串
  - 第三步：包装成函数：let render=`with(this){return ${code}}`; let renderFn=new Function(render)
        将字符串用with语句拼接，用 `new Function` 包装成一个js函数，render函数
12. v-if 与 v-show 区别
  - v-if 如果条件不成立，不会渲染当前指令所在节点的dom元素，编译成`一个三元表达式`，if判断成立则渲染节点，不成立则为空
  - v-show 切换当前节点dom元素的显示或者隐藏，编译成`一个指令dirctives`，运行时会处理 show指令，如果value是false，设置当前元素的 el.style.display='none'
13. 为什么 v-for 和 v-if 不能连用
  - 先循环后判断，v-for 的优先级比 v-if高，连用的话，v-if会给每个元素都添加一下，造成性能问题
14. vue中的虚拟DOM
  - 源码中创建标签： _c() -> vnode()
  ```js
  function _c(tag,data,...children){
    let key = data.key
    delete data.key
    children = children.map(child=>{
      if(typeof child === 'object'){
        return child
      } else {
        return vnode(undefined,undefined,undefined,undefined,child)
      }
    })
    return vnode(tag,data,key,children)
  }
  function vnode(tag,data,key,children,text){
    return {
      tag,data,key,children,text
    }
  }
  let r = _c('div',{id:'container'},_c('p',{},'hello'),'watson')
  console.log(r)
  ```
15. diff算法的时间复杂度
  - vue是基于同层级的元素的 vDom的对比，vue的优化逻辑分为四步
  - 第一步：先同级比较，在比较子节点
  - 第二步：先判断一方有子节点，一方没有子节点的情况
  - 第三步：比较都有子节点的情况(双指针算法)
  - 第四步：递归比较子节点
16. v-for 中为什么要用key
  - 为了做dom-diff，比较两个元素是否相等，比较key和标签名是否相等
  - 如果没有key，vue只会对应标签名，如果标签名一样，会复用当前标签，只创建不同的子元素
17. 描述组件的渲染，更新过程，以及组件的复用
  - 父子组件的渲染顺序 - 生命周期调用顺序
      - 首次渲染：父beforeCreate - 父created - 父beforeMount - 子beforeCreate - 子created - 子beforeMoute - 子mounted
      父mounted
      - 子组件更新：父beforeUpdate - 子beforeUpdate - 子updated - 父updated
      - 父组件更新：父beforeUpdate - 父updated
      - 销毁：父beforeDestory - 子beforeDestory - 子destoryed - 父destoryed
      - 原则：组件创建/销毁都是 `先父后子`，组件渲染挂载/销毁完成都是 `先子后父`
  - 渲染组件：分两步
      第一步：创建，调用createComponent方法，通过 `Vue.extend` 构建组件的构造函数，返回组件vnode对象
      第二步：挂载，调用createElm，通过组件的init方法 去 new Ctor一个实例，手动调用 `child.$mount` 进行挂载，并且实例化组件watcher
  - 更新组件：进行 patchVnode流程，核心是diff算法
  - 复用：多次创建组件，多次 new Ctor 产生不同的实例
18. 组件中的data为什么是一个函数，为什么会被复用
  - data属性在options对象中，options对象被定义在组件Ctor的原型，data如果是一个对象的话可通过原型链可进行共享，如果是一个函数的话，每次实例化组件的时候都会获取到一份独立的数据
  - `mergeOptions(Super.options,extendOptions)`
20. Vue中事件绑定的原理
  - vue的事件绑定有两种：原生的事件绑定 `@click.native="fn"`，组件的事件绑定 `@click="fn1"`
  - 原生：addEventListener实现，组件编译后原生事件为 nativeOn属性 等价于 普通元素的on
  - 组件：$on实现，组件编译后的事件为 on会单独处理
  - 性能问题：避免给v-for里面的元素绑定事件
21. v-model 实现原理 如何自定义
  - 原理：是input || textarea 标签中     `value+input方法` 的语法糖，被编译成3个属性 `指令/domProps(value)/on(input)`
         type='checkbox'  `checked+change方法`，被编译成3个属性 `指令/domProps(checked)/on(change)`
         type='select'    ?
         type='radio'     ?
         type='textarea'  ?
         是自定义组件中     `value+input方法` 的语法糖，被编译成 `model:{value:(value),callback:function(){},expression:'value'}`，在组件创建的时候进行转化transformModel，默认prop设为value，event设为input，并且绑定on事件=callback
  ```html
    <input :value="value" @input="input"/>
    <input v-model="value"/>
  ```
  - 自定义：在组件中自定义 `model:{prop:'value',event:'input'}`，prop对应value名字，event对应方法名
22. v-html 使用的问题
  - 原理：innerHTML
  - 导致xss攻击 `<img onerror="fn"/>`
  - 会替换掉标签内部子元素
23. 通信问题 - 6种方式
  - vue组件的通信是基于 `单向数据流`
  - 1.父子间通信：props,$on-$emit（发布订阅）
  - 2.父子组件实例：$parent,$children
  - 3.父组件提供数据：Provide,inject（插件）
  - 4.获取组件实例：ref
  - 5.跨组件通信：Event Bus，基于$on-$emit，专门创建一个实例`Vue.prototype.$bus = new Vue()`进行通信
  - 6.状态管理：vuex
24. 相同逻辑如何抽离
  - Vue.mixin 给组件每个生命周期，函数等混入一些公共逻辑
  - 原理：
  ```js
    Vue.minix = function(mixin){
      this.options = mergeOptions(this.options,mixin) // 将当前属性合并到每个组件中
      return this
    }
    function mergeOptions(parent,child){
      // todo...
      if (child.mixins) { // 递归合并mixin
        for(let i=0,l=child.length;i<l;i++){
          parent=mergeOptions(parent,child.mixins[i])
        }
      }
      // todo...
    }
  ```
25. 
  - 
26. 
  - 
27. 
  - 
28. 
  - 




