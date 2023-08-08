const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  publicPath: '', //打包后是相对路径
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end();
      //按需打包lodash函数
      config.plugin('lodash-webpack-plugin').use(require('lodash-webpack-plugin'))
    }
    //压缩代码
    config.optimization.minimize(true)
    // 移除 prefetch 插件 停止prefetch偷偷静默加载
    config.plugins.delete('prefetch')

    // wangeditor 和 vue 不打包 使用CDN引入
    config.externals({
      wangeditor: 'wangEditor',
      vue: 'Vue'
    })
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"))
    // .set("base", resolve("baseConfig"))
    // .set("public", resolve("public"));
  },
  // 压缩配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      return {
        plugins: [
          new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            deleteOriginalAssets: false,
          })
        ]
      }
    }
  }
})
