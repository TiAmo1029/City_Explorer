# City_Explorer

**城市探索者 (City Explorer)**

这是一个功能完备的现代WebGIS数据可视化平台，旨在探索和展示城市空间数据。应用前端基于 Vue 3 全家桶进行构建，地图渲染引擎采用高性能的 Mapbox GL JS，并消费由 GeoServer 发布的标准化OGC服务。

**✨ 项目核心功能**

交互式地图： 基于Mapbox GL JS和MapTiler云端样式，提供流畅的地图浏览体验。
动态图层控制： 通过UI面板，可独立控制不同GIS图层的显示与隐藏。
要素查询与高亮： 支持点击地图上的地理要素（如省份），在信息面板中显示其详细属性，并实现动态高亮。
数据可视化图表： 集成 ECharts，将地理空间数据与统计图表进行联动分析。
响应式UI面板： 所有交互面板（图层控制、属性详情、图表）均支持流畅的抽屉式折叠/展开。

**🚀 技术栈**

前端: Vue 3 (Composition API), Vue Router, Pinia, Element Plus, Axios, Mapbox GL JS, ECharts
后端服务: GeoServer
数据库: PostgreSQL + PostGIS
数据标准: GeoJSON, WFS, WMS
