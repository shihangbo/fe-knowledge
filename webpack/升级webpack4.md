
```js
1.Error: Cannot find module 'webpack/bin/config-yargs'
原因:  
这个就是目前版本的webpack-dev-server@2.xx.xx 不支持 webpack@4.32.2
webpack4.0以上都要安装webpack-cli 
2.TypeError: compilation.mainTemplate.applyPluginsWaterfall is not a function
TypeError: Cannot read property 'tap' of undefined
原因:  
是html-webpack-plugin·版本不兼容问题
 npm i -D html-webpack-plugin@3.2.0
3.
Module parse failed: Unexpected token (949:19)
You may need an appropriate loader to handle this file type.
|         name: 'settings',
|         component: function component() {
>             return import('@/views/settings');
|         }
|     }]);
原因：vue-loader被我删除了，安装上即可
4.
TypeError: Cannot read property 'vue' of undefined
原因：
vue-loader和webpack不兼容
npm i -D vue-loader@15.9.1
5.
Error: Cyclic dependency
升级 html-webapck-plugin
6.
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin 
解决：
const VueLoaderPlugin = require('vue-loader/lib/plugin');
plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
],
7.
Module build failed (from ./node_modules/less-loader/dist/cjs.js):
解决：
"less": "^4.1.1",
"less-loader": "^8.0.0",
8.
TypeError: this.getOptions is not a function
原因： less-loader安装的版本过高
1.npm uninstall less-loader
2.npm install less-loader@5.0.0
9. nom run build
Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint i
extract-text-webpack-plugin 插件是 webpack3的,插件extract-text-webpack-plugin的版本问题
npm install extract-text-webpack-plugin@next -D
```