<template>
  <van-tabbar v-model="active" route>
    <!-- 跳转路由写成对象，里面用name  如:to='{name:"mArticleList"}'-->
    <van-tabbar-item icon="home-o" :to="{ name: 'mArticleList' }"
      >首页</van-tabbar-item
    >
    <van-tabbar-item icon="search" :to="{ name: 'mColumn' }"
      >分类</van-tabbar-item
    >
    <van-tabbar-item icon="friends-o" :to="{ name: 'mUser' }"
      >我的</van-tabbar-item
    >
  </van-tabbar>
</template>

<script>
export default {
  name: "FootBar",

  data() {
    return {
      active: 0,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>