const { uploadURL } = require('../config')
const { formatDate } = require('../core/util/util')
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  title: {
    type: String,
    //Date.now 后面没有加() 不是马上执行 如果没有输入标题再回调执行
    default: '文章标题' + new Date().toDateString(),
    required: true
  },
  cover: {
    type: String,//URL
    default: `${uploadURL}article/article-cover.jpg`
  },
  content: {
    type: String,//URIencode(HTMLCode)
    required: true,
    set(val) {
      try {
        // 将双引号替换成单引号
        val = decodeURIComponent(`${val}`).replace(/\"/g, "\'")
        return val
      } catch (err) {
        return val
      }
    }
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), 'yyyy年MM月dd日 hh:mm:ss')
    }
  },
  hit_num: {
    type: Number,
    default: 0
  },
  comment_num: {
    type: Number,
    default: 0
  },
  like_num: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    //ref 关联 集合model的名字
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Comment'
    }
  ],
  column: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Column',
    required: true
  },
  like_users: [
    {
      type: mongoose.SchemaTypes.ObjectId,
    }
  ]
})
// 在mongose数据库中的数据是BSON格式，如果要使用Json的方法 需要加上下面一行代码
schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Article', schema)

// articles 6449d99cac344f27bb259f39