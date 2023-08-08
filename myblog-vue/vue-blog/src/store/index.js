import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store'
import base from '@/config/base.config'
import http from '@/api/http'

import modal from './modules/modal'
import likes from './modules/likes'
const { TOKEN_NAME } = base
Vue.use(Vuex)

import { io } from "socket.io-client";
import router from '@/router'
import _isMobile from "@/util/isMobile";

let actMe = false
export default new Vuex.Store({
  state: {
    token: store.get(TOKEN_NAME) || '',
    userInfo: {},
    live2dDis: false
  },
  getters: {
    userInfo(state) {
      if (state.token) {
        return state.userInfo
      }
    }
  },
  mutations: {
    RIGHT_LIVE2D_DIS(state) {
      state.live2dDis = true
    },
    LEFT_LIVE2D_DIS(state) {
      state.live2dDis = false
    },
    SET_TOKEN(state) {
      state.token = store.get(TOKEN_NAME)
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    CANCEL_TOKEN(state) {
      state.token = ''
      store.remove(TOKEN_NAME)
    }
  },
  actions: {
    async logout({ commit }) {
      actMe = true
      Vue.prototype.$ws?.close()
      commit('CANCEL_TOKEN')
    },
    async login({ commit, dispatch }) {
      commit('SET_TOKEN')
      dispatch('getUserInfo')
    },
    async online({ commit, getters }) {
      Vue.prototype.$ws = io(process.env.VUE_APP_USER_CHAT_PATH, { transports: ['websocket'] })
      let { _id, nikname } = getters.userInfo
      Vue.prototype.$ws.emit('online', { uid: _id, nikname })

      Vue.prototype.$ws.on('disconnect', () => {
        Vue.prototype.$ws = null
        let msg = `再见${nikname}`
        if (!actMe) {
          msg = '账号在其他设备登录'
        }
        Vue.prototype.$notify.success({
          title: '退出登录',
          message: msg
        })
        actMe = false
        if (router.app._route.name !== "index") {
          router.push('/index')
        }
        commit('CANCEL_TOKEN')
      })

    },
    async getUserInfo({ commit, dispatch }) {
      try {
        let userInfo = await http({ type: 'getUserInfo' })
        commit('SET_USERINFO', userInfo)
        console.log(this, 'store')
        if (!_isMobile()) {
          Vue.prototype.$notify({
            title: '登录成功',
            message: `欢迎你 ${userInfo.nikname}`,
            type: 'success'
          });
          console.log(router, 'router')
          if (router.app._route.name !== "index") {
            router.push('/index')
          }
          dispatch('online')
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  modules: {
    modal, likes
  }
})
