var express = require('express');
var router = express.Router();
const userControl = require('../core/userControl')
const { getUserStatusMsg } = require('../core/statusControl')
const expressJwt = require('express-jwt') // 用的512位加密 安装用此版本"^6.0.0"
const { getPublicKeySync } = require('../core/rsaControl')
const createError = require('http-errors')


/* post index page. */
router.post('/', expressJwt({
  secret: getPublicKeySync(), //解密秘钥 
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  isRevoked: function (req, payload, next) {
    //获取token payload内容
    // console.log(payload)
    let { username, _id } = payload
    req.username = username
    req.userID = _id

    userControl.verifyToken(username, _id).then(result => {
      req.isPass = false
      if (result.statusCode === getUserStatusMsg('USER_FOND')['statusCode']) {
        req.isPass = true
      }
      next()
    })

  }
}), function (req, res, next) {
  if (req.isPass) {
    let result = getUserStatusMsg('USER_LOGIN')
    result.statusCode = 200
    res.send(200, {
      ...result,
    })
  } else {
    let result = getUserStatusMsg('USER_FAILED')
    res.send(200, {
      ...result,
    })
  }
});


module.exports = router;
