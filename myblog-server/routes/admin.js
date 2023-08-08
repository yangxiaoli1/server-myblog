var express = require('express');
var router = express.Router();
const { sendToken } = require('../core/sendToken')
const assert = require('http-assert')
const User = require('../models/User')
const { decrypt } = require('../core/util/util')

const CLASSIFY = {
  'login': 'login',
  'register': 'register'
}

/* post register/login listing. */
router.post('/:classify', async function (req, res, next) {
  let { username, password, email } = req.body
  let { classify } = req.params
  let isClassPass = classify in CLASSIFY

  assert(isClassPass, 400, '请求无效')
  let user
  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0 || !email || email?.trim()?.length === 0) {
      assert(false, 422, "账号密码邮箱必填")
    }

    if (classify === 'login') {
      // +password 设置追加返回password内容 password Schema设置select为false时使用
      user = await User.findOne({ username }).select('+password')
      assert(user, 422, '用户不存在')
      //校验密码
      assert.equal(decrypt(password), decrypt(decrypt(user.password)), 422, '密码错误')
    }
    if (classify === 'register') {
      user = await User.create(req.body)
    }
    //生成token
    let token = await sendToken(user)
    res.send(200, {
      message: '注册成功',
      data: {
        // 前端用 属性命名用驼峰(userId)   数据库后端 小写加_ (hit_num)
        userId: user._id,
        token: token
      }
    })

  } catch (err) {
    // 传给app里的错误中间件统一处理
    next(err)
  }
});

module.exports = router;
