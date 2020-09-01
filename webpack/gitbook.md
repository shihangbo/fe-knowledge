
# webpack

### webpack三个核心概念
  1.module：模块，js文件 / css文件 / 图片；  
  2.chunk：代码块，相互依赖的模块会合并成一个代码块，模块的合集；  
  3.asset：资源，每个代码块会对应一个asset，每个asset会生成一个file文件输出到文件系统；

### webpack内部使用概念
1.Compiler：代表整个webpack对象；  
2.Compilation：编译对象，每次新到编译生成新的compilation对象，里面会包含 modules chunks assets files...