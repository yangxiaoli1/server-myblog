<template>
  <el-card class="blog-editor">
    <h3 class="blog-editor-title">标题</h3>
    <el-input
      ref="title"
      v-model="title"
      class="blog-editor-input"
      size="medium"
      placeholder="文章标题"
    ></el-input>
    <h3 class="blog-editor-title">内容</h3>
    <div id="blog-editor-textarea"></div>
    <div class="blog-editor-tags">
      <h3 class="blog-editor-title">分类选择</h3>
      <el-radio-group v-model="column">
        <el-radio-button
          v-for="item in columns"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <div class="blog-editor-button">
      <el-button type="info" @click="submitEditor">提交</el-button>
      <el-button type="info" @click="cancelEditor">重置</el-button>
    </div>
  </el-card>
</template>

<script>
import wangEditor from "wangeditor";
export default {
  name: "Editor",
  // 通过/editor路由的props属性传递而来
  props: {
    columnId: {
      type: String,
    },
  },
  data() {
    return {
      editor: null,
      title: "",
      content: "",
      column: "",
      columns: [],
    };
  },

  mounted() {
    const editor = new wangEditor(`#blog-editor-textarea`);
    editor.config.onchange = (newHtml) => {
      this.content = newHtml;
    };
    editor.config.uploadImgServer = process.env.VUE_APP_FILE_UPLOAD_PATH;
    editor.config.uploadImgMaxSize = 5 * 1024 * 1024; // 5M
    editor.config.uploadImgAccept = ["jpg", "jpeg", "png", "gif", "bmp"];
    editor.config.uploadImgMaxLength = 5;
    editor.config.uploadFileName = "file";
    editor.config.uploadImgHeaders = {
      Authorization: `Bearer ${this.$store.state.token}`,
    };
    editor.create();
    this.editor = editor;
  },
  created() {
    this.getColumns();
  },
  methods: {
    async getColumns() {
      try {
        let columns = await this.$api({ type: "columns" });
        this.columns = columns.list?.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
        //如果props传递columnId 就选中
        let columnId = this.columnId;
        if (columnId) {
          this.column = columnId;
          return;
        }
        //如果没有props 传递columnId 就选中第一项
        this.column = this.columns[0].id;
      } catch (err) {
        console.log(err);
      }
    },
    submitEditor() {
      if (!this.validateEditor()) {
        return;
      }
      this.postEditorData();
    },
    cancelEditor() {
      this.editor.txt.clear();
    },
    validateEditor() {
      if (this.title.trim().length === 0) {
        this.$notify.warning({
          title: "警告",
          message: "标题不能为空",
        });
        this.$refs["title"].focus();
        return false;
      }
      if (this.content.trim().length === 0) {
        this.$notify.warning({
          title: "警告",
          message: "内容不能为空",
        });
        return false;
      }
      return true;
    },
    async postEditorData() {
      let postData = {
        title: this.title,
        content: this.content,
        column: this.column,
        cover: this.content.match(/<img src="([^"']*)"/)?.[1] || undefined,
      };
      try {
        await this.$api({
          type: "postArticle",
          // JSON.stringify(postData)可以把postData里的不存在项清除
          data: JSON.parse(JSON.stringify(postData)),
        });
        this.$notify.success({
          title: "成功",
          message: "提交成功",
        });
        this.$router.push("/");
      } catch (err) {
        this.$notify.error({
          title: "错误",
          message: "提交失败",
        });
      }
    },
  },
};
</script>

<style lang="stylus">
.blog-editor-title {
  padding: 12px 0;
  font-size: 16px;
}

.el-input--medium.blog-editor-input {
  font-size: 18px;
  line-height: 38px;
  height: 38px;
}

.blog-editor-tags {
  margin: 20px 0;

  & .el-radio-button .el-radio-button__inner {
    margin-left: 12px;
    border: 1px solid #EBEEF5;
    border-radius: 4px !important;
  }
}

.blog-editor-button {
  padding-top: 20px;
  display: flex;
  justify-content: space-around;

  & button {
    flex: 1;
    line-height: 22px;
    font-size: 18px;
  }
}
</style>