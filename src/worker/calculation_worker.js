// 这是一个在后台线程运行的文件
// 引入 turf.js 库
import * as turf from '@turf/turf';

// 监听从主线程发来的消息
self.onmessage = function (event) {
    console.log('Worker: 接收到主线程的数据，开始后台计算...');

    // 从事件中解构出我们需要的原始数据
    const { provinceGeoJSON, cityGeoJSON } = event.data;

    // --- 这里的计算逻辑和我们之前在Action里写的一模一样 ---
    if (!provinceGeoJSON || !cityGeoJSON) {
        // 如果数据有问题，可以发一个错误消息回去，或者直接返回
        self.postMessage({ error: '数据不完整' });
        return;
    }

    const provinceFeatures = provinceGeoJSON.features;
    const cityFeatures = cityGeoJSON.features;
    const totalCities = cityFeatures.length;

    if (totalCities === 0) {
        self.postMessage({ labels: [], data: [] }); // 发送空结果回去
        return;
    }

    const stats = {};
    provinceFeatures.forEach(province => {
        const provinceName = province.properties.name_1;
        if (provinceName) stats[provinceName] = 0;
    });

    cityFeatures.forEach(cityPolygonFeature => {
        if (cityPolygonFeature && cityPolygonFeature.geometry) {
            const cityCentroid = turf.centroid(cityPolygonFeature);
            for (const provincePolygon of provinceFeatures) {
                if (provincePolygon.geometry && turf.booleanPointInPolygon(cityCentroid, provincePolygon.geometry)) {
                    const provinceName = provincePolygon.properties.name_1;
                    if (provinceName) stats[provinceName]++;
                    break;
                }
            }
        }
    });

    const labels = [];
    const data = [];
    for (const provinceName in stats) {
        labels.push(provinceName);
        const percentage = (stats[provinceName] / totalCities) * 100;
        data.push(percentage.toFixed(2));
    }

    console.log('Worker: 计算完成，正在将结果发回主线程...');
    // 【核心】当计算完成后，通过 postMessage 将最终结果发回主线程
    self.postMessage({ labels, data });
};