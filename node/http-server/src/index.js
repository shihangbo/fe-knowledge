const http = require('http')
const os = require('os')
const chalk = require('chalk')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const mime = require('mime')
const {createReadStream, readFileSync} = require('fs')
const ejs = require('ejs')
const crypto = require('crypto')
const zlib = require('zlib')

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
  // 缓存
  cacheFile(req, res, requestFile, statObj) {
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
    
      // 协商缓存：有一个服务器比较的过程。第一次反问服务器
      // Cache-Control 的值：
        // no-cache 每次向服务器发送请求，会存在浏览器的缓存
        // no-store 梅西向服务器发送请求，但是不会进行浏览器缓存
    
    // req.headers['if-modified-since'] === ctime
    const lastModifed = statObj.ctime.toGMTString()
    const etag = crypto.createHash('md5').update(readFileSync(requestFile)).digest('base64')
    // 强制缓存
    res.setHeader('Cache-Control', 'max-age=10')
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())
    // 协商缓存 服务端设置对比值
    res.setHeader('Last-Modified', lastModifed) // 对应浏览器请求头 if-modified-since
    res.setHeader('Etag', etag)

    const ifModifiedSince = req.headers['if-modified-since']
    const ifNoneMatch = req.headers['if-none-match']
    // 比较时间
    if (ifModifiedSince !== lastModifed) {
      return false
    }
    // 比较指纹
    if (ifNoneMatch !== etag) {
      return false
    }
    return true
  }
  // 压缩
  gzipFile(req, res, requestFile, statObj) {
    // 检查浏览器 是否支持压缩，eccpet-encoding字段
    // 优化方案
    // - 根据文件的不同类型，指定压缩方案，并不是所有是文件都适合压缩
    // - 重复率高的文件适合做压缩，例如.html .css .js
    // - 图片/视频文件，不适合做压缩，直接返回即可
    const encodings = req.headers['accept-encoding']
    if (encodings) {
      if (encodings.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip')
        return zlib.createGzip()
      } else if (encodings.includes('deflate')) {
        res.setHeader('Content-Encoding', 'deflate')
        return zlib.createDeflate()
      }
      return false
    }
    return false // 浏览器不支持
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
        // 创建缓存
        if (this.cacheFile(req, res, requestFile, statObj)) {
          // 协商缓存结果，去浏览器缓存读取静态资源 返回304
          res.statusCode = 304
          // 服务器没有响应结果
          return res.end()
        }

        // 文件，设置文件类型，编码格式
        res.setHeader('Content-Type', `${mime.getType(requestFile)};charset=utf-8`)


        // 创建压缩流
        let gzipFileRow;
        if (gzipFileRow = this.gzipFile(req, res, requestFile, statObj)) {
          return createReadStream(requestFile).pipe(gzipFileRow).pipe(res)
        }

        // res.end('文件')
        createReadStream(requestFile).pipe(res)
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