const http = require('http')
const os = require('os')
const chalk = require('chalk')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const mime = require('mime')
const {createReadStream, readFileSync} = require('fs')
const ejs = require('ejs')

const template = readFileSync(path.resolve(__dirname, 'template.html'), 'utf8')
let interfaces = os.networkInterfaces()
// console.log(interfaces)
let ips = []
// 数组拍平
ips = Object.values(interfaces).reduce((memo, current) => {
  return memo.concat(current)
}, []).filter(item => item.family === 'IPv4').map(item => item.address)
// console.log(ips)

class Server {
  constructor(serverOptions = {}) {
    this.port = serverOptions.port
    this.directory = serverOptions.directory
    this.cache = serverOptions.cache
    this.gzip = serverOptions.gzip
    this.template = template
  }
  handleRequest = async (req, res) => {
    let {pathname} = url.parse(req.url)
    pathname = decodeURIComponent(pathname)
    // console.log(1, path.join(this.directory, pathname))
    let requestFile = path.join(this.directory, pathname)
    try {
      let statObj = await fs.stat(requestFile)
      if (statObj.isDirectory()) {
        const dirs = await fs.readdir(requestFile)
        const fileContent = ejs.render(this.template, {dirs:dirs.map((dir)=>({
          name: dir,
          url: path.join(pathname, dir)
        }))})
        // 文件，设置文件类型，编码格式
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.end(fileContent)
      } else {
        // 缓存
        // 缓存优化
        // 优化方案1: 强制缓存 + 协商缓存 -> 比修改时间，性能好
        // res.setHeader('Cache-Control', 'max-age=10')
        // 10s内不要访问服务器，10之后访问服务器进行对比，并且在10s内不访问服务器
        // 缺陷：修改时间变化，但是文件内容没有变，需要重新访问服务器资源
        // 优化方案2: 针对上面的问题，解决使用Etag指纹 -> 修改内容，精准，耗性能
            // res.setHeader('Cache-Control', 'max-age=10') 
            // res.setHeader('Etag', etag) // 对应浏览器请求头 if-none-match
        // 优化方案3: 再次优化，用文件的大小生成一个指纹，文件的开头部分生成指纹等

        // 强制缓存：不会再次想服务器发起请求，disk cache, memory cache 代码无法控制
        // Cache-Control 的值：
          // max-age 相对时间 比Expires优先级很高
          // Expires 绝对时间
        // res.setHeader('Cache-Control', 'max-age=10') 
        // 兼容IE
        // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString()) 
        const ctime = statObj.ctime.toGMTString()
        if (req.headers['if-modified-since'] === ctime) {
          // 协商缓存结果，去浏览器缓存读取静态资源 返回304
          res.statusCode = 304
          // 服务器没有响应结果
          res.end()
        } else {
          // 协商缓存：有一个服务器比较的过程。第一次反问服务器
          // Cache-Control 的值：
            // no-cache 每次向服务器发送请求，会存在浏览器的缓存
            // no-store 梅西向服务器发送请求，但是不会进行浏览器缓存
          res.setHeader('Cache-Control', 'max-age=10') 
          res.setHeader('Last-Modified', ctime) // 对应浏览器请求头 if-modified-since
          // 文件，设置文件类型，编码格式
          res.setHeader('Content-Type', `${mime.getType(requestFile)};charset=utf-8`)
          // res.end('文件')
          createReadStream(requestFile).pipe(res)
        }
      }
    } catch (e) {
      this.sendError(req, res, e)
    }
  }
  sendError(req, res, e) {
    console.log(e)
    res.statusCode = 404
    res.end('Not Found')
  }
  start() {
    const server = http.createServer(this.handleRequest)
    server.listen(this.port, err => {
      if (err) return console.log(err)
      console.log(chalk.yellow('Starting up http-server, serving.'))
      console.log(chalk.yellow('Available on:'))
      ips.forEach(ip => {
        console.log(`  http://${ip}:${chalk.green(this.port)}`)
      })
    })
    server.on('error', (err) => {
      // console.log(err)
      // 端口占用，重新启动服务
      if(err.errno === 'EADDRINUSE') {
        server.listen(++this.port)
      }
    })
  }
}

module.exports = Server