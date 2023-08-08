const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/blog', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

let db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.on('open', () => {
  console.log('数据库已连接')
})

module.exports = {
  mongoose
}