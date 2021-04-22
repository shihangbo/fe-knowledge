## 重学前端

### 1.js
```html
1. 用一定文法（词法和语法），表达一定语义，从而操作运行时
2. 6种基本类型：Number,String,Null,Undefined,Symbol,Boolean
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
. 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法
10.装箱转换：每一种基本类型Number/String/Boolean/Symbol在对象中都有对应的类，装箱转换正是把基本类型转换为对应的对象；它产生一个个临时对象，通过这个临时对象获取到对应类的属性和方法；  
11.拆箱转换：ToPrimitive函数，是对象类型到基本类型的转换。拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。
12.NaN !== NaN
13.为什么js有对象的概念，但是却没有像其他语言那样，有类的概念？
js对象是什么？对象是一切事物的总称，JavaScript 对象的运行时是一个“属性的集合”，属性以字符串或者 Symbol 为 key，以数据属性特征值或者访问器属性特征值为 value
JavaScript 提供了完全运行时的对象系统，这使得它可以记性面向对象的编程范式（基于类和基于原型）
14.为什么在js对象里可以自由添加属性，而其他的语言却不能呢？
JavaScript 对象的运行时是一个“属性的集合”，是具有高度动态性的属性集合
15.关于js的面向对象？
在编程语言中，最为成功的流派是使用“类”的方式来描述对象，诸如 C++、Java 等流行的编程语言，Java 可以给对象定义“属性”和“方法”，都是基于类的、静态的对象设计，关注类和类之间关系开发模型（封装/继承/多态）；
js设计对象是一个高度动态性的属性的集合，首先是动态的，运行时的，具有在运行时给对象添加属性和方法的能力，他的面向对象的编程范式基于他的原型系统，更关注一系列对象实例的行为，基于原型的面向对象系统通过“复制”的方式来创建新对象，并提倡运行时的原型修改；
16.修改原型的方法：
Object.create() 根据指定的原型创建新对象
Object.getPrototypeOf() 获得一个对象的原型
Object.setPrototypeOf() 设置一个对象的原型
Object.prototype.toString 获取当前对象的[[class]]属性

``` 

### 2.HTML和CSS

### 3.浏览器实现原理与API

### 3.前端综合应用

