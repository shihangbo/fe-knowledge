
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

  return require((require.s = "./src/index.js"))
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