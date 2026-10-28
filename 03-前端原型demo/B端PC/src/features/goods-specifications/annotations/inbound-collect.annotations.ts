import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundCollectListAnnotations: PrototypeAnnotation[] = [
  {
    id: "collect-page-header",
    targetId: "collect-page-header",
    number: 1,
    kind: "页面",
    title: "入库收集项配置底座定位",
    content:
      "货品规格管理基础配置节点（入库采集字段池），负责集中维护全平台及各租户通用的入库采集字段规范、控件类型及保质期度量单位白名单（天/月/年），实现核心项保护、保质期专项配置与两阶段安全删除拦截，为下游【品类管理】与【货品管理 (SKU)】提供统一的字段元数据底座。",
    details: [
      {
        title: "全生命周期流转",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 启用: 新建收集项保存成功（默认启用）
    启用 --> 停用: 停用（存量货品与历史入库单不受影响）
    停用 --> 启用: 启用（下游新建货品恢复可选）
    启用 --> 启用: 编辑属性（仅对新业务生效）
    停用 --> [*]: 安全删除（已停用 + 完全无下游引用）`,
          },
          {
            label: "业务边界",
            content:
              "【收集项启用与停用规则】(R03)：极简双态流转。停用后下游新建货品不可选，存量已引用业务不受影响；支持随时恢复启用；系统核心字段永久禁止删除。",
          },
        ],
      },
      {
        title: "上下游影响",
        items: [
          {
            label: "数据源头与下游联动",
            content:
              "本菜单是字段池底座：品类管理从中勾选入库收集模板，货品管理 (SKU) 从中选取收集项并为具体货品指定专属固定保质期单位，仓储 WMS 入库单再按货品配置动态渲染表单。",
          },
          {
            label: "历史快照边界",
            content:
              "配置变更后版本号递增，只对后续新建的货品与业务单据生效；已过账的入库单明细与批次台账保持生成时刻的不可变快照，绝不回写。",
          },
        ],
      },
    ],
  },
  {
    id: "collect-filter",
    targetId: "collect-filter",
    number: 2,
    kind: "交互",
    title: "四维筛选与新增入口",
    content:
      "筛选条件按收集项名称（模糊）、控件类型（精确）、状态（精确）、创建时间范围四项组合过滤，右上角为重置、查询与新增收集项入口。",
    details: [
      {
        title: "交互约定",
        items: [
          {
            label: "草稿与生效分离",
            content:
              "输入框内容先落在草稿态，点【查询】或回车才生效；点【重置】清空全部四项并回到第 1 页。",
          },
        ],
      },
    ],
  },
  {
    id: "collect-table",
    targetId: "collect-table",
    number: 3,
    kind: "字段",
    title: "7 维精简矩阵与度量摘要",
    content:
      "主表格固定展示 7 维核心业务列：序号、收集项名称、控件类型、度量单位/选项摘要、状态徽章、创建时间、操作列，消除视觉噪音。",
    details: [
      {
        title: "核心保护机制",
        items: [
          {
            label: "核心内置项锁定",
            content:
              "【系统核心收集项保护机制】(R02)：保质期、生产日期、过期时间等核心字段永久禁止删除，底层控件类型锁定，操作列删除按钮置灰带锁定标识。",
          },
          {
            label: "名称唯一性",
            content:
              "【收集项名称唯一性校验规则】(R01)：租户内名称全局唯一，录入时去除首尾空格，重复阻断保存。",
          },
          {
            label: "下游引用探测",
            content:
              "【两阶段安全删除控制规则】(R04)：引用数来自 06 货品主档里实际勾选了本项的未删除货品数；有引用时禁止删除并显示「当前被 N 个货品使用」。",
          },
        ],
      },
    ],
  },
  {
    id: "collect-shelf-life-action",
    targetId: "collect-shelf-life-action",
    number: 4,
    kind: "规则",
    title: "保质期度量单位白名单与基准推荐",
    content:
      "在【保质期】行点击【配置单位】，集中维护全平台/租户允许使用的保质期单位范围（天/月/年）及推荐基准单位。",
    details: [
      {
        title: "白名单规则",
        items: [
          {
            label: "保底强校验",
            content:
              "【保质期度量单位白名单与基准推荐规则】(R05)：天、月、年三项开关不可同时关闭，至少保留 1 项开启。试图关闭最后一个单位系统即刻拦截。",
          },
          {
            label: "下游货品主档锁定",
            content:
              "货品管理 (SKU) 建档时从白名单中为商品指定专属固定单位（如花椒配年、八角配月），产生入库单后单位锁死只读。",
          },
        ],
      },
    ],
  },
  {
    id: "collect-delete-action",
    targetId: "collect-delete-action",
    number: 5,
    kind: "交互",
    title: "两阶段安全删除控制",
    content:
      "杜绝直接物理删除，执行自身停用状态检查与下游品类/货品引用实时扫描双门禁。",
    details: [
      {
        title: "两阶段安全拦截",
        items: [
          {
            label: "阶段一自身状态",
            content:
              "【两阶段安全删除控制规则】(R04)：启用状态下的收集项不可删除，点击直接拦截并提示：『启用状态下的收集项不可删除，请先停用。』",
          },
          {
            label: "阶段二引用扫描",
            content:
              "停用状态下点击删除，系统后台快速探测下游引用。存在有效引用时弹出阻断提示：『该收集项已被使用，不可删除！请先前往解绑。』；完全无引用二次确认后彻底删除。",
          },
        ],
      },
    ],
  },
]

export const inboundCollectDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "detail-header-card",
    targetId: "detail-header-card",
    number: 1,
    kind: "页面",
    title: "详情页头与保护级别摘要",
    content:
      "页头卡片展示收集项名称、系统核心项/自定义扩展项徽章、生效状态、核心属性摘要及快捷操作入口。",
    details: [
      {
        title: "操作联动",
        items: [
          {
            label: "安全操作",
            content:
              "支持编辑、启停用切换以及保质期专属单位配置，核心字段不允许删除。",
          },
        ],
      },
    ],
  },
  {
    id: "detail-section-specs",
    targetId: "detail-section-specs",
    number: 2,
    kind: "字段",
    title: "字段基础规格与控件属性",
    content:
      "包含收集项通俗名称、控件类型、度量单位标签/下拉选项、输入提示及业务说明备注。",
    details: [
      {
        title: "防呆与规范",
        items: [
          {
            label: "负数防呆快捷插入",
            content:
              "【负数温度与减号录入防呆规则】(R07)：内置快捷减号与标准示例按钮，智能纠偏下划线与全角减号为半角减号。",
          },
        ],
      },
    ],
  },
  {
    id: "detail-section-shelf-life",
    targetId: "detail-section-shelf-life",
    number: 3,
    kind: "规则",
    title: "保质期度量白名单与下游约束",
    content:
      "直观透出保质期天、月、年三项开启状态及默认推荐基准单位，展示下游货品建档指定固定单位与 WMS 入库单只读锁死规则。",
    details: [
      {
        title: "执行规范",
        items: [
          {
            label: "独立录入常识校验",
            content:
              "【下游货品执行与入库单只读规则】(R06)：生产日期、保质期数值、过期时间三项全部独立填报，系统仅校验过期时间晚于生产日期。",
          },
        ],
      },
    ],
  },
  {
    id: "detail-section-audit",
    targetId: "detail-section-audit",
    number: 4,
    kind: "字段",
    title: "系统版本与多租户审计信息",
    content:
      "严格记录数据版本号、租户隔离标识、创建人/时间及最近修改人/时间。",
    details: [
      {
        title: "审计与防冲突",
        items: [
          {
            label: "多人防冲突",
            content:
              "【多人同时编辑防冲突与防重复提交规则】(C02)：版本号递增，后保存者系统提示刷新重试，避免静默覆盖。",
          },
          {
            label: "历史不回写",
            content:
              "【历史业务单据不受影响规则】(C01)：配置变更仅对后续新业务生效，绝不修改历史入库单明细与批次台账。",
          },
        ],
      },
    ],
  },
]

export const inboundCollectFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "collect-form-header",
    targetId: "collect-form-header",
    number: 1,
    kind: "页面",
    title: "新增/编辑页定位与保存流转",
    content:
      "新增与编辑共用一套独立页面，由路由区分；顶部操作卡片承载面包屑、标题与取消/保存，列表与详情三处入口都跳这里。",
    details: [
      {
        title: "保存与离开",
        items: [
          {
            label: "保存后去向",
            content:
              "新增保存成功回收集项列表；编辑保存成功回到该收集项详情页，便于当场核对入库单录入样式。",
          },
          {
            label: "防重复提交与离开确认",
            content:
              "【多人同时编辑防冲突与防重复提交规则】(C02)：保存中按钮置灰；有未保存修改时点取消或面包屑，二次确认「当前有未保存的修改，确认离开吗？」。",
          },
        ],
      },
    ],
  },
  {
    id: "collect-form-fields",
    targetId: "collect-form-fields",
    number: 2,
    kind: "字段",
    title: "字段录入与控件联动",
    content:
      "收集项名称、控件类型、度量单位标签、输入提示、下拉选项集合与说明备注按两列排布，联动关系由控件类型驱动。",
    details: [
      {
        title: "校验与联动",
        items: [
          {
            label: "名称唯一性",
            content:
              "【收集项名称唯一性校验规则】(R01)：2～30 个字符，录入自动去首尾空格，同一租户内重名时阻断保存。",
          },
          {
            label: "控件联动",
            content:
              "选【数字区间框】或【百分比数值框】才显示度量单位标签（必填）；选【下拉单选框】才显示下拉选项集合，至少配 1 项；选【省市区三级联动】按省 → 市 → 区逐级选择，不配单位与选项；周期组合项为保质期专属，不开放新建。",
          },
          {
            label: "减号防呆",
            content:
              "【负数温度与减号录入防呆规则】(R07)：输入提示旁提供快捷减号与示例按钮，误输入的下划线与全角减号自动纠正为半角。",
          },
          {
            label: "锁定规则",
            content:
              "【系统核心收集项保护机制】(R02)：核心项锁定名称与控件类型；已被下游引用的自定义项锁定控件类型与度量单位标签。",
          },
        ],
      },
    ],
  },
]
