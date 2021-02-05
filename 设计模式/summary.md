
# 设计模式

### 1. 面向对象
  0. 软件开发经历分析，设计和编码三个阶段  
  1. 以【类和对象】作为组件代码的基本单位，实现抽象，封装，继承，多态四个特性
    1.1 抽象：把客观事物抽象成属性数据和对数据的相关操作，把内部细节信息隐藏起来，让调用者只关心功能而不是关心功能的实现  
             提高代码的可拓展性和可维护性  
             例子：缓存
```ts
interface IStrorage{
  save(key:any,value:any): void
  read(key:any): void
}
class LocalStorage{
  save(){}
  read(){}
}
class Cookie{
  save(){}
  read(){}
}
// 固定的
class User{
  constructor(public name:string, public storage:IStrorage){
    this.name = name
    this.storage = storage
  }
  save(){
    this.storage.save()
  }
  read(){
    this.storage.read()
  }
}
let user = new User('watson', new LocalStorage())
user.save()
user.read()
```
    1.2 封装：把同一类型的客观对象的属性数据和操作绑定在一起，封装成类，并且把部分内容属性隐藏起来，与外界隔离，即保护类的隐私同时提高类的易用性  
      2.1 public：公有修饰符，在类内或者外部使用，默认
      2.2 protected：受保护的，在本类和子类中使用
      2.3 private：私有的，只能在本类内部使用
    1.3 继承：子类可以继承父类，实现属性和操作的共享，抽离公用方法，提高复用，减少冗余  
             例子：原型模式
    2.4 多态：子类可以替换父类，子类可以重写父类的方法，保持子类的开放性和灵活性，同一个接口不同子类可以有不同现实，面向接口编程  
      2.4.1 ts支持抽象类 abstract
```ts
abstract class Animal{
  abstract speak(): void
}
```
### 2. ts
  1. 静态类型校验
  2. 接口 interface，相当自定义类型 
```ts
  // 定义接口 - 只描述name即可
  interface Name {
    firstName: string;
    lastName: string;
  }
  // 定义接口 - 只描述 飞 的翅膀即可
  interface Fly {
    swing: number;
  }
  // 使用接口
  function greeting(obj: Name) {
    console.log(obj.firstName + obj.lastName)
  }
  const name1 = {
    firstName: 'xiao'
  }
  greeting(name1)
```

### 3. 设计原则
  1. 什么是设计
    1.1 按哪一种思路或者标准来实现功能
    1.2 功能相同，可以有不同设计的方式
    1.3 需求如果不断变化，设计的作用才能体现出来
  2. SOLID 五大设计原则
    2.1 S 单一职责原则: single responsibility principle 【单一功能】，一个程序只做好一件事，进行拆分，vue源代码的文件系统，拆分不同的代码块，保持整个代码的整洁，便于维护  
    2.2 O 开放封闭原则: open close principle，【对拓展开放，对修改封闭】，新增需求时拓展新代码，而非修改已有代码，vue的合并策略，针对不同的属性，data/methods/生命周期/watcher等等进行不同的合并，后续增加新的属性，只要增加新的合并策略规则即可    
    2.3 L 里氏替换原则: liskov substitution principle，程序中的对象应该是可以在不改变程序正确性的前提下【被他的子类所替换】
                      要求子类不能违反父类的功能和规定，父类的方法返回number，子类的同方法必须返回number   
    2.4 I 接口隔离原则: interface segregation principle，【多个特定客户端接口好于一个宽泛用途的接口】  
```ts
// 推荐
interface Running{
  run():void;
}
interface Flying{
  fly():void;
}
interface Swimming{
  swim():void;
}
// 避免定义如下胖接口
interface AutomobileInterface{
  run():void;
  fly():void;
  swim():void;
}
class Automobile implements Running,Flying,Swimming{
  run(){}
  fly(){}
  swim(){}
}
```
    2.5 D 依赖反转原则: dependence inversion principle，一个方法应该遵从【依赖于抽象而不是实例】，依赖注入是改原则的一种实现  
                      例子：找女朋友，先想象女朋友是什么样子(性格好的，漂亮的...)，而不能喜欢angularBaby就找她，一辈子单身  
