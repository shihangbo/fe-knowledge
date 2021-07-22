#! node


// 帮助文档
const options = require('./config')
const program = require('commander')
program.name('fs')
program.usage('[options]')
// 解析当前运行进行传递的参数
const examples = new Set()
// const defaultMapping = {}
Object.entries(options).forEach(([key, value]) => {
  examples.add(value.usage)
  // defaultMapping[key] = value.default
  program.option(value.option, value.description,value.default)
})

program.on('--help', () => {
  console.log('\nExamples:')
  examples.forEach(item => {
    console.log(`  ${item}`)
  })
})

program.parse(process.argv)

const serverOptions = program.opts()
// console.log(program.opts())
// console.log(defaultMapping)

// 启动服务
const Server = require('../src/index')
let server = new Server(serverOptions)
server.start()