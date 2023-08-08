const express = require('express');
const router = express.Router();
const userControl = require('../core/userControl')
const { getUserStatusMsg } = require('../core/statusControl')
const { getPrivateKey } = require('../core/rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT 安装用此版本"^8.5.1"
const { sendToken } = require('../core/sendToken')
const assert = require('http-assert')
const User = require('../models/User')
const Article = require('../models/Article')
const { encrypt, decrypt } = require('../core/util/util')

/* post register listing. */

router.post('/', async function (req, res, next) {
  let { username, password, email } = req.body

  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0 || !email || email?.trim()?.length === 0) {
      assert(false, 422, "账号密码邮箱必填")
    }
    // +password 设置追加返回password内容 password Schema设置select为false时使用
    let user = await User.findOne({ username }).select('+password')
    assert(user, 422, '用户不存在')
    //校验密码
    assert.equal(password, decrypt(user.password), 422, '密码错误')

    let token = await sendToken(user)
    res.send(200, {
      data: {
        message: '登陆成功',
        data: {
          // 前端用 属性命名用驼峰(userId)   数据库后端 小写加_ (hit_num)
          userId: user._id,
          token: token
        }
      }
    })

  } catch (err) {
    next(err)
  }

  // xiaoli U4l2xk4GW2kGww9EWYRoishQQ4JA1MyBYzTe/Z+XaRyZkSZcFSBxk7CTbiI2VecDA8m72mRItRSZ4fhM6kLs1Q==
  // let result = await userControl.verifyUser(username, pwd)
  // console.log(result)
  // //如果验证账号密码失败
  // if (result.statusCode !== getUserStatusMsg('USER_INN')?.['statusCode']) {
  //   res.send(200, { ...result })
  //   return
  // }
  // if (result.statusCode === '4020' && result.data) {
  //   let token = await sendToken(result)
  //   //成功结果返回前端 统一statusCode 200
  //   let backRes = getUserStatusMsg('USER_LOGIN')
  //   backRes.statusCode = 200
  //   res.send(200, {
  //     ...backRes,
  //     data: {
  //       token
  //     }
  //   })
  // }

});


module.exports = router;
