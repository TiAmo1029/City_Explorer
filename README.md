<p align="center">
  <a href=<img width="1049" height="999" alt="image" src="https://github.com/user-attachments/assets/5859b5a5-5503-4c11-a7b3-e8d6f1e5f110" />
  </a>
</p>

<h1 align="center">城市探索者 (City Explorer)</h1>

<p align="center">
  <a href="https://github.com/TiAmo1029/City_Explorer/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TiAmo1029/City_Explorer?style=flat-square" alt="License"></a>
  <a href="https://github.com/TiAmo1029/City_Explorer/stargazers"><img src="https://img.shields.io/github/stars/TiAmo1029/City_Explorer?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/TiAmo1029/City_Explorer/network/members"><img src="https://img.shields.io/github/forks/TiAmo1029/City_Explorer?style=flat-square" alt="Forks"></a>
  <br>
  <b>二三维一体化的现代WebGIS数据可视化平台</b>
  <br><br>
  <a href="https://tiamo1029.github.io/City_Explorer/"><b>在线演示 (GitHub)</b></a>
  ·
  <a href="https://github.com/TiAmo1029/City_Explorer/issues">报告Bug</a>
  ·
  <a href="https://github.com/TiAmo1029/City_Explorer/issues">提出新特性</a>
</p>

## 📖 概述 (Overview)

**城市探索者 (City Explorer)** 是我独立设计并开发的一款对标主流互联网地图应用的、**从后端数据处理与服务发布，到前端交互可视化的全链路、高性能单页面WebGIS应用(SPA)**。本项目旨在全面实践并深度融合现代Web开发技术栈与专业的GIS处理流程，最终实现了一个功能丰富、交互流畅、可同时进行二三维场景探索的综合性可视化平台。

这个项目不仅是我个人技术能力的全面展示，更体现了我对**数据驱动、组件化架构、高性能可视化及动静分离部署**等工程化思想的深刻理解与实践。

## ✨ 核心特性 (Features)

*   :world_map: **二三维场景无缝切换**: 基于 **Vue Router** 实现，用户可在2D地图与3D地球之间自由切换。
*   :satellite: **多源异构数据显示**:
    *   **2D模式:** 高性能加载 **省份(GeoJSON)** 和 **城市(矢量瓦片)** 两级矢量数据。
    *   **3D模式:** 集成**全球高精度地形**与**3D Tiles建筑模型**，并加载了**立体化城市面**和**动态飞行轨迹**。
*   :computer_mouse: **丰富的交互体验**:
    *   **2D:** 省份要素的**点击查询、悬浮/选中高亮**；城市矢量瓦片的点击弹窗；**聚合/聚类**展示海量点数据。
    *   **3D:** 支持点击实体查询，并实现了相机**自动飞行聚焦**。
*   :chart_with_upwards_trend: **动态数据可视化仪表盘 (Dashboard):**
    *   **智能双模式图表:** 默认实时统计2D地图视野内的城市数量；当用户点击省份后，**智能切换**为该省内部TOP10城市的面积占比分析图。
*   :iphone: **专业的UI/UX设计:** 所有UI面板均采用**抽屉式设计**，支持流畅的折叠与展开。

## 🚀 技术栈深度解析 (Architecture & Tech Deep Dive)

