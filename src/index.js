const http = require('http')
const chalk = require('chalk')
const conf = require('./config/configDefault')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<body>')
  res.write('Hello world!')
  res.write('</body>')
  res.write('</html>')
  res.end()
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.info(`Server start at ${chalk.green(addr)}`)
})
