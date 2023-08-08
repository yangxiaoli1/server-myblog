import base from '@/config/base.config'
import store from 'store'
import Vue from 'vue'

const { LIKES_NAME } = base

export default {
  namespaced: true,
  state: {
    //当前用户点赞文章列表
    likes: store.get(LIKES_NAME) || []
  },
  getters: {
    // 文章是否存在于当前用户点赞列表
    isLike: state => (aid) => {
      return !!(state.likes.includes(aid))
    }
  },
  mutations: {
    CHANGE_LIKES(state) {
      state.likes = store.get(LIKES_NAME)
    }
  },
  actions: {
    pushLike({ commit }, payload) {
      let { aid } = payload
      if (aid) {
        let localLikes = store.get(LIKES_NAME) || []
        let idx = localLikes.indexOf(aid)
        if (idx === -1) {
          localLikes.push(aid)
        }
        store.set(LIKES_NAME, localLikes)
        commit('CHANGE_LIKES')
      }
    },
    pullLike({ commit }, payload) {
      let { aid } = payload
      if (aid) {
        let localLikes = store.get(LIKES_NAME) || []
        let idx = localLikes.indexOf(aid)
        if (idx !== -1) {
          localLikes.splice(idx, 1)
        }
        store.set(LIKES_NAME, localLikes)
        commit('CHANGE_LIKES')
      }
    },
    async sendLikes({ state }, { aid }) {
      console.log(state)
      Vue.prototype.$api({ type: 'articleLikes', data: { id: aid } })
    }
  },
  modules: {
  }
}


