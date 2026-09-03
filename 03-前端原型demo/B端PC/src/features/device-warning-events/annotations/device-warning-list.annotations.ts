import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-page",
    targetId: "device-warning-page",
    number: 1,
    kind: "页面",
    title: "页面定位与处理闭环",
    content: "这是设备侧事件流水的只读列表，核心任务是筛选、查看事实、回看频次并进入解除处置。",
    details: [
      {
        title: "物联穿透与判定流程",
        items: [
          {
            label: "物联穿透链路流转图",
            content: `flowchart TD
    E["硬件事件/网关接入"] --> R["03/02 规则 + 02/01 台账 R11"]
    R --> D{"sync_to_order_warn=是 且在押订单 R12"}
    D -->|否| N["仅保留 02/01 设备流水"]
    D -->|是| Y["生成 warn_source=IOT_PENETRATION R13"]
    Y --> L["关联设备事件ID + 设备规则等级"]
    L --> M["订单级摘要通知 R15~R16"]
    M --> F["6.2 fuse_status=NONE"]`,
          },
          {
            label: "数据来源",
            content:
              "流水来自物联网接入网关、防抖判定引擎和设备主数据事件流，正式命中后写入 iot_event_ledger；页面不提供新增或编辑。",
          },
          {
            label: "用户目标",
            content:
              "监管人员按类型、等级、状态、仓库、频次和首次预警时间定位事件，再进入详情、频次时间轴或人工解除。",
          },
          {
            label: "状态边界",
            content:
              "用户可见状态为未处理（有效）、未处理（无效）、已处理（有效）；Pending/Firing 属于引擎内部态，不在列表直接展示。",
          },
        ],
      },
      {
        title: "上下游与路由",
        items: [
          {
            label: "上游",
            content:
              "设备预警配置提供触发时规则快照，预警等级提供等级字典快照，设备与仓库档案提供空间归属和数据权限。",
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
            label: "预警类型",
            content: "6 大类多选，空选表示全部；同一字段多选按 OR 匹配。",
          },
          {
            label: "预警等级",
            content:
              "提交 severity_level_id，空选表示全部；当前原型展示 03/01 启用档 Mock 数据。",
          },
          {
            label: "预警状态",
            content:
              "全部、未处理（有效）、未处理（无效）、已处理（有效）；默认未处理（有效），与配置侧规则生命周期状态不是同一语义。",
          },
          {
            label: "所属仓库",
            content: "按用户管辖仓库进行 P02 数据权限过滤；空选表示全部可见仓库。",
          },
          {
            label: "触发频次",
            content: "全部或高频（>5 次）；高频条件为 triggerCount > 5。",
          },
          {
            label: "首次预警时间",
            content:
              "按日期范围匹配，起始日按 00:00:00、结束日按 23:59:59 包含在范围内；今天/本周/本月是快捷填值。",
          },
        ],
      },
      {
        title: "交互、异常与原型边界",
        items: [
          {
            label: "组合逻辑",
            content:
              "不同字段之间按 AND 组合；查询后按最近预警时间倒序，筛选结果为空时表格显示暂无数据。",
          },
          {
            label: "重置",
            content: "恢复全部类型、全部等级、未处理（有效）、全部仓库、全部频次和空日期范围，并刷新列表。",
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
    content: "表格承载当前筛选结果的事件事实快照；序号按当前页重算，最近预警时间用于默认排序。",
    details: [
      {
        title: "列定义",
        items: [
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
            label: "状态与时间",
            content: "状态 Tag 按三态着色；最近时间格式化为 MM-DD HH:mm，详情页再承载完整秒级时间。",
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
            label: "异常展示",
            content:
              "【待确认】当前 PC 原型将抓拍失败与无抓拍图都显示为短横线，需确认是否改为“抓拍失败”文案并提供刷新签名入口。",
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
    content: "详情、频次时间轴对三种状态均可用；解除仅对未处理（有效）且命中人工解除条件的事件展示。",
    details: [
      {
        title: "展示矩阵",
        items: [
          {
            label: "未处理（有效）",
            content: "允许详情和频次查看；图像入侵、挂锁破坏、非法开箱、物联离线、GPS 离线、门禁离线等配置允许人工处理的类型才展示解除。",
          },
          {
            label: "未处理（无效）",
            content: "仅允许查看详情和频次，不可人工恢复或解除；通常由规则删除或设备移除联动进入终态。",
          },
          {
            label: "已处理（有效）",
            content: "自动恢复、人工解除或瞬态通行落账后的归档只读状态；未来再次超标须开启新轮次，Count 从 1 重新计算。",
          },
        ],
      },
      {
        title: "权限、确认与失败处理",
        items: [
          {
            label: "详情",
            content: "点击规则名称或行内详情进入详情页；列表、详情和频次均受 P01/P02 菜单和仓库数据权限控制。",
          },
          {
            label: "解除",
            content: "先弹出本页二次确认，确认后在当前弹窗展开解除说明和现场照片；提交时需携带情况说明、照片 IDs 和 Version，服务端以乐观锁保证幂等和并发安全。",
          },
          {
            label: "解除权限",
            content: "仅 R-IOT-OPS / R-SYS-ADMIN 等具备 IoT 处理权限的角色可操作，风控只读角色只能查看。",
          },
          {
            label: "失败处理",
            content: "状态已变更或 Version 冲突时提示“数据已被他人修改，请刷新重试”；重复解除返回“该预警已处理”。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-frequency",
    targetId: "device-warning-table-area",
    number: 5,
    kind: "交互",
    title: "预警次数与频次时间轴",
    content: "预警次数来自同一设备同一子类型的未处理聚合轮次，点击后打开时间轴抽屉查看每次触发事实。",
    details: [
      {
        title: "聚合规则",
        items: [
          {
            label: "Count 累加",
            content: "未处理（有效）期间同设备同子类型再次超标时 Count + 1，同时更新最近时间和最新快照。",
          },
          {
            label: "幂等",
            content: "同一原始 event_id 重复投递不得重复累加；聚合期间不重复发送首次通知。",
          },
          {
            label: "升级计时",
            content: "升级任务以首次预警时间为起点，不因 Count 增加而重置；处理或置无效后取消升级任务。",
          },
        ],
      },
      {
        title: "抽屉字段与待确认",
        items: [
          {
            label: "时间轴明细",
            content: "按序展示触发时间、采集值/事实和抓拍入口；底层对应 event_trigger_timeline。",
          },
          {
            label: "抓拍预览",
            content: "有图时支持预览；图片签名过期需重新换取时效 URL，联动抓拍失败不应阻断解除成功。",
          },
          {
            label: "关闭与数据状态",
            content: "关闭抽屉不改变流水状态；查看行为只读，不产生审计写操作。",
          },
          {
            label: "点击条件",
            content: "【待确认】列表 PRD 写明 Count>1 可展开，但动作矩阵允许所有状态查看时间轴，当前原型 Count=1 也可点击；需确认是否限制入口。",
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
    title: "解除前二次确认与整轮归档",
    content: "确认文案中的 N 是本轮累计触发次数；确认后在当前弹窗展开解除材料，真正状态变更和审计由提交解除流程完成。",
    details: [
      {
        title: "确认内容",
        items: [
          {
            label: "提示文案",
            content: "确认解除该轮次告警？提交后将归档整轮 N 次触发。需要让操作者明确这是整轮处理，不是只处理最近一条触发。",
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
            content: "最终提交必须再次校验未处理（有效）、仓库权限和 Version；页面二次确认不能替代服务端幂等与并发锁。",
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
