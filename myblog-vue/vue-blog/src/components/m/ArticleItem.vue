<template>
  <van-card class="blogm-item" :thumb="article.cover">
    <template #title>
      <h3 class="van-ellipsis blogm-item--title">{{ article.title }}</h3>
    </template>
    <template #desc>
      <p class="van-ellipsis blogm-item--content">{{ content }}</p>
    </template>
    <template #price>
      <p class="van-ellipsis">{{ nikname }}</p>
    </template>
    <template #num>
      <p class="blog-item--tags">
        <span class="blog-tags--hit">浏览 ({{ article.hit_num }})</span
        ><span class="blog-tags--like">点赞 ({{ article.like_num }})</span>
        <span class="blog-tags--comment">评论 ({{ article.comment_num }})</span>
      </p>
    </template>
  </van-card>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    nikname() {
      return this.article.author?.nikname || "默认昵称";
    },
    content() {
      let content = this.article.content.replace(
        /(<[a-zA-Z0-9]+.*?>)|(<\/[a-zA-Z0-9]+.*?>)|\//g,
        ""
      );
      return content;
    },
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
.blogm-item {
  margin-top: 2px;

  & p {
    padding: 4px 2px;
  }
}

.blogm-item--title {
  font-size: 18px;
}

.blogm-item--content {
  text-indent: 2em;
}
</style>