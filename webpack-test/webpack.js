// https://shihangbo.github.io/fe-knowledge/part2/

(function(modules){
  // 缓存模块
  let installedModules = {}
  // 在浏览器实现一套common.js require方法
  function require(moduleId){
    if(installedModules[moduleId]){
      return installedModules[moduleId].exports
    }
    var module = (installedModules[moduleId] = {
      i: moduleId, // identify 模块ID 模块的标识符
      l: false,    // loaded 资源是否已经加载成功或者初始化成功
      exports: {}  // 当前模块的导出对象
    })
    modules[moduleId].call(module.exports, module, module.exports, require)
    module.l = true
    return module.exports
  }

  require.m = modules
  require.c = installedModules
  // 为了兼容导出，定义getter函数
  require.d = function(exports,name,getter){
    if(!require.o(exports,name)){
      Object.defineProperty(exports,name,{
        enumerable: true,
        get:getter
      })
    }
  }
  // 定义Object.prototype.toString.call(obj)类型
  // 把一个exports对象声明为一个 es模块
  require.r = function(exports){
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag){
      Object.defineProperty(exports,Symbol.toStringTag,{
        value: 'Module'
      })
    }
    Object.defineProperty(exports,'__esModule',{
      value: true
    })
  }
  // 创建一个模拟命名空间对象，核心用法：把任意一个模块转成es模块
  // mode & 1 value is a module id, require it
  // mode & 2 merge all propertyies of value into the ns
  // mode & 4 return value when already ns object
  // mode & 8|1 behave like require 
  require.t = function(value, mode){
    if(mode & 1) value = require(value)
    if(mode & 8) return value
    if(mode & 4 && typeof value === 'object' && value && value.__esModule) return value
    var ns = Object.create(null)
    require.r(ns) // 将bs定义成一个es6模块
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value
    })
    // 将value的属性和值 同步到ns模块上
    if(mode & 2 && typeof value != 'string') {
      for(var key in value){
        require.d(ns,key,function(key){return value[key]}.bind(null,key))
      }
    }
    return ns
  }

  /* 获取默认导出的函数，为了兼容 非harmony模块
  *  excemple
  *  1.commonjs模块
  *     let commonjsModule = {name: 'watson'}
  *     let getter = require.n(commonjsModule)
  *     console.log(getter.a) // {name:'watson'}
  *  2.es6模块
  *     let esModule = {__esModule:true, default: {name:'watson'}}
  *     let getter2 = require.n(esModule)
  *     console.log(getter2.a) // {name:'watson'}
  *  原理：当webpack得带一个模块之后，会遍历这个模块所有语句，发现任意一个export/import节点，就认为是es6模块，导出当时候增加 __esModule:true 属性！
  */
  require.n = function(module){
    var getter = module && module.__esModule ? function getDefault(){return module['default']} : function getModuleExports(){return module}
    require.d(getter, 'a', getter)
    return getter
  }
  // Object.prototype.hasOwnProperty.call
  require.o = function(object,property){
    return Object.prototype.hasOwnProperty.call(object,property)
  }
  // __webpack_pulic_path__ 公开访问路径
  require.p = ''

  return require((require.s = "./src/index.js"))  // require.s 入口文件ID，即相对根目录的路径
})({
  "./src/index.js":function(module,exports,__webpack_require__){
    let title = __webpack_require__("./src/title.js")
    console.log(title)
  },
  "./src/title.js":function(modules,exports){
    module.exports = 'title'
  }
})

/**
 * 打包后的webpack文件解析
 * 1.是一个立即执行函数
 *  (function(modules){
 *  })({
 *    "./src/index.js":function(module,exports,__webpack_require__){
 *      let title = __webpack_require__("./src/title.js")
 *      console.log(title)
 *    },
 *    "./src/title.js":function(modules,exports){
 *      module.exports = 'title'
 *    }
 *  })
 * 2.参数是一个对象
 * key是模块ID，一个相对于项目根目录的相对路径  ./src
 * value是一个函数，一个common.js的模块定义，用户写的代码将成为common.js模块的函数体
 */

