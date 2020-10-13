
# 文档学习 https://v3.vuejs.org/guide/component-props.html#prop-types

### 1.props
  1.any types uses an array of string  
```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```
  2.every props to be a specific type of value  
```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```
  3.type checks
    3.1 type can be a custom constructor function, the value of the prop was created with new People  
### 1.non-prop attributes
  1 inheritAttrs 子组件顶层DOM元素是否继承父设置的属性  
  
