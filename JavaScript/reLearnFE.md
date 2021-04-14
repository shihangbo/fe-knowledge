## 重学前端

### 1.js
```html
1. 用一定文法（词法和语法），表达一定语义，从而操作运行时
2. 7种基本类型：Number,String,Null,Undefined,Symbol,Boolean
3. 7种语言类型：Undefined,Null,Boolean,Number,String,Symbol,Object
4. 为什么有的编程规范要求用 void 0 代替 undefined？
因为 JavaScript 的代码 undefined 是一个变量，而并非是一个关键字，这是 JavaScript 语言公认的设计失误之一，所以，我们为了避免无意中被篡改，我建议使用 void 0 来获取 undefined 值
5. undefined 与 null 的区别：Undefined 类型表示未定义，它的类型只有一个值，就是 undefined，Null 表示的是：“定义了但是为空”，null 是 JavaScript 关键字
6. 字符串有最大长度吗？String 有最大长度是 2^53 - 1
7. 为什么在 JavaScript 中，0.1+0.2 不能 =0.3？
JavaScript 中的 Number 类型基本符合 IEEE 754-2008 规定的双精度浮点数规则，这源自于机器只识别二进制，所以将小数转为二进制数之后可能有精度丢失的问题，解决办法：检查等式左右两边差的绝对值是否小于最小精度，console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
8. ES6 新加入的 Symbol 是个什么东西？
一切非字符串的对象 key 的集合，她是一个全局函数
应用场景：允许编写与语言结合更紧密的 API，可以使用 Symbol.iterator 来自定义 for…of 在对象上的行为
9. 为什么给对象添加的方法能用在基本类型上？

``` 

### 2.HTML和CSS

### 3.浏览器实现原理与API

### 3.前端综合应用

