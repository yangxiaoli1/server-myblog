<template>
  <div class="blogm-header">
    <component
      :is="headType"
      :title="title"
      :button="button"
      :handle="handleBtn"
    ></component>
  </div>
</template>

<script>
import BaseNavBar from "@/components/m/BaseNavBar";
import BaseSearchBar from "@/components/m/BaseSearchBar";

export default {
  name: "Header",
  components: { BaseNavBar, BaseSearchBar },
  data() {
    return {
      headType: "BaseSearchBar",
      title: "默认标题",
      button: "",
      handleBtn: "",
    };
  },
  watch: {
    $route(to) {
      Object.assign(this, to.meta);
    },
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>