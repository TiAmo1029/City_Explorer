import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMapStore = defineStore('MapStore', () => {
    // --- STATE ---
    // 只管理省份数据和图层的可见性状态
    const provinces = ref([]);
    const provinceGeoJSON = ref(null); // 保留它，可能未来有其他客户端分析需要
    const selectedFeatureId = ref(null);
    const provinceLayerVisible = ref(true);
    const cityLayerVisible = ref(false); // 城市图层的总开关


    // --- GETTERS ---
    const selectedProvince = computed(() => {
        if (selectedFeatureId.value === null) return null;
        return provinces.value.find(l => l.id === selectedFeatureId.value)?.feature || null;
    });

    const selectedFeatureProperties = computed(() => {
        return selectedProvince.value ? selectedProvince.value.properties : null;
    });


    // --- ACTIONS ---
    function initializeProvinces(initialData, rawGeoJSON) {
        provinces.value = initialData;
        provinceGeoJSON.value = rawGeoJSON;
    }

    function setLayerVisibility(layerName, isVisible) {
        if (layerName === 'provinces') {
            provinceLayerVisible.value = isVisible;
        } else if (layerName === 'cities') {
            cityLayerVisible.value = isVisible;
        }
    }

    function toggleProvinceVisibility(provinceId) {
        const targetProvince = provinces.value.find(province => province.id === provinceId);
        if (targetProvince) {
            targetProvince.visible = !targetProvince.visible;
        }
    }

    function setSelectedFeatureId(featureId) {
        selectedFeatureId.value = featureId;
    }

    // --- RETURN ---
    // 只暴露组件需要用到的状态和方法
    return {
        // State
        provinces,
        selectedFeatureId,
        provinceLayerVisible,
        cityLayerVisible,

        // Getters
        selectedProvince,
        selectedFeatureProperties,

        // Actions
        initializeProvinces,
        setSelectedFeatureId,
        setLayerVisibility,
        toggleProvinceVisibility
    };
});