| 分类 | 技术 | 在项目中的应用 |
| :--- | :--- | :--- |
| **前端核心** | **Vue 3 (Composition API)** | 构建了整个应用的**组件化架构**，实现了逻辑的清晰解耦与高效复用。 |
| | **Vue Router** | 管理应用的多页面路由，实现了`首页`, `2D地图`, `3D地球`, `关于`等页面的无刷新跳转。 |
| | **Pinia** | 作为中央**状态管理器**，对图层可见性、选中要素、统计数据等全局状态进行集中、响应式管理。 |
| **GIS可视化** | **Mapbox GL JS (2D)** | 作为2D地图的**核心渲染引擎**，利用其WebGL性能优势，实现了数据驱动样式和`feature-state`高性能交互。 |
| | **Cesium.js (3D)** | 作为3D地球的**核心渲染引擎**，负责加载和渲染地形、3D Tiles、动态实体等复杂三维场景。 |
| **UI与图表** | **Element Plus** | 提供了专业、美观的UI组件库，极大提升了开发效率和界面专业度。 |
| | **ECharts** | 用于构建动态交互式的**数据可视化仪表盘**，将复杂的统计数据转化为直观的图表。 |
| **后端服务** | **Python / FastAPI** | (在【Geo-Engine】项目中)构建了**高性能、异步**的RESTful API，为前端提供空间分析服务。 |
| | **Node.js / Express** | (在本项目后端部分)为三维场景提供了**轻量级的数据接口服务**。 |
| **GIS服务**| **GeoServer** | 负责将PostGIS中的数据，发布成符合**OGC标准**的**WMS**和**矢量瓦片(Vector Tiles)**服务。 |
| **数据库** | **PostgreSQL / PostGIS** | 作为核心**空间数据库**，存储所有GIS数据，并利用其强大的**空间SQL函数**进行后端计算。 |
| **工程化** | **Git / npm / Vue CLI** | 进行项目**版本控制**、**依赖管理**和**自动化构建**。 |
| | **Docker** | (在【Geo-Engine】项目中)将后端应用**容器化**，实现了一键化、跨平台的快速部署。 |

## 🤔 我的思考与成长 (My Reflection & Growth)

这个项目对我而言，远不止是技术的堆砌，更是一次**从“学生思维”到“工程师思维”**的深刻蜕变。

*   **关于“取舍”:** 在城市图层的渲染上，我最初尝试用WFS加载全量GeoJSON，但很快遇到了性能瓶颈。最终，我选择了**矢量瓦片**方案。这个过程让我深刻理解了，**优秀的工程，是在“理想功能”与“现实性能”之间，做出最明智的权衡与取舍。**
*   **关于“成长”:** 从最初对Vue生命周期的困惑，到最终能独立设计出“智能双模式”的联动图表；从对`git`命令的恐惧，到最终能从容地处理合并冲突并自动化部署。**每一个被解决的bug，都成为了我能力体系中最坚固的一块基石。**

## 🔧 如何在本地运行

1.  **克隆本仓库:**
    ```bash
    git clone https://github.com/TiAmo1029/City_Explorer.git
    cd City_Explorer
    ```

2.  **安装依赖:**
    ```bash
    npm install
    ```

3.  **启动开发服务器:**
    ```bash
    npm run serve
    ```

4.  在浏览器中打开 `http://localhost:8080` (或终端提示的地址)。

## 📸 项目截图预览

<img width="2558" height="1344" alt="image" src="https://github.com/user-attachments/assets/a1832e39-1410-4dba-8965-59bfe04d53c7" />
<img width="2559" height="1339" alt="image" src="https://github.com/user-attachments/assets/d82f9f2f-484e-426f-a968-3eddae28c94b" />
<img width="2559" height="1344" alt="image" src="https://github.com/user-attachments/assets/6c2ef520-63fc-4c17-b724-7b16b03ba015" />
<img width="2559" height="1340" alt="image" src="https://github.com/user-attachments/assets/6f13aa6b-3694-4807-bddc-61ee43bbd443" />
<img width="2559" height="1346" alt="image" src="https://github.com/user-attachments/assets/aadf6efe-2abe-42ae-b738-25e5394a433e" />
<img width="2559" height="1340" alt="image" src="https://github.com/user-attachments/assets/ad84acbe-6988-457e-aa1d-675487eae1d6" />
<img width="2559" height="1339" alt="image" src="https://github.com/user-attachments/assets/7115d131-3b31-4e12-b60d-89bbf40a218c" />
<img width="2558" height="1345" alt="image" src="https://github.com/user-attachments/assets/ef8e659d-d00d-46ed-b547-d322bf21df9f" />
<img width="2559" height="1346" alt="image" src="https://github.com/user-attachments/assets/fae0b9da-2433-432b-90c6-9ecf40e7f769" />

---

*作者：秦亚会*
