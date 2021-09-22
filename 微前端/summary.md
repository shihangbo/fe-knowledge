
# 微前端

### 解决的问题
1. 不同团队(技术栈不同)，同时开发一个应用
2. 每个团队开发的模块可以独立开发，独立部署
3. 数显增量迁移

### 实现思路
1. 拆分
2. 打包
3. 根据路由加载子应用

### 技术落地
1. SystemJS + SingleSpa
2. quankun：基于SingleSpa
3. EMP：基于module Federation，webpack5联邦模块

- systemJS ：是一种动态加载js的规范，使用script标签
- SingleSpa：实现路由劫持和应用加载，缺陷：不能动态加载js文件 / 样式不隔离 / 没有js沙箱机制
  解决隔离的方案：1.子应用之间的隔离：动态样式表
               2.主子应用之间的隔离：约定项目前缀 / css-moudles 打包时生成不同选择器名字 / shadow dom
- quankun  ：基于SingleSpa，singleSpa + sandbox + import-html-entry，子应用独立构建，运行时动态加载，主子应用解耦，技术栈无关，靠的是协议接入(子应用必须导出 bootstrap / mount / unmount 方法)

- js沙箱：应用的运行，从开始到结束，切换之后，不会影响全局window
  1. 快照沙箱：前后两张照片，将区别保存起来，多个子应用不能使用这种方式
  2. 代理沙箱：es6的proxy，可以实现多应用沙箱，把不同的应用用不同的代理实现