const { defineConfig } = require('@vue/cli-service');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// 定义Cesium源码的位置，以便复用
const cesiumSource = 'node_modules/cesium/Build/Cesium';

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/City_Explorer/' : '/',

  configureWebpack: {
    plugins: [
      // 核心插件：CopyWebpackPlugin
      // 它的作用，就是在Webpack打包时，把指定的文件或文件夹，复制到输出目录(dist)
      // 在开发时，它会把这些文件“虚拟地”提供给devServer
      new CopyWebpackPlugin({
        patterns: [
          // 我们需要复制Cesium的四个核心静态资源文件夹
          // 目标路径'cesium/'，与我们代码里window.CESIUM_BASE_URL的设置完全匹配
          { from: path.join(cesiumSource, 'Workers'), to: 'cesium/Workers' },
          { from: path.join(cesiumSource, 'ThirdParty'), to: 'cesium/ThirdParty' },
          { from: path.join(cesiumSource, 'Assets'), to: 'cesium/Assets' },
          { from: path.join(cesiumSource, 'Widgets'), to: 'cesium/Widgets' },
        ],
      }),
    ],
    // 解决一些Cesium的模块依赖和兼容性问题
    resolve: {
      mainFields: ['module', 'main', 'browser'],
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          include: path.resolve(__dirname, cesiumSource),
          use: [{
            loader: 'strip-pragma-loader',
            options: {
              pragmas: {
                debug: false
              }
            }
          }]
        }
      ]
    },
  },
});