<template>
  <div id="app-layout">
    <header class="app-header">
      <div class="logo">城市探索者</div>
      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/map">地图页</router-link>
        <router-link to="/map3D">3D地图页</router-link>
        <router-link to="/about">关于项目</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view></router-view>
    </main>
    <footer class="app-footer">
      <p>© 2025 秦亚会. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// 作为纯布局组件，App.vue通常不需要任何JS逻辑
</script>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 继承来自html/body/app的100%高度 */
}

.app-header {
  flex-shrink: 0;
  /* 防止被压缩 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border-bottom: 1px solid #eaecef;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.main-nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin-left: 20px;
}

.main-nav a.router-link-exact-active {
  color: #42b983;
}

.app-main {
  flex-grow: 1;
  /* 占据所有剩余空间，把页脚推到底部 */
  position: relative;
  /* 为内部绝对定位的元素提供参照 */
  overflow: hidden;
  /* 防止地图等内容溢出 */
}

.app-footer {
  flex-shrink: 0;
  /* 防止被压缩 */
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  font-size: 0.8rem;
  color: #6c757d;
}
</style>