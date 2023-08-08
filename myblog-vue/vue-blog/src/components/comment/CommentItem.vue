<template>
  <li class="blog-comment--item">
    <div class="blog-comment--user blog-line blog-line--row">
      <div class="blog-comment--avatar">
        <img :src="uid.avatar" alt="!" />
      </div>
      <span class="blog-comment--name">{{ uid.nikname }}</span>
    </div>
    <p class="blog-comment-content">{{ content }}</p>
    <p class="blog-comment-date">{{ date }}</p>
  </li>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    uid: {
      type: Object,
    },
    content: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
@import '~assets/css/base.styl';

.blog-comment--item {
  margin-bottom: padding-space;
  padding: padding-space * 2;
  background-color: line-modifier-color;
}

.blog-comment--user {
  display: flex;
  align-items: center;
  padding: padding-space 0;
  font-size: 14px;
  line-height: 24px;
}

.blog-comment--avatar {
  overflow: hidden;
  width: 24px;
  height: 24px;
  border-radius: 50%;

  &>img {
    width: 24px;
    height: auto;
  }
}

.blog-comment--name {
  padding-top: 6px;
  padding-left: padding-space;
  color: font-theme-color;
}

.blog-comment-content {
  overflow: hidden;
  padding: 20px 0;
  word-wrap: break-word;
  word-break: break-word;
  color: #666;
}

.blog-comment-date {
  text-align: right;
}
</style>