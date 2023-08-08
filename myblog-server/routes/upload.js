const express = require('express');
const router = express.Router();
const multer = require('multer')
const assert = require('http-assert')
const { uploadPath, maxFileSize, uploadURL } = require('../config')
const path = require('path')
const fs = require('fs')

const FILE_TYPE = {
  'article': 'article',
  'user': 'user'
}

const storage = multer.diskStorage({
  //存储位置
  destination(req, res, cb) {
    let fileType = FILE_TYPE[req.params['classify'].trim()] ?? "other";
    const filePath = path.join(uploadPath, fileType)
    // 不存在就创建文件夹
    fs.existsSync(filePath) || fs.mkdirSync(filePath);
    cb(null, filePath);
  },
  filename(req, file, cb) {
    const { ext, base, name } = path.parse(file.originalname)
    cb(null, name + '_' + Date.now() + ext);
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize
  }
})

router.post('/:classify', upload.any(), async (req, res, next) => {
  try {
    let fileType = FILE_TYPE[req.params['classify']] ?? ''
    assert(fileType, 400, '文件上传分类不正确')

    // let { uid } = req.body
    // 从鉴权里面去取uid
    let uid = req._id
    if (fileType === 'user') {
      assert(uid, 422, '用户头像必须指定UID')
    }

    let fileURLS = req.files.map(item => {
      let { destination, filename } = item
      return path.join(uploadURL, path.parse(destination).name, filename).replace(/\\/g, '/').replace('http:/', 'http://')
    })
    // let { destination, filename } = req.file
    // let fileURL = path.join(uploadURL, path.parse(destination).name, filename).replace(/\\/g, '/').replace('http:/', 'http://')

    let resultData = {
      message: "上传成功",
      data: {
        // 上传用户头像
        fileURL: fileURLS[0]
      }
    }

    if (fileType === 'article') {
      let data = fileURLS
      resultData = {
        "errno": 0,
        data
      }
    }
    res.send(200, resultData)
  } catch (err) {
    next(err)
  }
})

module.exports = router