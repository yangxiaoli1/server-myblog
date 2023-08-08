import store from 'store'
// import Message from './message'
import base from '@/config/base.config'
import service from './common'
import API_LIST from '@/config/api.config'
import encrypt from '@/util/encrypt'
const { TOKEN_NAME } = base


export default async function Http({ type, data }) {
  if (!(type in API_LIST)) {
    throw new Error('API请求错误')
  }
  let { url, method, noMessage = false,
    rsaKey = false, rest = false, setToken = false } = API_LIST[type]
  try {
    method = method.toLowerCase()
    if (rest) {
      let restSymbol = url.match(/:(.*)$/)[1]
      url = url.replace(/:(.*)$/, data[restSymbol])
    }

    if (rsaKey && data[rsaKey]) {
      data[rsaKey] = await encrypt(data[rsaKey])
    }
    // { params: data }相当于URL里的querystring
    data = method === 'get' ? { params: data } : data
    let result = await service[method](url, data)
    if (setToken) {
      let token = result.token
      let uid = result.userId
      store.set('uid', uid)
      store.set(TOKEN_NAME, token)
      this.$store.dispatch('login')
    }
    console.log(this, 'http')
    return result
  } catch (error) {
    if (error.response) {
      let message = error.response.data.message
      if (!noMessage) {
        //http函数作为插件挂载到了 Vue的prototype上 this指向vue实例
        this.$notify.error({
          title: '错误',
          message
        });
      }
    }
    return Promise.reject(error)
  }
}
