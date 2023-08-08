<template>
  <div class="blog-chat">
    <div class="blog-chat--content">
      <div
        class="blog-chat--item"
        :class="chat.dis"
        v-for="chat in chatList"
        :key="chat.id"
      >
        <span v-if="chat.nikname" class="blog-chat--nikname">{{
          chat.nikname
        }}</span>
        <div :class="[chat.type === 'action' && 'notify', 'blog-chat--box']">
          <span v-if="chat.time" class="blog-chat--time">{{ chat.time }}</span>
          <p v-if="chat.msg" class="blog-chat--msg">{{ chat.msg }}</p>
        </div>
      </div>
    </div>

    <div class="blog-chat--bottom">
      <el-input v-model="sendMsg" placeholder="请输入内容"></el-input>
      <el-button type="primary" @click="sendChat">发送消息</el-button>
    </div>

    <el-dialog title="欢迎聊天" :visible="dialogVisible" width="30%">
      输入昵称:
      <el-input v-model="nikname"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enterChat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let idx = 0;
import { io } from "socket.io-client";
import formatDate from "@/util/formatDate";

export default {
  name: "Socket",

  data() {
    return {
      ws: null,
      chatList: [],
      sendMsg: "",
      uid: "",
      nikname: "",
      dialogVisible: true,
    };
  },
  created() {
    this.$store.commit("RIGHT_LIVE2D_DIS");

    if (this.$ws) {
      this.ws = this.$ws;
      this.getUserInfo();
      this.ws.emit("enterChat", { uid: this.uid, nikname: this.nikname });
      this.dialogVisible = false;
    } else {
      this.ws = io(process.env.VUE_APP_USER_CHAT_PATH, {
        transports: ["websocket"],
      });
    }

    this.ws.on("connect", () => {
      console.log("建立连接");
    });

    this.ws.on("chat", (data) => {
      this.serverChat(data);
    });

    this.ws.on("logged", (nikname) => {
      this.serverLog({ nikname, isLogin: true });
    });
    this.ws.on("logout", (nikname) => {
      this.serverLog({ nikname, isLogin: false });
    });
  },
  beforeDestroy() {
    this.$store.commit("LEFT_LIVE2D_DIS");
    //关闭socket
    this.ws.emit("leaveChat");
  },
  mounted() {},

  methods: {
    getUserInfo() {
      let { _id, nikname } = this.$store.getters.userInfo;
      this.uid = _id;
      this.nikname = nikname;
    },
    enterChat() {
      this.ws.emit("enterChat", { nikname: this.nikname });
      this.dialogVisible = false;
    },
    login() {
      this.ws.emit("login", this.nikname);
      this.dialogVisible = false;
    },
    addChat({
      type = "msg",
      msg = "",
      nikname = "",
      time = formatDate(),
      isMe = false,
    }) {
      let dis = "left";
      if (type === "action") {
        dis = "center";
      }
      if (isMe) {
        dis = "right";
      }
      this.chatList.push({ type, msg, nikname, time, isMe, dis, id: ++idx });
    },

    sendChat() {
      let msg = this.sendMsg;
      this.addChat({
        msg,
        nikname: this.nikname,
        isMe: true,
      });
      this.ws.emit("send", msg);
      this.sendMsg = "";
    },

    serverChat({ msg = "", nikname = "陌生人", time = "" }) {
      this.addChat({
        msg,
        nikname,
        time,
      });
    },

    serverLog({ nikname, isLogin }) {
      let state = isLogin ? "进入" : "离开";
      let msg = `${nikname}${state}了聊天室`;
      this.addChat({
        type: "action",
        msg,
      });
    },
  },
};
</script>

<style lang="stylus" >
.blog-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8) inset;
  height: 70vh;
}

.blog-chat--content {
  overflow: hidden;
  overflow-y: auto;
}

.blog-chat--item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 0 5px;
}

.blog-chat--item.left {
  justify-content: flex-start;
}

.blog-chat--item.right {
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.blog-chat--item.right .blog-chat--box {
  background-color: skyblue;
}

.blog-chat--item.left .blog-chat--box {
  background-color: #ddd;
}

.blog-chat--box {
  display: flex;
  flex-direction: column;
  margin: 25px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
}

.blog-chat--nikname {
  flex: 0 0 auto;
}

.blog-chat--time {
  font-size: 12px;
}

.blog-chat--msg {
  padding: 6px 0 0;
  line-height: 1.5;
  font-size: 14px;
}

.blog-chat--box.notify {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  line-height: 20px;
}

.blog-chat--bottom {
  display: flex;
  background-color: #fff;
  padding: 20px;
}
</style>