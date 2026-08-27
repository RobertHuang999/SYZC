# SYZC 前端原型

本目录包含 **B 端 PC** 与 **B 端 H5** 两套独立 Vite 工程，分别存放在子文件夹中。

## B 端 PC（后台管理）

```bash
cd B端PC
npm install
npm run dev
```

- 端口：5173（默认）
- 路径：`B端PC/src/features/`
- 布局：Sidebar + 宽表

详见 [B端PC/README.md](./B端PC/README.md)

## B 端 H5（项目监管 App）

```bash
cd B端H5
npm install
npm run dev
```

- 端口：**5174**
- 路径：`B端H5/src/features/`
- 布局：NavBar + 卡片列表 + 筛选抽屉

详见 [B端H5/README.md](./B端H5/README.md)

## 模块对照

| PRD 模块 | PC feature | H5 feature |
| :--- | :--- | :--- |
| 02/02 押品预警信息 | `collateral-warning-events` | `collateral-warning-events` |
| 02/01 设备预警信息 | `device-warning-events` | `device-warning-events` |

规格文档见 `02-PRD文档/B-迭代需求/6.2版本（2026.08）/02-预警信息/` 下各模块的 `*_Demo_移动端.md`。
