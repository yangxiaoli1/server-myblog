const { generateKeys, encrypt, decrypt } = require('./util/util')
const fs = require('fs').promises
const fsSync = require('fs')
const { priKeyPath, pubKeyPath } = require('../config')


module.exports = {
  getPublicKeySync() {
    return fsSync.readFileSync(pubKeyPath, 'utf8')
  },
  async getPublicKey() {
    let pubKey
    try {
      pubKey = await fs.readFile(pubKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      pubKey = await fs.readFile(pubKeyPath, 'utf8')
    }
    return pubKey
  },
  async getPrivateKey() {
    let priKey
    try {
      priKey = await fs.readFile(priKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      priKey = await fs.readFile(priKeyPath, 'utf8')
    }
    return priKey
  }
}