//  webpack 打包之后的核心代码
//  (function(modules){
//   function require(moduleId){
//     let module = {
//       i: moduleId,
//       l: false,
//       exports: {}
//     }
//     modules[moduleId].call(module.exports, module, module.exports, require)
//     module.l = true
//     return module.exports
//   }
//   return require('./src/index.js')
//  })({
//   './src/index.js':function(module,exports,require){
//     const title = require('./src/title.js')
//     console.log(title)
//   },
//   './src/title.js':function(module,exports){
//     module.exports = 'title'
//   }
//  })

/**
 * webpack三个核心概念
 * 1.module：模块，js文件 / css文件 / 图片；
 * 2.chunk：代码块，相互依赖的模块会合并成一个代码块，模块的合集；
 * 3.asset：资源，每个代码块会对应一个asset，每个asset会生成一个file文件输出到文件系统；
 * 
 * webpack内部使用概念
 * 1.Compiler：代表整个webpack对象；
 * 2.Compilation：编译对象，每次新到编译生成新的compilation对象，里面会包含 modules chunks assets files...
 * 
 */

 /**
 * webpack 流程
 * 1.参数合并，添加默认插件
 *    1.1 从配置文件 和 shell语句中读取参数并合并参数，得出最终的参数；
 * 2.编译阶段
 *    2.1 开始编译：初始化Complier对象，加载所有配置的插件，执行对象的run方法开始执行编译，确定入口 entry对应的文件；
 *    2.2 编译模块：从入口文件出发，调用所有配置的loader对模块进行编译，再递归本步骤直到所有日寇依赖的文件都经过了本步骤的处理；
 *    2.3 完成模块编译：再经过第4步使用loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
 * 3.输出阶段
 *    3.1 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表
 *                这步是可以修改的输出内容的最后机会；
 *    3.2 输出完成：再确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；
 * 
 * 在以上过程中，webpack会在特定的时间点广播出特定的时间，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用webpack提供的API改变webpack的运行结果；
 * 
 */

 /**
  * webpack 调试流程 - 配合 vscode
  * 1.vscode debug功能：node.js  create a launch json file
  *   作用：1.调试webpack源码；2.写webpack插件的时候用于插件的调试；
  * 
  */

  /**
  * 手写 webpack-cli.js
  * 1.Stats对象，在webpack的回调函数中得到，来自于 Compilation.getStats()，返回的主要包含 modules、chunks和assets三个属性值的对象；
  *   modules：记录所有解析后的模块
  *     modules: [{
  *                 id: './src/index.js',
  *                 name: './src/index.js',
  *                 chunks: [Array],
  *                 identifier: 'path',
  *                 source: 'import title, {name} form "./title";\r\nconsole.log(title,name);\r\n'
  *                 ...
  *              }]
  *   chunks： 记录所有chunk
  *     chunks：[{
  *               id: 'main',
  *               rendered: true,
  *               modules: [Array],
  *               children: [],
  *               parent: [],
  *               size: 990,
  *               ...
  *             }]
  *   assets： 记录所有要生成的文件
  *       assets：[{
  *                 name: 'index.html',
  *                 size: 990,
  *                 chunks: [],
  *                 chunkNames: [],
  *                 info: {},
  *                 ...
  *               }]
  */
const webpack = require('webpack')
const options = require('./webpack.config')
const compiler = webpack(options)
// 开始启动编译，编译完成后会执行回调函数
compiler.run((err,stats)=>{
  console.log('编译完成后会执行回调函数：'
  ,err             //错误对象
  ,stats.toJson({  //status 保存输出的信息 编译的信息
    entries: true, //输出 入口信息
    chunks: true,  //输出 代码块信息
    modules: true, //输出 模块信息 数组保存所有modules对象，[{id:'index.js',name:'index'}]
    _modules: true,//同上         key-value, {'index.js':{id:'index.js',name:'index'}}
    assets: true,  //输出 打包出来的资源信息
  }))
})

/**
 * webpack-loader
 * 1.概述（详见xmind）
 * 2.自定义 loader 配置
 * 3.手写 loaders/babel-loader.js
 */

const babel = require('@babel/core')
function loader(source, inputSourceMap){
  let options = {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMaps:true
  }
  // babel转换后生成 code-转换后的代码，map-映射文件，ast-抽象语法树
  let {code,map,ast} = babel.transform(source,options)
  // return code
  // 返回多个值
  return this.callback(null,code,map,ast)
}
module.exports = loader
