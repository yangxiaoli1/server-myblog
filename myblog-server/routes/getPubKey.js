const express = require('express');
const router = express.Router();
const { getPublicKey } = require('../core/rsaControl')
const Key = require('../models/Key')

/* GET /keys. */
router.get('/', async function (req, res, next) {
  // let pubKey = await getPublicKey()
  // res.send(200, {
  //   message: 'ok',
  //   data: {
  //     pubKey
  //   }
  // })
  let result = await Key.findOne()
  // console.log(result)
  res.send(200, {
    message: 'ok',
    data: {
      pubKey: result.content
    }
  })
});

module.exports = router;