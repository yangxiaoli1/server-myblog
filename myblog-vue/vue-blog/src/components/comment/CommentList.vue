<template>
  <el-card v-if="commentLength">
    <div class="blog-comment blog-comment--list">
      <h3>评论列表</h3>
      <ul>
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :uid="comment.uid"
          :content="comment.content"
          :date="comment.date"
        />
      </ul>
    </div>
  </el-card>
</template>

<script>
import CommentItem from "@/components/comment/CommentItem";
export default {
  name: "CommentList",
  components: { CommentItem },
  props: {
    comments: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    commentLength() {
      return this.comments?.length || 0;
    },
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
@import '~assets/css/base.styl';

.blog-comment {
  font-size: 16px;
  background-color: line-modifier-color;
  border-radius: radius-theme-size;
  margin-top: padding-space * 2;

  & h3 {
    padding: padding-space;
  }
}

.blog-comment--list {
  padding: 20px 0;
  background-color: bg-theme-color;
}
</style>