<template>
    <div class="map-page-container">
        <!-- 1. 新增：分析工具UI面板 -->
        <div class="analysis-tools">
            <el-button @click="toggleLineOfSight" :type="isLosAnalysisActive ? 'success' : 'primary'">
                {{ isLosAnalysisActive ? '分析中 (点击结束)' : '开始视线分析' }}
            </el-button>
        </div>
        <div id="cesiumContainer" ref="cesiumContainer"></div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css'; // 我们仍然需要导入CSS

// --- 核心修改：定义一个全局变量，告诉Cesium去哪里找它的静态资源 ---
// 这个路径，对应的是我们devServer的根目录
window.CESIUM_BASE_URL = 'cesium/';

const cesiumContainer = ref(null);
let viewer = null;

// --- 2. 视线分析所需的状态变量 ---
const isLosAnalysisActive = ref(false);
let losStartPoint = null;
const losEntities = []; // 用于存储所有分析过程中创建的实体，方便清除
let sceneHandler = null; // 将事件处理器设为全局，方便管理



onMounted(async () => { // 1. 将onMounted改为异步函数
    if (!cesiumContainer.value) return;

    // --- 2. 设置你的Ion Token ---
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZGYzMWM3Ny1jZDhhLTQ2ZDktYTAzYi00ZTgyZGYxNzkzOTkiLCJpZCI6MzI5Nzk5LCJpYXQiOjE3NTQ1ODA1NDJ9.DB8BghGI977awRcqhMPn8B73YNmRtagq4wVTJKM-F2k';

    // 3. 创建Viewer实例
    viewer = new Cesium.Viewer(cesiumContainer.value, {
        // 在初始化时，就可以直接指定影像和地形
        imageryProvider: undefined,
        terrainProvider: undefined,
        animation: true,
        timeline: true,
        geocoder: true,
        homeButton: true,
        sceneModePicker: true,
        baseLayerPicker: true,
        navigationHelpButton: true,
        shadows: false,
        shouldAnimate: true,
    });

    // 启动后续所有异步加载和设置流程
    setupMapLayersAndInteractions();
});


