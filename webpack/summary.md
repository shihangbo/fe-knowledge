
# webpack

### 1.webpack三个核心概念
  1.module：模块，js文件 / css文件 / 图片；  
  2.chunk：代码块，相互依赖的模块会合并成一个代码块，模块的合集；  
  3.asset：资源，每个代码块会对应一个asset，每个asset会生成一个file文件输出到文件系统；

### 2.webpack内部使用概念
1.Compiler：代表整个webpack对象；  
2.Compilation：编译对象，每次新到编译生成新的compilation对象，里面会包含 modules chunks assets files...


### 3.webpack 流程
1.参数合并，添加默认插件  
   1.1 从配置文件 和 shell语句中读取参数并合并参数，得出最终的参数；  
2.编译阶段  
   2.1 开始编译：初始化Complier对象，加载所有配置的插件，执行对象的run方法开始执行编译，确定入口 entry对应的文件；  
   2.2 编译模块：从入口文件出发，调用所有配置的loader对模块进行编译，再递归本步骤直到所有日寇依赖的文件都经过了本步骤的处理；  
   2.3 完成模块编译：再经过第4步使用loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；  
3.输出阶段  
   3.1 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改的输出内容的最后机会；  
   3.2 输出完成：再确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；  
总结  
  在以上过程中，webpack会在特定的时间点广播出特定的时间，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用webpack提供的API改变webpack的运行结果；  


### 4.webpack 调试流程 - 配合 vscode
 1.vscode debug功能：node.js  create a launch json file  
   作用：1.调试webpack源码；2.写webpack插件的时候用于插件的调试；


### 5.手写 webpack-cli.js
 1.Stats对象，在webpack的回调函数中得到，来自于 Compilation.getStats()，返回的主要包含 modules、chunks和assets三个属性值的对象；

```js
   modules：记录所有解析后的模块
     modules: [{
                 id: './src/index.js',
                 name: './src/index.js',
                 chunks: [Array],
                 identifier: 'path',
                 source: 'import title, {name} form "./title";\r\nconsole.log(title,name);\r\n'
                 ...
              }]
   chunks： 记录所有chunk
     chunks：[{
               id: 'main',
               rendered: true,
               modules: [Array],
               children: [],
               parent: [],
               size: 990,
               ...
             }]
   assets： 记录所有要生成的文件
       assets：[{
                 name: 'index.html',
                 size: 990,
                 chunks: [],
                 chunkNames: [],
                 info: {},
                 ...
               }]

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
```

### 6.webpack-loader
1.概述（详见xmind）  
2.自定义 loader 配置  
3.手写 loaders/babel-loader.js  将es6 转成 es5语法
  原理 使用babel进行转换
```js
const babel = require('@babel/core')
function loader(source, inputSourceMap){
  // 获取路径的内置属性
  console.log(this.request)     // '/loaders/babel-loader.js!/src/index.js'
  console.log(this.userRequest) // '/src/index.js'

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
```
4.手写 loaders/file-loader.js  将图片img/jpge/png 转成 js模块
  原理 把源文件拷贝一份输出到打包后的目录，dist，然后返回访问路径
```js
/*
 * 默认情况下source是字符
 * 
*/
const {getOptions,interpoleName} = require('loader-utils)
function loader(content, inputSourceMap) {
  // 合并参数，webpack.config.js中的用户自定义的loader参数
  let options = getOptions(this) || {}
  // 获取新的文件名/文件路径，
  let url = interpoleName(this, options.filename || 'images/[hash].[ext]', {content})
  // 写入到输出目录，调用eimtFile方法
  this.emitFile(url,content)
  // 返回一个js模块
  return `module.exports = ${JSON.stringify(url)}`
}
// row属性是原生的，告诉webpack我想得到一个 Buffer，而非一个字符串
loader.row = true
module.exports = loader
```

### 6.sourcemap
6.1 sourcemap 是为了解决开发代码与实际打包后运行代码不一致时，帮助我们debug到原始代码到技术
6.2 webpack 通过配置可以自动实现sourcemap功能，map文件是一种对应编译文件和源文件到方法
    可配置为：source-map / eval-source-map / cheap-module-eval-source-map / cheap-eval-source-map / eval / cheap-source-map / cheap-module-source-map
6.3 关键字识别：eval-eval执行，source-map - 生成.map文件，cheap-不包含列信息，module-包含loader的sourcemap信息，inline-将.map作为dataURI嵌入打包后的代码，不单独生成.map文件

### 7.url-loader
7.1 url-loader是基于file-loader的，多一个功能：如果图片或者文件的大小【小于指定阀值】就不再拷贝文件而是变成一个base64字符串
7.2 手写实现
```js
let {getOptions} = require('loader-utils')
let mime = require('mime')
function loader(source){
  let options = getOptions(this)
  let {limit=16*1024, fallback='file-loader', filename="'[hash].[ext]'"} = options
  if(limit) {
    limit = parseFloat(limit)
  }
  console.log('this.resourcePath', this.resourcePath) // 这个资源的绝对路径
  let mimeType = mime.getType(this.resourcePath)
  if(limit && source.length<limit) { // base64
    let base64Str = `data:${mimeType};base64,${source.toString('base64')}`
    return `module.exports=${JSON.stringify(base64Str)}`
  } else { // 走fileloader 加载文件
    let fileLoader = require(fallback||'file-loader')
    return fileLoader.call(this,source)
  }
}
loader.row = true // 不然让webpack把源文件转成字符串，true-源文件以buffer（字节数组）返回，false-源文件以字符串返回
module.exports = loader
```

### 8.url-loader
8.1 样式处理
    css-loader：处理css中的@import和url这样的外部链接
    style-loader：把样式插入到dom中，方法是在head中插入一个style标签，并把样式写入到这个标签到innerHTML里
    less-loader：把less编译成css
8.2 手写实现
```js
// less-loader
let {getOptions} = require('loader-utils')
let less = require('less')
function loader(source){
  //如何把loader变成异步？
  //调用this.async方法，webpack就会异步处理这个loader
  let callback = this.async()
  less.render(source,{filename:this.resource},(err,output)=>{
    callback(err,output.css)
  })
}
module.exports = loader
```
```js
  // style-loader
let {getOptions} = require('loader-utils')
function loader(source){
  let script = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
    module.exports='';
  `
  return script
}
module.exports = loader
```