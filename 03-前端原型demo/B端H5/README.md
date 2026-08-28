# SYZC B 端 H5 原型系统

森云科技·SYZC 供应链金融存货监管系统（移动机构端）前端原型工程。

---

## 🚀 1. 启动与运行

```bash
cd 03-前端原型demo/B端H5
npm install
npm run dev
```

- **本地访问地址**：[http://localhost:5182/](http://localhost:5182/)（或对应控制台提示端口）
- **构建打包验证**：`npm run build`

---

## 📚 2. 设计与交互规范体系

完整的移动端设计规范与交互反面案例对照文档位于：[`../样式规范- H5端/`](../样式规范-%20H5端/README.md)

1. [01-移动端整体架构与导航规范](../样式规范-%20H5端/01-移动端整体架构与导航规范.md)
2. [02-移动端列表页设计与交互规范](../样式规范-%20H5端/02-移动端列表页设计与交互规范.md)
3. [03-移动端详情页与时间线规范](../样式规范-%20H5端/03-移动端详情页与时间线规范.md)
4. [04-移动端表单与新增编辑规范](../样式规范-%20H5端/04-移动端表单与新增编辑规范.md)
5. [05-移动端色彩与视觉系统规范](../样式规范-%20H5端/05-移动端色彩与视觉系统规范.md)

---

## 🗺️ 3. 路由与功能全景架构

| 模块 | 路由 | 说明 |
| :--- | :--- | :--- |
| **首页** | `/m/home` / `/` | 核心盯市指标看板、在线视频监控、数据看板入口、待办事项单据卡片 |
| **工作台** | `/m/workspace` | 6大业务分类、5列等宽彩色应用网格（仓储16项/融资监管4项/交易3项/风控5项/结算3项/配置4项） |
| **业务办理** | `/m/tasks` | 待确认统计、内部审批（待处理/抄送我/已处理）、业务发起网格、客户需求审批（带红点角标）、其他审批 |
| **机构权限** | `/m/profile` | 登录人信息、授权管辖物理仓库清单、三维权限矩阵规则说明 |
| **开锁审批** | `/m/approval/unlock-applies` | 6.2 其他审批·挂锁开锁申请列表/审批 |
| **通用落地页** | `/m/module/:moduleId` | 38项子功能的高保真模拟 |
| **押品预警** | `/m/supervision/order-warnings` | 02/02 押品预警列表、批量公示、多维处置动作链 |
| **押品预警详情** | `/m/supervision/order-warnings/:id` | 订单穿透、物联与估值告警、补仓/平仓/处置流转 |
| **设备预警** | `/m/iot/device-warning-events` | 02/01 设备预警列表、抓拍回溯、严重等级过滤 |
| **设备预警详情** | `/m/iot/device-warning-events/:id` | 视频直播联动、规则参数与解除预警表单 |

---

## 🏗️ 4. 目录约定

```text
src/
├── components/
│   ├── common/        # IconRenderer 等通用工具组件
│   ├── layout/        # MobileShell(固定视口), BottomTabBar(常驻底栏), NavBar(动态回退)
│   └── ui/            # 原子 UI 控件
├── data/
│   └── mobileMenuData.ts # 移动端全量功能清单与权限字典元数据
├── features/          # 高保真模块
│   ├── collateral-warning-events/
│   ├── device-warning-events/
│   └── unlock-applies/              # 业务办理·其他审批·开锁审批
├── pages/             # HomePage, WorkspacePage, TasksManagementPage, ProfilePage, GenericModulePage
└── routes/            # 集中式路由配置文件
```
