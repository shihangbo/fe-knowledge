## 前期准备
1. 业务线收集
2. 组件适配方案 https://git.winbaoxian.com/wy-front/bxs-ui/issues/10

## 前期目标
1. 收集各个业务线使用的适配方案 (计划书，活动，交易，大内容) ,如何应用到第三方组件库的
2. 调研当前业界 通用适配方案(rem, 百分比, vw …) ，调研第三方vue知名组件库是否提供了方案
2. 综合比较目前 各个业务线大家使用的适配方案 挑选合适的适配方案
4. 基于最终选出的方案 提供一种实现方案 (待定)

## 前期反馈
1. 页面中单位统一用rem。rem的值取决于html的font-size,根据屏宽设置html的字体大小，实现不同设备的适配
`document.documentElement.style.fontSize = window.innerWidth/375*16 >=20 ? 20 : window.innerWidth/375*16 + 'px';`

## 前期总结 - vant
1. 在vant的文档中提到使用`postcss-pxtorem`和`lib-flexible`来适配，将组件中的px转换为rem；
2. 结合以上插件，在.vue中可以直接用style标签引用的方式转换.css中的px
```md
<style src="../node_modules/vant/es/vant-css/cell.css"></style>
```
3. 如果想使用 import '../node_modules/vant/es/vant-css/cell.css'的方式需要额外引入babel-plugin-import插件，这样css才会被postcss处理(参考 https://github.com/vuejs/vue-loader/issues/1090)

## 前期总结 - mand-mobile
1. mand-mobile是滴滴出的一个基于vue的移动组件库，其提供的适配解决方案同vant类似可以参考文档(https://didi.github.io/mand-mobile/#/zh-CN/docs/started)


## 前期总结 - bxs-ui-vue
1. 接下来用一个实例来说明如何将bxs-ui-vue中的css转换为rem
```md
npm i -S bxs-ui-vue
npm i -D babel-plugin-component
npm i -D postcss-pxtorem
npm i -S lib-flexible
```


