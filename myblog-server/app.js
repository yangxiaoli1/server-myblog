const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { mongoose } = require('./plugins/db')
const { maxFileSize } = require('./config')
const expressJwt = require('express-jwt')
const { getPublicKeySync } = require('./core/rsaControl')
const User = require('./models/User')

require('./socket')
const resourceMiddleware = require('./middleware/resource')

// const indexRouter = require('./routes/index');
const pubKeyRoute = require('./routes/getPubKey')
const busRoute = require('./routes/bus')
// const registerRoute = require('./routes/register')
// const loginRoute = require('./routes/login')
const adminRoute = require('./routes/admin')
const uploadRoute = require('./routes/upload')
const searchRoute = require('./routes/search')
const artLikesRoute = require('./routes/artLikes')
const userRoute = require('./routes/user')

const app = express();
app.use(cors({
  "origin": true, //true 设置为 req.origin.url
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
  "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
  "maxAge": 1728000, //options预验结果缓存时间 20天
  "credentials": true, //携带cookie跨域
  "optionsSuccessStatus": 200 //options 请求返回状态码
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 将public和uploads文件夹下的资源开放  访问这些资源的时候不需要在路径中写public和uploads
// 例如 'http://127.0.0.1:3000/article/h1.jpg'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(expressJwt({
  secret: getPublicKeySync(), //解密秘钥 
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  isRevoked: async function (req, payload, next) {
    //获取token payload内容
    // console.log(payload)
    let { _id } = payload
    req._id = _id
    req.isPass = true
    try {
      let result = await User.findById(_id)
      if (!result) {
        req.isPass = false
      }
      next()
    } catch (err) {
      next(err)
    }
  }
  // 以下操作不需要鉴权
}).unless({
  path: [
    // { url: '/api/reset/comments', methods: ['GET', 'POST'] },
    // { url: '/api/reset/articles', methods: ['GET'] },
    // { url: '/api/reset/columns', methods: ['GET'] },
    { url: /\/api\/reset/, methods: ['GET'] },
    { url: '/api/reset/keys', methods: ['GET'] },
    { url: '/admin/login' },
    { url: '/admin/register' },
    { url: '/keys' },
    { url: '/articles/search' },
    { url: '/articles/likes' },
    // { url: /upload/ },
  ]
}))

//资源路由
app.use('/api/reset/:resource', resourceMiddleware(), busRoute)
//登录注册
app.use('/admin', adminRoute)
// app.use('/admin', loginRoute)
// app.use('/user', indexRouter);

app.use('/index', (req, res, next) => {
  if (req.isPass) {
    res.send(200, {
      message: 'ok'
    })
  } else {
    res.send(401, {
      message: '请先登录'
    })
  }
})
//获取公钥
app.use('/keys', pubKeyRoute)
// 上传文件
app.use('/upload', uploadRoute)

// 搜索文章
app.use('/articles/search', searchRoute)

// 点赞文章
app.use('/articles/likes', artLikesRoute)

//获取|修改个人信息
app.use('/user', userRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const ERROR_CODE_MAP = {
  'LIMIT_FILE_SIZE': `文件大小不得超过 ${maxFileSize} bytes`
}

const ERROR_STATUS_MAP = {
  '401': "无权限操作,请先登录"
}

const QUE_MAP = {
  "username": "用户名",
  "password": "密码",
  "email": "邮箱",
  "nikname": "昵称",
  "avatar": "头像",
  "name": "分类名称"
}
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err.message.indexOf('duplicate key error') !== -1) {
    let repeatKey = Object.entries(err.keyValue)?.map(([key, vaule]) => {
      return `${QUE_MAP?.[key]}不能重复`
    })[0]
    err.status = 422
    err.message = repeatKey
  }

  if (err.errors) {
    let paramErrors = Object.entries(err.errors).map(([key, value]) => {
      return `${value.message}`
    }).join(',')
    err.status = 422
    err.message = paramErrors
  }

  if (err.code in ERROR_CODE_MAP) {
    err.status = 422
    err.message = ERROR_CODE_MAP[err.code]
  }

  if (err.status in ERROR_STATUS_MAP) {
    err.message = ERROR_STATUS_MAP[err.status]
  }

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  })
});

module.exports = app;
