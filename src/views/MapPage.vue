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
import axios from 'axios';
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
        // --- 1. (核心) 并发加载所有需要的【静态】数据文件 ---
        const [provinceResponse, cityPointsResponse] = await Promise.all([
            fetch(`${process.env.BASE_URL}provinces_of_china.json`),
            fetch(`${process.env.BASE_URL}china_cities_points.json`)
        ]);
        const provinceGeoJsonData = await provinceResponse.json();
        const cityPointsGeoJson = await cityPointsResponse.json();
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

        // --- 2. (核心修复) 使用正确的`url`属性，并【检查真实的source-layer】 ---
        const tileJsonUrl = `https://api.maptiler.com/tiles/0198dc07-9e93-7368-9269-00c754ca38a4/tiles.json?key=KNvedDoPlLw61gg1Kn4l`;

        // --- 2a. (终极侦察) 动态地获取真实的source-layer名称 ---
        const tileJsonResponse = await axios.get(tileJsonUrl);
        const realSourceLayerName = tileJsonResponse.data.vector_layers[0].id;
        console.log("侦察到的真实Source Layer名称是:", realSourceLayerName);

        // --- 2. (核心修复) 使用正确的`url`属性来加载矢量瓦片 ---
        if (!map.getSource('cities-vt-source')) {
            map.addSource('cities-vt-source', {
                'type': 'vector',
                'url': tileJsonUrl
            });
        }
        if (!map.getLayer('cities-vt-layer')) {
            map.addLayer({
                'id': 'cities-vt-layer',
                'type': 'fill',
                'source': 'cities-vt-source',
                'source-layer': realSourceLayerName,
                'layout': { 'visibility': mapStore.cityLayerVisible ? 'visible' : 'none' },
                'paint': {
                    'fill-color': '#f08',
                    'fill-opacity': 0.4
                }
            });
        }

        // c. (核心) 添加高亮专用Source和Layer，并立刻获取其实例
        map.addSource('highlight-source', { type: 'geojson', data: null });
        map.addLayer({ id: 'highlight-layer', type: 'fill', source: 'highlight-source', paint: { 'fill-color': '#FFFF00', 'fill-opacity': 0.7 } });
        highlightSource = map.getSource('highlight-source'); // <-- 在这里获取并赋值给顶层变量
        /*
                // --- 1. (核心) 调用我们自己的后端API，获取城市质心点数据 ---
                const cityCentroidsUrl = 'http://localhost:3000/api/cities-centroids';
                const cityPointsResponse = await axios.get(cityCentroidsUrl);
                const cityPointsGeoJson = cityPointsResponse.data;
                */

        // --- 2. (核心) 添加一个【可聚合】的数据源 ---
        if (!map.getSource('city-points-source')) {
            map.addSource('city-points-source', {
                type: 'geojson',
                data: cityPointsGeoJson,
                cluster: true, // <-- 开启聚合功能的“总开关”！
                clusterMaxZoom: 14, // 在哪个缩放级别停止聚合
                clusterRadius: 50 // 聚合点的半径（像素）
            });
        }

        // --- 3. (核心) 创建三个独立的图层，来渲染这个数据源 ---

        // a. 创建【聚合点簇】图层 (带数字的圆圈)
        if (!map.getLayer('clusters-layer')) {
            map.addLayer({
                id: 'clusters-layer',
                type: 'circle',
                source: 'city-points-source',
                filter: ['has', 'point_count'], // 只渲染那些“有point_count属性”的要素，也就是聚合点
                paint: {
                    // 根据点簇内的数量，分级显示不同颜色
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6', 100, // 数量 < 100 时，用蓝色
                        '#f1f075', 750, // 100 <= 数量 < 750 时，用黄色
                        '#f28cb1'  // 数量 >= 750 时，用粉色
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20, 100, // 数量 < 100 时，半径20px
                        30, 750, // 100 <= 数量 < 750 时，半径30px
                        40      // 数量 >= 750 时，半径40px
                    ]
                }
            });
        }

        // b. 创建【聚合点簇内的数字】图层
        if (!map.getLayer('cluster-count-layer')) {
            map.addLayer({
                id: 'cluster-count-layer',
                type: 'symbol',
                source: 'city-points-source',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}', // 显示被聚合点的数量（自动缩写 K/M）
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });
        }

        // c. 创建【未被聚合的单个点】图层
        if (!map.getLayer('unclustered-point-layer')) {
            map.addLayer({
                id: 'unclustered-point-layer',
                type: 'circle',
                source: 'city-points-source',
                filter: ['!', ['has', 'point_count']], // 只渲染那些“没有point_count属性”的要素
                paint: {
                    'circle-color': '#11b4da',
                    'circle-radius': 6,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });
        }

        // --- 4. (核心) 为聚合点簇添加交互 ---
        map.on('click', 'clusters-layer', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters-layer'] });
            const clusterId = features[0].properties.cluster_id;

            // 获取这个点簇的扩展范围(zoom extent)
            map.getSource('city-points-source').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;
                    // 让地图平滑地放大到可以“炸开”这个点簇的级别
                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // d. 统一设置交互和监听
        setupInteractions();
        setupWatchers();

        // e. 初始统计和移动监听
        updateChartData();
        map.on('moveend', updateChartData);
        map.on('zoomend', updateChartData);
        map.on('mouseenter', 'clusters-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters-layer', () => { map.getCanvas().style.cursor = ''; });

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

    // --- (核心) 智能的城市图层模式监听器 ---
    watch(() => mapStore.cityDisplayMode, (newMode) => {
        if (!map) return;

        // 根据新模式，智能地切换图层可见性
        map.setLayoutProperty('cities-vt-layer', 'visibility', newMode === 'fill' ? 'visible' : 'none');

        // 同时控制三个聚合图层
        ['clusters-layer', 'cluster-count-layer', 'unclustered-point-layer'].forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', newMode === 'cluster' ? 'visible' : 'none');
            }
        });
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