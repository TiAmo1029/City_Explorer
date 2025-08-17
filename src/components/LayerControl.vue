<template>
    <div class="panel-wrapper" :class="{ collapsed: isCollapsed }">
        <!-- 抽屉式开关按钮 -->
        <div class="toggle-button" @click="isCollapsed = !isCollapsed">
            <el-icon><el-icon-arrow-right v-if="isCollapsed" /><el-icon-arrow-left v-else /></el-icon>
        </div>

        <el-card class="layer-control-panel">
            <template #header><span>图层控制</span></template>
            <div v-show="!isCollapsed" class="panel-content">
                <div class="master-control">
                    <el-checkbox v-model="mapStore.provinceLayerVisible" label="所有省份" size="large" />
                    <el-checkbox v-model="mapStore.cityLayerVisible" label="所有城市" size="large" />
                </div>
                <el-divider />
                <p class="sub-title">单独控制省份:</p>
                <div class="province-list">
                    <el-checkbox-group v-model="visibleProvinceNames">
                        <div v-for="province in mapStore.provinces" :key="province.id" class="province-item">
                            <el-checkbox :label="province.name" />
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMapStore } from '../stores/mapStore';
import { ArrowLeft as ElIconArrowLeft, ArrowRight as ElIconArrowRight } from '@element-plus/icons-vue';

const mapStore = useMapStore();
const isCollapsed = ref(false);

const visibleProvinceNames = computed({
    get() { return mapStore.provinces.filter(p => p.visible).map(p => p.name); },
    set(newVisibleNames) {
        mapStore.provinces.forEach(province => {
            province.visible = newVisibleNames.includes(province.name);
        });
    }
});
</script>

<style scoped>
/* 抽屉式布局 + 面板样式 (左侧版本) */
.panel-wrapper {
    position: absolute;
    top: 20px;
    left: 0;
    /* 1. 定位在屏幕左侧 */
    z-index: 1000;
    display: flex;
    flex-direction: row-reverse;
    /* 2. (核心) 反转Flex的主轴方向！ */
    align-items: center;
    transition: transform 0.3s ease-in-out;
}

/* 3. 当折叠时，向左移出 */
.panel-wrapper.collapsed {
    transform: translateX(calc(-100% + 40px));
}

.toggle-button {
    width: 20px;
    height: 60px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-left: none;
    /* 4. 左边框不要，让它和面板无缝连接 */
    border-radius: 0 6px 6px 0;
    /* 5. 右边是圆角，左边是直角 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.layer-control-panel {
    width: 220px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-content {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
}

.master-control {
    display: flex;
    flex-direction: column;
}

.sub-title {
    font-size: 12px;
    color: #999;
    margin: 10px 0 5px;
}

.province-list .province-item {
    display: block;
    margin-bottom: 5px;
}
</style>