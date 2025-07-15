// 1. 导入必要的函数和我们创建的页面组件
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import MapPage from '../views/MapPage.vue';
import AboutPage from '../views/AboutPage.vue';

// 2. 定义路由表 (routes) - 这是一个规则数组
const routes = [
    // 规则一：当URL路径是'/'时
    {
        path: '/',          // 匹配的URL路径
        name: 'Home',       // 给这条路由起个名字，方便以后编程式导航
        component: HomePage // 渲染 HomePage.vue 这个组件
    },
    // 规则二：当URL路径是'/map'时
    {
        path: '/map',
        name: 'Map',
        component: MapPage
    },
    // 规则三：当URL路径是'/about'时
    {
        path: '/about',
        name: 'About',
        component: AboutPage
    }
];

// 3. 创建 router 实例
const router = createRouter({
    // history 模式：使用 createWebHistory() 来获得干净的URL（如 /about）
    // 这是推荐的模式，依赖HTML5 History API
    history: createWebHistory(),
    // 将我们定义的路由规则数组传递给 router
    routes: routes
});

// 4. 将 router 实例导出，以便在 main.js 中使用
export default router;