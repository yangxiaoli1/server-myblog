<template>
  <div class="blogm-page">
    <Header />
    <div class="blogm-cotent">
      <transition
        enter-active-class="animate__animated animate__fadeInRight"
        appear
        mode="out-in"
      >
        <router-view></router-view>
      </transition>
    </div>
    <FootBar />
    <BaseDialog />
  </div>
</template>

<script>
import Header from "./Header.vue";
import FootBar from "./FootBar.vue";
import BaseDialog from "@/components/m/BaseDialog";

export default {
  name: "MHome",
  components: { FootBar, Header, BaseDialog },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
.blogm-cotent {
  overflow: hidden;
  overflow-y: auto;
  height: calc(100vh - 105px);
  background-color: #f1f1f1;
}

.animate__fadeInRight {
  animation-duration: 0.2s;
}
</style>