
## webpack 配置

```js
const path = require('path')
{
  // 在webpack解析loader的时候配置
  resolveLoader: {
    alias:{  // 别名
      // 'babel-loader': path.resolve(__dirname,'loaders','babel-loader.js')
    },
    modules:[path.resolve(__dirname,'loaders'),path.resolve(__dirname,'node_modules')]
  },
  // 配置如何查找普通模块
  resolve: {
    alias:{  // 别名
      // 'babel-loader': path.resolve(__dirname,'loaders','babel-loader.js')
    },
    modules:[path.resolve(__dirname,'loaders'),path.resolve(__dirname,'node_modules')]
  },
  // loader配置
  module:{
    rules:[
      {
        test:/\.js&/,
        use:[  // 这个配置可以是多个，执行顺序“从下往上，从右往左”
          'babel-loader'
        ]
      }
    ]
  }
}
```
