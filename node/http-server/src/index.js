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
    // console.log(pathname)
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
        // 文件，设置文件类型，编码格式
        res.setHeader('Content-Type', `${mime.getType(requestFile)};charset=utf-8`)
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