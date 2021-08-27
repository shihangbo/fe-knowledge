
# webpack

### 1.webpack三个核心概念
  1.module：模块，js文件 / css文件 / 图片；  
  2.chunk：代码块，相互依赖的模块会合并成一个代码块，模块的合集；  
  3.asset：资源，每个代码块会对应一个asset，每个asset会生成一个file文件输出到文件系统；

### 2.webpack内部使用概念
1.Compiler：代表整个webpack对象；  
2.Compilation：编译对象，每次编译生成新的compilation对象，里面会包含 modules chunks assets files...


### 3.webpack 流程
1.参数合并，添加默认插件  
   1.1 从配置文件 和 shell语句中读取参数并合并参数，得出最终的参数；  
2.编译阶段  创建`Compiler`对象，创建`Compilation`对象
   2.1 开始编译：初始化Complier对象，加载所有配置的插件，执行对象的run方法开始执行编译，确定入口 entry对应的文件；  
   2.2 编译模块：从入口文件出发，调用所有配置的loader对模块进行编译，再递归本步骤直到所有依赖的文件都经过了本步骤的处理；  
   2.3 完成模块编译：生成对应chunk，得到了每个模块最终内容以及它们之间的依赖关系；  
3.输出阶段  
   3.1 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改的输出内容的最后机会；  
   3.2 输出完成：再确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；  
总结  
  在以上过程中，webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用webpack提供的API改变webpack的运行结果；  


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

### 7.sourcemap
 1 sourcemap 是为了解决开发代码与实际打包后运行代码不一致时，帮助我们debug到原始代码到技术  
 2 webpack 通过配置可以自动实现sourcemap功能，map文件是一种对应编译文件和源文件到方法  
    可配置为：source-map / eval-source-map / cheap-module-eval-source-map / cheap-eval-source-map / eval / cheap-source-map / cheap-module-source-map  
 3 关键字识别：eval-eval执行，source-map - 生成.map文件，cheap-不包含列信息，module-包含loader的sourcemap信息，inline-将.map作为dataURI嵌入打包后的代码，不单独生成.map文件  