// --- 2. 封装所有异步加载和交互设置 ---
async function setupMapLayersAndInteractions() {
    if (!viewer) return;

    try {
        // --- a. 并发加载基础场景 ---
        console.log("开始加载基础场景（影像，地形，建筑）...");
        const [imageryProvider, terrainProvider, osmBuildings] = await Promise.all([
            Cesium.IonImageryProvider.fromAssetId(3), // Bing Maps Aerial
            Cesium.createWorldTerrainAsync(),
            Cesium.createOsmBuildingsAsync()
        ]);

        viewer.imageryProvider = imageryProvider;
        viewer.terrainProvider = terrainProvider;
        viewer.scene.primitives.add(osmBuildings);
        viewer.scene.globe.depthTestAgainstTerrain = true;
        console.log("基础场景加载成功！");

        try {
            console.log("正在创建动态飞行轨迹...");
            // --- 1. 创建一个“航班时刻表”（SampledPositionProprety） ---
            const positionProperty = new Cesium.SampledPositionProperty();

            // a. 定义我们的飞行路径的关键帧（时间 + 位置）
            const startTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(2025, 7, 9, 16, 0, 0)));
            const stopTime = Cesium.JulianDate.addSeconds(startTime, 3600, new Cesium.JulianDate());

            // b. 为“时刻表”添加数据点
            // 第一个点：北京
            const beijingPosition = Cesium.Cartesian3.fromDegrees(116.39, 39.91, 5000.0);
            positionProperty.addSample(startTime, beijingPosition);

            // 第二个点：经过西安上空
            const xianTime = Cesium.JulianDate.addSeconds(startTime, 1800, new Cesium.JulianDate());
            const xianPosition = Cesium.Cartesian3.fromDegrees(108.95, 34.26, 5000.0);
            positionProperty.addSample(xianTime, xianPosition);

            // 第三个点：经过上海上空
            const shanghaiPosition = Cesium.Cartesian3.fromDegrees(121.47, 31.23, 5000.0);
            positionProperty.addSample(stopTime, shanghaiPosition);

            // --- 2. 创建我们的飞机模型实体 ---
            const modelUrl = `${process.env.BASE_URL}models/CesiumAir/Cesium_Air.glb`;
            const aircraftEntity = viewer.entities.add({
                availability: new Cesium.TimeIntervalCollection([
                    new Cesium.TimeInterval({
                        start: startTime,
                        stop: stopTime,
                    }),
                ]),

                // a. 将位置属性，设置为我们创建的“时刻表”！
                position: positionProperty,

                // b. 让模型的朝向，自动地沿着轨迹方向
                orientation: new Cesium.VelocityOrientationProperty(positionProperty),

                model: {
                    uri: modelUrl,
                    minimumPixelSize: 128,
                    // --- 推荐的“酷炫皮肤包” ---

                    // color: Cesium.Color.WHITE.withAlpha(0.8),
                    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,

                    // 1. 轮廓光
                    //    我们将用它来让飞机在深色的地形和太空中都清晰可见
                    silhouetteColor: Cesium.Color.fromCssColorString('#00BFFF'), // 科技蓝
                    silhouetteSize: 2.0, // 稍微细一点，更精致
                    color: Cesium.Color.LEMONCHIFFON,
                    // 3. 阴影
                    shadows: Cesium.ShadowMode.ENABLED,
                },

                // c. 为飞机添加轨迹线
                path: new Cesium.PathGraphics({
                    resolution: 1,
                    // 1. 设置尾迹时间为1800秒（30分钟）
                    //    这意味着飞机会拖着一条代表过去30分钟轨迹的尾巴
                    trailTime: 20,
                    // 2. 设置领先时间为0，让飞机前方的路径不可见
                    leadTime: 0,

                    // 3.升级材质，让尾迹有“淡出”效果
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.2, // 让光晕更明显一点
                        color: Cesium.Color.AQUAMARINE, // 换成科技蓝绿色，更酷炫

                        // taperPower: 1.0 意味着尾迹从头到尾一样粗
                        // taperPower < 1.0 意味着尾迹会从粗变细，产生“消散”感
                        taperPower: 0.5
                    }),
                    width: 15
                }),
            });

            // --- 3. 设置时钟和追踪 ---
            viewer.clock.startTime = startTime.clone();
            viewer.clock.stopTime = stopTime.clone();
            viewer.clock.currentTime = startTime.clone();
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 循环播放
            viewer.timeline.zoomTo(startTime, stopTime);
            viewer.trackedEntity = aircraftEntity; // 让相机自动跟随飞机


            console.log("动态飞机实体已创建！动画即将开始。");
        } catch (error) {
            console.error("创建动态轨迹时发生错误：", error);
        }

        /*
        // --- 2. 加载我们的静态3D模型 ---
        console.log("正在加载自定义3D模型...");

        // a. 定义模型的URL，它指向我们public文件夹里的文件
        const modelUrl = `${process.env.BASE_URL}models/CesiumAir/Cesium_Air.glb`;

        // b. 定义模型的位置和姿态 (我们把它放在北京天安门上空)
        const position = Cesium.Cartesian3.fromDegrees(116.397, 39.908, 5000.0); // 经度, 纬度, 高度(米)
        const heading = Cesium.Math.toRadians(0); // 朝向正北
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        // c. 使用 viewer.entities.add() 创建模型实体
        const aircraftEntity = viewer.entities.add({
            name: "My Custom Aircraft",
            position: position,
            orientation: orientation,
            model: {
                uri: modelUrl,
                minimumPixelSize: 128, // 保证在缩小时也能看见
            },
        });

        console.log("自定义3D模型已成功添加！");

        // --- 3. 将相机聚焦到我们新添加的模型上 ---
        viewer.trackedEntity = aircraftEntity;
        */

        // --- 2. 定义我们的3D样式规则 ---
        //     这是一个基于3D Tiles Styling language的JSON对象
        const buildingStyle = new Cesium.Cesium3DTileStyle({
            // a. 定义颜色规则
            color: {
                // b. 这是一个条件表达式
                //    格式：["condition", "value_if_true", "value_if_false"]
                conditions: [
                    ["${feature['cesium#estimatedHeight']} >= 100", "color('red')"],
                    ["${feature['cesium#estimatedHeight']} >= 50", "color('orange')"],
                    ["${feature['cesium#estimatedHeight']} >= 20", "color('yellow')"],
                    ["true", "color('white', 0.8)"]
                ]
            },
            // c. 定义显示/隐藏规则
            // show: "${feature['cesium#estimatedHeight']} >= 5" 
        });


        // --- 3. 将样式应用到我们的3D Tileset上 --- 
        osmBuildings.style = buildingStyle;
        console.log("已为建筑应用数据驱动的3D样式！");



        // --- b. 加载我们自己的后端城市面数据 ---
        console.log("开始加载自定义城市面数据...");
        const ourApiUrl = `${process.env.BASE_URL}cities.json`;
        const cityDataSource = await Cesium.GeoJsonDataSource.load(ourApiUrl, {
            stroke: Cesium.Color.fromCssColorString('#FFD700').withAlpha(0.8),
            strokeWidth: 2,
            fill: Cesium.Color.fromCssColorString('#FFD700').withAlpha(0.2)
        });
        await viewer.dataSources.add(cityDataSource);
        console.log("自定义城市面数据加载成功！");

        // --- c. 对我们自己的数据，进行遍历和样式增强 ---
        const entities = cityDataSource.entities.values;
        for (const entity of entities) {
            if (entity.polygon) {
                entity.polygon.material = Cesium.Color.ORANGE.withAlpha(0.5);
                entity.polygon.extrudedHeight = 20000.0;
            }
            // !!! 确保你的后端API返回的properties里有city_name这个字段 !!!
            entity.description = `<h2>${entity.properties.city_name?.getValue()}</h2><p>这是一个从我们自己后端加载的城市面！</p>`;
        }

        // --- d. 在所有数据都准备好后，再设置交互 ---
        setupInteractions();


        /*
        // --- e. 最后，将相机飞到最佳视野 ---
        // 我们选择聚焦到我们自己的数据上，而不是一个固定的点
        await viewer.camera.flyTo({
            // 目的地(destination)：相机的最终位置
            // 我们使用经度、纬度、高度来定义
            destination: Cesium.Cartesian3.fromDegrees(
                108.0,  // 经度：中国的中心位置偏西一点
                19.0,   // 纬度：中国的中心位置偏北一点
                7600000.0 // 高度：6000公里，这个高度能看全中国
            ),

            // 姿态(orientation)：相机的朝向
            orientation: {
                // heading: 从正北方向顺时针旋转的角度
                heading: Cesium.Math.toRadians(0.0), // 指向正北

                // pitch: 俯仰角。-90度是垂直向下，0度是平视
                // 我们给一个-45度，让相机有一个倾斜的、充满纵深感的视角
                pitch: Cesium.Math.toRadians(-80.0),

                // roll: 翻滚角，通常保持为0
                roll: 0.0
            },

            // 飞行持续时间（秒）
            duration: 4 // 让飞行过程更平滑
        });
        console.log("已启动相机飞行，飞向预设的中国区最佳视角。");
        */

        // --- 1. 手动创建一个“北京”的点实体 ---
        viewer.entities.add({
            id: 'beijing-poi', // 给实体一个唯一的ID，方便以后查找
            name: '中华人民共和国首都',
            // a. 定义位置：使用经纬高坐标
            position: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 100), // 100米高度

            // b. 定义外观：一个红色的、10像素大小的圆点
            point: new Cesium.PointGraphics({
                color: Cesium.Color.RED,
                pixelSize: 10,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            }),

            // c. 定义标签
            label: new Cesium.LabelGraphics({
                text: '北京',
                font: '16pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -12) // 向上偏移12像素
            })
        });

        // --- 2. 手动创建一条从北京到上海的线实体 ---
        viewer.entities.add({
            id: 'bj-sh-line',
            name: '京沪线',
            polyline: new Cesium.PolylineGraphics({
                // a. 定义线的顶点坐标（经度, 纬度, 高度, 经度, 纬度, 高度, ...）
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    116.39, 39.91, 20000, // 北京，20km高空
                    121.47, 31.23, 20000  // 上海，20km高空
                ]),

                // b. 定义线的样式
                width: 3,
                material: Cesium.Color.CYAN, // 线的颜色

                // c. (可选) 让线贴着地球曲面
                clampToGround: true
            })
        });

        console.log("手动创建的京沪线实体已添加！");

    } catch (error) {
        console.error("在设置地图图层和交互时发生错误: ", error);
    }
}

