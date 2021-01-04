## js模块

## 1.模块化
是指把一个复杂的系统分解到多个模块以方便编码；

### 1.1 命名空间
开发网页要通过命名空间的方式来组织代码
- 命名空间冲突，两个库可能会使用同一个名字
- 无法合理的管理项目的依赖和版本
- 依法方便的控制依赖的家在顺序

### 1.2 CommonJS
CommonJS 是一种js的模块化规范，核心思想是通过 `require` 方法来同步地加载依赖的其他模块，通过 `module.exports` 导出需要暴露的接口；
node实现了CommonJS
#### 1.2.1用法
```js
  // 导入
  const moduleA = require('./moduleA')
  //导出
  modelue.exports = 'moduleA'
```
#### 1.2.2 实现require
```js
  let fs = require('fs')
  function req(moduleName) {
    const content = fs.readFileSync(moduleName, 'utf8')
    const fn = new Function('exports','module','require','__dirname','__filename',content+'\n return module.exports')
    const module = {
      exports: {}
    } 
    return fn(module.exports, module, req, '', '', content)
  }
```

### 1.3 AMD
AMD 是一种js模块化规范
与CommonJS最大的不同在于他采用异步的方式加载依赖模块；
AMD 规范主要是为了解决针对浏览器环境的模块化问题，最具代表性的现实是requirejs；
- 直接在浏览器环境 和nodejs环境同时运行
- 同时加载多个依赖

#### 1.2.1用法
```js
  // 定义
  define('name',[],function(){
    return 'watson'
  })
  // age 依赖 name
  define('age',['name'],function(name){
    return name + 9
  })
  // 使用 同时加载多个依赖
  require(['age'],function(age){
    console.log(age)
  })
```
#### 1.2.2 实现define
```js
  let factories = {}
  // 实现 define
  function define(moduleName,dependencies,factory) {
    // 依赖注入
    factory.dependencies = dependencies
    factories[moduleName] = factory
  }
  // 实现 require
  function require(mods,callback) {
    let result = mods.map(mod => {
      let factory = factories[mod]
      let exports;
      let dependencies = factory.dependencies
      require(dependencies,function(){
        exports = factory.apply(null, arguments)
      })
      return exports
    })
    callback.call(null, result)
  }
```