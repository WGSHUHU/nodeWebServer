const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/configDefault')
const route = require('./helper/route')
const openUrl = require('./helper/openUrl')

class Server {
  constructor(config) {
    // merge 用户传入的config和默认的设置
    this.conf = Object.assign({}, conf, config)
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url)
      route(req, res, filePath, this.conf)
    })

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`
      console.info(`Server start at ${chalk.green(addr)}`)
      openUrl(addr)
    })
  }
}

module.exports = Server
// 这样的好处，用户可以直接使用这个包
//1. 实例化server，实例化的时候，可以传config，可以不传
//2. 调用实例的start方法就会启动静态服务器
