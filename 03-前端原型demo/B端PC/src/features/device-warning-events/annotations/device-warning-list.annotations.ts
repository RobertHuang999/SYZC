import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-page",
    targetId: "device-warning-page",
    number: 1,
    kind: "页面",
    title: "页面定位与处理闭环",
    content: "这是设备侧事件流水的只读列表，核心任务是筛选、查看单条事件事实并进入解除处置；厂商预过滤回调后逐条独立落账（一事件一条记录）。",
    documentRefs: {
      fields: {
        section: "一、基础识别与列表业务字段",
        match: "预警状态",
        element: "row",
      },
      prd: {
        section: "3.1 写入机制与生命周期",
        match: "逐条独立落账",
        element: "text",
      },
      rules: {
        section: "一、能力定位",
        match: "逐条独立落账",
        element: "text",
      },
    },
    details: [
      {
        title: "物联穿透与判定流程",
        items: [
          {
            label: "逐条落账与穿透流转图",
            content: `flowchart TD
    V["设备厂商预过滤回调"] --> R["03/02 规则匹配 + Version 快照"]
    R --> L["02/01 逐条写入 iot_event_ledger (R01)"]
    L --> D{"sync_to_order_warn=是 且在押订单 R12"}
    D -->|否| N["仅保留设备流水"]
    D -->|是| Y["生成 warn_source=IOT_PENETRATION R13"]
    Y --> M["订单级摘要通知 R15~R16"]
    M --> F["6.2 fuse_status=NONE"]`,
          },
          {
            label: "数据来源",
            content:
              "流水来自设备厂商预过滤回调与设备主数据事件流，每条回调独立写入 iot_event_ledger；页面不提供新增或编辑。",
          },
          {
            label: "用户目标",
            content:
              "监管人员按类型、等级、状态、仓库和预警时间定位单条事件，再进入详情或人工/批量解除。",
          },
          {
            label: "状态边界",
            content:
              "用户可见状态为待处置、已作废、已结案；不存在频次聚合或 timeline 内部态。",
          },
        ],
      },
      {
        title: "上下游与路由",
        items: [
          {
            label: "上游",
            content:
              "设备预警配置提供触发时规则快照（含 Version），预警等级提供等级字典快照，设备与仓库档案提供空间归属和数据权限。",
          },
          {
            label: "下游",
            content:
              "人工或自动解除成功后取消升级任务，并在存在订单穿透关联时发布 DeviceEventReleased；这些服务端联动不在本页 Mock 中实现。",
          },
          {
            label: "路由口径",
            content: "6.2 PC 原型与 PRD 统一使用 /物联网IOT与预警/预警信息/设备预警信息，详情与解除页沿用同一菜单路径。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-filter",
    targetId: "device-warning-filter",
    number: 2,
    kind: "交互",
    title: "组合筛选与查询边界",
    content: "筛选条件先进入草稿值，点击查询或按 Enter 后才应用；查询和重置都会将页码归一到第 1 页。",
    documentRefs: {
      fields: {
        section: "一、基础识别与列表业务字段",
        match: "预警类型",
        element: "row",
      },
      prd: {
        section: "4.1 PC 列表页",
        match: "筛选区",
        element: "text",
      },
      rules: {
        section: "六、校验规则",
        match: "预警类型",
        element: "text",
      },
    },
    details: [
      {
        title: "字段与默认值",
        items: [
          {
            label: "预警类型大类与子类型级联多选",
            content:
              "采用两栏树形级联多选面板：支持 5 大类一键全选或半选联动，右栏展开对应细粒子类型复选列表；支持按具体子类型精准过滤，亦支持按大类全选包含过滤。门禁通行与操作事务不属于设备预警类型。",
          },
          {
            label: "预警等级",
            content:
              "提交 severity_level_id，空选表示全部；当前原型展示 03/01 启用档 Mock 数据。",
          },
          {
            label: "预警状态",
            content:
              "全部、待处置、已作废、已结案；默认待处置，与配置侧规则生命周期状态不是同一语义。",
          },
          {
            label: "所属仓库",
            content: "按用户管辖仓库进行 P02 数据权限过滤；空选表示全部可见仓库。",
          },
          {
            label: "预警时间",
            content:
              "按日期范围匹配 warningTime，起始日按 00:00:00、结束日按 23:59:59 包含在范围内；今天/本周/本月是快捷填值。",
          },
        ],
      },
      {
        title: "交互、异常与原型边界",
        items: [
          {
            label: "组合逻辑",
            content:
              "不同字段之间按 AND 组合；查询后按预警时间倒序，筛选结果为空时表格显示暂无数据。",
          },
          {
            label: "重置",
            content: "恢复全部类型、全部等级、待处置、全部仓库和空日期范围，并刷新列表。",
          },
          {
            label: "控件差异",
            content:
              "【待确认】列表页 Demo 要求预警等级和所属仓库支持搜索，当前原型是可展开选项列表，是否补充远程搜索、无结果和加载态。",
          },
          {
            label: "加载失败",
            content: "PRD 规定提示“加载失败，请重试”；当前页面仅使用本地同步 Mock，尚未演示请求失败、重试和防重复提交。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-table",
    targetId: "device-warning-table-area",
    number: 3,
    kind: "字段",
    title: "表格字段字典与快照规格",
    content: "表格承载当前筛选结果的单条事件事实快照；序号按当前页重算，预警时间用于默认倒序排序。",
    documentRefs: {
      fields: {
        section: "一、基础识别与列表业务字段",
        match: "列表业务字段展示顺序",
        element: "text",
      },
      prd: {
        section: "4.1 PC 列表页",
        match: "列表区",
        element: "text",
      },
      rules: {
        section: "六、校验规则",
        match: "R01",
        element: "row",
      },
    },
    details: [
      {
        title: "1. 列表字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件与类型 | 展示与格式要求 | 触发动作 / 业务联动 |
| :--- | :--- | :--- | :--- |
| **复选框** | 行首多选框 | 勾选/取消；受 DEV-C01 门控（仅待处置且人工结案行可选） | 批量解除多选计数联动 |
| **序号** | 系统计算整数 | 翻页重算：\`(page - 1) * pageSize + index + 1\` | 纯前端展示，非主键 |
| **规则名称** | 规则快照文本 | 最大 50 字符；固化触发时刻名称（后续修改不回写） | 点击跳转预警规则详情快照 |
| **预警等级** | 枚举 Tag 徽标 | 展示等级编码与名称（如 L4 严重风险）；动态色值 | 筛选联动；受穿透开关控制 |
| **预警类型** | 两栏树形枚举 | 5 大类枚举与细粒子类型；支持大类/子类精准筛选 | 展开两栏级联多选面板 |
| **预警内容** | 组合文本 | 系统仓库(仓/库房/分区)+用户手录位置+触发内容；与详情四字段口径一致 | 文本截断，悬浮查看完整内容 |
| **现场照片** | 厂商回传图片 | 告警触发时设备厂商硬件自动回传，可能多张；私有 OSS 签名 URL | 点击调起多图轮播预览；无回传展示「—」 |
| **预警抓拍图** | 监控联动图片 | 系统产生预警时主动调用摄像头抓拍；私有 OSS 动态时效防盗链 URL | 点击调起高清大图预览大窗 |
| **预警时间** | 事件发生时间 | \`YYYY-MM-DD HH:mm:ss\`；禁止截断年份与秒数 | 列表默认倒序；升级计时起点 |
| **处理信息** | 两行合并展示 | 首行处理人，次行处理时间戳；待处置展示占位横杠“—” | 自动结案展示“系统自动处理” |
| **预警状态** | 状态机枚举 | 三态展示：待处置(橙) / 已结案(绿) / 已作废(灰) | 严格三态词表，禁止简写 |
| **操作** | 按钮链接 | 待处置且人工结案展示【解除预警】+【详情】；其余仅【详情】 | 调起核销弹窗或路由跳转 |`,
          },
        ],
      },
      {
        title: "2. 抓拍、空态与数据一致性",
        items: [
          {
            label: "抓拍时效与防盗链",
            content:
              "预警抓拍图调用私有 OSS 临时授权签名 URL；抓拍超时或摄像头离线时统一展示“抓拍失败/设备离线”占位符，受 DEV-C06 容灾保护，不阻断核心核销流程。",
          },
          {
            label: "一事件一条记录 (DEV-R01)",
            content:
              "每条厂商事件独立落账生成全局唯一 Event ID，禁止频次累加、合并覆盖或频次抽屉；同设备同指标再次越限独立生成新行记录。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-row-actions",
    targetId: "device-warning-table-area",
    number: 4,
    kind: "规则",
    title: "状态 × 行操作控制矩阵",
    content: "行操作遵循规则生命周期与处置权限；待处置且人工结案支持单条核查解除与复选框批量解除。",
    documentRefs: {
      fields: {
        section: "一、基础识别与列表业务字段",
        match: "预警状态",
        element: "row",
      },
      prd: {
        section: "8.2 解除",
        match: "R14'",
        element: "text",
      },
      rules: {
        section: "五、动作能力矩阵",
        match: "人工解除",
        element: "row",
      },
    },
    details: [
      {
        title: "1. 操作列状态化控制矩阵",
        items: [
          {
            label: "状态与动作对照表",
            content: `| 预警处置状态 | 处置策略模式快照 | 操作列展示按钮 | 业务逻辑与权限门禁 |
| :--- | :--- | :--- | :--- |
| **待处置** | 人工处置结案 | 【解除预警】、【详情】 | 蓝色高亮；点击弹出单条核销弹窗，需录入 1～200 字情况说明；现场照片选填 |
| **待处置** | 恢复自动结案 | 【详情】 (无解除按钮) | 仅由网关遥测平稳 >= 60 秒自动结案，禁止人工干预 |
| **待处置** | 触发即结案 | 【详情】 (无解除按钮) | 瞬态通知类，落账即已处理，不提供人工核销按钮 |
| **已结案** | 任意策略 | 【详情】 | 查看已结案不可变事实快照、现场核查说明与抓拍图 |
| **已作废** | 任意策略 | 【详情】 | 规则软删除或设备移除置失效，仅供司法审计追溯 |`,
          },
        ],
      },
      {
        title: "2. 权限、并发与异常防护",
        items: [
          {
            label: "权限隔离 (DEV-P02/P04)",
            content: "仅拥有 R-IOT-OPS / R-SYS-ADMIN 权限且处于操作人管辖仓库范围内的记录允许点击【解除预警】；风控只读角色操作按钮置灰或隐藏。",
          },
          {
            label: "并发乐观锁 (DEV-C03)",
            content: "单条与批量解除均携带流水 Version 乐观锁；多端并发结案时比对版本号，后提交者拦截并提示“数据已被处理，请刷新”。",
          },
        ],
      },
      {
        title: "3. 权限、确认与失败处理",
        items: [
          {
            label: "详情",
            content: "点击规则名称或行内详情进入详情页；列表与详情均受 P01/P02 菜单和仓库数据权限控制。",
          },
          {
            label: "单条解除",
            content: "先弹出本页二次确认，确认后在当前弹窗展开解除说明和现场照片；提交时需携带情况说明、照片 IDs 和 Version，服务端以乐观锁保证幂等和并发安全。",
          },
          {
            label: "解除权限",
            content: "仅 R-IOT-OPS / R-SYS-ADMIN 等具备 IoT 处理权限的角色可操作，风控只读角色只能查看。",
          },
          {
            label: "失败处理",
            content: "状态已变更或 Version 冲突时提示“数据已被他人修改，请刷新重试”；重复解除返回“该预警已结案”。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-batch-release",
    targetId: "device-warning-batch-release",
    number: 5,
    kind: "交互",
    title: "批量解除预警（R16）",
    content: "列表工具区【批量解除】按钮；选中 ≥1 条 R14' 可解除记录后启用，统一填写情况说明与可选现场照片，逐条独立归档。",
    documentRefs: {
      fields: {
        section: "二、解除预警表单字段",
        match: "情况说明",
        element: "row",
      },
      prd: {
        section: "4.1 PC 列表页",
        match: "批量解除",
        element: "text",
      },
      rules: {
        section: "六、校验规则",
        match: "R16",
        element: "row",
      },
    },
    details: [
      {
        title: "1. 批量解除流转时序与状态机",
        items: [
          {
            label: "批量核销处理流转图",
            content: `flowchart TD
    A["勾选待处置且人工结案行 (DEV-C01)"] --> B["点击【批量解除预警】"]
    B --> C["弹出核销确认弹窗 (展示已选 N 条清单)"]
    C --> D["统一录入情况说明 (1~200字) + 现场照片 (<=10张)"]
    D --> E["携带各自 Version 乐观锁提交服务端"]
    E --> F{"逐条原子核销校验"}
    F -->|成功| G["独立落账为【已结案】+ 联动押品穿透核销"]
    F -->|并发冲突| H["记录失败原因，继续处理其余流水"]
    G --> I["汇总 Toast 提示：成功 N_succ 条，失败 N_fail 条"]`,
          },
        ],
      },
      {
        title: "2. 解除预警核销表单字段字典",
        items: [
          {
            label: "核销表单字段规格",
            content: `| 字段名称 | 控件与类型 | 必填性 | 校验规则与说明 |
| :--- | :--- | :---: | :--- |
| **情况说明** | 多行文本框 | **必填** | 1~200 个字符；禁止全空格；统一写入各选中流水 (DEV-C04) |
| **现场照片** | 图片上传组件 | 选填 | JPG/PNG 格式；单张 $\le$ 5MB，最多 10 张；复制绑定所选流水 |
| **解除预警抓拍图** | 异步监控抓拍 | 系统自动 | 提交瞬间向同库区摄像头下发抓拍指令；超时容灾不阻断提交 |
| **处理人** | 文本只读 | 系统自动 | 格式为“姓名（所属机构名称）”；根据 Token 自动解析固化 |
| **处理时间** | 日期时间只读 | 系统自动 | \`YYYY-MM-DD HH:mm:ss\`；事务提交成功的数据库时间戳 |
| **并发版本号** | 隐藏字段 | 系统自动 | 乐观锁版本计数器；提交时比对，版本冲突阻断单条提交 (DEV-C03) |`,
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-pagination",
    targetId: "device-warning-pagination",
    number: 6,
    kind: "交互",
    title: "分页、页容量与空结果",
    content: "分页只作用于已应用的筛选结果；调整页容量、查询或重置后回到第 1 页，避免当前页超出结果范围。",
    documentRefs: {
      fields: {
        section: "一、基础识别与列表业务字段",
        match: "序号",
        element: "row",
      },
      prd: {
        section: "4.1 PC 列表页",
        match: "分页",
        element: "text",
      },
      rules: {
        section: "六、校验规则",
        match: "R16",
        element: "row",
      },
    },
    details: [
      {
        title: "分页行为",
        items: [
          {
            label: "页码",
            content: "支持上一页、下一页、页码和前往页；当前页不会小于 1，也不会超过筛选结果总页数。",
          },
          {
            label: "每页条数",
            content: "当前原型提供 10、20、50 条/页；切换后页码重置为 1，重新按最新 pageSize 截取。",
          },
          {
            label: "总数",
            content: "显示当前筛选结果条数，不应直接使用未过滤总数；后端分页场景需替换为接口返回 total。",
          },
        ],
      },
      {
        title: "异常与实现边界",
        items: [
          {
            label: "筛选联动",
            content: "筛选后若当前页超过新总页数，currentPage 取 totalPages 的较小值；查询和重置显式回到第 1 页。",
          },
          {
            label: "空结果",
            content: "无匹配数据时保留表头和分页区域，表格正文显示“暂无数据”，不展示行操作。",
          },
          {
            label: "加载与重试",
            content: "【待确认】生产接口分页的 loading、超时、失败重试和重复点击锁定尚未在本静态 Mock 中演示。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-release-confirm",
    targetId: "device-warning-release-confirm",
    number: 7,
    kind: "规则",
    title: "单条解除前二次确认",
    content: "确认解除该条预警；确认后在当前弹窗展开解除材料，真正状态变更和审计由提交解除流程完成。",
    documentRefs: {
      fields: {
        section: "二、解除预警表单字段",
        match: "情况说明",
        element: "row",
      },
      prd: {
        section: "4.3 PC 解除（弹窗为主流程）",
        match: "二次确认",
        element: "text",
      },
      rules: {
        section: "六、校验规则",
        match: "R04",
        element: "row",
      },
    },
    details: [
      {
        title: "确认内容",
        items: [
          {
            label: "提示文案",
            content: "确认解除该条预警？提交后状态将变为「已结案」，并同步取消相关升级任务。",
          },
          {
            label: "取消",
            content: "关闭确认框并停留列表，releaseTarget 清空，不改变筛选、分页和事件状态。",
          },
          {
            label: "确认解除",
            content: "在当前弹窗展开情况说明、现场照片、联动抓拍和最终提交，不跳转到详情页或单独解除页。",
          },
        ],
      },
      {
        title: "强一致性与原型边界",
        items: [
          {
            label: "服务端校验",
            content: "最终提交必须再次校验待处置、仓库权限和 Version；页面二次确认不能替代服务端幂等与并发锁。",
          },
          {
            label: "审计",
            content: "解除成功应记录操作人、时间戳、IP、前后版本及解除材料快照，并发布至少一次 DeviceEventReleased（有关联穿透时）。",
          },
          {
            label: "当前原型边界",
            content: "当前弹窗演示确认、材料填写和提交解除三步流程；提交成功后列表移除该事件并显示成功提示，并发失败反馈仍由服务端接口负责。",
          },
        ],
      },
    ],
  },
]
