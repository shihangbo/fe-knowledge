## webpack基础知识

#### 1.toStringTag
```js
console.log(Object.prototype.toString.call('watson'))
console.log(Object.prototype.toString.call(1))
console.log(Object.prototype.toString.call([1,2,3]))
console.log(Object.prototype.toString.call(true))
console.log(Object.prototype.toString.call(undefined))
console.log(Object.prototype.toString.call(null))

console.log(Object.prototype.toString.call({name: 'watson'}))

const obj = {}
Object.defineProperty(obj, Symbol.toStringTag, {value: 'Module'})
console.log(Object.prototype.toString.call(obj))
```

#### 2.Object.create
```js
let ns1 = {}
console.log(ns1, Object.getPrototypeOf(ns1))

let ns2 = Object.create(null)
console.log(ns2, Object.getPrototypeOf(ns2))

// 1.使用Object.create创建的对象，没有任何属性，没有原型
// 2.Object.create的实现
Object.create = function(proto) {
  function F(){}
  F.prototype = proto
  return new F()
}
```

#### 3.Oject.defineProperty(obj,key,{})
```js
getter //获取器函数
```

#### 4.按位与 &
```js
// 比特 bit 二进制数系统中，每个0或1就是一个位(bit)，位是数据存储的最小单位
// 其中 8个bit 就是一个字节 Byte ，即 1byte=8bit（一个英文字母=1字节，一个中文汉字=2字节）
// 按位与& 两个输入数的同一位都为1才为 1
// js中 0为false，0b开头二进制，0开头八进制，0x开头十六进制，不加前缀10进制
let a = 0b1000
let b = 0b1111
console.log(a&b) // 2^3 = 8
```

#### 5.问题
```js
// 5.1 es6 import export 的实现
// 5.2 第三方插件是如何运行的
```