
## Promise

### 1.概述
是一种异步流程的控制手段，可以解决js异步的问题，但promise本身不是异步实现的(默认promise中的参数executor同步执行，then是异步调用的(遵循事件环机制))，解决了如下问题：
1.回调地狱(代码难以维护) -> 链式调用(代码简洁)  
2.支持多个并发请求，统一获取数据之后进行处理  

### 2.编写Promise
