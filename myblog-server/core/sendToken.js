const { getPrivateKey } = require('../core/rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT 安装用此版本"^8.5.1"

module.exports = {
  async sendToken(result) {
    let { username, _id } = result
    let privateKey = await getPrivateKey()
    let token = jwt.sign({ username, _id, exp: ~~((Date.now() / 1000) + 24 * 3600 * 3) }, privateKey, { algorithm: 'RS256' });
    return token
  }
}