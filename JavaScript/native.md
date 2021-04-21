
### 1. Object.create
```ts
Object.create = function(proto, args) {
  function F(){}
  F.prototype = proto
  return new F()
}
```

### 2. Promise
```ts
// 事件环 / 订阅发布 / 递归

```