import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const subcategoryListAnnotations: PrototypeAnnotation[] = [
  {
    id: "subcategory-page",
    targetId: "subcategory-page",
    number: 1,
    kind: "页面",
    title: "品类定位与规格维度定义",
    content:
      "品类向上归属大类、向下细分货品，并定义该品类下所有货品必须填写的规格参数维度。",
    details: [
      {
        title: "全生命周期流转",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 启用: 新建保存（所属大类启用）
    启用 --> 停用: 停用（保存下属货品快照并级联停用）
    停用 --> 启用: 启用（所属大类必须启用）
    停用 --> 已删除: 删除（下属无入库单 + 二次确认）
    启用 --> 启用: 编辑名称、所属大类或规格参数`,
          },
          {
            label: "规格维度",
            content:
              "规格参数维度最少 1 组、最多 5 组；货品建档时按这些维度动态生成规格输入项。",
          },
        ],
      },
      {
        title: "上下游影响",
        items: [
          {
            label: "上游大类",
            content:
              "新建和启用品类时，所属大类必须处于启用状态；大类停用时品类会同步级联停用。",
          },
          {
            label: "下游货品",
            content:
              "品类停用或删除时，下属货品同步停用或删除；已产生的入库单保留当时的品类与规格快照。",
          },
        ],
      },
    ],
  },
  {
    id: "subcategory-filter",
    targetId: "subcategory-filter",
    number: 2,
    kind: "交互",
    title: "筛选条件与新建入口",
    content:
      "按所属大类、品类名称和状态组合筛选；新建品类入口位于筛选区右侧。",
    details: [
      {
        title: "筛选字段",
        items: [
          {
            label: "所属大类",
            content:
              "下拉单选框，仅加载启用中的大类；用于快速定位某个大类下的品类。",
          },
          {
            label: "品类名称",
            content:
              "单行文本输入框，前后去空格，支持模糊匹配。",
          },
          {
            label: "状态",
            content: "下拉单选框：全部、启用、停用。",
          },
          {
            label: "查询与重置",
            content:
              "查询从第 1 页重新检索；重置清空筛选条件并恢复默认状态。",
          },
        ],
      },
    ],
  },
  {
    id: "subcategory-table",
    targetId: "subcategory-table",
    number: 3,
    kind: "字段",
    title: "列表字段与规格标签展示",
    content:
      "列表展示品类名称、所属大类、货品规格参数、状态、创建人、创建时间、更新人、更新时间与操作。",
    details: [
      {
        title: "字段字典",
        items: [
          {
            label: "字段清单对照",
            content: `| 字段名称 | 控件与类型 | 展示与格式要求 | 说明 |
| :--- | :--- | :--- | :--- |
| 序号 | 纯文本 | 当前页从 1 开始递增 | 不入库 |
| 品类名称 | 纯文本 | 1~20 个字符，同一大类内唯一 | 继承大类归属 |
| 所属大类 | 纯文本 | 展示大类名称 | 只读带出 |
| 货品规格参数 | 标签组 | 每个规格维度一个标签，超长换行 | 1~5 个 |
| 状态 | 状态徽章 | 启用绿色、停用灰色 | 受大类级联影响 |
| 创建人/创建时间 | 纯文本 / 日期时间 | 创建时写入，不随编辑变化 | 服务端带出 |
| 更新人/更新时间 | 纯文本 / 日期时间 | 编辑或启停后刷新 | 级联也会刷新 |
| 操作 | 行操作链接 | 编辑、启用/停用、删除 | 按角色权限展示 |`,
          },
        ],
      },
    ],
  },
  {
    id: "subcategory-row-actions",
    targetId: "subcategory-row-actions",
    number: 4,
    kind: "规则",
    title: "启用前置校验与停用级联",
    content:
      "启用品类前必须确认所属大类已启用；停用品类会保存货品快照并级联停用；删除采用两阶段拦截。",
    details: [
      {
        title: "启停用规则",
        items: [
          {
            label: "启用",
            content:
              "【上级大类启用状态强依赖规则】(SUB-F03)：所属大类停用时阻断启用，并提示所属大类处于停用状态，请先启用大类。",
          },
          {
            label: "停用",
            content:
              "【级联停用与两阶段删除控制规则】(SUB-F05)：二次确认后保存下属货品自身状态快照，在同一事务内级联停用全部货品。",
          },
        ],
      },
      {
        title: "删除规则",
        items: [
          {
            label: "阶段一",
            content:
              "启用状态下的品类不可删除，提示先停用。",
          },
          {
            label: "阶段二",
            content:
              "扫描下属货品的入库单；存在入库数据时阻断并提示该品类或其下级已有入库业务数据，不可删除；无数据时二次确认后连同下属货品一起逻辑删除。",
          },
        ],
      },
      {
        title: "编辑拦截",
        items: [
          {
            label: "入库单强拦截",
            content:
              "【编辑操作下属入库单拦截规则】(SUB-F04)：下属货品已产生入库单时，保存被阻断并提示该品类已有业务数据产生，不可编辑。",
          },
        ],
      },
    ],
  },
  {
    id: "subcategory-dialog",
    targetId: "subcategory-dialog",
    number: 5,
    kind: "交互",
    title: "新建与编辑品类弹窗",
    content:
      "弹窗维护品类名称、所属大类与 1~5 组规格参数；达到 5 组后添加按钮置灰。",
    details: [
      {
        title: "校验规则",
        items: [
          {
            label: "名称唯一",
            content:
              "【所属大类从属与品类名称唯一性规则】(SUB-F01)：品类名称 1~20 个字符，同一个大类下严格唯一；所属大类只能选择启用中的大类。",
          },
          {
            label: "规格上限",
            content:
              "【动态规格参数维度上限控制规则】(SUB-F02)：规格参数维度 1~5 组，达到 5 组时前端置灰禁用添加按钮；至少保留 1 组，且组名不能重复。",
          },
        ],
      },
    ],
  },
]
