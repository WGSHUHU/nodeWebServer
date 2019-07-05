module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 3000,
  compress: /\.(html|js|css|md)/, // 对该类型的文件进行压缩
  cache: {
    maxAge: 60 * 10, // 10分钟
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}
