var express = require('express');
var router = express.Router();
// const { addUser } = require('../core/userControl')
// 必须引入userControl，不能单独引用addUser，因为addUser里调用了userControl里的其他方法
const userControl = require('../core/userControl')
const { getUserStatusMsg } = require('../core/statusControl')
const { getPrivateKey } = require('../core/rsaControl')
const jwt = require('jsonwebtoken')
const { sendToken } = require('../core/sendToken')
const assert = require('http-assert')
const User = require('../models/User')
const Article = require('../models/Article')
const createError = require('http-errors')
const QUE_MAP = require('../plugins/QUE_MAP')

/* post register listing. */
router.post('/', async function (req, res, next) {
  let { username, password, email } = req.body

  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0 || !email || email?.trim()?.length === 0) {
      assert(false, 422, "账号密码邮箱必填")
    }

    let user = await User.create(req.body)
    let token = await sendToken(user)
    res.send(200, {
      data: {
        message: '注册成功',
        data: {
          // 前端用 属性命名用驼峰(userId)   数据库后端 小写加_ (hit_num)
          userId: user._id,
          token: token
        }
      }
    })

  } catch (err) {
    if (err.message.indexOf('duplicate key error') !== -1) {
      let repeatKey = Object.entries(err.keyValue)?.map(([key, vaule]) => {
        return `${QUE_MAP?.[key]}不能重复`
      })[0]
      next(createError(422, repeatKey))
    } else if (err.errors) {
      let paramErrors = Object.entries(err.errors).map(([key, value]) => {
        return `${value.message}`
      }).reduce((acc, curr) => {
        acc += curr
        return acc
      }, '')
      next(createError(422, paramErrors))
    } else {
      next(createError(422, err))
    }

  }


  // let { username, pwd } = req.body
  // if (!username || username?.length === 0 || !pwd || pwd?.length === 0) {
  //   res.send(200, {
  //     ...getUserStatusMsg('USER_TRIM')
  //   })
  // }
  // let result = await userControl.addUser(username, pwd)
  // console.log(result)
  // // result.statusCode = 200
  // if (result.statusCode === 200) {
  //   let token = await sendToken(result)
  //   // let { user_name, user_id } = result.data

  //   // let privateKey = await getPrivateKey()
  //   // let token = jwt.sign({ user_name, user_id, exp: ~~((Date.now() / 1000) + 24 * 3600 * 3) }, privateKey, { algorithm: 'RS256' });
  //   res.send(200, {
  //     ...result,
  //     data: {
  //       token
  //     }
  //   })
  //   return
  // }
  // res.send(200, {
  //   ...result
  // })
});

module.exports = router;
