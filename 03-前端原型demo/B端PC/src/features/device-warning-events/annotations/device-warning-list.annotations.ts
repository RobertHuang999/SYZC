import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-page",
    targetId: "device-warning-page",
    number: 1,
    kind: "页面",
    title: "页面定位与处理闭环",
    content: "这是设备侧事件流水的只读列表，核心任务是筛选、查看单条事件事实并进入解除处置；厂商预过滤回调后逐条独立落账（一事件一条记录）。",
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
              "用户可见状态为待处置 · 有效、已作废、已结案 · 有效；不存在频次聚合或 timeline 内部态。",
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
    details: [
      {
        title: "字段与默认值",
        items: [
          {
            label: "预警类型大类与子类型级联多选",
            content:
              "采用两栏树形级联多选面板：支持 6 大类一键全选或半选联动，右栏展开对应细粒子类型复选列表（含常规通行与操作事务 10 类合流子类型）；支持按具体子类型精准过滤，亦支持按大类全选包含过滤。",
          },
          {
            label: "预警等级",
            content:
              "提交 severity_level_id，空选表示全部；当前原型展示 03/01 启用档 Mock 数据。",
          },
          {
            label: "预警状态",
            content:
              "全部、待处置 · 有效、已作废、已结案 · 有效；默认待处置 · 有效，与配置侧规则生命周期状态不是同一语义。",
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
            content: "恢复全部类型、全部等级、待处置 · 有效、全部仓库和空日期范围，并刷新列表。",
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
    title: "表格字段、快照与展示格式",
    content: "表格承载当前筛选结果的单条事件事实快照；序号按当前页重算，预警时间用于默认排序。",
    details: [
      {
        title: "列定义",
        items: [
          {
            label: "复选框",
            content: "行首复选框用于批量解除；仅待处置 · 有效且快照 disposition=ACTION_REQUIRED（R14'）的行可选，其余禁用。",
          },
          {
            label: "序号",
            content: "系统生成，当前页从 1 开始；翻页后按 (page - 1) × pageSize + index + 1 重算。",
          },
          {
            label: "规则名称",
            content: "取触发规则名称快照，可点击进入详情；未命名规则的兜底展示由服务端负责。",
          },
          {
            label: "预警等级",
            content: "展示等级色块、编码和名称；颜色及文案来自触发时字典快照，不随当前配置回溯改写。",
          },
          {
            label: "预警类型",
            content: "展示 6 大类枚举，常规通行与操作事务属于合流流水，不可在设备预警配置侧新建。",
          },
          {
            label: "预警内容/设备",
            content: "组合展示位置、设备名称和触发内容；长文本截断并保留 title 作为完整内容查看入口。",
          },
          {
            label: "预警时间",
            content: "本条独立流水的触发时间 warningTime，格式 YYYY-MM-DD HH:mm:ss；同时作为升级计时起点。",
          },
          {
            label: "状态",
            content: "状态 Tag 按三态着色；详情页再承载完整秒级时间与处置留痕。",
          },
        ],
      },
      {
        title: "抓拍、空态与数据一致性",
        items: [
          {
            label: "抓拍字段",
            content:
              "可用时展示图片入口；无抓拍图或抓拍失败应分别遵循 R08/R13 的展示和权限规则，图片访问需使用时效签名 URL。",
          },
          {
            label: "权限",
            content:
              "列表和详情受租户、仓库权限过滤；抓拍预览还受 P05 图片查看权限控制，无权限时置灰或隐藏。",
          },
          {
            label: "一事件一条记录",
            content: "不存在预警次数、最近预警时间或频次聚合列；同设备同子类型再次触发产生新的独立流水行。",
          },
          {
            label: "当前 Mock",
            content:
              "当前实现使用本地 Mock 数据，分页总数由筛选结果动态计算；列表 PRD 的示例目标为 128 条，是否补齐固定数据量属于交付范围待确认项。",
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
    title: "状态 × 行操作能力矩阵",
    content: "详情对三种状态均可用；解除仅对待处置 · 有效且快照 disposition=人工解除结案（R14'）的事件展示；支持复选框批量解除。",
    details: [
      {
        title: "展示矩阵",
        items: [
          {
            label: "待处置 · 有效",
            content: "允许详情；是否展示解除由触发快照 manualReleaseAllowed（R14'：ACTION_REQUIRED）决定；可勾选参与批量解除。",
          },
          {
            label: "已作废",
            content: "仅允许查看详情，不可人工恢复或解除；通常由规则删除或设备移除联动进入终态。",
          },
          {
            label: "已结案 · 有效",
            content: "自动恢复、人工解除或瞬态通行落账后的归档只读状态；再次超标产生新的独立流水。",
          },
        ],
      },
      {
        title: "权限、确认与失败处理",
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
            content: "状态已变更或 Version 冲突时提示“数据已被他人修改，请刷新重试”；重复解除返回“该预警已结案 · 有效”。",
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
    details: [
      {
        title: "批量解除流程",
        items: [
          {
            label: "批量解除流转图",
            content: `flowchart TD
    A["勾选待处置·有效且 R14' 行"] --> B["点击批量解除"]
    B --> C["二次确认 + 展示已选清单"]
    C --> D["统一填写情况说明/现场照片"]
    D --> E["逐条校验 Version 与状态"]
    E --> F["每条独立归档为已结案·有效"]
    F --> G["取消各条升级任务 + 发布 Released"]`,
          },
          {
            label: "选中规则",
            content: "仅 manualReleaseAllowed=true 且 warningStatus=待处置·有效的行可勾选；表头全选仅作用于当前页可选项。",
          },
          {
            label: "材料复用",
            content: "批量解除时同一情况说明与同一组现场照片写入每条选中流水；每条流水独立联动解除抓拍。",
          },
          {
            label: "部分失败",
            content: "逐条校验 Version 与状态；部分失败时 Toast 汇总成功/失败条数，成功条目从列表移除。",
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
    details: [
      {
        title: "确认内容",
        items: [
          {
            label: "提示文案",
            content: "确认解除该条预警？提交后状态将变为「已结案 · 有效」，并同步取消相关升级任务。",
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
            content: "最终提交必须再次校验待处置 · 有效、仓库权限和 Version；页面二次确认不能替代服务端幂等与并发锁。",
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