```ts
// 定义接口
interface GirlFriend{
  age:number;
  height:number;
  cook(): void;
}
// 实现接口
class Lin implements GirlFriend{
  public cook():void{}
}
class Mei implements GirlFriend{
  public cook():void{}
}
class SingleDoy{
  constructor(public girlfriend: GirlFriend){}
}
let dog1 = new SingleDog(new Lin())
let dog2 = new SingleDog(new Mei())
```
    2.6 最少知识原则: 迪米特法则，降低类之间的耦合，实现内聚，少用public多用private protected  
                    例子：层级管理，ceo - 销售经理 - 销售  
    2.7 合成复用原则: 尽量使用聚合/组合的方式，而不是继承实现代码  
                    类之间有三种基本关系，关联(聚合和组合)，泛化和依赖  
                    依赖：另外一个类是当前类的方法和属性，例如学生读书，学生和书之前有依赖关系，关系最弱  
                    关联：单项关联，双向关联，关系弱  
                    聚合：班级和学生，一个班里面有很多学生，班级没了学生还在，关系中等  
                    组合：人和心脏，心脏是组成人的一个部分，关系最强  
                    泛化：数学老师和老师，老师就是数学老师的泛化  
```ts
class Cooker{
  cook(){}
}
// 不推荐 - 将自己变成一个厨师
class Person1 extends Cooker{

}
// 推荐 - 将厨师变成自己的一个属性
class Person2{
  private cooker: Cooker
  cooker(){
    this.cooker.cook()
  }
}
```
    2.8 总结: 开闭原则是核心，是软件设计的基石  
             单一职责是编码的基本要求  
             里氏替换原则，接口隔离原则，依赖反转原则构建大型项目  

### 4. 工厂模式
  1. 简单工厂模式
    缺点：需求增长的时候，需要改原方法，不符合“开闭原则”；
```ts
  class Plant {
    constructor(name) {
      this.name = name
    }
    grow() {

    }
  }
  class Apple extends Plant {
    constructor(name, flavour) {
      super(name)
      this.flavour = flavour
    }
  }
  class Orange extends Plant {
    constructor(name, flavour) {
      super(name)
      this.flavour = flavour
    }
  }
  // 直接通过 new 获取实例
  // 缺点：
  // 1. 耦合
  // 2. 依赖具体实现
  const a = new Apple()
  const o = new Orange()
  
  // 简单工厂模式
  class Factory {
    // 静态方法，不会被继承，只能直接调用
    static create(type, name, flavour){
      switch(type) {
        case 'apple':
          return new Apple(name, flavour)
        case 'orange':
          return new Orange(name, flavour)
        default:
          throw new Error('没有了')
      }
    }
  }
  const a1 = Factory.create('apple', '苹果', '甜')
  const o1 = Factory.create('orange', '橘子', '酸')
```
  1.1 经典场景
    1.1.1 jQuery
```ts
  // 定义
  class jQuery{}
  window.$ = function() {
    return new jQuery()
  }
  // 使用
  $('li').html()
  $('li').addClass('red')
```
    1.1.1 React
```ts
  let h1 = React.createElement('h1', {className: 'title'}, 'hello')
  class Vnode{
    constructor(tagName,attrs,children) {
      this.tagName = tagName
      this.attrs = attrs
      this.children = children
    }
  }
  function createElement(tagName,attrs,children) {
    return new Vnode(tagName,attrs,children)
  }
```
  2. 工厂方法模式，多态性工厂模式
    概述：区别是工厂类不再直接所有类的创建，而是将具体创建的工作交给子类完成  