// --- 3. 激活/关闭分析模式的函数 ---
function toggleLineOfSight() {
    isLosAnalysisActive.value = !isLosAnalysisActive.value;

    if (isLosAnalysisActive.value) {
        console.log("视线分析模式已激活。请在地球上点击选择起点。");
        // (交互逻辑由setupInteractions处理)
    } else {
        console.log("视线分析模式已关闭。");
        clearLosAnalysis();
    }
}

// --- 4. 清除分析结果的函数 ---
function clearLosAnalysis() {
    losEntities.forEach(entity => viewer.entities.remove(entity));
    losEntities.length = 0;
    losStartPoint = null;
}

// --- 5. 执行分析的核心函数 ---
function performLineOfSightAnalysis(endPoint) {
    if (!losStartPoint || !endPoint) return;

    const direction = Cesium.Cartesian3.normalize(
        Cesium.Cartesian3.subtract(endPoint, losStartPoint, new Cesium.Cartesian3()),
        new Cesium.Cartesian3()
    );
    const ray = new Cesium.Ray(losStartPoint, direction);

    // 使用 scene.pickFromRay，它可以返回被遮挡物的信息
    const intersection = viewer.scene.pickFromRay(ray, []);

    const distanceToTarget = Cesium.Cartesian3.distance(losStartPoint, endPoint);
    let color = Cesium.Color.GREEN;

    // 检查是否有交点，并且交点距离小于目标点距离
    if (Cesium.defined(intersection) && Cesium.Cartesian3.distance(losStartPoint, intersection.position) < distanceToTarget) {
        color = Cesium.Color.RED;
        // (可选) 在遮挡点创建一个标记
        const obstructionMarker = viewer.entities.add({
            position: intersection.position,
            point: { color: Cesium.Color.YELLOW, pixelSize: 8, outlineWidth: 2, outlineColor: Cesium.Color.BLACK }
        });
        losEntities.push(obstructionMarker);
    }

    const line = viewer.entities.add({
        polyline: { positions: [losStartPoint, endPoint], width: 3, material: color, clampToGround: false }
    });
    losEntities.push(line);
}

