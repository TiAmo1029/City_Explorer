<template>
    <div class="map-page-container">
        <LayerControl />
        <FeaturePanel />

        <!-- <StatisticsChart /> -->
        <div ref="mapContainer" class="map-container"></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '../stores/LayerStore.js';

import LayerControl from '../components/LayerControl.vue';
import FeaturePanel from '../components/FeaturePanel.vue';
//import StatisticsChart from '../components/StatisticsChart.vue'; // 即使注释掉模板，也可以保留导入

const mapContainer = ref(null);
let map = null;
const layerStore = useMapStore();
const MAPTILER_KEY = 'KNvedDoPlLw61gg1Kn4l'; // 替换为你的Key
mapboxgl.accessToken = MAPTILER_KEY;

onMounted(() => {
    if (mapContainer.value) {
        const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: styleUrl,
            center: [104, 35],
            zoom: 3.5
        });
        map.on('load', setupMapAndLayers);
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});

async function setupMapAndLayers() {
    console.log("地图加载，开始设置图层...");
    try {
        // 1. 加载省份数据 (客户端加载)
        const provinceWfsUrl = 'http://localhost:8080/geoserver/my_gis_project/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=my_gis_project%3Agadm41_chn_1_1&outputFormat=application%2Fjson';
        const provinceResponse = await fetch(provinceWfsUrl);
        const provinceGeoJsonData = await provinceResponse.json();

        const initialProvinces = provinceGeoJsonData.features.map((feature, index) => ({
            id: feature.properties.name_1 || `province-${index}`,
            name: feature.properties.name_1,
            type: '面',
            visible: true,
            feature: feature
        }));
        layerStore.initializeProvinces(initialProvinces, provinceGeoJsonData);

        // 2. 添加省份图层到地图
        if (!map.getSource('provinces-source')) {
            map.addSource('provinces-source', {
                type: 'geojson',
                data: provinceGeoJsonData,
                promoteId: 'name_1'
            });
        }
        if (!map.getLayer('provinces-layer')) {
            map.addLayer({
                id: 'provinces-layer',
                type: 'fill',
                source: 'provinces-source',
                paint: {
                    'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#FFD700', ['boolean', ['feature-state', 'hover'], false], '#FFA500', '#0080ff'],
                    'fill-opacity': 0.5,
                    'fill-outline-color': '#000000'
                }
            });
        }

        // 3. 添加城市图层 (WMS方式，服务端加载)
        if (!map.getLayer('cities-layer')) {
            map.addLayer({
                id: 'cities-layer',
                type: 'raster', // WMS返回的是图片，所以类型是栅格
                source: {
                    type: 'raster',
                    tiles: [
                        // WMS服务的URL模板，请确保GeoServer地址和图层名正确
                        'http://localhost:8080/geoserver/my_gis_project/wms?service=WMS&version=1.1.0&request=GetMap&layers=my_gis_project%3Agadm41_2&bbox=73.25161743164062%2C17.982297897338867%2C135.0800018310547%2C53.73786926269531&width=768&height=444&srs=EPSG%3A4326&styles=&format=image%2Fpng'
                    ],
                    tileSize: 256
                },
                paint: { 'raster-opacity': 0.8 },
                layout: {
                    // 初始可见性由Store控制，默认为 'none'
                    visibility: layerStore.cityLayerVisible ? 'visible' : 'none'
                }
            });
        }

        // 4. 设置交互和监听器
        setupInteractions();
        setupWatchers();

    } catch (error) {
        console.error("设置地图时发生错误:", error);
    }
}

function setupInteractions() {
    let hoveredId = null;
    map.on('click', 'provinces-layer', (e) => {
        if (e.features.length > 0) {
            layerStore.setSelectedFeatureId(e.features[0].properties.name_1);
        }
    });
    map.on('click', (e) => {
        if (map.queryRenderedFeatures(e.point, { layers: ['provinces-layer'] }).length === 0) {
            layerStore.setSelectedFeatureId(null);
        }
    });
    map.on('mousemove', 'provinces-layer', (e) => {
        if (e.features.length > 0) {
            if (hoveredId !== null) map.setFeatureState({ source: 'provinces-source', id: hoveredId }, { hover: false });
            hoveredId = e.features[0].properties.name_1;
            map.setFeatureState({ source: 'provinces-source', id: hoveredId }, { hover: true });
        }
    });
    map.on('mouseleave', 'provinces-layer', () => {
        if (hoveredId !== null) map.setFeatureState({ source: 'provinces-source', id: hoveredId }, { hover: false });
        hoveredId = null;
    });
}

function setupWatchers() {
    // 监听 "所有省份" 总开关
    watch(() => layerStore.provinceLayerVisible, (isVisible) => {
        if (map && map.getLayer('provinces-layer')) {
            map.setLayoutProperty('provinces-layer', 'visibility', isVisible ? 'visible' : 'none');
        }
    });

    // 监听 "所有城市" WMS图层总开关
    watch(() => layerStore.cityLayerVisible, (isVisible) => {
        if (map && map.getLayer('cities-layer')) {
            map.setLayoutProperty('cities-layer', 'visibility', isVisible ? 'visible' : 'none');
        }
    });

    // 监听 provinces 数组内部的变化，用于单独控制省份
    watch(() => layerStore.provinces, (newProvinces) => {
        if (map && map.getLayer('provinces-layer')) {
            const visibleProvinceNames = newProvinces
                .filter(p => p.visible)
                .map(p => p.name);
            map.setFilter('provinces-layer', ['in', 'name_1', ...visibleProvinceNames]);
        }
    }, { deep: true });

    // 监听选中要素变化，更新高亮状态
    let lastSelectedId = null;
    watch(() => layerStore.selectedFeatureId, (newId) => {
        if (!map || !map.isStyleLoaded()) return;
        if (lastSelectedId !== null) map.setFeatureState({ source: 'provinces-source', id: lastSelectedId }, { selected: false });
        if (newId !== null) map.setFeatureState({ source: 'provinces-source', id: newId }, { selected: true });
        lastSelectedId = newId;
    });
}
</script>

<style scoped>
.map-page-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-container {
    width: 100%;
    height: 100%;
}
</style>