```ts
  // 定义工厂接口 规定子类必须实现的方法
  // 依赖抽象，不依赖实现
  // 可抽离成单独js文件
  class Factory{
    create(){}
  }
  // 实现接口 苹果工厂 可抽离成单独js文件
  class AppleFactory extends Factory{
    static create(name, flavour) {
      return new Apple(name, flavour)
    }
  }
  // 实现接口 橘子工厂 可抽离成单独js文件
  class OrangeFactory extends Factory{
    static create(name, flavour) {
      return new Orange(name, flavour)
    }
  }
  // 动态配置项，可抽离成单独配置js文件
  const settins = {
    'apple': AppleFactory,
    'orange': OrangeFactory
  }
  // 使用
  const a2 = settins['apple'].create('苹果', '甜')
  const o2 = settins['orange'].create('苹果', '甜')
```
  3. 抽象工厂模式
    概述：提供一个接口，在不指定具体产品的情况下，创建多个产品对象  
```ts
// 定义工厂基类
class Factory{
  createButton(){} // 创建按钮
  createIcon(){} // 创建图标
}
// 定义图标基类
class Icon{}
class AppleIcon{
  render(){ console.log('绘制AppleIcon') }
}
class WindowIcon{
  render(){ console.log('绘制AppleIcon') }
}
// 定义按钮基类
class Button{}
class AppleButton{
  render(){ console.log('绘制AppleIcon') }
}
class WindowButton{
  render(){ console.log('绘制AppleIcon') }
}

// 定义工厂
class AppleFactory extends Factory {
  createButton(){
    return new AppleButton()
  }
  createIcon(){
    return new AppleIcon()
  }
}
class WindowFactory extends Factory {
  createButton(){
    return new WindowButton()
  }
  createIcon(){
    return new WindowIcon()
  }
}

// 使用
// apple平台
const applePlatform = new AppleFactory()
const appleButton = applePlatform.createButton()
appleButton.render()
const appleIcon = applePlatform.createIcon()
appleIcon.render()
// window平台
const windowPlatform = new WindowFactory()
const windowButton = applePlatform.createButton()
windowButton.render()
const windowIcon = applePlatform.createIcon()
windowIcon.render()

```

### 5. 单例模式
  1. 单例的实现
```ts
  // es5 用闭包实现 - 优化后的
  function Window(name){
    this.name = name
  }
  const CreateSingle = (function(Constructor){
    let instance;
    let SingleConstructor = function() {
      if (!instance) {
        instance = new Constructor(...arguments)
      }
      return instance
    }
    return SingleConstructor
  })()
  let w1 = new CreateSingle(Window)
  let w2 = new CreateSingle(Window)
  console.log(w1 === w2)

  // es6 用类实现
  // 定义类
  class Window {
    constructor(name) {
      this.name = name
    }
    static getInstance() {
      if(!this.instance) {
        this.instance = new Window()
      }
      return this.instance
    }
  }
  let w3 = Window.getInstance()
  let w4 = Window.getInstance()
  console.log(w3 === w4)
```
  2. 命名空间
    概述：防止便携代码过程中的名字冲突  
```ts
  // jQuery 实现 - 封装在一个$对象中
  $ = {
    get(){},
    post(){}
  }
  // 使用 
  $.get()
  $.post()
```
```ts
  // 自定义utils库
  let utils = {a:1}
  utils.define = function(namespace,fn) {
    let namespaces = namespace.split(/\./)
    let fnName = namespaces.pop()
    let current = utils
    for (let i=0,l=namespaces.length;i<l;i++){
      let ns = namespaces[i]
      if (!current[ns]) {
        current[ns] = {}
      }
      current = current[ns]
      current.a = 2
    }
    current[fnName] = fn
  }
  utils.define('dom.addClass',function(){
    console.log('dom.addClass')
  })
  // 使用
  console.log(utils.dom.addClass())
```
  3. 单例使用场景  
    3.1 jQuery
```ts
  // jQuery 
  if(window.jQuery) {
    return window.jQuery
  } else {
    // init
  }
```
    3.2 模态窗口组件：全局只会注册一个组件，全局随处可调用这个组件  
    3.3 redux：单例模式的应用  
    3.4 缓存，解决读硬盘速度慢的问题  
