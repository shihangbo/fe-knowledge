
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
  *  原理：当webpack得带一个模块之后，会便利这个模块所有语句，发现任意一个export/import节点，就认为是es6模块，导出当时候增加 __esModule:true 属性！
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
 * 1.模块：js文件 / css文件 / 图片
 * 2.相互依赖的模块会合并成一个代码块，模块的合集
 * 3.
 */