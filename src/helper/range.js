module.exports = (totalSize, req, res) => {
  const range = req.headers['range']
  if(!range){
    return { code: 200 }
  }
  const sizes = range.match(/bytes=(\d*)-(\d*)/) // 获取客户端要请求的数据的start和end

  // 下面的处理，start和end都可以省略
  const end = sizes[2] || totalSize - 1 // end是正则表达式的第二个分组
  const start = sizes[1] || totalSize - end

  // 下面的非法情况
  if(start > end || start < 0 || end > totalSize){
    return { code: 200 }
  }


  // 正常的返回
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`)
  res.setHeader('Content-Length', end - start)
  return {
    code:206,
    start:parseInt(start, 10),
    end:parseInt(end, 10)
  }
}