```ts
let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
let cache = {}
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/user/:id', function(req,res){
  let id = req.params.id
  let user = cache[id]
  if (user) {
    res.json(user)
  } else {
    fs.readFile(`./users/${id}.json`, 'utf8', function(err, data){
      let user = JSON.parse(data)
      cache[id] = user
      res.json(user)
    })
  }
})
app.post('/user', function(){
  let user = req.body
  fs.writeFile(`./users/${user.id}.json`, JSON.stringify(user), function(err){
    console.log(err)
    res.json(user)
  })
})
let app = express()
app.listen(8080)
```
    3.5 LRU缓存，最近最少使用  
      规则：1.用一个数组存储，给每个数据项标记一个访问时间戳  
           2.每次插入新的数据项的时候，先把数据中存在的数据项的时间戳自增，并将新的数据项时间戳置为0，放入数据中  
           3.访问已有数据项的时候，将该项时间戳重置为0  
           4.当数据空间已满时，将时间戳最大的数据项淘汰  
    3.6 链表LRU，LRU缓存的升级版本  
```ts
// 循环的版本
class LRUCache {
  constructor(capacity){
    this.capacity = capacity
    this.members = [] // [{key,value,age},...]
  }
  put(key,value){
    let oldestAge = -1
    let oldestIndex = -1
    let found = false
    let length = this.members.length
    for(let i=0;i<length;i++){
      let member = this.members[i]
      if (member.age > oldestAge) {
        oldestAge = member.age
        oldestIndex = i
      }
      if (member.key === key) {
        found = true
        this.members[i] = {key,value,age:0}
      } else {
        member.age++
      }
    }
    if (!found) {
      if (length >= this.capacity) {
        this.members.splice(oldestIndex, 1)
      }
      this.members.push({key,value,age:0})
    }
  },
  get(key){
    for(let i=0,l=this.members.length;i<l;i++){
      let member = this.members[i]
      if (member.key === key) {
        member.age = 0
        return member.value
      }
    }
  }
}
let lruCache = new LRUCache(10)
```

### 6. 代理模式
  概述：解决一个对象不能直接引用另外一个对象，通过代理对象在两个对象之间起到中介作用  
```ts
class Google{
  get(url){
    // todo url
    return 'google'
  }
}
class Proxy{
  constructor(){
    this.google = new Google()
  }
  get(url){
    return this.google.get(url)
  }
}
// 用户
let proxy = new Proxy()
let response = proxy.get('https://www.google.com')
// google
```
  1. 应用场景  
   1.1 代理缓存: 为开销大的计算结果提供暂时的存储  
```ts
// 普通版
function multi(i){
  if(i<=1){
    return i
  }else{
    return i*multi(i-1)
  }
}
function sum(n){
  let res = 0
  for(let i=1;i<=n;i++){
    res += multi(i)
  }
  return res
}
// 使用
console.time('cost')
console.log(sum(100000))
console.timeEnd('cost')
// cost: 864.262939453125 ms
```
```ts
// 使用代理缓存
let sum = (function(){
  let cache = {}
  function multi(i){
    if(i<=1){
      return i
    }else{
      return i*(cache[i-1]||multi(i-1))  // 直接返回计算过的结果
    }
  }
  return function (n){
    let result = 0
    for(let i=1;i<=n;i++){
      let ret = multi(i)
      cache[i] = ret // 从1开始，每个阶乘都放入缓存
      result += ret
    }
    return result
  }
})()
// 使用
console.time('cost')
console.log(sum(100000))
console.timeEnd('cost')
// cost: 14.1748046875 ms
```
   1.2 $.proxy: jQuery的proxy实现，接口一个函数和上下文，返回一个保持特定上下文的新函数  
       原理：使用apply call bind实现  
   1.3 Proxy
       修改某些操作的默认行为  
       代理器：对外界对访问进行过滤和拦截  
       典型例子：vue对数组方法进行函数劫持，增加了数据观察  
              vue3对数据观察进行了重写，完全拥抱Proxy  
```ts
let watxon={}
let targat=new Proxy(watson,{
  get(){},
  set(){}
})
```
   1.4 事件委托  
       事件捕获：从document到触发事件的目标节点，自上而下  
       事件冒泡：从触发的目标节点到document，自下而上  
       绑定事件方法的第三个参数：控制事件触发顺序是否为事件捕获，true为事件捕获，false为事件冒泡，默认false  
