const Etag = require('etag')
const fs = require('fs')
const path = require('path')
const { cache, root } = require('../config/configDefault')

function refreshRes(stats,req, res){
  const { maxAge, expires, cacheControl, lastModified, etag } = cache
  if(expires){
    res.setHeader('Expires', new Date(Date.now() + maxAge*1000).toUTCString())
  }

  if(cacheControl){
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }

  if(lastModified){
    res.setHeader('Last-Modified', stats.mtime.toUTCString())
  }
  if(etag){
    const filePath = path.join(root, req.url)
    const body = fs.readFileSync(filePath)
    res.setHeader('ETag', Etag(body))
  }
}

module.exports = function isFresh(stats,req, res){
  //1.  初始化，设置响应头
  refreshRes(stats,req, res)

  const lastModified = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']
  if(!lastModified && !etag){
    //2. 可能是第一次请求
    return false
  }

  //3.  res.getHeader('Last-Modified') ---> 获取设置的响应头
  if(lastModified && lastModified !== res.getHeader('Last-Modified')){
    return false // 失效
  }

  if(etag && etag !== res.getHeader('ETag')){
    return false
  }
  return true
}
