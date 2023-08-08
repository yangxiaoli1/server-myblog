<template>
  <van-search
    v-model="value"
    show-action
    shape="round"
    placeholder="请输入搜索关键词"
    @search="onSearch"
  >
    <template #action>
      <div @click="onSearch">搜索</div>
    </template>
  </van-search>
</template>

<script>
export default {
  name: "BaseSearchBar",

  data() {
    return {
      value: "",
    };
  },

  mounted() {},

  methods: {
    onSearch() {
      this.$EventBus.$emit("search-article", this.value);
      this.value = "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>