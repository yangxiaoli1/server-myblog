<template>
  <div class="blog-header--login">
    <el-image class="blog-avatar--img" :src="src" fit="cover"></el-image>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="blog-header--logout"
      width="16px"
      height="15.37px"
      viewBox="0 0 1066 1024"
      version="1.1"
      @click="logout"
    >
      <path
        fill="#fff"
        d="M537.642667 213.333333h-213.333334a85.333333 85.333333 0 0 0-85.333333 85.333334v298.666666a42.666667 42.666667 0 0 1-85.333333 0.341334V298.666667a170.666667 170.666667 0 0 1 170.666666-170.666667h298.666667a42.666667 42.666667 0 1 1 0 85.333333h-85.333333z m0 597.333334h-213.333334a85.333333 85.333333 0 0 1-80.64-57.344 42.709333 42.709333 0 1 0-79.232 31.701333h-0.042666A170.752 170.752 0 0 0 324.266667 896h298.666666a42.666667 42.666667 0 1 0 0-85.333333h-85.333333z m371.498666-268.501334a42.666667 42.666667 0 0 0 0-60.330666l-170.666666-170.666667a42.666667 42.666667 0 1 0-60.330667 60.330667L775.978667 469.333333H366.976a42.666667 42.666667 0 1 0 0 85.333334h409.002667l-97.834667 97.834666a42.666667 42.666667 0 1 0 60.330667 60.330667l170.666666-170.666667z"
      />
    </svg>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UserImgAvatar",

  data() {
    return {};
  },
  computed: {
    src() {
      return this.userInfo?.avatar;
    },
    ...mapGetters(["userInfo"]),
  },
  mounted() {},

  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="stylus">
.blog-avatar--img {
  overflow: hidden;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.blog-header--logout {
  width: 20px;
  height: 20px;
  padding-left: 10px;
  cursor: pointer;
  transition: 0.2s;
  transform: scale(1);

  &:hover {
    transform: scale(1.5);
  }
}
</style>