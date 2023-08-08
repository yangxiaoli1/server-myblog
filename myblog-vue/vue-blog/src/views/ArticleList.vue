<template>
  <div class="article-wrap">
    <div v-if="hasArticle">
      <el-card
        class="blog-content--item"
        v-for="item in articles"
        :key="item.id"
      >
        <router-link :to="{ name: 'article', params: { id: item.id } }">
          <ArticleItem :article="item"
        /></router-link>
      </el-card>
    </div>
    <article v-else class="blog-content--item blog-content-never">
      <h3 class="blog-item--title">很遗憾 没有找到对应的文章</h3>
      <el-button type="info" @click="routeEditor">去写一篇吧！</el-button>
    </article>
  </div>
</template>

<script>
import ArticleItem from "@/components/article/ArticleItem";
import QS from "qs";
export default {
  name: "ArticleList",
  props: {
    loading: {
      type: Boolean,
    },
    // 通过/index路由的props属性传递而来
    columnId: {
      type: String,
    },
  },
  inject: ["closeLoadClock"],
  components: {
    ArticleItem,
  },
  data() {
    return {
      articles: [],
      size: 4,
      page: 1,
      q: "",
    };
  },
  created() {
    this.getArticles();
  },
  computed: {
    hasArticle() {
      return this.articles.length > 0;
    },
  },
  watch: {
    loading(newVal) {
      if (newVal) {
        this.getArticles();
      }
    },
    $route(to) {
      if (to.name === "index") {
        this.cancelArticles();
        this.getArticles();
      }
    },
  },
  // 获得当前渲染页面的数据
  mounted() {
    this.$EventBus.$on("activeSearch", (q) => {
      this.q = q;
      this.resetArticles();
      this.getArticles();
    });
  },
  methods: {
    resetArticles() {
      (this.page = 1), (this.articles = []);
    },
    routeEditor() {
      let columnId = this.columnId;
      this.$router.push({ name: "editor", query: { columnId } });
    },
    getQuery() {
      let column = this.columnId;
      let q = this.q || undefined;
      // 只有当q=undefined时 JSON.stringify才将q从query里清除
      let query = JSON.parse(JSON.stringify({ column, q }));
      return query;
    },
    cancelArticles() {
      (this.page = 1), (this.articles = []);
    },
    getArticles() {
      let data = { size: this.size, page: this.page };
      let query = this.getQuery();
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query);
      }
      this.$api({
        type: "articles",
        data,
      })
        .then((result) => {
          if (this.articles.length >= result.total) {
            console.log("没有更多了");
            return;
          }
          this.articles.push(...result.list);
          this.closeLoadClock();
          this.page++;
          console.log(this, "articleList");
        })
        .catch((err) => {
          this.$notify.error({
            title: "获取失败",
            message: err.message,
          });
        });
    },
  },
};
</script>

<style lang="stylus"></style>