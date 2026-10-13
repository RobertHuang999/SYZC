# UI 移植追踪（现网 → SYZC 原型）

> **目标**：在 **不改动业务功能与逻辑** 的前提下，用 SYZC 技术栈（React + TS + Tailwind）重做 UI，**仅替换当前为 `PrototypeEmptyPage` 的入口**。  
> **行为真源优先级**：`11yuanma/wrl-agency-*` 现网交互与字段 > 已有 PRD 三件套（冲突须登记差异后再定稿）。  
> **验收**：占位路由变为 `implemented-routes` / H5 `customRoute`；核心链路可点通；标注挂载对应 PRD（有则挂，无则移植后补三件套）。  
> **布局**：移植 UI 时必须对齐 [`原型页面布局速查.md`](./原型页面布局速查.md) 与 `样式规范- PC端/`、`样式规范- H5端/`（[`AGENTS.md`](../AGENTS.md) 4.1.1）。

---

## 1. 移植边界（必须遵守）

| 允许 | 禁止 |
| :--- | :--- |
| 换 UI 组件、布局、间距、色板（对齐 SYZC 样式规范） | 改状态机、校验口径、按钮有无、接口字段语义 |
| Mock 数据贴近现网样例 | 删减行操作、筛选项、Tab、弹窗步骤 |
| 从 Vue/uni-app **读**逻辑，用 React **重写** | 把 Vue 工程嵌入或混跑 |
| 仅处理 **占位页** 对应菜单 | 重写已交付模块（预警、门禁、入库记录等已实现部分）除非显式开 refactor |

---

## 2. 单页移植工作流

```mermaid
flowchart LR
  A[权限菜单占位路径] --> B[定位 11yuanma 路由/页面]
  B --> C[核对 PRD 三件套或从现网反提]
  C --> D[React feature + Mock + 标注]
  D --> E[implemented-routes / customRoute]
  E --> F[本表勾选完成]
```

---

## 3. PC 占位菜单（75）

状态：`⬜ 待移植` · `🟡 进行中` · `✅ 已完成`（已实现模块不在此表重复）

