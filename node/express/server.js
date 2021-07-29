
const express = require('express')
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