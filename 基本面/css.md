
web app & web page

1.rem：相对于根元素的字体大小单位，是一个相对单位
2.em ：相对于父元素的字体大小单位
3.meta name=viewport 原理
visual viewport：可见视口，即屏幕宽度；
layout viewport：布局视口，即DOM宽度；
idea viewport：理想适口，使布局视口就是可见视口；
<meta name="viewport" content="width=device-width,initial-scale=1">
这个meta设置 布局视口(layout viewport) 等于 移动设备的屏幕宽度(visual viewport)，得到 idea viewport
4.物理像素(设备像素)，普通屏幕1个css像素=1个物理像素
5.CSS像素用于控制元素样式的样式单位像素
6.总结：标准设备1px对应1个物理像素，苹果Retina屏幕1px对应4个物理像素

7.vm/vh：表示视区宽度/高度，视区总宽度为100vw, 总高度为100vh
  视区指浏览器内部的可视区域大小：window.innerWidth/Height
  同屏幕宽度一致

8.flex：【弹性布局】用于排列元素的一种布局模式，display:flex
  主轴、交叉轴
  父容器：7个属性
  子容器：3个属性

9.grid：【网格布局】是最强大的 CSS 布局方案，display: grid
  采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）
  容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）

89总结：
  Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是一维布局
  Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是二维布局


【流式布局】
    实现：通过百分比定义宽度，用px定义高度
    缺陷：在大屏设备上，被横向拉长，高度不变
【等比缩放布局 - rem】
    实现：淘宝首页方案js计算，640基准font-size等于20px来实现等比缩放
         css的 media query来实现适配

一、移动端适配方案
1.viewport（scale=1/dpr）视口
2.font-size + rem
3.flex
4.vm/vh

学习链接：https://www.jianshu.com/p/b13d811a6a76
