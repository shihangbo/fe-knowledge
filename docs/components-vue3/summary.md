# 组件库开发基础知识学习

## 参考Ant Design Vue - https://www.antdv.com/docs/vue/i18n-cn/  

### 1.vue3
  参考vue3学习知识  
### 2.定制方式
  1.定制主题(实现换肤功能)  
    1.使用less.modifyVars更改变量实现换肤
### 3.国际化
  1.ant-design-vue 提供一个vue组件 LocaleProvider用户全局配置国际化文案  
```vue
<template>
  <a-locale-provider :locale="locale">
    <App/>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  export default {
    data() {
      return locale: zhCN,
    }
  }
</script>
```