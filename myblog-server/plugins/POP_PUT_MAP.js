module.exports = {
  "Article": {
    // 可修改字段
    "revisable": ["title", "cover", "content"],
    // 鉴权字段
    "authField": "author"
  },
  "Comment": {
    "revisable": ["content"],
    "authField": "uid"
  },
  "Column": {
    "revisable": ["name"],
    "authField": "uid"
  },
  "User": {
    "revisable": ["password", "email", "nikname"],
    "authField": "_id"
  }
}