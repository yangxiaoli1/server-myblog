<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isShow"
      width="60%"
      :before-close="close"
    >
      <BaseForm v-if="formType" :type="type" ref="form" />
      <div slot="footer" class="dialog-footer">
        <el-button
          v-for="btn in btns"
          :key="btn.targetName"
          @click="handlerBtn(btn.targetName, btn.isSubmit)"
          >{{ btn.name }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MODAL_DATA from "@/config/modal.config";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("modal");
import BaseForm from "./BaseForm.vue";

export default {
  name: "BaseModal",
  components: {
    BaseForm,
  },
  data() {
    return {};
  },

  computed: {
    ...mapState(["isShow", "type"]),
    formType() {
      return MODAL_DATA[this.type]?.formType;
    },
    needUpdate() {
      return MODAL_DATA[this.type]?.needUpdate;
    },
    title() {
      return MODAL_DATA[this.type]?.title ?? "默认modal";
    },
    btns() {
      return (
        MODAL_DATA[this.type]?.btns ?? [
          {
            targetName: "close",
            name: "关闭",
          },
          {
            targetName: "confirm",
            name: "提交",
            isSubmit: true,
          },
        ]
      );
    },
  },
  methods: {
    ...mapActions(["close", "open", "confirm"]),
    handlerBtn(action, isSubmit) {
      if (isSubmit) {
        this.submitForm();
        return;
      }
      this[action] && this[action]();
    },
    submitForm() {
      if (!this.formType) {
        return false;
      }
      // 使用了validate Form-Item Attributes 必填prop属性 其值是 Form Attributes model对象中的字段
      console.log(this.$refs["form"], this); //BaseForm组件
      let refForm = this.$refs["form"];
      refForm.$refs["elForm"].validate(async (valid) => {
        if (valid) {
          try {
            await this.$api({ type: this.formType, data: refForm.form });
            refForm.$refs["elForm"].resetFields();
            this.close();
            if (this.needUpdate) {
              this.$EventBus.$emit("updateView");
            }
          } catch (err) {
            refForm.$refs["elForm"].resetFields();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>