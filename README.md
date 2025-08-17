<img width="2559" height="1340" alt="image" src="https://github.com/user-attachments/assets/b33fc1f7-a1bd-4cd2-ae83-8dbc140de19b" /># 城市探索者 - 二三维一体化 WebGIS 数据可视化平台

**[在线演示 (GitHub Pages)](https://tiamo1029.github.io/City_Explorer/)**

---

## 📖 项目概述

“城市探索者”是我独立设计并开发的一款对标主流互联网地图应用的、**从后端服务发布到前端交互可视化的全链路、高性能单页面WebGIS应用(SPA)**。本项目旨在全面实践并深度融合现代Web开发技术栈与专业的GIS处理流程，最终实现了一个功能丰富、交互流畅、可同时进行二三维场景探索的综合性可视化平台。

这个项目不仅是我个人技术能力的全面展示，更体现了我对**数据驱动、组件化架构和高性能可视化**等工程化思想的深刻理解与实践。

## ✨ 核心功能与亮点

*   **二三维场景无缝切换:** 用户可在**2D地图页**和**3D地球页**之间自由切换，体验不同维度的地理空间数据。
*   **多源异构数据显示:**
    *   **2D模式:** 高性能加载**省份(GeoJSON)**和**城市(矢量瓦片)**两级矢量数据，实现了清晰的行政区划展示。
    *   **3D模式:** 集成**全球高精度地形**与**3D Tiles建筑模型**，并加载了由后端API驱动的**立体化城市面**和**动态飞行轨迹(CZML)**，构建了生机勃勃的数字地球。
*   **丰富的交互体验:**
    *   **2D:** 实现了省份要素的**点击查询、悬浮/选中高亮**；城市矢量瓦片的点击弹窗，交互逻辑清晰，响应迅速。
    *   **3D:** 支持点击实体查询，并实现了相机**自动飞行聚焦**，提供了“身临其境”的探索体验。
*   **动态数据可视化仪表盘 (Dashboard):**
    *   **智能双模式图表:** 默认以**仪表盘**形式，实时统计2D地图视野内的城市数量；当用户点击某个省份后，图表会**智能切换**为**饼图**，动态请求并展示该省内部TOP10城市的面积占比分析。
*   **专业的UI/UX设计:** 所有UI面板（图层控制、属性详情、统计图表）均采用**抽屉式设计**，支持流畅的折叠与展开动画，在不影响地图视野的情况下提供了强大的功能。

## 🚀 技术栈深度解析

| 分类 | 技术 | 在项目中的应用 |
| :--- | :--- | :--- |
| **前端核心** | **Vue 3 (Composition API)** | 构建了整个应用的**组件化架构**，实现了逻辑的清晰解耦与高效复用。 |
| | **Vue Router** | 管理应用的**多页面路由**，实现了`首页`, `2D地图`, `3D地球`, `关于`等页面的无刷新跳转。 |
| | **Pinia** | 作为中央**状态管理器**，对图层可见性、选中要素、统计数据等全局状态进行集中、响应式管理。 |
| **GIS可视化** | **Mapbox GL JS (2D)** | 作为2D地图的**核心渲染引擎**，利用其WebGL性能优势，实现了数据驱动样式和`feature-state`高性能交互。 |
| | **Cesium.js (3D)** | 作为3D地球的**核心渲染引擎**，负责加载和渲染地形、3D Tiles、动态实体等复杂三维场景。 |
| **UI与图表** | **Element Plus / Vant UI** | 提供了专业、美观的UI组件库，极大提升了开发效率和界面专业度。 |
| | **ECharts** | 用于构建动态交互式的**数据可视化仪表盘**，将复杂的统计数据转化为直观的图表。 |
| **后端服务** | **Python / FastAPI** | (在【Geo-Engine】项目中)构建了**高性能、异步**的RESTful API，为前端提供空间分析服务。 |
| | **Node.js / Express** | (在本项目后端部分)为三维场景提供了**轻量级的数据接口服务**。 |
| **GIS服务**| **GeoServer** | 负责将PostGIS中的数据，发布成符合**OGC标准**的**WMS**和**矢量瓦片(Vector Tiles)**服务。 |
| **数据库** | **PostgreSQL / PostGIS** | 作为核心**空间数据库**，存储所有GIS数据，并利用其强大的**空间SQL函数**进行后端计算。 |
| **工程化** | **Git / npm / Vue CLI** | 进行项目**版本控制**、**依赖管理**和**自动化构建**。 |
| | **Docker** | (在【Geo-Engine】项目中)将后端应用**容器化**，实现了一键化、跨平台的快速部署。 |

## 📸 项目截图预览

<img width="2557" height="1340" alt="image" src="https://github.com/user-attachments/assets/4aa312bd-d1bc-40b8-a045-1b7892aa72bc" />
<img width="2559" height="1340" alt="image" src="https://github.com/user-attachments/assets/ad84acbe-6988-457e-aa1d-675487eae1d6" />
<img width="2559" height="1339" alt="image" src="https://github.com/user-attachments/assets/7115d131-3b31-4e12-b60d-89bbf40a218c" />
<img width="2558" height="1345" alt="image" src="https://github.com/user-attachments/assets/ef8e659d-d00d-46ed-b547-d322bf21df9f" />
<img width="2559" height="1346" alt="image" src="https://github.com/user-attachments/assets/fae0b9da-2433-432b-90c6-9ecf40e7f769" />
---
