<template>
  <div class="blog-header--login">
    <span @click="refreshModal('login')">登录</span>
    <i class="blog-header--split">|</i>
    <span @click="refreshModal('register')">注册</span>
  </div>
</template>

<script>
import MIXIN from "@/core/mixin";

export default {
  name: "UserLoginHead",
  //和组件的属性混入在一起，组件如果有同名属性就执行组件的，没有就执行mixin里的
  mixins: [MIXIN],
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
.blog-header--login span {
  cursor: pointer;
}

.blog-header--split {
  font-size: 18px;
  padding: 0 4px;
}
</style>