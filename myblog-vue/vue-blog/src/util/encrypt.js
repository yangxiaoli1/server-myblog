import JSEncrypt from 'jsencrypt'
import store from 'store'
import base from '@/config/base.config'
import service from '@/api/common'

const { PUBKEY_NAME } = base

//参数是  明文 输出密文
export default async function encrypt(value) {
  let key = store.get(PUBKEY_NAME)
  try {
    if (!key || key === 'undefined') {
      let result = await service.get('/keys')
      key = result.pubKey
      key = key.replace(/\.+/g, '')
      key = key.replace(/[\n\r]/g, '')
      store.set(PUBKEY_NAME, key)
    }
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    return encrypt.encrypt(value)
  } catch (err) {
    console.log(err)
  }
}