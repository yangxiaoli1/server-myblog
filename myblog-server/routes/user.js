const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Article = require('../models/Article')
const Column = require('../models/Column')
const createError = require('http-errors')
const assert = require('http-assert')


//更新资源
router.put('/', async (req, res, next) => {
  // const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
  // res.send(model)

  let putData = req.body
  let isPass = req.isPass //鉴权结果
  let userId = req._id

  try {
    assert(isPass, 400, '无权修改')
    await User.findByIdAndUpdate(userId, putData)
    res.send(200, {
      message: "修改成功"
    })
  } catch (err) {
    next(err)
  }
})
//查询资源列表
// GET http://127.0.0.1:3000/api/reset/users
router.get('/', async (req, res, next) => {
  let _id = req._id

  try {
    let result = await User.findById(_id)

    let articleCount = await Article.find({ author: _id }).count()
    let columnCount = await Column.find({ uid: _id }).count()
    //得到的result数据是BSON，要转换成JSON
    result = result.toJSON()
    result = Object.assign(result, { articleCount, columnCount })
    console.log(result, '!!===================')
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(createError(422, "获取失败"))
  }

})



module.exports = router