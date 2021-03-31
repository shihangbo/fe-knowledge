
# 文档学习 https://v3.vuejs.org/guide/component-props.html#prop-types

### Composition API
#### 1.setup : 在创建组件之前执行，因此没有this，没有组件相关的本地状态、计算属性或方法  
##### ref  
```ts
const count = ref(0)
ref是一个函数用于定义一个数据的响应式，并返回一个Ref对象  
定义一个基本类型的响应式数据  
对象中又一个value属性，可对其进行操作；模板中不需要通过.value使用  
count 的类型 Ref类型
```
##### reactive  
```ts
const proxy = reactive(obj)
是一个函数用于定义多个数据的响应式
接受一个普通对象，然后返回该对象的响应式代理器对象  
对象中又一个value属性，可对其进行操作；模板中不需要通过.value使用  
proxy 的类型 Proxy类型
```
#### 2.比较Vue2和Vue3的响应式对比
##### vue2
```ts
核心
1.对象：通过defineProperty对对象已有属性读取和修改进行数据劫持，getter/setter
2.数组：通过重写数组方法（7个：push/shift/pop/unsift/sort/reserve/splice）实现对数组对监听和拦截

问题
1.对象直接新增或删除属性，页面不会更新
2.数组通过下标新增或替换元素，更新length，页面不会更新
```
##### vue3
```ts
核心
1.Proxy（代理）：通过代理data对象，拦截对data对任意属性操作（13种），包括属性的读写/新增/删除等
2.Reflect（反射）：动态对被代理对象的相应属性进行特定操作，提供的操作方法与proxy handlers的方法相同
```


  
