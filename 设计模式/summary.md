
# 设计模式

### 1. 面向对象
  1. 抽象：把客观对象抽象成属性数据和对数据的相关操作，把内部细节信息隐藏起来
  2. 封装：把同一类型的客观对象的属性数据和操作绑定在一起，封装成类
    2.1 public：公有修饰符，在类内或者外部使用，默认
    2.2 protected：受保护的，在本类和子类中使用
    2.3 private：私有的，只能在本类内部使用
  3. 继承：并且允许不同层次进行抽象，通过继承实现属性和操作的共享
  4. 多态：
    4.1 同一个接口可以不同现实，保持子类的开放性和灵活性，面向接口编程

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
    2.1 S 单一职责原则: single responsibility principle 单一功能，一个程序只做好一件事，进行拆分，vue源代码的文件系统，拆分不同的代码块，保持整个代码的整洁，便于维护  
    2.2 O 开放封闭原则: open close principle，对拓展开放，对修改封闭，新增需求时拓展新代码，而非修改已有代码，vue的合并策略，针对不同的属性，data/methods/生命周期/watcher等等进行不同的合并，后续增加新的属性，只要增加新的合并策略规则即可    
    2.3 L 里氏替换原则: liskov substitution principle，子类能覆盖父类，子类能够实现父类方法，保持子类灵活性，vue2 检测数组变化就是重写了数组7个方法（push/shift/unshift/sort/reverse/splice/pop），父类能出现的地方子类就能出现，js使用比较少   
    2.4 I 接口隔离原则: interface segregation principle，保持接口的单一独立，避免出现胖接口，js使用比较少  
    2.5 D 依赖反转原则: dependence inversion principle，面向接口编程，依赖于抽象实现，js使用比较少  

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
    static create(type){
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
  const a1 = Factory.create('apple')('苹果', '甜')
  const o1 = Factory.create('orange')('橘子', '酸')
```
  1.1 经典场景
    1.1.1 jQuery
```ts
  class jQuery{}
  window.$ = function() {
    return new jQuery()
  }
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
  
```
  