| 状态 | 菜单路径 | 现网 admin 线索（待填视图路径） | PRD 基准版 |
| ✅ | /仓储/入库管理/入库记录 | warehousing.vue (store-records + store-apply) | 侧边栏唯一常驻菜单；页头分段器对齐现网切换「入库记录」归档与「入库申请」全流转（侧边栏已隐藏入库申请） |
| ⬜ | /仓储/出库管理/出库记录 | outboundLibrary / outboundApplyInfo | 10-出库管理-出库记录 |
| ⬜ | /仓储/移库管理/移库记录 | | 11-移库管理-移库记录 |
| ⬜ | /仓储/货物转让/转让记录 | | 12-货物转让-转让记录 |
| ⬜ | /仓储/仓单管理 | | 05-仓单管理 |
| ⬜ | /仓储/加工管理/加工记录 | | 14-加工管理 |
| ⬜ | /仓储/提货单 | | 15-提货单 |
| ⬜ | /仓储/货物异动/异动记录 | | 13-货物异动 |
| ⬜ | /仓储/货物盘点 | | 16-货物盘点 |
| ⬜ | /仓储/库存查询/存货管理 | | 01-存货管理 |
| ⬜ | /仓储/库存查询/理货堆放 | | 02-理货堆放 |
| ⬜ | /仓储/库存查询/库存明细 | | 03-库存明细 |
| ⬜ | /仓储/库存查询/库存流水 | | 04-库存流水 |
| ⬜ | /仓储/货权管理/货权档案 | | 06-货权档案 |
| ⬜ | /仓储/货权管理/货权公示 | | 07-货权公示 |
| ⬜ | /仓储/货权管理/证据管理 | | 08-证据管理 |
| ⬜ | /仓储/合同管理/仓储合同管理 | | 23-仓储合同 |
| ⬜ | /融资/监管/*（12 项） | financing 模块 | 03-融资监管 各子 PRD |
| ⬜ | /交易/*（4 项） | | 04-交易 |
| ⬜ | /结算/监管结算/*（2 项） | | |
| ⬜ | /统计/看板/*（6 项） | BI 大屏 | |
| ⬜ | /风控/风控中心/*（4 项） | | |
| ⬜ | /配置管理/货品规格管理/*（4 项） | | 6.3 迭代部分已有 |
| ⬜ | /配置管理/平台管理/*（5 项，不含基础配置） | | |
| ⬜ | /配置管理/门户/业务流程等 | | |
| ⬜ | /工作中心/数据一览/*（10 项） | | |
| ⬜ | /物联网IOT与预警/预警信息/贷中风控管理 | | 05-贷中风控（PC 刻意占位） |
| ⬜ | /用户中心/业务协同/存量业务单据协同 | | |

> 完整路径列表以脚本为准：`npx tsx -e "..."` 见 `B端PC` README 或本仓库维护脚本。

**PC 已实现（勿重复移植）**：工作中心审批中心、物联网/预警大部分、基础配置、仓库管理、合作方档案、开锁审批、入库记录列表/新增/详情等（见 `implemented-routes.ts`）。

---

## 4. 移动端占位（52，`customRoute` 未配置）

| 状态 | moduleId | 名称 | 现网 native 线索 | 备注 |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | ws-inbound-mgr / biz-init-inbound | 入库管理/发起 | pickings/warehousing-order | 与 PC 新增页校验/关联单/汇总栏一致 |
| ⬜ | ws-outbound-mgr / biz-init-outbound | 出库 | outbound 相关 pickings | 与 PC 出库成对 |
| ⬜ | ws-transfer-loc-mgr / biz-init-transfer-loc | 移库 | | |
| ⬜ | ws-transfer-owner-mgr / biz-init-transfer-owner | 转让 | | |
| ⬜ | ws-receipt-mgr / biz-init-receipt-issue | 仓单 | | |
| ⬜ | ws-processing-mgr / biz-init-processing-apply | 加工 | | |
| ⬜ | ws-delivery-order | 提货单 | | |
| ⬜ | ws-inventory-mgr | 存货管理 | | |
| ⬜ | ws-stock-detail / ws-tally-stacking | 库存/理货 | | |
| ⬜ | ws-cargo-movement / biz-init-movement-apply | 异动 | | |
| ⬜ | ws-stock-taking / biz-init-stock-taking-apply | 盘点 | | |
| ⬜ | ws-cargo-rights / ws-evidence-mgr | 货权/证据 | | |
| ⬜ | ws-device-iot / ws-device-gps | 物联/GPS | device 子包 | 设备 hub 已部分实现 |
| ⬜ | ws-pledge-order-mgr 等融资监管 | 多条 | supervision 包 | |
| ⬜ | biz-overview-* / biz-approve-* | 审批类 | | 部分与 PC 审批重复 |
| ⬜ | home-report / home-todos | 首页 | | |

**H5 已落地 `customRoute`**：仓库管理、新增仓库、设备/门禁、设备/押品预警、风险公示、我的申请、开锁审批、入库（13 项）。

---

## 5. 推荐移植批次（仓储作业链优先）

1. **批次 A**：出库 PC + 移动（出库管理/出库发起）— PRD 齐全，与入库对称。  
2. **批次 B**：移库、转让、提货单。  
3. **批次 C**：仓单、加工、盘点、异动。  
4. **批次 D**：库存查询四菜单 + 货权三菜单。  
5. **批次 E**：融资/监管/交易/看板/配置（体量大，按 PRD 版本排期）。

---

## 6. 完成定义（DoD）

- [ ] 菜单入口不再出现「占位页」空态（含 H5 `GenericModulePage`）。  
- [ ] 列表 / 详情 / 新增（若有）与现网按钮、校验、状态提示一致（Mock 可代替 API）。  
- [ ] `PrototypeDocument` 挂载 PRD/字段/规则；无 PRD 则移植后补三件套再挂。  
- [ ] 更新 `implemented-routes.ts` 或 `mobileMenuData.customRoute`。  
- [ ] 本表状态改为 ✅。

---

*维护：每完成一模块更新本表；现网路径列可随 `11yuanma` 检索补充。*
