import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useMapStore = defineStore('mapStore', () => {
    const provinces = ref([]);
    const cityLayerVisible = ref(false);
    const selectedFeature = ref(null);
    const mapStats = ref({ cityCount: 0 });
    const selectedProvinceCitiesStats = ref(null);
    const isLoadingStats = ref(false);

    const selectedFeatureProperties = computed(() => {
        return selectedFeature.value ? selectedFeature.value.feature.properties : null;
    });

    const provinceLayerVisible = computed({
        get: () => provinces.value.length > 0 ? provinces.value.every(p => p.visible) : true,
        set: (value) => provinces.value.forEach(p => p.visible = value)
    });

    function initializeProvinces(data) {
        provinces.value = data;
    }

    function toggleCityLayerVisibility() {
        cityLayerVisible.value = !cityLayerVisible.value;
    }

    function setSelectedFeature(type, feature) {
        if (feature) {
            selectedFeature.value = { type, feature };
        } else {
            selectedFeature.value = null;
        }
    }

    function updateMapStats(stats) {
        mapStats.value = stats;
    }
    /*
    async function fetchCityStatsForProvince(provinceName) {
        if (!provinceName) {
            selectedProvinceCitiesStats.value = null;
            return;
        }
        isLoadingStats.value = true;
        try {
            const apiUrl = `http://localhost:8000/api/provinces/${provinceName}/cities-with-area`;
            const response = await axios.get(apiUrl);
            selectedProvinceCitiesStats.value = response.data;
        } catch (error) {
            console.error("获取城市统计数据失败:", error);
            selectedProvinceCitiesStats.value = null;
        } finally {
            isLoadingStats.value = false;
        }
    }
    */
    async function fetchCityStatsForProvince(provinceName) {
        if (!provinceName) {
            selectedProvinceCitiesStats.value = null;
            return;
        }
        isLoadingStats.value = true;
        try {
            // --- 核心修改：不再请求API，而是请求静态JSON ---
            if (!window.allProvinceStats) { // 加一个缓存，只请求一次
                const response = await axios.get(`${process.env.BASE_URL}province_city_stats.json`);
                window.allProvinceStats = response.data;
            }
            // 从缓存的数据中，直接查找对应省份的数据
            selectedProvinceCitiesStats.value = window.allProvinceStats[provinceName] || [];
        } catch (error) {
            console.error("获取城市统计数据失败:", error);
            selectedProvinceCitiesStats.value = null;
        } finally {
            isLoadingStats.value = false;
        }
    }

    return {
        provinces, cityLayerVisible, selectedFeature, mapStats,
        selectedProvinceCitiesStats, isLoadingStats, selectedFeatureProperties,
        provinceLayerVisible,
        initializeProvinces, toggleCityLayerVisibility,
        setSelectedFeature, updateMapStats, fetchCityStatsForProvince
    };
});