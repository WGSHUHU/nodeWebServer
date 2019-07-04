const { createGzip, createDeflate }  = require('zlib')

module.exports = (rs, req, res) => {

  const acceptCoding = req.headers['accept-encoding']
  if(!acceptCoding || !acceptCoding.match(/\b(gzip|deflate)\b/)){
    return rs
  }else if(acceptCoding.match(/\bgzip\b/)){
    res.setHeader('Content-Encoding', 'gzip')
    return rs.pipe(createGzip())
  }else if(acceptCoding.match(/\bdeflate\b/)){
    res.setHeader('Content-Encoding', 'deflate')
    return rs.pipe(createDeflate())
  }
}
