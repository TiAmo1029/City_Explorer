const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  // --- 核心配置在这里 ---
  // publicPath 决定了你的应用在打包后，资源文件（如JS, CSS）的引用路径
  publicPath: process.env.NODE_ENV === 'production'
    ? '/city-explorer/' // 生产环境下，我们把它部署在 /city-explorer/ 子目录下
    : '/'             // 开发环境下，我们还是在根目录
})
