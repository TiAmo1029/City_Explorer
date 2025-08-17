<template>
    <!-- 1. 最外层的 v-if 决定面板是否“存在” -->
    <div v-if="mapStore.selectedFeature" class="panel-wrapper" :class="{ collapsed: isCollapsed }">

        <!-- 抽屉式开关按钮 -->
        <div class="toggle-button" @click="isCollapsed = !isCollapsed">
            <el-icon>
                <ArrowRightBold v-if="isCollapsed" />
                <ArrowLeftBold v-else />
            </el-icon>
        </div>

        <el-card class="feature-panel">
            <template #header>
                <div class="card-header">
                    <span>要素详情</span>
                    <!-- 2. (核心) 关闭按钮，只负责调用action清空选中状态 -->
                    <el-button :icon="Close" circle size="small" @click="mapStore.setSelectedFeature(null, null)"
                        title="清空选择" />
                </div>
            </template>

            <!-- 3. v-show 控制内容的显示/隐藏 -->
            <div v-show="!isCollapsed" class="feature-content">
                <el-descriptions
                    v-if="mapStore.selectedFeatureProperties && Object.keys(mapStore.selectedFeatureProperties).length > 0"
                    :column="1" border size="small" class="description-table">
                    <el-descriptions-item v-for="(value, key) in mapStore.selectedFeatureProperties" :key="key"
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
import { useMapStore } from '../stores/mapStore';
import { ArrowLeftBold, ArrowRightBold, Close } from '@element-plus/icons-vue';

const mapStore = useMapStore();
const isCollapsed = ref(false);
</script>

<style scoped>
/* 抽屉式布局 + 面板样式 */
.panel-wrapper {
    position: absolute;
    top: 20px;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease-in-out;
}

.panel-wrapper.collapsed {
    transform: translateX(calc(100% - 40px));
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
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.feature-content {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
</style>