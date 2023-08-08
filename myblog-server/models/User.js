const mongoose = require('mongoose')
const { encrypt, decrypt } = require('../core/util/util')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,8}$/.test(val)
      },
      message: '用户名必须为 数字+字母 6-8位'
    },
    unique: true
  },
  password: {
    type: String,
    //默认设置 查询 user的document文档的时候 不返回 password字段
    select: false,
    required: true,
    set(val) {
      let isValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(decrypt(val))
      if (isValidate) {
        return encrypt(val)
      }
      return '密码格式不正确'
    },
    validate: {
      validator(val) {
        // return false 验证不通过 才返回message
        return val !== '密码格式不正确'
      },
      message: "密码必须为 数字+字母(大小写) 8-12位"
    }
  },
  email: {
    type: String,
    required: [true, '邮箱必填'],
    unique: true,
    validate: {
      validator(val) {
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
      },
      message: '请输入合法邮箱地址'
    },
  },
  avatar: {
    type: String, //URL
    default: 'http://127.0.0.1:3000/images/avatar.jpg'
  },
  nikname: {
    type: String,
    validate: {
      validator: function (val) {
        return /^[0-9a-zA-Z\u0391-\uFFE5]{1,8}$/.test(val)
      },
      message: "昵称可包含 数字/英文/汉字 1-8位"
    },
    default: '用户' + ~~(Math.random() * 99999)
  },
  signature: {
    type: String,
    default: '😮这是一个神秘人 什么也没留下'
  }
})

module.exports = mongoose.model('User', schema)

/* 

users 644792c10c67e6d12a76e610
"username":"123eee",
"password":"123eeeAA",
"email":"113@163.com" 
"token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyM2VlZSIsIl9pZCI6IjY0NDc5MmMxMGM2N2U2ZDEyYTc2ZTYxMCIsImV4cCI6MTY4MjgyOTExMCwiaWF0IjoxNjgyNTY5OTEwfQ.grZLb_4hoZlB9OlOBSMx32FvsEQxiD-XkggBeYF8j5QE6cVJ5tcDzdpH9wgSzSVuuN0qPMK1lueJZXkzm88YbQ"
*/