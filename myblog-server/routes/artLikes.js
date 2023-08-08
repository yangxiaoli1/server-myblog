const express = require('express')
const router = express.Router()
const Article = require('../models/Article')
const { getPublicKeySync } = require('../core/rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT 安装用此版本"^8.5.1"

/*
  文章搜索 title content
  http://127.0.0.1:3000/search?q=你好
*/
router.post('/:id', async (req, res, next) => {
  let token = req.headers?.authorization?.replace('Bearer ', '')
  // console.log(token, 'token')
  if (token) {
    let key = getPublicKeySync()
    jwt.verify(token, key, function (err, data) {
      if (err) {
        console.log(err)
        return
      }
      let userId = data._id
      // console.log(userId, 'userId')
      if (userId) {
        req._id = userId
      }
    })
  }
  next()
}, async (req, res, next) => {
  let id = req.params.id
  console.log(id, 'id')
  let isLike = true
  let query = {}

  try {
    if (req._id) {
      let resArticle = await Article.findById(id)
      // console.log(resArticle, 'resArticle')
      let likeUsers = resArticle['like_users']
      isLike = !(likeUsers.includes(req._id))
      // $addToSet去重添加到数组里 $pull删除数组的字段
      query[isLike ? '$addToSet' : '$pull'] = {
        like_users: req._id
      }

      query['$inc'] = {
        like_num: isLike ? 1 : -1
      }
    }

    let result = await Article.findByIdAndUpdate(id, query)
    let likes = ++result.like_num
    res.send(200, {
      message: '点赞成功',
      data: { likes }
    })
  } catch (err) {
    next(err)
  }

})

module.exports = router;