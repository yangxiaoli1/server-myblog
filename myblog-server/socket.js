let app = require('./app')
let http = require('http')
let webSocketServer = http.Server(app)
let socketIo = require('socket.io')
// transports:['websocket']建立持续连接
let io = socketIo(webSocketServer, { transports: ['websocket'] })
let { formatDate } = require('./core/util/util')

const users = {}

io.on('connection', (socket) => {
  console.log('连接已经建立', `id:${socket.id}`)

  socket.on('online', ({ uid, nikname }) => {
    //如果uid存在 说明已登录
    if (users[uid]) {
      users[uid].socket.disconnect()
    }
    users[uid] = {
      uid,
      nikname,
      socket: socket,
    }
    socket.uid = uid
    socket.ghost = false //不是游客
  })
  // 进入聊天室
  socket.on('enterChat', ({ uid = tempId(), nikname }) => {
    //广播给所有的客户端 登陆者昵称
    io.sockets.emit('logged', nikname)
    //如果是已登录用户
    if (users[uid]) {
      return
    }
    users[uid] = {
      uid,
      nikname,
      socket: socket,
    }
    socket.uid = uid
    socket.ghost = true
  })
  // 离开聊天室
  socket.on('leaveChat', () => {
    let uid = socket.uid
    // 如果是游客离开
    if (socket.ghost) {
      users[uid].socket.disconnect()
      delete users[uid]
    }
    io.sockets.emit('logout', users[uid]?.nikname)
  })
  //如果客户端断开连接
  socket.on('disconnect', () => {
    let uid = socket.uid
    delete users[uid]
  })

  socket.on('send', (msg) => {
    let sendTime = formatDate()
    let uid = socket.uid
    let nikname = users[uid]['nikname']
    // 广播给除了发送方的其他客户端
    socket.broadcast.emit('chat', {
      nikname,
      msg: msg,
      time: sendTime
    })
  })
})

function tempId() {
  //[0,1)的随机数转换成36进制的字符串，截取后6位
  return Date.now() + Math.random().toString(36).slice(-6)
}

webSocketServer.listen(8000, () => {
  console.log('websocket聊天室开启 端口8000')
})

module.exports = webSocketServer