<template>
  <div class="blogm-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        @load="onLoad"
      >
        <router-link
          v-for="item in articleList"
          :key="item.id"
          :to="{ name: 'mArticle', params: { id: item.id } }"
        >
          <ArticleItem :article="item" />
        </router-link>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from "@/components/m/ArticleItem";
import QS from "qs";
export default {
  name: "MArticleList",
  components: { ArticleItem },
  props: {
    columnId: {
      type: String,
    },
  },
  data() {
    return {
      articleList: [],
      columnArticleCache: {},
      page: 1,
      size: 4,
      loading: false,
      finished: false,
      refreshing: false,
      q: "",
    };
  },

  mounted() {
    this.$EventBus.$off("search-article", this.searchArticle);
    this.$EventBus.$on("search-article", this.searchArticle);
  },
  created() {},
  watch: {
    columnId(newcolumnId) {
      if (newcolumnId.trim().length === 0) {
        return false;
      }
      //如果columnId对应文章列表 存在缓存 articleList = 缓存数据
      if (this.columnArticleCache[newcolumnId]) {
        this.articleList = this.columnArticleCache[newcolumnId];
        return false;
      }
      this.refreshing = true;
      this.onRefresh();
    },
  },
  methods: {
    cacheColumnList() {
      if (this.columnId) {
        this.columnArticleCache[this.columnId] = JSON.parse(
          JSON.stringify(this.articleList)
        );
      }
    },
    getQuery() {
      let column = this.columnId;
      let q = this.q || undefined;
      // 只有当q=undefined时 JSON.stringify才将q从query里清除
      let query = JSON.parse(JSON.stringify({ column, q }));
      return query;
    },
    searchArticle(q) {
      this.q = q;
      this.refreshing = true;
      this.onRefresh();
    },
    onRefresh() {
      this.page = 1;
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      this.getArticles();
    },
    getArticles() {
      let data = { size: this.size, page: this.page };
      let query = this.getQuery();
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query);
      }
      this.$api({ type: "articles", data })
        .then((result) => {
          if (this.refreshing) {
            this.articleList = [];
            this.refreshing = false;
          }
          if (this.articleList.length >= result.total) {
            this.finished = true;
            return;
          }

          this.articleList.push(...result.list);
          this.cacheColumnList();
          this.loading = false;
          this.page++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>