<template>
    <div class="panel-wrapper" :class="{ collapsed: isCollapsed }">
        <el-card class="component-panel">
            <template #header>
                <div class="card-header">
                    <span>图表分析</span>
                    <el-button :icon="isCollapsed ? ArrowUpBold : ArrowDownBold" circle size="small"
                        @click="isCollapsed = !isCollapsed" />
                </div>
            </template>
            <div v-show="!isCollapsed">
                <div ref="chartDom" style="width: 100%; height: 250px;"></div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useMapStore } from '../stores/LayerStore';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';

const chartDom = ref(null);
let myChart = null;
const layerStore = useMapStore();
const isCollapsed = ref(false);

// 【核心修改】监听的目标从之前的重量级 computed 换成了现在轻量级的 chartStats state。
// 这个 watch 现在非常快，因为它只是在读取一个已经计算好的结果。
watch(() => layerStore.chartStats, (newStats) => {
    // 当 Store 中的 chartStats 被更新时，这里会立即响应
    if (myChart && newStats && newStats.labels.length > 0) {
        console.log("图表组件侦测到新的统计数据，正在更新图表...");
        myChart.setOption({
            xAxis: [{
                data: newStats.labels
            }],
            series: [{
                data: newStats.data
            }]
        });
    }
}, {
    deep: true,      // 深度监听，确保对象内部变化也能被侦测到
    immediate: true  // 立即执行一次，确保组件加载时就能用上初始数据
});

onMounted(() => {
    if (chartDom.value) {
        myChart = echarts.init(chartDom.value);
        const option = {
            title: {
                text: '各省份城市数量占比',
                left: 'center',
                textStyle: { fontSize: 14 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: '{b}: {c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '25%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: [],
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            }],
            yAxis: [{
                type: 'value',
                name: '%'
            }],
            series: [{
                name: '城市占比',
                type: 'bar',
                barWidth: '60%',
                data: []
            }]
        };
        myChart.setOption(option);
    }
});

onUnmounted(() => {
    if (myChart) {
        myChart.dispose();
    }
});
</script>

<style scoped>
.panel-wrapper {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
}

.panel-wrapper.collapsed {
    transform: translateY(calc(100% - 45px));
}

.component-panel {
    width: 450px;
    background-color: rgba(255, 255, 255, 0.9);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>