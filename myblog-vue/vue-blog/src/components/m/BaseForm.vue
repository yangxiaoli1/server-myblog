<template>
  <van-form ref="form">
    <van-field
      v-for="item in formData"
      :key="item['query']"
      v-model="form[item['query']]"
      name="用户名"
      :readonly="item.readonly"
      :type="item['type']"
      :label="item['label']"
      :placeholder="item['placeholder']"
      :rules="validates[item['query']] | formatRuleTrigger"
    />
  </van-form>
</template>

<script>
import VALIDATE_DATE from "@/config/validate.config";
import FORM_DATA from "@/config/form.config";
import { padStart, capitalize } from "lodash";

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
  created() {
    if (this.type === "userInfo") {
      this.form = this.formUserInfo;
    }
  },

  computed: {
    formUserInfo() {
      return Object.fromEntries(
        Object.entries(this.$store.getters.userInfo).filter(([key]) => {
          return FORM_DATA["userInfo"].find((item) => {
            return key === item["query"];
          });
        })
      );
    },
    formData() {
      return FORM_DATA[this.type].filter((item) => {
        return item.query !== "avatar";
      });
    },
    validates() {
      return VALIDATE_DATE;
    },
  },
  filters: {
    formatRuleTrigger(rules) {
      return rules?.map((item) => {
        item.trigger = padStart(capitalize(item.trigger), 6, "on");
        return item;
      });
    },
  },
  mounted() {},
  watch: {
    type(newVal) {
      this.form = {};
      if (newVal === "userInfo") {
        this.form = this.formUserInfo;
      }
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>