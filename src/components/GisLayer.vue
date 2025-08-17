<template>
    <div class="gis-layer">
        <!-- 1. 显示标题和描述 -->
        <h3>{{ layerName }}</h3>
        <p>类型: {{ layerType }}</p>
        <!-- 按钮直接调用 store 里的 action -->
        <botton @click="layerStore.toggleLayerVisibility(layerName)">
            {{ isVisible ? '隐藏' : '显示' }}
        </botton>
    </div>
</template>

<script setup>

import { defineProps } from 'vue';
import { useLayerStore } from '../stores/mapStore.js'; // 导入 Pinia store

// 接受props用于展示
defineProps({
    layerName: {
        type: String,
        required: true
    },
    layerType: {
        type: String,
        required: true
    },
    layerId: {
        type: Number,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true
    }
});

// 2. 同样获取 store 实例
const layerStore = useLayerStore();
</script>

<style scoped>
.gis-layer {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
}

botton {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 2px 7px;
    border-radius: 5px;
    cursor: pointer;
}
</style>