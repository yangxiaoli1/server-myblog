export default {
  'register': {
    method: 'POST',
    url: '/admin/register',
    withToken: false,
    rsaKey: 'password',
    setToken: true
  },
  'login': {
    method: 'POST',
    url: '/admin/login',
    withToken: false,
    rsaKey: 'password',
    setToken: true
  },
  'index': {
    method: 'GET',
    url: '/index',
    noMessage: true
  },
  'pubKey': {
    method: 'GET',
    url: '/keys'
  },
  'articles': {
    method: 'GET',
    url: '/api/reset/articles',
  },
  'postArticle': {
    method: 'POST',
    url: '/api/reset/articles'
  },
  'getArticleById': {
    method: 'GET',
    url: '/api/reset/articles/:id',
    rest: true
  },
  'columns': {
    method: 'GET',
    url: '/api/reset/columns'
  },
  'postColumn': {
    url: '/api/reset/columns',
    method: 'POST'
  },
  'postComment': {
    url: '/api/reset/comments',
    method: 'POST'
  },
  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'
  },
  'uploadUserAvatar': {
    url: '/upload/user',
    method: 'POST'
  },
  'getUserInfo': {
    url: '/user',
    method: 'GET'
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT'
  },
  'articleLikes': {
    url: '/articles/likes/:id',
    method: 'POST',
    rest: true
  },
}