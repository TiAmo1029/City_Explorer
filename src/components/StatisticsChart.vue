<template>
    <!-- 1. 抽屉式布局的容器 -->
    <div class="panel-wrapper" :class="{ collapsed: isCollapsed }">

        <!-- 开关按钮 -->
        <div class="toggle-button" @click="isCollapsed = !isCollapsed">
            <el-icon><el-icon-arrow-right v-if="isCollapsed" /><el-icon-arrow-left v-else /></el-icon>
        </div>

        <el-card class="chart-panel" v-loading="mapStore.isLoadingStats" element-loading-text="正在查询分析...">

            <div v-show="!isCollapsed" class="panel-content">
                <!-- 
          2. (核心) v-if / v-else 智能切换图表模式
             当“选中省份的城市统计”有数据时，显示饼图
        -->
                <div v-if="shouldShowPieChart" class="chart-wrapper">
                    <h4>{{ chartTitle }}</h4>
                    <div ref="pieChartDom" style="width: 100%; height: 250px;"></div>
                </div>

                <!-- 否则，显示默认的仪表盘 -->
                <div v-else class="chart-wrapper">
                    <h4>当前视野内城市统计</h4>
                    <div ref="gaugeChartDom" style="width: 100%; height: 250px;"></div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import { useMapStore } from '../stores/mapStore';
import { ArrowLeft as ElIconArrowLeft, ArrowRight as ElIconArrowRight } from '@element-plus/icons-vue';

const mapStore = useMapStore();
const isCollapsed = ref(false);

const gaugeChartDom = ref(null);
const pieChartDom = ref(null);
let gaugeChart = null;
let pieChart = null;

// --- 3. (核心) 用计算属性来决定显示哪个图表，逻辑更清晰 ---
const shouldShowPieChart = computed(() => {
    return mapStore.selectedProvinceCitiesStats && mapStore.selectedProvinceCitiesStats.length > 0;
});

const chartTitle = computed(() => {
    if (mapStore.selectedFeature && mapStore.selectedFeature.type === 'province') {
        return `${mapStore.selectedFeature.feature.properties.name} 城市面积占比`;
    }
    return '城市面积占比';
});

// --- 4. 封装独立的渲染函数，职责更单一 ---

// 渲染或更新仪表盘
function renderGaugeChart() {
    if (gaugeChartDom.value) {
        if (!gaugeChart) {
            gaugeChart = echarts.init(gaugeChartDom.value);
        }
        gaugeChart.setOption({
            series: [{
                type: 'gauge',
                detail: { formatter: '{value}' },
                data: [{ value: mapStore.mapStats.cityCount, name: '城市数量' }]
            }]
        });
    }
}

// 渲染或更新饼图
function renderPieChart() {
    if (pieChartDom.value && shouldShowPieChart.value) {
        if (!pieChart) {
            pieChart = echarts.init(pieChartDom.value);
        }
        const chartData = mapStore.selectedProvinceCitiesStats
            .map(city => ({
                name: city.city_name,
                value: (city.area_sqm / 1000000).toFixed(2)
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        pieChart.setOption({
            title: { text: 'TOP10 城市面积 (km²)', left: 'center', textStyle: { fontSize: 12 } },
            tooltip: { trigger: 'item', formatter: '{b}: {c} km² ({d}%)', confine: true },
            series: [{
                type: 'pie',
                radius: '70%',
                data: chartData,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }]
        });
    }
}

// --- 最终的、唯一的、智能的watch，负责调度所有渲染 ---
watch(
    () => [mapStore.selectedFeature, mapStore.mapStats],
    () => {
        // 使用nextTick，确保v-if/v-else已经完成了DOM的切换
        nextTick(() => {
            if (shouldShowPieChart.value) {
                // --- 饼图模式 ---
                if (gaugeChart) { // 如果仪表盘存在，就销毁它
                    gaugeChart.dispose();
                    gaugeChart = null;
                }
                renderPieChart();
            } else {
                // --- 仪表盘模式 ---
                if (pieChart) { // 如果饼图存在，就销毁它
                    pieChart.dispose();
                    pieChart = null;
                }
                renderGaugeChart();
            }
        });
    },
    { deep: true, immediate: true }
);

// --- (核心) 监听折叠状态，调整图表大小 ---
watch(isCollapsed, (newCollapsedState) => {
    if (!newCollapsedState) {
        setTimeout(() => {
            if (pieChart) pieChart.resize();
            if (gaugeChart) gaugeChart.resize();
        }, 350); // 延迟时间略长于CSS动画
    }
});

onUnmounted(() => {
    if (gaugeChart) gaugeChart.dispose();
    if (pieChart) pieChart.dispose();
});
</script>

<style scoped>
/* 抽屉式布局 + 面板样式 (左下角版本) */
.panel-wrapper {
    position: absolute;
    bottom: 40px;
    /* 距离底部40px */
    left: 0;
    /* 定位在屏幕左侧 */
    z-index: 1000;
    display: flex;
    align-items: center;
    /* 垂直居中对齐按钮和面板 */
    transition: transform 0.3s ease-in-out;
}

.panel-wrapper.collapsed {
    transform: translateX(calc(-100% + 40px));
    /* 向左移出，只留40px */
}

.toggle-button {
    width: 20px;
    height: 60px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-left: none;
    border-radius: 0 6px 6px 0;
    /* 右边是圆角 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    /* (核心) 为了让按钮和面板主体水平排列 */
    order: 2;
}

.chart-panel {
    width: 380px;
    order: 1;
    /* (核心) 让面板在按钮的左边 */
}

.panel-content {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    padding: 10px;
    /* 添加内边距，避免内容贴边 */
    background-color: #f9f9f9;
    /* 设置背景色，增加可读性 */
    border-radius: 6px;
    /* 圆角边框，和按钮风格一致 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果，增加层次感 */
    transition: all 0.3s ease-in-out;
    /* 平滑过渡效果 */
    display: flex;
    flex-direction: column;
    /* 让内容垂直排列 */
    align-items: center;
    /* 水平居中对齐内容 */
    justify-content: center;
    /* 垂直居中对齐内容 */
    gap: 10px;
    /* 设置内容之间的间距 */
    font-size: 14px;
    /* 设置字体大小 */
    color: #333;
    /* 设置字体颜色 */
    text-align: center;
    /* 文本居中对齐 */
    line-height: 1.5;
    /* 设置行高，增加可读性 */
}

.chart-wrapper {
    width: 100%;
}

h4 {
    text-align: center;
    margin: 0 0 10px 0;
    color: #333;
}
</style>