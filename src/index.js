const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/configDefault')
const route = require('./helper/route')

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url)
  route(res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.info(`Server start at ${chalk.green(addr)}`)
})
