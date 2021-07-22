
const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  console.log('--------req 请求处理 start---------')
  console.log('请求行url：', url.parse(req.url, true))
  console.log('请求头：', req.headers)
  // 分段数据
  let chunk = []
  req.on('data', data => {
    chunk.push(data)
  })
  req.on('end', () => {
    console.log('请求体：', Buffer.concat(chunk))
    console.log('--------req 请求处理 end---------')
  })

  console.log('--------res 响应处理 start---------')
  res.statusCode = 222
  res.statusMessage = 'watson'
  res.setHeader('MyHeader', 'watson')
  res.write('hello watson!')
  res.end()
  console.log('--------res 响应处理 end---------')

})
// server.on('request', (req, res) => {
//   console.log('client come on 3')
// })

server.listen(3000, () => {      
  console.log('server start, port: 3000')
})