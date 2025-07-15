<template>
    <!-- 1. 用一个容器div把所有内容包起来，并给它一个class -->
    <div class="about-container">
        <div class="content-card">
            <h2>关于项目</h2>
            <p>
                本项目由 <strong>秦亚会</strong> 基于 Vue 3, Vue Router, Pinia, Element Plus, Mapbox GL JS 等现代前端技术构建。
            </p>
            <p>
                旨在学习和实践WebGIS开发的全链路流程，从后端的空间数据处理（PostGIS）、服务发布（GeoServer），到前端的组件化开发与交互式可视化。
            </p>
        </div>
    </div>
</template>

<style scoped>
/* 2. 添加CSS样式 */
.about-container {
    display: flex;
    /* 使用Flexbox布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: flex-start;
    /* 垂直方向从顶部开始对齐 */
    padding-top: 50px;
    /* 距离顶部留出一些空间 */
    width: 100%;
    height: 100%;
    background-color: #f4f7f6;
    /* 给一个淡淡的背景色 */
}

.content-card {
    max-width: 800px;
    /* 设置一个最大宽度，让文本不会拉得太长，易于阅读 */
    width: 90%;
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left;
    /* 卡片内部文字左对齐 */
}

h2 {
    text-align: center;
    /* 标题居中 */
    margin-bottom: 25px;
}

p {
    line-height: 1.8;
    /* 增加行高，阅读更舒适 */
    text-indent: 2em;
    /* 首行缩进两个字符 */
}
</style>