
# 文档学习 https://v3.vuejs.org/guide/component-props.html#prop-types

### Composition API
#### 1.setup : 在创建组件之前执行，因此没有this，没有组件相关的本地状态、计算属性或方法  
1.1 执行时机：beforeCreate 之前  
1.2 返回值：对象，对象中的属性与data/methods进行合并，重名setup优先
1.3 参数：props-{当前组件通过props接收的所有属性组成的对象}; content-{attrs：当前标签上，没有在props中声明接收的所有属性组成的对象；emit：事件分发，向上传递，相当于this.$emit方法；}
1.4 setup中的响应式方法：ref，reactive
##### ref  
```ts
const count = ref(0)
ref是一个函数用于定义一个数据的响应式，并返回一个Ref对象  
定义一个基本类型的响应式数据  
对象中又一个value属性，可对其进行操作；模板中不需要通过.value使用  
count 的类型 Ref类型
ref内部：通过给value属性添加getter/setter来实现对数据的劫持
ref中如果放入一个对象/数组，那么这个对象/数据是经过reactive处理，转化为Proxy类型的代理对象
```
##### reactive  
```ts
const proxy = reactive(obj)
是一个函数用于定义多个数据的响应式
reacitve内部：通过使用proxy来实现对对象内部所有数据的劫持，并通过Reflect操作对象内部数据
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
#### 3.计算属性和监视
```ts
const c = computed(()=>{})
1.返回值：返回一个Ref类型的对象
2.参数：如果只传入一个回调函数，表示get 
       如果传入一个对象，{get(){...},set(val){...}}
```
```ts
watch(user,()=>{},{immidiate:true,deep:true})
// 用watch监视非响应式数据，监视同时多个数据
watch([()=>user.fitstName, ()=>user.lastName],()=>{})
// 不需要配置 immidiate，默认执行
watchEffect(()=>{})
```
#### 4.生命周期
```ts
1.2与3一样的生命周期              推荐使用组合式API
beforeCreate                   -> setup()
created                        -> setup()
beforeMount                    -> onBeforeMount
mounted                        -> onMounted
beforeUpdate                   -> onBeforeUpdate
updated                        -> onUpdated

2.2与3不一样的生命周期
beforeDestory -> beforeUnmount -> onBeforeUnmount
destoryed     -> unmounted     -> onUnmounted

3.组合API提供了相应的调试函数
onRenderTracked
onRenderTriggered 检查哪个依赖导致组件的重新渲染
```
