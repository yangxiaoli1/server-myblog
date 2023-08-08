<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right; padding: 3px 0" type="text"
          >x</el-button
        >
      </div>
      <BaseForm v-if="isLoad" type="userInfo" ref="form" />
      <div class="blog-btn--wrap">
        <el-button type="success" @click="submit">提交修改</el-button>
        <el-button type="primary" @click="reset">重置信息</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BaseForm from "@/components/base/BaseForm";

export default {
  name: "User",
  components: { BaseForm },
  data() {
    return {
      isLoad: true,
    };
  },
  created() {},
  mounted() {},

  methods: {
    submit() {
      // 使用了validate Form-Item Attributes 必填prop属性 其值是 Form Attributes model对象中的字段
      let refForm = this.$refs["form"];
      refForm.$refs["elForm"].validate(async (valid) => {
        if (valid) {
          try {
            await this.$api({ type: "putUserInfo", data: refForm.form });
            this.$store.dispatch("getUserInfo");
            this.$router.push("/index");
          } catch (err) {
            refForm.$refs["elForm"].resetFields();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      this.isLoad = false;
      this.$nextTick(function () {
        this.isLoad = true;
      });
    },
  },
};
</script>

<style lang="stylus" >
.blog-btn--wrap {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>