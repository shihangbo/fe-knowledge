## 前期准备
1. 业务线收集
2. 组件适配方案 https://git.winbaoxian.com/wy-front/bxs-ui/issues/10

## 前期目标
1. 收集各个业务线使用的适配方案 (计划书，活动，交易，大内容) ,如何应用到第三方组件库的
2. 调研当前业界 通用适配方案(rem, 百分比, vw …) ，调研第三方vue知名组件库是否提供了方案
2. 综合比较目前 各个业务线大家使用的适配方案 挑选合适的适配方案
4. 基于最终选出的方案 提供一种实现方案 (待定)

## 前期回馈
1. 页面中单位统一用rem。rem的值取决于html的font-size,根据屏宽设置html的字体大小，实现不同设备的适配
`document.documentElement.style.fontSize = window.innerWidth/375*16 >=20 ? 20 : window.innerWidth/375*16 + 'px';`
2. 


