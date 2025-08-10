<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';

const props = defineProps({
    viewer: { type: Object, required: true }
});

const emit = defineEmits(['clearTrackedEntity']);

const aircraftEntity = ref(null);

onMounted(() => {
    if (props.viewer) {
        console.log("FlightAnimation: Viewer已通过prop传入，开始创建动态轨迹...");
        createDynamicFlight(props.viewer);
    }
});

async function createDynamicFlight(viewerInstance) {
    try {
        const positionProperty = new Cesium.SampledPositionProperty();
        const startTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(2025, 7, 9, 16, 0, 0)));
        const stopTime = Cesium.JulianDate.addSeconds(startTime, 3600, new Cesium.JulianDate());

        positionProperty.addSample(startTime, Cesium.Cartesian3.fromDegrees(116.39, 39.91, 5000.0));
        const xianTime = Cesium.JulianDate.addSeconds(startTime, 1800, new Cesium.JulianDate());
        positionProperty.addSample(xianTime, Cesium.Cartesian3.fromDegrees(108.95, 34.26, 5000.0));
        positionProperty.addSample(stopTime, Cesium.Cartesian3.fromDegrees(121.47, 31.23, 5000.0));

        const modelUrl = `${process.env.BASE_URL}models/CesiumAir/Cesium_Air.glb`;

        aircraftEntity.value = viewerInstance.entities.add({
            id: 'dynamic-aircraft',
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: startTime, stop: stopTime })]),
            position: positionProperty,
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            model: { uri: modelUrl, minimumPixelSize: 128 },
            path: {
                resolution: 1,
                trailTime: 1800,
                leadTime: 0,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.AQUAMARINE,
                    taperPower: 0.5
                }),
                width: 15
            },
        });

        viewerInstance.clock.startTime = startTime.clone();
        viewerInstance.clock.stopTime = stopTime.clone();
        viewerInstance.clock.currentTime = startTime.clone();
        viewerInstance.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewerInstance.timeline.zoomTo(startTime, stopTime);
        viewerInstance.trackedEntity = aircraftEntity.value;

        console.log("动态飞机实体已创建！");
    } catch (error) {
        console.error("创建动态轨迹时发生错误：", error);
    }
    onUnmounted(() => {
        if (props.viewer && aircraftEntity.value) {
            props.viewer.entities.remove(aircraftEntity.value);
            // 通过事件通知父组件清除跟踪实体，避免直接修改prop
            emit('clearTrackedEntity');
        }
        console.log("FlightAnimation: 已清理并销毁。");
    });
    console.log("FlightAnimation: 已清理并销毁。");
}
</script>