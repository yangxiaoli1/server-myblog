<template>
  <div v-if="article.id">
    <ArticleContent :article="article" />
    <CommentTextArea :aid="article.id" />
    <CommentList :comments="article.comments" />
  </div>
</template>

<script>
import ArticleContent from "@/components/article/ArticleContent";
import CommentTextArea from "@/components/comment/CommentTextArea";
import CommentList from "@/components/comment/CommentList";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("likes");

export default {
  name: "Article",
  components: {
    ArticleContent,
    CommentTextArea,
    CommentList,
  },
  provide() {
    return {
      getArticleById: this.getArticleById,
    };
  },
  data() {
    return {
      id: "",
      article: {},
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getArticleById();
  },
  mounted() {},

  methods: {
    ...mapActions(["pushLike", "sendLikes"]),

    async getArticleById() {
      try {
        this.article = await this.$api({
          type: "getArticleById",
          data: { id: this.id },
        });
        let likeUsers = this.article?.like_users || [];

        let uid = this.$store.getters.userInfo?._id;
        console.log(uid, "uid");
        let aid = this.article?.id;
        if (likeUsers.includes(uid)) {
          this.pushLike({ aid });
        }
      } catch (err) {
        this.$notify.error({
          title: "获取失败",
          message: err.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>