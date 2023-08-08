<template>
  <div class="blog-article--info">
    <span class="blog-info--item"> 作者: {{ info.nikname }} </span>
    <span class="blog-info--item">
      <i class="el-icon-time"></i> {{ info.date }}
    </span>
    <div class="hidden-xs-only">
      <span class="blog-info--item" @click="like">
        <i
          class="el-icon-star-on blog-info-like"
          :class="{ active: isLike }"
        ></i>
        {{ likeNum }}
      </span>
      <span class="blog-info--item">
        <i class="el-icon-view"></i> {{ info.hit_num }}
      </span>
      <span class="blog-info--item">
        <i class="el-icon-s-comment"></i> {{ info.comment_num }}
      </span>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("likes");

export default {
  name: "ArticleBarInfo",
  props: {
    info: {
      type: Object,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      initLike: false,
    };
  },
  created() {
    this.initLike = this.isLike;
  },
  computed: {
    ...mapGetters({
      localLike: "isLike",
    }),
    isLike() {
      let aid = this.id;
      return this.localLike(aid);
    },

    likeNum() {
      let stepNum = this.isLike ? 0 : -1;
      return Math.max(this.info.like_num + !this.initLike + stepNum, 0);
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    like() {
      this[this.isLike ? "pullLike" : "pushLike"]({ aid: this.id });
      this.sendLikes({ aid: this.id });
    },

    ...mapActions(["pushLike", "pullLike", "sendLikes"]),
  },
};
</script>

<style lang="stylus">
.blog-info-like.active {
  color: blue;
}

.blog-info--item {
  cursor: pointer;
}
</style>