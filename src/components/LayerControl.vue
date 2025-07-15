<template>
    <div class="panel-wrapper" :class="{ collapsed: isCollapsed }">
        <el-card class="layer-control-panel">
            <template #header>
                <div class="card-header">
                    <span>图层控制</span>
                    <el-button :icon="isCollapsed ? ArrowRightBold : ArrowLeftBold" circle size="small"
                        @click="isCollapsed = !isCollapsed" />
                </div>
            </template>

            <!-- 使用 v-show 来包裹所有内容 -->
            <div v-show="!isCollapsed">
                <!-- 【新增】总开关 -->
                <div class="master-control">
                    <el-checkbox :model-value="layerStore.provinceLayerVisible"
                        @change="layerStore.setLayerVisibility('provinces', $event)" label="所有省份" size="large" />
                    <el-checkbox :model-value="layerStore.cityLayerVisible"
                        @change="layerStore.setLayerVisibility('cities', $event)" label="所有城市" size="large" />
                </div>
                <el-divider />

                <!-- 保留你原有的分省份控制，如果需要的话 -->
                <p class="sub-title">单独控制省份:</p>
                <div class="province-list">
                    <div v-for="province in layerStore.provinces" :key="province.id" class="province-item">
                        <el-checkbox :model-value="province.visible"
                            @change="layerStore.toggleProvinceVisibility(province.id)">
                            {{ province.name }}
                        </el-checkbox>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>


<script setup>
import { useMapStore } from '../stores/LayerStore';
const layerStore = useMapStore();
import { ref } from 'vue';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';

const isCollapsed = ref(false);
</script>

<style scoped>
/* 你的原有样式保持不变 */
.panel-wrapper {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
}

.panel-wrapper.collapsed {
    transform: translateX(calc(-100% + 40px));
}

.layer-control-panel {
    width: 220px;
    background-color: rgba(255, 255, 255, 0.9);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 【新增】一些样式让布局更好看 */
.master-control {
    display: flex;
    justify-content: space-around;
    padding-bottom: 10px;
}

.sub-title {
    font-size: 12px;
    color: #909399;
    margin: 0 0 5px 0;
}

.province-list {
    max-height: 200px;
    /* 如果省份太多，可以设置一个最大高度并滚动 */
    overflow-y: auto;
}

.province-item {
    margin-bottom: 5px;
}
</style>