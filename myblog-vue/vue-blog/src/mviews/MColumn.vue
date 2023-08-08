<template>
  <div>
    <van-sticky :offset-top="45">
      <van-tabs v-model="columnId">
        <van-tab
          v-for="item in columns"
          :key="item.id"
          :title="item.name"
          :name="item.id"
        ></van-tab>
      </van-tabs>
    </van-sticky>
    <MArticleList v-if="columnId" :columnId="columnId" />
  </div>
</template>

<script>
import MArticleList from "./MArticleList";
export default {
  name: "MColumn",
  components: { MArticleList },
  data() {
    return {
      columnId: "",
      columns: [],
    };
  },
  created() {
    this.getColumns();
  },
  mounted() {},

  methods: {
    async getColumns() {
      try {
        let columns = await this.$api({ type: "columns" });
        this.columns = columns.list;
        this.columnId = this.columns[0].id;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>