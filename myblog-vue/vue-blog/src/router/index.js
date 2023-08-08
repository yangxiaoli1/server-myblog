import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
//PC views
// import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
// import ArticleList from '../views/ArticleList.vue'
// import Column from '../views/Column.vue'
// import Editor from '../views/Editor.vue'
import User from '../views/User.vue'
import Socket from '../views/Socket.vue'

// 路由懒加载
const Home = () => import(/* webpackChunkName: "home_articleList" */ '../views/Home.vue')
const ArticleList = () => import(/* webpackChunkName: "home_articleList" */ '../views/ArticleList.vue')
const Column = () => import(/* webpackChunkName: "column" */ '../views/Column.vue')
const Editor = () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue')

//mobile views
import MHome from '../mviews/MHome.vue'
import MArticleList from '../mviews/MArticleList.vue'
import MArticle from '../mviews/MArticle.vue'
import MColumn from '../mviews/MColumn.vue'
import MUser from '../mviews/MUser.vue'

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function (local) {
  console.log(this, 'replace')//this指向VueRouter
  return originalReplace.call(this, local).catch(err => err)
}

VueRouter.prototype.push = function (local) {
  return originalPush.call(this, local).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/m',
    name: 'mHome',
    redirect: '/m/articles',
    component: MHome,
    children: [
      {
        path: 'articles',
        name: 'mArticleList',
        component: MArticleList,
        meta: {
          headType: "BaseSearchBar",
        },
      },
      {
        path: 'article/:id',
        name: 'mArticle',
        component: MArticle,
        meta: {
          headType: "BaseNavBar",
          title: '文章',
          button: '评论',
          handleBtn: 'show-comment-action'
        },
      },
      {
        path: 'column',
        name: 'mColumn',
        component: MColumn,
        meta: {
          headType: "BaseNavBar",
          title: '分类',
          button: '',
        },
      },
      {
        path: 'user',
        name: 'mUser',
        component: MUser,
        meta: {
          headType: "BaseNavBar",
          title: '我的',
          button: '',
        },
        props: (route) => ({
          state: route.query.state
        })
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/index',
    component: Home,
    children: [
      {
        path: '/index',
        name: 'index',
        component: ArticleList,
        props: (route) => ({
          columnId: route.query.columnId
        })
      },
      {
        path: '/column',
        name: 'column',
        component: Column,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/article/:id',
        name: 'article',
        component: Article
      },
      {
        path: '/editor',
        name: 'editor',
        component: Editor,
        props: (route) => ({
          columnId: route.query.columnId
        })
      },
      {
        path: '/user',
        name: 'user',
        component: User
      },
      {
        path: '/socket',
        name: 'socket',
        component: Socket
      },
    ]
  }
]

const router = new VueRouter({
  routes
})
//全局前置守卫
router.beforeEach((to, from, next) => {
  //滚动条开始
  NProgress.start()
  // console.log(to)
  console.log(this, 'router')
  let useAuth = to.meta.requiresAuth
  if (useAuth && !store.state.token) {
    Vue.prototype.$notify({
      title: '警告',
      message: '请先登录',
      type: 'warning'
    });
    NProgress.done()
    next('/index')
  }
  next()
})
//全局后置守卫
router.afterEach(() => {
  //滚动条结束
  NProgress.done()
})
export default router