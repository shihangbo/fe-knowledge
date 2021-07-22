const options = {
  'port': {
    option: '-p, --port <n>',
    default: 8080,
    usage: 'fs --port 3000',
    description: 'set fs port'
  },
  'gzip': {
    option: '-g, --gzip <n>',
    default: 1,
    usage: 'fs --gzip 0',
    description: 'set fs gzip'
  },
  'cache': {
    option: '-c, --cache <n>',
    default: 1,
    usage: 'fs --cache 0',
    description: 'set fs cache'
  },
  'directory': {
    option: '-d, --directory <n>',
    default: process.cwd(),
    usage: 'fs --directory n:',
    description: 'set fs directory'
  }
}

module.exports = options