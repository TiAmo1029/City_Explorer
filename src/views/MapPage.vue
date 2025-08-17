<template>
    <div class="map-page-container">
        <LayerControl />
        <FeaturePanel />
        <StatisticsChart />
        <div ref="mapContainer" class="map-container"></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '../stores/mapStore.js';

import LayerControl from '../components/LayerControl.vue';
import FeaturePanel from '../components/FeaturePanel.vue';
import StatisticsChart from '../components/StatisticsChart.vue';

const mapContainer = ref(null);
let map = null;
const mapStore = useMapStore();
// --- 1. (核心) 在组件的顶层作用域，定义一个变量来持有source ---
let highlightSource = null;
const MAPTILER_KEY = 'KNvedDoPlLw61gg1Kn4l'; // 替换为你的Key
mapboxgl.accessToken = MAPTILER_KEY;

// --- 2. 生命周期钩子 ---
onMounted(() => {
    const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
    map = new mapboxgl.Map({
        container: mapContainer.value,
        style: styleUrl,
        center: [104, 35],
        zoom: 3.5
    });
    map.on('load', setupMap);
});

onUnmounted(() => {
    if (map) map.remove();
});


// --- 3. 地图设置总函数 (只在load后执行一次) ---
async function setupMap() {
    try {
        // a. 加载数据并初始化Store
        const response = await fetch(`${process.env.BASE_URL}provinces_of_china.json`);
        const provinceGeoJsonData = await response.json();
        const initialProvinces = provinceGeoJsonData.features.map(f => ({
            id: f.properties.name,
            name: f.properties.name,
            visible: true,
            feature: f
        }));
        mapStore.initializeProvinces(initialProvinces);

        // b. 添加所有Source和Layer (只添加一次！)
        map.addSource('provinces-source', { type: 'geojson', data: provinceGeoJsonData, promoteId: 'name' });
        map.addLayer({
            id: 'provinces-layer', type: 'fill', source: 'provinces-source',
            paint: {
                'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#FFD700', ['boolean', ['feature-state', 'hover'], false], '#FFA500', '#088'],
                'fill-opacity': 0.5, 'fill-outline-color': '#fff'
            }
        });

        map.addSource('cities-vt-source', {
            type: 'vector',
            tiles: ['http://localhost:8080/geoserver/gwc/service/wmts?layer=my_gis_project:cities_of_china&style=&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/vnd.mapbox-vector-tile&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}']
        });
        map.addLayer({
            id: 'cities-vt-layer', type: 'fill', source: 'cities-vt-source',
            'source-layer': 'cities_of_china', paint: { 'fill-color': '#f08', 'fill-opacity': 0.4 }
        });

        // c. (核心) 添加高亮专用Source和Layer，并立刻获取其实例
        map.addSource('highlight-source', { type: 'geojson', data: null });
        map.addLayer({ id: 'highlight-layer', type: 'fill', source: 'highlight-source', paint: { 'fill-color': '#FFFF00', 'fill-opacity': 0.7 } });
        highlightSource = map.getSource('highlight-source'); // <-- 在这里获取并赋值给顶层变量

        // d. 统一设置交互和监听
        setupInteractions();
        setupWatchers();

        // e. 初始统计和移动监听
        updateChartData();
        map.on('moveend', updateChartData);
        map.on('zoomend', updateChartData);

    } catch (error) { console.error("地图设置失败:", error); }
}

// --- 4. 统一的交互处理器 ---
function setupInteractions() {
    let hoveredProvinceId = null;
    map.on('click', (e) => {
        const provinceFeatures = map.queryRenderedFeatures(e.point, { layers: ['provinces-layer'] });
        const cityFeatures = map.queryRenderedFeatures(e.point, { layers: ['cities-vt-layer'] });

        if (cityFeatures.length > 0) {
            mapStore.setSelectedFeature('city', cityFeatures[0]);
        } else if (provinceFeatures.length > 0) {
            mapStore.setSelectedFeature('province', provinceFeatures[0]);
        } else {
            mapStore.setSelectedFeature(null, null);
        }
    });

    map.on('mousemove', 'provinces-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
            if (hoveredProvinceId) map.setFeatureState({ source: 'provinces-source', id: hoveredProvinceId }, { hover: false });
            hoveredProvinceId = e.features[0].properties.name;
            map.setFeatureState({ source: 'provinces-source', id: hoveredProvinceId }, { hover: true });
        }
    });
    map.on('mouseleave', 'provinces-layer', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredProvinceId) map.setFeatureState({ source: 'provinces-source', id: hoveredProvinceId }, { hover: false });
        hoveredProvinceId = null;
    });
}

// --- 5. 统一的状态侦听器 ---
function setupWatchers() {
    let lastSelectedProvinceId = null;

    // --- 唯一的、监听选中要素变化的watch ---
    watch(() => mapStore.selectedFeature, (newSelection) => {
        // a. 安全检查：确保地图和高亮源都已准备就绪
        if (!map || !map.isStyleLoaded() || !highlightSource) {
            console.warn("Watch triggered, but map or highlightSource is not ready.");
            return;
        }

        // b. 清除所有旧的高亮（省份feature-state + 城市高亮图层）
        if (lastSelectedProvinceId) {
            map.setFeatureState({ source: 'provinces-source', id: lastSelectedProvinceId }, { selected: false });
        }
        lastSelectedProvinceId = null;
        highlightSource.setData({ type: 'FeatureCollection', features: [] });

        // c. 根据新的选择，设置新的高亮，并触发Action
        if (newSelection) {
            const { type, feature } = newSelection;

            if (type === 'province') {
                // 如果选中的是省份
                lastSelectedProvinceId = feature.properties.name;
                map.setFeatureState({ source: 'provinces-source', id: lastSelectedProvinceId }, { selected: true });
                // 触发获取饼图数据的Action
                mapStore.fetchCityStatsForProvince(lastSelectedProvinceId);
            }
            else if (type === 'city') {
                // 如果选中的是城市，就更新高亮图层的数据
                highlightSource.setData(feature);
                // (可选) 清空省份统计数据，让图表切回仪表盘
                mapStore.fetchCityStatsForProvince(null);
            }
        } else {
            // d. 如果是清空选择，也确保清空饼图数据
            mapStore.fetchCityStatsForProvince(null);
        }
    }, { deep: true });

    // b. 统一处理可见性
    watch(() => mapStore.provinces, (newProvinces) => {
        if (!map || !map.getLayer('provinces-layer')) return;
        const visibleNames = newProvinces.filter(p => p.visible).map(p => p.name);
        map.setFilter('provinces-layer', ['in', 'name', ...visibleNames]);
    }, { deep: true });

    watch(() => mapStore.cityLayerVisible, (isVisible) => {
        if (!map || !map.getLayer('cities-vt-layer')) return;
        map.setLayoutProperty('cities-vt-layer', 'visibility', isVisible ? 'visible' : 'none');
    });
}

// --- 6. 更新图表数据的函数 ---
function updateChartData() {
    if (!map || !map.isStyleLoaded()) return;
    const features = map.queryRenderedFeatures({ layers: ['cities-vt-layer'] });
    const stats = { cityCount: features.length };
    mapStore.updateMapStats(stats);
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