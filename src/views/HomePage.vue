<template>
    <div class="page-container">
        <h1>欢迎来到 "城市探索者" 平台</h1>
        <p>在这里，我们将使用现代Web技术，探索和可视化我们生活的城市空间。</p>
        <router-link to="/map">
            <button class="action-button">开始探索地图</button>
        </router-link>
    </div>
</template>

<style scoped>
.page-container {
    text-align: center;
    padding-top: 50px;
}

.action-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
}
</style>