// --- 6. 统一的交互处理函数 ---
function setupInteractions() {
    if (!viewer) return;
    sceneHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    sceneHandler.setInputAction((clickEvent) => {
        // a. 如果当前正处于视线分析模式
        if (isLosAnalysisActive.value) {
            handleLosClick(clickEvent);
        } else {
            handleFeaturePick(clickEvent)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 新的、专门处理视线分析点击的函数
function handleLosClick(clickEvent) {
    const cartesian = viewer.scene.pickPosition(clickEvent.position);
    if (!Cesium.defined(cartesian)) return;

    if (!losStartPoint) {
        // 设置起点
        clearLosAnalysis();
        losStartPoint = cartesian;
        const startMarker = viewer.entities.add({
            // a. 位置：就是我们刚刚点击拾取到的那个三维空间坐标
            position: cartesian,

            // b. 名字和描述 (可选，但推荐，方便调试)
            name: '视线分析起点',
            description: '这是视线分析的起点。',

            // c. (核心) 外观：定义它应该被画成一个“点”
            point: {
                // i. 颜色：我们使用Cesium预设的颜色常量
                color: Cesium.Color.LIME,

                // ii. 大小（像素）
                pixelSize: 10,

                // iii. (可选) 添加一个白色的轮廓，让点更清晰
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            }
        });
        losEntities.push(startMarker);
    } else {
        // 设置终点并执行分析
        const endPoint = cartesian;
        const endMarker = viewer.entities.add({
            // a. 位置：就是第二次点击拾取到的坐标
            position: cartesian, // 或者 endPoint 变量

            // b. 名字和描述
            name: '视线分析终点',
            description: '这是视线分析的终点。',

            // c. 外观：定义它是一个点
            point: {
                // i. 颜色：换成红色
                color: Cesium.Color.RED,

                // ii. 大小
                pixelSize: 10,

                // iii. 轮廓
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            }
        });
        losEntities.push(endMarker);
        performLineOfSightAnalysis(endPoint);
        losStartPoint = null; // 重置，准备下一次
    }
}

function handleFeaturePick(clickEvent) {

    // 1. 使用 viewer.scene.pick() 拾取点击位置的对象
    const pickedObject = viewer.scene.pick(clickEvent.position);

    // 2. 检查拾取结果是否存在
    if (!Cesium.defined(pickedObject)) {
        console.log("点击到了空白处。");
        return; // 点击到空白处，直接返回
    }
    // --- 3. (核心) 判断拾取到的对象类型，并执行不同逻辑 ---
    // a. 如果点到的是一个Entity (我们手动创建的点、线、或者GeoJSON加载的面)
    if (pickedObject.id instanceof Cesium.Entity) {
        const entity = pickedObject.id;
        console.log(`拾取到实体(Entity): ${entity.name || entity.id}`);

        // 让Cesium的默认选中行为生效（绿色框 + InfoBox）
        viewer.selectedEntity = entity;
        // (可选) 如果你想，你依然可以手动控制相机
        viewer.flyTo(entity);
        return; // 处理完毕，返回
    }

    // b. 如果点到的是一个3D Tileset的Feature (我们的OSM建筑)
    if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
        const feature = pickedObject;
        console.log("拾取到3D建筑要素！");

        // 打印所有属性到控制台
        const propertyIds = feature.getPropertyIds();
        console.log("--- 属性详情 ---");
        const properties = {};
        propertyIds.forEach(id => {
            const value = feature.getProperty(id);
            properties[id] = value;
            console.log(`${id}:`, value);
        });

        // 手动更新InfoBox的内容，让它也能显示3D Tile的属性
        viewer.selectedEntity = new Cesium.Entity({
            name: `建筑 (ID: ${feature.featureId})`,
            description: createDescriptionHtml(properties)
        });
        return; // 处理完毕，返回
    }
}

function createDescriptionHtml(properties) {
    let html = '<table class="cesium-infoBox-defaultTable"><tbody>';
    for (const key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            const value = properties[key];
            html += `<tr><th>${key}</th><td>${value}</td></tr>`;
        }
    }
    html += '</tbody></table>';
    return html;
}


onUnmounted(() => {
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }

    if (sceneHandler) sceneHandler.destroy(); // 销毁事件处理器
});

</script>

<style scoped>
.map-page-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#cesiumContainer {
    width: 100%;
    height: 100%;
}

.analysis-tools {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
}
</style>