<template>
    <!-- v-if 决定了只有选中要素时，整个组件才存在 -->
    <div v-if="layerStore.selectedProvince" class="panel-wrapper" :class="{ collapsed: isCollapsed }">

        <!-- “拉片”开关，点击它来切换 isCollapsed 状态 -->
        <div class="toggle-button" @click="isCollapsed = !isCollapsed">
            <el-icon>
                <ArrowRightBold v-if="isCollapsed" />
                <ArrowLeftBold v-else />
            </el-icon>
        </div>

        <!-- el-card 作为面板的主体 -->
        <el-card class="feature-panel">
            <template #header>
                <div class="card-header">
                    <span>要素详情</span>
                </div>
            </template>

            <!-- v-show 让内容在折叠时隐藏，保留 DOM 结构以获得流畅动画 -->
            <div v-show="!isCollapsed" class="feature-content">
                <el-button class="clear-btn" type="danger" plain size="small"
                    @click="layerStore.setSelectedFeatureId(null)">
                    清空选择
                </el-button>

                <el-descriptions
                    v-if="layerStore.selectedFeatureProperties && Object.keys(layerStore.selectedFeatureProperties).length > 0"
                    :column="1" border size="small" class="description-table">
                    <el-descriptions-item v-for="(value, key) in layerStore.selectedFeatureProperties" :key="key"
                        :label="key">
                        {{ value }}
                    </el-descriptions-item>
                </el-descriptions>

                <el-empty v-else description="无属性信息" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMapStore } from '../stores/LayerStore';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';

const isCollapsed = ref(false);
const layerStore = useMapStore();
</script>

<style scoped>
.panel-wrapper {
    position: absolute;
    top: 90px;
    /* 稍微往下移一点，避免和图层控制器重叠 */
    right: 0;
    z-index: 999;
    /* 比图层控制器低一点 */
    display: flex;
    align-items: center;
    transition: transform 0.3s ease-in-out;
}

/* 【修改】这里是唯一的 bug！你的 class 是 panel-wrapper，而不是 feature-panel-container */
.panel-wrapper.collapsed {
    /* 将整个 wrapper 向右移动，移动的距离等于面板的宽度 */
    /* 这样，面板就移出了屏幕，只剩下左边的“拉片”开关还贴在屏幕边缘 */
    transform: translateX(320px);
    /* 这里的 320px 应该等于下面 .feature-panel 的 width */
}

.toggle-button {
    width: 20px;
    height: 60px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-right: none;
    border-radius: 6px 0 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.feature-panel {
    width: 320px;
    /* 面板的宽度 */
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.feature-content {
    max-height: calc(100vh - 250px);
    /* 优化一下最大高度计算 */
    overflow-y: auto;
}

.clear-btn {
    margin-bottom: 15px;
}

.description-table {
    margin-top: 10px;
}
</style>
