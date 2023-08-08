const express = require('express')
const router = express.Router()
const Article = require('../models/Article')
const { pagination } = require('../core/util/util')
const createError = require('http-errors')
const qs = require('qs')
/*
  文章搜索 title content
  http://127.0.0.1:3000/search?q=你好
*/
const POPULATE_MAP = require('../plugins/POPULATE_MAP')
router.get('/', async (req, res, next) => {
  let modelName = 'Article'
  let query = req.query
  query = qs.parse(query)
  let regExp = new RegExp(query.q, 'i')

  query = {
    $or: [
      // 正则关键字校验
      { title: { $regex: regExp } },
      { content: { $regex: regExp } }
    ]
  },
    options = {},
    populate = {},
    size = 100, page = 1, dis = 8

  try {
    if (modelName in POPULATE_MAP) {
      populate = POPULATE_MAP[modelName]
    }
    let result = await pagination({ model: Article, query, options, size, page, dis, populate })
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(createError(422, "获取失败"))
  }

})

module.exports = router;