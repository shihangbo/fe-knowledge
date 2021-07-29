
const express = require('express')
// 找node_module文件下的同名文件夹
// 先找里面的package.json文件，里面的main字段对应引用路径
// 再找index.js文件，对应导出的文件路径
const app = express()

app.get('/', function(req, res) {
  res.end('home')
})
app.get('/login', function(req, res) {
  res.end('login')
})

app.listen(3000, () => {
  console.log('server start')
})