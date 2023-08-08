<template>
  <div>
    <el-card>
      <div class="blog-comment blog-comment--editor">
        <textarea
          class="blog-comment--input"
          ref="textarea"
          v-model="commentVal"
          name="comment"
          autofocus
        ></textarea>
        <el-button type="primary" @click="submitComment">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CommentTextArea",
  inject: ["getArticleById"],
  props: {
    aid: {
      type: String,
    },
  },
  data() {
    return {
      commentVal: "",
    };
  },

  mounted() {
    this.$EventBus.$on("focusTextarea", () => {
      this.focusTextarea();
    });
  },

  methods: {
    focusTextarea() {
      this.$refs.textarea.focus();
    },
    async submitComment() {
      // console.log(this.commentVal);
      try {
        await this.$api({
          type: "postComment",
          data: { aid: this.aid, content: this.commentVal },
        });
        this.$notify({
          title: "评论成功",
          type: "success",
        });
        //inject 调用父组件的 getArticleById方法
        this.getArticleById();
      } catch (err) {
        this.$notify.error({
          title: "评论失败",
          message: err.message,
        });
      }
    },
  },
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

.blog-comment--editor {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  height: 240px;

  &>textarea {
    padding: padding-space;
    height: 120px;
    resize: none;
  }
}
</style>