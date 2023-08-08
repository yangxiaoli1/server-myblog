<template>
  <div class="blog-page">
    <el-container class="blog-container">
      <el-header height="10vh" class="blog-header">
        <BaseHeader />
      </el-header>
      <el-container class="blog-middle">
        <el-row
          class="blog-middle--wrap"
          type="flex"
          justify="space-around"
          align="top"
        >
          <el-col :span="2">
            <BaseCircleMenu :circleMenuList="circleMenuList" />
          </el-col>
          <el-col :span="24" :lg="{ span: 16 }">
            <el-main class="blog-main">
              <Scroll ref="scrollView" @handle-scroll="lodaMore">
                <router-view
                  v-if="isRouteLoading"
                  :loading="loading"
                ></router-view>
              </Scroll>
            </el-main>
          </el-col>
          <el-col :span="6" class="hidden-md-and-down">
            <BaseAside v-if="$store.state.token" />
          </el-col>
        </el-row>
      </el-container>
      <el-footer height="10vh" class="blog-footer">底部</el-footer>
    </el-container>

    <BaseModal />
    <Live2D />
  </div>
</template>

<script>
import BaseModal from "@/components/base/BaseModal";
import BaseHeader from "@/components/base/BaseHeader";
import BaseAside from "@/components/base/BaseAside";
import BaseCircleMenu from "@/components/base/BaseCircleMenu";
import circleMenuConfig from "@/config/circleMenu.config";
import Live2D from "@/components/Live2d";
import { throttle } from "lodash";
const TH = 200;
export default {
  name: "Home",
  components: {
    BaseModal,
    BaseHeader,
    BaseAside,
    BaseCircleMenu,
    Live2D,
  },
  provide() {
    return {
      closeLoadClock: this.closeLoadClock,
    };
  },
  data() {
    return {
      loading: false,
      scrollTop: 0,
      circleMenuList: [],
      isRouteLoading: true,
    };
  },
  created() {
    this.circleMenuList = circleMenuConfig["index"]?.() || [];
  },

  watch: {
    $route(to) {
      this.circleMenuList = circleMenuConfig[to.name]?.() || [];
      this.reload();
    },
  },
  methods: {
    reload() {
      this.isRouteLoading = false;
      //实际DOM渲染完成之后触发 相当于 setTimeout 宏任务队列
      this.$nextTick(function () {
        this.isRouteLoading = true;
      });
    },
    closeLoadClock() {
      this.loading = false;
    },
    lodaMore: throttle(
      function (vertical, horizontal, nativeEvent) {
        this.scrollTop = vertical.scrollTop;
        console.log(this.scrollTop);
        if (this.loading) {
          return;
        }
        let st = vertical.scrollTop;
        let sh =
          nativeEvent.srcElement.scrollHeight -
          nativeEvent.srcElement.clientHeight;
        if (st + TH > sh) {
          console.log("加载更多");
          this.loading = true;
        }
      },
      500,
      false
    ),
  },
};
</script>

<style lang='stylus'>
.blog-container {
  overflow: hidden;
  height: 100%;
}

.blog-middle {
  padding: 20px;
  height: calc(100vh - 60px - 10vh);
  background-color: #f1f1f1;
}

.el-main.blog-main {
  padding: 0 20px;
  height: 100%;
}

.blog-middle--wrap {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.blog-footer {
  height: 10vh;
  background-color: #2D2F33;
}
</style>