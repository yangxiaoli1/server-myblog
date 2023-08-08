<template>
  <div>
    <el-form :model="form" ref="elForm">
      <el-form-item
        v-for="item in formData"
        :key="item['query']"
        :label="item.label"
        label-width="80px"
        :rules="validates[item['query']]"
        :prop="item.query"
      >
        <el-upload
          v-if="item.type === 'avatar'"
          ref="upload"
          class="avatar-uploader"
          :action="userFileAction"
          :show-file-list="false"
          :headers="{ Authorization: `Bearer ${$store.state.token}` }"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
        >
          <el-image
            v-if="form[item['query']]"
            class="avatar"
            style="width: 100px; height: 100px"
            :src="form.avatar"
            fit="cover"
          ></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input
          v-if="['text', 'password'].includes(item.type)"
          v-model="form[item['query']]"
          :type="item.type"
          :name="item['query']"
          autocomplete="off"
          :placeholder="item.placeholder"
          :disabled="item.readonly"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VALIDATE_DATE from "@/config/validate.config";
import FORM_DATA from "@/config/form.config";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
export default {
  name: "BaseForm",
  props: {
    type: {
      type: String,
    },
  },
  data() {
    return {
      form: {},
    };
  },

  mounted() {},
  created() {
    if (this.type === "userInfo") {
      let userInfo = this.$store.getters.userInfo;
      this.form = Object.fromEntries(
        Object.entries(userInfo).filter(([key]) => {
          return FORM_DATA["userInfo"].find((item) => {
            return key === item["query"];
          });
        })
      );
    }
  },
  computed: {
    userFileAction() {
      return process.env.VUE_APP_USER_UPLOAD_PATH;
    },
    formData() {
      return FORM_DATA[this.type];
    },
    validates() {
      return VALIDATE_DATE;
    },
  },
  watch: {
    type() {
      this.initForm();
    },
  },

  methods: {
    beforeAvatarUpload(file) {
      // console.log(file, "jjjjj");
      let { size, type } = file;
      let isPass = /image/.test(type) && size < 5 * 1024 * 1024;
      if (!isPass) {
        let msg = /image/.test(type) ? "文件大小必须小于5M" : "文件类型不正确";
        this.$notify.error({
          title: "上传错误",
          message: msg,
        });
        this.$refs.upload[0].abort(file);
        return false;
      }
      NProgress.start();
    },
    handleAvatarSuccess(res) {
      NProgress.done();
      this.form.avatar = res.data.fileURL;
      // console.log(res, "上传头像");
    },
    handleAvatarError(err) {
      // console.log(err);
      let errMsg = JSON.parse(err.message);
      this.$notify.error({
        title: "上传失败",
        message: errMsg?.message,
      });
    },
    initForm() {
      this.form = {};
      this.resetForm();
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>