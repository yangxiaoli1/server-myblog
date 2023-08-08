<template>
  <div class="blogm-user">
    <van-uploader v-if="avatar" :after-read="afterRead">
      <van-image round width="10rem" height="10rem" :src="avatar" />
    </van-uploader>
    <van-image
      v-else
      round
      width="10rem"
      height="10rem"
      :src="require('@/assets/img/logo.jpg')"
    />

    <div class="blogm-users--content">
      <h2 class="blogm-users--title">{{ title }}</h2>
      <BaseForm ref="userWrap" :type="formType" />
      <p
        class="blogm-users--tag"
        v-if="tagValue"
        @click="changeType"
        v-html="tagValue"
      ></p>
    </div>
    <!-- <p v-if="isLogin" class="blogm-dialog--route">
      <van-tag plain round type="primary" @click="goRegister">注册</van-tag>
    </p> -->
    <div class="blogm-users--btns">
      <van-button type="info" block @click="onSubmit">{{
        buttonName
      }}</van-button>
      <van-button
        type="warning"
        v-if="formType === 'userInfo'"
        @click="logout"
        block
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import BaseForm from "@/components/m/BaseForm";
import MODAL_DATA from "@/config/modal.config";
import { mapGetters, mapActions } from "vuex";

const BTN_NAME = {
  login: "登录",
  register: "注册",
  userInfo: "修改",
};

const TAG_VALUE = {
  login: "还没有账号? <span>点击注册</span>",
  register: "已有账号? <span>点击登录</span>",
  userInfo: "",
};

export default {
  name: "MUser",
  components: { BaseForm },
  props: {
    state: {
      type: String,
      default: "login",
    },
  },
  data() {
    return {
      fileBase: "",
      type: "",
    };
  },
  created() {
    let isLogin = this.$store.state.token;
    let nikname = this.userInfo?.nikname;
    if (isLogin && !nikname) {
      this.getUserInfo();
    }
  },
  computed: {
    tagValue() {
      return TAG_VALUE[this.formType];
    },
    avatar() {
      return this.fileBase || this.userInfo?.avatar;
    },
    // isLogin() {
    //   return this.formType === "login";
    // },
    nikname() {
      return this.userInfo?.nikname;
    },
    requestType() {
      return this.formType === "userInfo" ? "putUserInfo" : this.formType;
    },
    formType() {
      return this.nikname ? "userInfo" : this.type || this.state;
    },
    title() {
      return MODAL_DATA[this.formType]?.title;
    },
    buttonName() {
      return BTN_NAME[this.formType] || "登录";
    },
    ...mapGetters(["userInfo"]),
  },
  mounted() {},

  methods: {
    changeType() {
      this.type = (this.type || this.state) === "login" ? "register" : "login";
    },
    async onSubmit() {
      let userWrap = this.$refs.userWrap;
      let form = userWrap.$refs.form;
      form
        .validate()
        .then(async () => {
          let formData = userWrap.form;
          formData.avatar = this.avatar;
          try {
            await this.$api({ type: this.requestType, data: formData });
            this.getUserInfo();
          } catch (err) {
            form.resetValidation();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async afterRead(upload) {
      // 创建一个FormData表单对象
      let formData = new FormData();
      // 在表单对象中添加一个file字段，字段的值为upload.file对象
      formData.append("file", upload.file);
      try {
        let result = await this.$api({
          type: "uploadUserAvatar",
          data: formData,
        });
        console.log(result);
        this.fileBase = result.fileURL;
      } catch (err) {
        console.log(err);
      }
    },
    // goRegister() {
    //   this.$router.push({
    //     name: "mUser",
    //     query: {
    //       state: "register",
    //     },
    //   });
    // },
    ...mapActions(["logout", "getUserInfo"]),
  },
};
</script>

<style lang="stylus">
.blogm-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  height: 100%;
  background-color: #f9f9f9;
}

.blogm-users--content {
  width: 100%;
  padding: 20px 0;
  background-color: #fff;
}

.blogm-users--btns {
  width: 100%;

  &>button+button {
    margin-top: 10px;
  }
}

.blogm-users--title {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  line-height: 1.8;
}

.blogm-users--tag {
  padding: 1em 2em;
  text-align: right;
  font-size: 14px;

  &>span {
    color: blue;
  }
}
</style>