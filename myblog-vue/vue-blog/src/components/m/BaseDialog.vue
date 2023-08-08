<template>
  <van-dialog
    v-model="show"
    :title="title"
    show-cancel-button
    :beforeClose="beforeClose"
  >
    <BaseForm
      v-if="show"
      :type="type"
      ref="formWrap"
      class="blogm-dialog--form"
    />
    <p v-if="isLogin" class="blogm-dialog--route">
      <van-tag plain round type="primary" @click="goRegister">注册</van-tag>
    </p>
  </van-dialog>
</template>

<script>
import MODAL_DATA from "@/config/modal.config";
import BaseForm from "./BaseForm.vue";

export default {
  name: "BaseDialog",
  components: {
    BaseForm,
  },
  data() {
    return {
      show: false,
      type: "login",
    };
  },
  computed: {
    formType() {
      return MODAL_DATA[this.type]?.formType;
    },
    title() {
      return MODAL_DATA[this.type]?.title ?? "弹窗";
    },
    isLogin() {
      return this.type === "login";
    },
  },
  mounted() {
    this.$EventBus.$on("dialog-show", this.showDialog);
  },
  beforeDestroy() {
    this.$EventBus.$off("dialog-show", this.showDialog);
  },
  methods: {
    goRegister() {
      this.show = false;
      this.$router.push({
        name: "mUser",
        query: {
          state: "register",
        },
      });
    },
    showDialog(type) {
      this.type = type;
      this.show = true;
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        let formWrap = this.$refs.formWrap;
        let form = formWrap.$refs.form;
        form
          .validate()
          .then(async () => {
            try {
              await this.$api({ type: this.formType, data: formWrap.form });
              done();
              this.$EventBus.$emit("show-comment-action");
            } catch (err) {
              form.resetValidation();
            }
          })
          .catch(() => {
            done(false);
          });
      } else {
        done();
      }
    },
  },
};
</script>

<style lang="stylus" >
.blogm-dialog--form {
  padding: 20px 10px;
}

.blogm-dialog--route {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 2em;
  font-size: 12px;

  &>a {
    color: #1989fa;
  }
}
</style>