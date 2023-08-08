const path = require('path')
module.exports = {
  host: '127.0.0.1',
  port: 3000,
  root: process.cwd(),
  keyPath: path.join(process.cwd(), '/auth'),
  priKeyPath: path.join(process.cwd(), '/auth/private.cer'),
  pubKeyPath: path.join(process.cwd(), '/auth/public.cer'),
  userPath: path.join(process.cwd(), '/user/user.json'),
  uploadPath: path.join(process.cwd(), '/uploads'),
  uploadURL: 'http://127.0.0.1:3000/',
  maxFileSize: 10240000
}