```ts
// 实现图片的懒加载
// 加载图片功能
let Background = (function(){
  let img = new Image()
  bgimg.appendChild(img)
  return {
    setSrc(src){
      img.src = src
    }
  }
})()
// 增强效果功能 拓展了加载图片功能
let ProxyBackGround = (function(){
  let img = new Image()
  img.onload = function(){
    Background.setSrc(this.src)
  }
  return {
    setSrc(src){
      Background.setSrc('/loading.fig')
      img.src = src
    }
  }
})()
// 用户使用
let src = '/bg.png'
ProxyBackGround.setSrc(src)
```
   1.5 防抖代理  
```ts
let lazyToggle = (function(){
  let ids = []
  let timer;
  return function(id) {
    ids.indexOf(id) === -1 ? ids.push(id) : null
    if (!timer) {
      timer = setTimeout(function(){
        toggle(ids.join(','))
        clearTimeout(timer)
        ids.length = 0
        timer = null
      },2000)
    }
  }
})()
```

### 6. 外观模式 & 观察者模式
  6.1 外观模式
    概述：把复杂的流程封装成一个接口供外部使用  
    三种角色：  
      1.门面角色：被客户端调用，熟悉子系统功能  
      2.子系统角色：实现了子系统的功能  
      3.客户角色：调用Facede实现功能  
    例子：1.实现计算器  
         2.vue的初始化  
    场景：1.接耦合，将客户端和内部子系统之间隔离，只提供对外接口  
         2.子系统之间相互隔离  
  6.2 观察者模式  
    概述：在被观察者发生变化时候，调用观察者的更新方法  
    特性：1.观察者和被观察者是耦合的  
         2.dep的update更新是观察者Observe来调用的  
    例子：1.事件处理 addEventLiener  
         2.Promise原理  
         3.jQuery的callbacks原理  
         4.node的EventEmitter类  
```ts
class Observe(){
  constructor(){
    this.deps = []
  }
  attach(dep) {
    this.deps.push(dep)
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
class Dep() {
  constructor(){
    this.deps = []
  }
  update(){
    // todo
  }
}

let obs = new Observe()
let dep = new Dep()
obs.attach(dep)
obs.notify()
```
```ts
// Promise 实现原理
class Promise{
  constructor(fn){
    this.successes = []
    let resolve = (data) => {
      this.successes.forEach(item => item(data))
    }
    fn(resolve)
  }
  then(success){
    this.successes.push(success)
  }
}
let p = new Promise(function(resolve){
  setTimeout(function(){
    resolve('ok')
  },2000)
})
// p.then(data=>console.log(data))

```
  6.3 发布订阅模式  
    1.订阅者  
    2.发布者  
    3.调度中心  
```ts
// 调度中心
class Agent{
  constructor(){
    this._events={}
  }
  subscribe(type,listener){
    let listeners = this._events[type]
    if(listeners){
      listeners.push(listener)
    }else{
      this._events[type]=[listener]
    }
  }
  publish(type){
    let listeners = this._events[type]
    let args = Array.prototype.slice.call(arguments,1)
    if(listeners){
      listeners.forEach(listener=>listener(...args))
    }
  }
}
// 发布者
class Dep{
  constructor(name){
    this.name = name
  }
  lend(agent,money){
    agent.publish('house',money)
  }
}
// 订阅者
class Observe{
  constructor(name){
    this.name = name
  }
  rent(agent){
    agent.subscribe('house',(money)=>{
      console.log(this.name, money)
    })
  }
}
// 使用
let agent = new Agent()
let obs1 = new Observe('aaa')
let obs2 = new Observe('bbb')
obs1.rent(agent)
obs2.rent(agent)
let dep = new Dep()
dep.lend(agent, 1000)
```
### 6. 原型模式  
  6.1 原型链 画图 __proto__  prototype  
  6.2 instanceof  
  6.3 原型链上的方法， Object.prototype.toString === Array.prototype.toString  // false  





