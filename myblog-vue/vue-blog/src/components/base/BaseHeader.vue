<template>
  <el-row
    class="blog-header--wrap"
    type="flex"
    justify="space-between"
    align="center"
  >
    <el-col :span="2" :offset="1" :xs="{ span: 24 }" class="blog-logo--wrap">
      <div class="blog-head--logo">
        <el-image
          :src="require('@/assets/img/logo.jpg')"
          fit="cover"
        ></el-image>
      </div>
    </el-col>
    <el-col :span="10" :offset="2" class="hidden-sm-and-down"
      ><div class="blog-nav">
        <!-- router 实现 index路由跳转 -->
        <el-menu
          class="blog-head--menu"
          mode="horizontal"
          background-color="#2d2f33"
          text-color="#fff"
          active-text-color="#fff"
          default-active="/index"
          router
        >
          <el-menu-item index="/index">首页</el-menu-item>
          <el-menu-item index="/column">分类</el-menu-item>
          <el-menu-item index="/album">相册</el-menu-item>
          <el-menu-item index="/socket">聊天</el-menu-item>
          <el-menu-item index="/user" v-if="userInfo">个人信息</el-menu-item>
        </el-menu>
      </div></el-col
    >
    <el-col :span="4" :offset="1" class="hidden-sm-and-down">
      <el-input
        placeholder="文章搜索"
        class="blog-input--search"
        v-model="searchVal"
        @keydown.native.enter="activeSearch"
      >
        <!-- 给自定义事件添加native 触发原生input标签的对应事件 -->
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          v-if="searchVal"
          @click="activeSearch"
        ></i>
      </el-input>
    </el-col>
    <el-col :span="3" :offset="2" class="hidden-xs-only">
      <component :is="loginCompontent"></component>
    </el-col>
  </el-row>
</template>

<script>
import UserLoginHead from "@/components/user/UserLoginHead";
import UserImgAvatar from "@/components/user/UserImgAvatar";

// import { mapGetters } from "vuex";

export default {
  name: "BaseHeader",
  components: {
    UserLoginHead,
    UserImgAvatar,
  },
  data() {
    return {
      searchVal: "",
    };
  },
  created() {
    let isLogin = this.$store.state.token;
    if (isLogin) {
      this.$store.dispatch("getUserInfo");
    }
  },
  computed: {
    loginCompontent() {
      return this.$store.state.token ? "UserImgAvatar" : "UserLoginHead";
    },
    userInfo() {
      return this.$store.state.userInfo?.nikname;
    },
    // ...mapGetters(["userInfo"]),
  },
  mounted() {},

  methods: {
    activeSearch() {
      this.$EventBus.$emit("activeSearch", this.searchVal);
      this.searchVal = "";
    },
  },
};
</script>

<style lang="stylus">
@import '~assets/css/base.styl';

.blog-header {
  background-color: bg-reverse-color;
}

.blog-header--wrap {
  display: flex;
  align-items: center;
  height: 60px;
}

.blog-head--logo {
  width: 40px;
  height: 40px;
}

.blog-head--logo {
  overflow: hidden;
  border-radius: 50%;
  text-align: center;

  & img {
    display: block;
    width: auto;
    height: 40px;
  }
}

.el-menu.el-menu--horizontal.blog-head--menu {
  height: 60px;
  border-bottom-color: bg-reverse-color;
}

.blog-header--login {
  display: flex;
  align-items: center;
  color: line-reverse-color;
}

.blog-header .blog-input--search {
  max-width: 240px;

  & :focus {
    border-color: transparent;
    box-shadow: 0 0 8px #ccc inset;
  }
}

.el-icon-search {
  cursor: pointer;
}
</style>