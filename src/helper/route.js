const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const mime = require('mime');
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/configDefault')
const compress = require('../helper/compress')
const range = require('../helper/range')

const tplPath = path.join(__dirname, '../template/index.html')
const source = fs.readFileSync(tplPath, 'utf-8') // 添加编码就是字符串，不加编码读出来的是Buffer
const template = Handlebars.compile(source)

module.exports = async function(req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      let ext = path.basename(filePath).split('.').pop().toLowerCase()
      // ext就是扩展名
      const MimeType = mime.getType(ext);
      res.setHeader('Content-Type', MimeType)
      // fs.createReadStream(filePath).pipe(res) // 1. 使用流的方式在高并发的情况下，表现更好；此处最好不加编码方式(所有文)
      let rs
      const { code, start, end } = range(stats.size, req, res) // stats.size就是文件的大小
      if(code === 200){
        res.statusCode = 200
        rs  =  fs.createReadStream(filePath)
      }else{
        res.statusCode = 206
        rs  =  fs.createReadStream(filePath, {
          start, end
        })
      }
      if(filePath.match(config.compress)){
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
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