### 8.url-loader
 1 url-loader是基于file-loader的，多一个功能：如果图片或者文件的大小【小于指定阀值】就不再拷贝文件而是变成一个base64字符串
 2 手写实现  
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
loader.row = true // 不让webpack把源文件转成字符串，true-源文件以buffer（字节数组）返回，false-源文件以字符串返回
module.exports = loader
```

### 9.样式处理
 1 样式处理  
    style-loader：把样式插入到dom中，方法是在head中插入一个style标签，并把样式写入到这个标签到innerHTML里  
    css-loader：处理css中的@import和url这样的外部链接  
    less-loader：把less编译成css  
 2 手写实现  
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

### 10.webpack-pitch
1.loader的返回值有两种  
  1.一种是返回一个js模块化的代码 module.exports = 'xx'; 可以作为最左边的loader  
  2.其他就是返回任意内容如css样式语句，图片二进制buffer等; 不可以作为最左边的loader
  备注：webpack要求，不管哪个模块，最终都要返回一个js代码块，因为webpack本身就是一个把任意资源转成js模块的工具  
2.webpack执行的时候，“从左往右，从上往下”依次执行loader的pitch方法，然后“从右往左，从下往上”依次执行loader的loader方法；

### 11.loader-runner
1.loader类型 = post(后置) + inline(内联) + normal(正常) + pre(前置)
2.特殊配制
  -! : 不要前置和普通loader
  !  : 不要普通loader
  !! : 只要内联loader

### 12.css-loader
1.用来处理css中 @import 和 url 这样的外部资源的；

## webpack插件机制
1.webpack的插件机制  
  1.创建：webpack在其内部对象上创建钩子函数；  
  2.注册：插件将自己的方法注册到对应钩子上，交给webpack；  
  3.调用：webpack在编译过程中，会适时的触发相应钩子，从而触发插件的方法；  
2.webpack本质是一种事件流的机制，他的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundle的Compilation都是Tapable的实例；  
3.通过事件，注册和监听，触发webpack生命周期中的函数方法；
```js
const {
  SyncHook,               // 同步
  SyncBailHook,           // 熔断，遇到第一个结果 result!==undefiend 则返回，不再继续执行
  SyncWaterfallHook,      // 瀑布，上一个执行的返回作为下一个执行的参数
  SyncLoopHook,           // 循环
  AsyncParallelHook,      // 并行
  AsyncParallelBailHook,
  AsyncSeriesHook,        // 串行
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tabable')
```

### 12.tapable
1.basic ： 按顺序依次执行；  
2.bail  ： 熔断，遇到第一个结果 result!==undefiend 则返回，不再继续执行；  
3.waterfall ：瀑布，上一个事件函数的结果 result!==undefined 则result会作为后一个事件函数的第一个参数，继续执行；  
4.loop  ： 循环执行事件函数，直到所有函数的执行结果 result===undefined
  
### 13.webpack_ast 抽象语法树 abstract syntax tree
1.webpack 和 lint 等很多等工具和库的核心都是通过 abstract syntax tree 抽象语法树这个概念来实现对代码的检查、分析等操作的；  
2.抽象语法树的用途  
  2.1代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动不全等； 
    如jslint、jshint对代码错误或风格等检查，发现一些潜在的错误  
    ide的错误提示、格式化、高亮、自动补全等  
  2.2带啊吗混淆压缩  
    uglifyjs2等  
  2.3优化变更代码，改变代码结构使达到想要的结构  
    代码打包工具webpack、rollup等  
    commonjs、amd、cmd、umd等代码规范之间的转化  
    coffeescript、typescript、jsx等转化为原生js  
3.抽象语法树定义
  3.1这些工具等原理都是通过 javascript parse 把代码转化为一颗抽象语法树ast，这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作；  
  3.2如图展示：../assets/ast.png  
4.javascript parse  
  4.1javascript parse把js源码转化为抽象语法树的解析器；  
  4.2浏览器会把js源码通过js解析器转为抽象语法树，再进一步转化为字节码或直接生成机器码；  
  4.3浏览器实现的js引擎，都会有自己的抽象语法树格式：chrome的v8引擎，firefox的spiderMonkey引擎；  
5.常用的 javascript parse  
  5.1 esprima  
  5.2 traceur  
  5.3 acorn  
5.课程：实现源码 -> ast语法树 -> 源码  
  5.1通过 esprima 把源码转化为ast  
  5.2通过 estraverse 遍历并更新ast  
  5.3通过 escodegen 将ast重新生成源码  
  5.4工具，astexplorer ast的可视化工具  
6.实现babel插件  
7.实现js引擎  

### 13.编译器
1.编译器分为三个阶段
  1.1解析Parsing，解析是将最初原始的代码转换为一种更加抽象的表示，即ast；  
  1.2转换Transformation，转换将对这个抽象的表示做一些处理，让他能做到编译器期望他做到的事情；  
  1.3代码生成Code Generation，接受处理之后的代码表示，然后把它转换成新的的代码；  
2.编译器实现  
  2.1词法分析器 tokennizer ：while循环字符串，匹配对应的语言符号如小括号(，方法名add等  
  2.2词法分析器 Parser  
  2.3遍历器  
  2.4转换ast  
  2.5代码生成  
  2.6打包  
3.对应课程webpack，webpack_ast_parser  

### 14.plugin
1.概述  
  1.1插件向第三方开发者提供了webpack引擎中完整的能力。实用阶段式的构建回调，开发者可以引入他们自己的行为到webpack构建流程中，创建插件比创建loader更加高级，因为你将需要理解一些webpack底层的内部特性来做相应的钩子；  
2.为什么需要一个插件  
  2.1webpack基础配置无法满足需求；  
  2.2插件几乎能够任意更改webpack编译结果；  
  2.3webpack内部也是通过大量内部插件实现的；  
3.可以加在插件的常用对象  
  Compiler  
  COmpilation 代表一次编译  
  Module Factory  
  Parser  
  Template  
4.创建插件  
  4.1webpack插件由以下组成  
    4.1.1一个javascript命名函数；  
    4.1.2在插件函数的prototype上定义一个apply方法；  
    4.1.3制定一个绑定到webpack自身的事件钩子；  
    4.1.4处理webpack内部实例的特定数据；  
    4.1.5功能完成后调用webpack提供的回调；  
5.Compiler 和 Compilation   
  5.1在插件开发中最重要的两个资源就是compiler 和 compilation 对象。理解他们的角色是拓展webpack引擎重要的第一步；
  5.2compiler 对象代表了完整的webpack环境配置。这个对象在启动webpack时被一次性建立，并配置好所有可操作的设置，包括options，loader和plugin。当在webpack环境应用一个插件时，插件将受到此compiler对象的引用。可以用来访问webpack的主环境；  
  5.3compilation 对象代表了一次资源版本构建。当运行webpack开发环境中间件时，每当检测到一个文件变化，就会创建一个新的compilation，从而生成一组新的编译资源。一个compilation对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪以来的状态信息。compilation 对新阿贵也提供了很多关键是时机回调，以供插件做自定义处理是选择使用；  
6.基本插件架构  
  6.1概述  
    6.1.1插件是由【具有apply方法的prototype对象】所实例化出来的；  
    6.1.2这个apply方法在安装插件时，会被webpack compiler调用一次；  
    6.1.3apply方法可以接受一个webpack compiler对象的引用，从而可以在回调函数中访问到 compiler对象；  
  6.2webpack源码使用插件的代码  
```js
if(options.plugins && Array.isArray(options.plugins)){
  for(const plugin of options.plugins){
    plugin.apply(compiler)
  }
}
```
  6.3用户使用插件代码  
```js
let DonePlugin = require('DonePlugin')
module.exports = {
  mode: '',
  entry: '',
  output: {},
  module: {},
  plugins: [
    new DonePlugin()
  ]
}
```
  6.4Compiler插件  
    6.3.1done: new AsyncSeriesHook(["stats"])  
    6.3.2自定义同步插件  
```js
class DonePlugin{
  constructor(options){
    this.options = options
  }
  // compiler创建后，会挂在所有的钩子 new DonePlugin().apply(compiler)
  apply(compiler){
    compiler.hooks.done.tap('DonePlugin',(stats)=>{
      console.log('hello ', this.options.name)
    })
  }
}
module.exports = DonePlugin
```
  6.5对应webpack-plugin的课程webpack；  

### 15.webpack_hand
1.开始实现webpack源码：45～58；  

### 16.webpack优化
1.缩小范围  
  1.1wepack普通模块查找：  
    1.1.1用户引用：用户引入一个模块 require('lodash')；  
    1.1.2查找文件：在当前node_modules文件夹下找到 lodash 文件夹中的 package.json 文件；  
    1.1.3查找字段：默认main字段对应的路径，当没有main字段的时候，查找index.js文件；  
    1.1.4加载文件：对main字段对应的路径的文件进行加载；  
```js
module.exports = {
  // 普通模块查找，webpack需要经过非常复杂的过程，指定路径会极大的缩短查找过程
  resolve:{
    // 别名设置，如import一个第三方包
    alias:{
      'bootstrap':path.resolve(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css')
    },
    // 指定webpack只查找当前 node_modules，以减少无谓的查找过程
    modules:[path.resolve(__dirname,'node_modules')],
    // 默认情况下，package.json文件按照文中的 main 字段的文件名被查找到
    mainFields:['browser','main'],
    // 当目录下没有 package.json文件时，默认使用目录下的 index.js这个文件
    mainFiles:['index']
  },
  // loader模块查找，webpack需要经过非常复杂的过程，指定路径会极大的缩短查找过程
  resolveLoader:{
    alias:{},
    modules:[]
  }
}
```
2.noParse  
  2.1module.noParse 字段，用于配置那些模块文件的内容不需要进行解析；  
```js
module.export = {
  module:{
    noParse: /jquery|lodash/,
    // 或者使用函数
    noParse(content){
      return /jquery|lodash/.test(content)
    }
  }
}
```
3.DefinePlugin  
  3.1DefinePlugin 创建一些在编译是可以配置的全局常量；  
```js
let webpack = require('webpack')
new webpack.DefinePlugin({
  VERSION:1, //会被转成字符串
  EXPRESSION:"1+2", //字符串，会被当成代码片段来执行 eval("1+2")
  COPYRIGHT:{ //对象
    AUTHOR:JSON.stringify('watson')
  }
})
```
4.IgnorePlugin
  4.1用于忽略某些特定的模块，让webpack不把这些特定的模块打包进去；  
```js
import moment from 'moment'
console.log(moment)

// 忽略掉moment模块中的locale目录
new webpack.IgnorePlugin(/^\.\/locale/,/moment$/)
// 参数1: 匹配引入模块路径的正则表达式；
// 参数2: 匹配模块对应的上下文；
```
5.区分环境变量  
  5.1环境差异  
    5.1.1生产环境  
      ·分离common css文件，以便多个文件进行共享  
      ·压缩代码/图片  
      ·混淆  
    5.1.2开发环境  
      ·生成sourcemap文件  
      ·打印debug信息  
      ·需要live reload 或者 hot reload功能
  5.2webpack 4.x引入了 mode 概念

```js
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssWebpackPlugin = require('optimize-css-webpack-plugin')
module.exports = (env,argv) => ({
  //配置优化策略
  optimization:{
    //如果是生产模式
    minimizer:argv.mode==='production'
      ? [
          new TerserWebpackPlugin({
            parallel:true, // 启动多进程并行压缩js
            cache:true,
          }),
          new OptimizeCssWebpackPlugin({

          })
        ]
      : []
  }
})
```
6.对图片进行压缩优化  
  6.1 webpack插件 image-webpack-loader  
7.日志优化  
  7.1 webpack插件 friendly-errors-webpack-plugin  
    ·success 成功的提示  
    ·warning 警告的提示  
    ·error   报错的提示  
```js
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

  stats: 'verbose',
  plugin:[
    new FriendlyErrorsWebpackPlugin()
  ]
```
8.日志输出  
9.分析时间 - 费时分析  
  9.1webpack插件 speed-measure-webpack-plugin  
```js
  const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
  const smv = new SpeedMeasureWebpackPlugin()
  module.exports = smv.warp({...})
```
10.分析空间 - webpack-bundle-analyzer  

11.libraryTarget和library  
  11.1outputlibrarytarget  
    ·当webpack去构建一个可以被其他模块导入的库时需要用到他们  
    ·output.library 配置导出库的名字  
    ·output.libraryExport 配置当前模块中哪些子模块需要被导出  
    ·output.libraryTarget 配置以何种方式导出库  
      ·var       : 只能通过script标签引入，且以全局变量的形式使用  
      ·commonjs  : 只能以commonjs的规范引入和使用  
      ·amd       : 只能以amd的规范引入和使用  
      ·umd       : 可以使用script标签、commonjs、amd引入  
```js
  module.exports ={
    output:{
      library: 'calculate',
      libraryTarget: 'var'
    }
  }
```
12.polyfill
  12.1概述：babel负责语法转换，如将es6语法转成es5语法。但如果有些对象、方法浏览器本身不支持，比如：  
    ·全局对象：Promise, WeabMap...  
    ·全局静态函数：Array.from, Object.assign...  
    ·实例方法：Array.prototype.includes...  
  12.2引用方式(三种)  
```js
  require('@babel-polyfill')
  import('@babel-polyfill')
  module.exports = {
    entry: ['@babel-polyfill', './index.js']
  }
```
  12.3polyfill-service  
    <script src='polyfill.min.js'></script>  

13.purgecss-webpack-plugin  
  13.1用于去除未使用的css，一般与glob配合使用，必须与 mini-css-extract-plugin 配合使用，paths路径是绝对路径  
14.DLL  
15.多进程处理  
  15.1 thread-load : 把这个loader放在其他loader之前使用；  
```js
  module.exports = {
    module: {
      rules:[
        {
          test: /\.js$/,
          use:[
            {
              loader:'thead-loader',
              options:{
                worker:3
              }
            }
          ]
        }
      ]
    }
  }
```
16.CDN  
  16.1HTML文件不缓存，放在自己服务器上，关闭自己服务器缓存，静态资源的URL变成指向CDN服务器的地址  
  16.2静态的js、css、图片等文件开启CDN和缓存，文件名带上HASH值  
  16.3为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上  
  16.4配置多个域名后会增加域名解析时间，解决办法“预解析域名”，<link rel='dns-prefetch' url='www.watson.com/'></link>，即在对应HTML文件头部加上link去预解析域名，以降低域名解析带来的延迟  
  16.5接入CDN  
```js
  module.exports = {
    output:{
      path:path.join(__dirname,'dist),
      filename:'[name]_[hash:8].js',
      publicPath:'CDN URL/'
    }
  }
```
  16.6文件指纹  
    ·hash：每次webpack构建生成一个唯一的hash值，全局唯一，各文件共用这个hash值  
      ·缺点：当修改一个文件的时候，重新进行webpack打包，【所有文件】的hash值都会改变  
    ·chunkhash：根据chunk生成的hash值，来源于同一个chunk的hash值一样  
      ·优点：当修改一个文件的时候，重新进行webpack打包，只有【同一个代码块】chunk的文件的hash值会改变，其他文件保持不变  
    ·contenthash：根据内容生成的hash值  
      .优点：修改文件重新webpack打包，只有修改文件的hash改变，其他文件保持不变  
```js
  //文件指纹 推荐配置
  //解读1 性能：hash > chunkhash > contenthash, contenthash文件级的，读文件
  //解读2 稳定性：contenthash > chunkhash > hash
  module.exports={
    output:{
      filename:'[name]_[hahs].js',
      // 公共模块
      chunkFilename:'[name]_[chunkhash].js',
    },
    plugins:[
      new MiniCSSExtractPlugin({
        filename:'[name]_[contenthash].css'
      })
    ]
  }

```
17.Tree Shaking  
  17.1概述：一个模块有多个方法，只要其中某个方法使用到了，则整个文件就会被打包到bundle里面去，Tree Shaking就是只把用到到方法打包到bundle里面，没有用到的方法会在uglify阶段查处掉  
  17.2原理：es6模块的 import 关键字  
```js
  //Tree Shaking 最佳实践 生产模式下
  module.exports={
    mode:'production',
    devtool:false,
    module:{
      rules:[
        {
          test:/\.js$/,
          // 配置{moduls:false}，不让bable转换模块，因为只有es6模块才能实现Tree Shaking 
          use:[
            {
              loader:'babel-loader',
              options:{
                presets:[
                  ['@babel/preset-env',{'modules':false}],
                  '@babel/preset-react'
                ]
              }
            }
          ]
        }
      ]
    }
  }

```
  17.3哪些代码会被优化掉  
    ·没有导入或使用  
    ·代码不可达，不会被执行  
    ·代码的结果没有人用  
    ·代码里只写不读的变量  
    
18.代码分割  
  18.1目标：1.抽离相同代买到一个共享块；2.脚本懒加载，是初始下载代码更小；  
  如下三个方法实现  
  18.2Entry Point：配置入口文件设置  
    ·优点：简单
    ·缺点：如果入口文件之间包含相同模块，这些相同模块会被引入各个bundle中  
          不够灵活，不能将核心应用程序逻辑进行动态查分代码  
```js
  entry:{
    index:'./src/index.js',
    login:'./src/login.js'
  }
```
  18.3动态导入和懒加载  
    18.3.1概述：用到什么功能加载这个功能对应到代码，即按需加载，再给单页应用做按需加载的优化时，采用以下原则：
      ·对网站功能进行划分，每个分类一个chunk  
      ·首页功能直接加载，其他二级页面按需加载  
      ·被分割出来的代码需要一个按需加载得时机  
```js
  // video.js
  module.exports='this is video'

  // index.js
  document.getElementById('video').addEventListener('click',event=>{
    import('./video.js').then(res=>{
      console.log(res)
    })
  })
```
  18.4prefetch 和 preload  
    18.4.1预先拉去prefetch: 浏览器会在空闲时间下载该模块，且下载时发生在父级chunk加载完成之后  
```js
  // index.js
  import(/*webpackPrefetfch:true*/ './video.js').then(res=>{
    console.log(res)
  })
  // 原理：webpack会生成一个link标签，并将他被添加至页面头部，浏览器进入空间时间就开始加载这个文件 <link rel="prefetch" as="script" href="utilities.js"> 
```
    18.4.2预先加载preload：会将资源的下载顺序权重提高，关键数据资源提前下载，不当使用webpackProload也会损害性能  
      ·异步chunk和父级chunk并行加载，父级chunk加载好了页面就会展示，同时等待异步chunk加载  
```js
  // index.js
  import(/*webpackPreload:true*/ './video.js').then(res=>{
    console.log(res)
  })
  // 原理：webpack会生成一个link标签，并将他被添加至页面头部，浏览器进入空间时间就开始加载这个文件 <link rel="preload" as="script" href="utilities.js"> 
```
19.开启Scope Hoisting  
  19.1原理：将所有的模块按照引用顺序放在一个函数作用域里  
      作用：体积更小，运行更快  
      这个功能在production模式默认开启   
      webpack3新推出的功能   
```js
//hello.js
module.exports='watson'

//index.js
import str from './hello.js'
console.log(str)

//查看打包后的结果
var hello = ('hello')
console.log(hello)
```
20.利用缓存  
  20.1webpack利用缓存有以下几个思路：  
    ·babel-loader开启缓存  
    ·使用cache-loader  
    ·使用hard-source-webpack-plugin  
  20.2babel-loader  
    babel在转译js过程中耗能较高，将babel执行的结果缓存起来，当重新打包构建时尝试读取缓存，从而提高打包构建速度，降低消耗  
```js
  {
    test:/\.js$/,
    exclude:/node_modules/,
    use:[
      {
        loader:'babel-loader',
        options:{
          cacheDirectory:true
        }
      }
    ]
  }
```
  20.3cache-loader
    ·在一些性能开销加大对的leader之前添加此laoder，将结果缓存到洗盘里  
  20.4hard-source-webpack-plugin
    ·为模块提供了中间缓存，缓存默认存放路径 node_modelus/.cache/hard-source  
    ·配置之后，首次构建时间不会大的变化，从第二次开始，构建时间可以减少80%左右  
    ·webpack5中已经内置该插件  
```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
module.exports={
  plugins:[
    new HardSourceWebpackPlugin()
  ]
}
```
21.babel  
  21.1概述：是一个转换工具，把es6转换成es5代码  
  21.2只能转换js代码，不能转换api，如Iterator，Generator，Set，Map，Proxy，Reflect，Symble，Promise等全局对象，以及在全局对象上的方法Object.assign等。  
  21.3官方给出 bable-polyfill 和 babel-runtime 两种解决方案来解决这种全局对象或全局对象方法不足的问题；  
  21.4bable-polyfill适合在业务项目使用，babel-runtime适合在组件和类库项目中使用  
  21.5bable-polyfill  
    ·优点：使用简单（三种方式引用）  
    ·缺点：体积大（300k+），污染全局变量或者对象中的方法  
  21.6babel-runtime：babel提供单独的包babel-runtime用以提供编译模块的工具函数  
    ·优点：按需引用，import Promise from 'babel-runtime/core-js/promise'  
    ·缺点：手动import引入，coding的时候需要时时注意  
  21.7babel-plugin-transform-runtime  
    ·优点：帮助我们避免手动引入import，并且还做公用方法的抽离  
22.公共资源提取
  22.1webpack会基于以下条件自动分割代码块：  
    ·新的代码块被共享或者来自node_modules文件夹  
    ·新的代码块大于30kb（在min+giz之前）  
    ·按需加载代码块的请求数量应该<=5  
    ·页面初始化是加载代码块的请求数量应该<=3  
```js
module.exports={
  optimization:{
    splitChunks:{
      //代码块分成两类：初始模块，异步模块，
      chunks:'all',//initial, async, all
      minSize:30000,//默认值30k，代码块的最小尺寸
      minChunks:2,//分割之前被引用的次数，阀值
      maxAsyncRequests:5,//按需加载最大请求数
      maxInitialRequests:3,//一个入口的最大并行请求数量
      name:true,//打包后的名称，默认是chunk的名字，pageA～pageB～pageC
      automaticNamedelimiter:'~',//默认分隔符
      cacheGroups:{
        vendors:{
          chunks:'initial',//分割同步代码块
          test:/node_modules/,//模块正则，node_modules里面的会被抽去到vendors中
          priority:-10//一个代码块可能有多个缓存组，会被抽取到优先级比较高的缓存组
        },
        commons:{
          chunks:'initial',
          minSize:0,
          minChunks:2,
          priority:-20,
          reuseExistingChunk:true,//如果该chunk引用了已经被抽取的chunk，则会直接引用chunk，不再重复打包
        }
      }
    }
  }
}

// common~pageA～pageB～pageC.js   提取自定义的公用的chunk，如工具方法js
// vendors~pageA～pageB～pageC.js  提取node_modules中的公用chunk，如jquery.js
```