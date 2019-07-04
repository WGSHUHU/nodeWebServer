const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/configDefault')

const tplPath = path.join(__dirname, '../template/index.html')
const source = fs.readFileSync(tplPath, 'utf-8') // 添加编码就是字符串，不加编码读出来的是Buffer
const template = Handlebars.compile(source)

module.exports = async function(res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      fs.createReadStream(filePath, 'utf-8').pipe(res) // 1. 使用流的方式在高并发的情况下，表现更好
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative(config.root, filePath)
      const data = {
        title: path.basename(filePath),
        files,
        dir: dir ? `/${dir}`:''
      }
      res.end(template(data))
    }
  } catch (error) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not file or directory \n ${error}`)
    return
  }
}
