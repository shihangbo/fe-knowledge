
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
loader.row = true // 不然让webpack把源文件转成字符串，true-源文件以buffer（字节数组）返回，false-源文件以字符串返回
module.exports = loader
```

### 9.url-loader
 1 样式处理  
    css-loader：处理css中的@import和url这样的外部链接  
    style-loader：把样式插入到dom中，方法是在head中插入一个style标签，并把样式写入到这个标签到innerHTML里  
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

### 13.编译器