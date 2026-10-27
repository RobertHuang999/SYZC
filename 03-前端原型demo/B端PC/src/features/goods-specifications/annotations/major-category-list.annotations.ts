import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const majorCategoryListAnnotations: PrototypeAnnotation[] = [
  {
    id: "major-category-page",
    targetId: "major-category-page",
    number: 1,
    kind: "页面",
    title: "大类定位与全树启停流转",
    content:
      "大类是货品规格体系的顶层分类实体，向下承载品类与货品，并统一控制整棵子树的启停状态。",
    details: [
      {
        title: "全生命周期流转",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 启用: 新建保存
    启用 --> 停用: 停用（保存下级快照并级联停用）
    停用 --> 启用: 启用（按快照恢复原启用下级）
    停用 --> 已删除: 删除（整树无入库单 + 二次确认）
    启用 --> 启用: 编辑名称（整树无入库单）
    已删除 --> [*]`,
          },
          {
            label: "业务边界",
            content:
              "大类只管分类与启停，不维护规格参数；规格参数由品类定义，规格取值由货品维护。",
          },
        ],
      },
      {
        title: "上下游影响",
        items: [
          {
            label: "向下继承",
            content:
              "品类新建时只能选择启用中的大类；大类停用后，下属品类与货品在同一事务内级联停用。",
          },
          {
            label: "历史数据",
            content:
              "历史已产生的入库单、仓单保留生成时刻的分类快照，不随大类停用或改名而变化。",
          },
        ],
      },
      {
        title: "权限与数据隔离",
        items: [
          {
            label: "角色权限",
            content:
              "系统管理员、配置维护人员可新建、编辑、启停和删除；风控与业务人员仅查看和筛选。",
          },
          {
            label: "租户隔离",
            content:
              "大类名称在同一租户内唯一，跨租户数据不可见、不可复用。",
          },
        ],
      },
    ],
  },
  {
    id: "major-category-filter",
    targetId: "major-category-filter",
    number: 2,
    kind: "交互",
    title: "筛选条件与新建入口",
    content:
      "按大类名称模糊查询、按状态精确筛选；筛选项区分草稿态与已生效态，点击查询才刷新列表。",
    details: [
      {
        title: "筛选字段",
        items: [
          {
            label: "大类名称",
            content:
              "单行文本输入框，前后自动去空格，支持模糊匹配；按回车或点击查询生效。",
          },
          {
            label: "状态",
            content: "下拉单选框：全部、启用、停用；默认全部。",
          },
          {
            label: "查询与重置",
            content:
              "点击查询从第 1 页重新检索；点击重置清空筛选并恢复默认状态。",
          },
        ],
      },
      {
        title: "新建入口",
        items: [
          {
            label: "新建大类",
            content:
              "位于筛选区右侧；点击后打开模态弹窗，录入大类名称，保存后默认启用并写入审计日志。",
          },
        ],
      },
    ],
  },
  {
    id: "major-category-table",
    targetId: "major-category-table",
    number: 3,
    kind: "字段",
    title: "列表字段与展示口径",
    content:
      "列表固定展示序号、大类名称、状态、创建人、创建时间、更新人、更新时间与操作列。",
    details: [
      {
        title: "字段字典",
        items: [
          {
            label: "字段清单对照",
            content: `| 字段名称 | 控件与类型 | 展示与格式要求 | 说明 |
| :--- | :--- | :--- | :--- |
| 序号 | 纯文本 | 当前页从 1 开始递增，翻页重新计算 | 不入库 |
| 大类名称 | 纯文本 | 1~20 个字符，超长省略并可悬停查看 | 同租户唯一 |
| 状态 | 状态徽章 | 启用为绿色、停用为灰色 | 枚举 ENABLED / DISABLED |
| 创建人 | 纯文本 | 展示创建人姓名 | 服务端带出 |
| 创建时间 | 日期时间 | 年-月-日 时:分:秒 | 创建后不变 |
| 更新人 | 纯文本 | 展示最近更新人姓名 | 级联操作也会刷新 |
| 更新时间 | 日期时间 | 年-月-日 时:分:秒 | 名称或状态变化时刷新 |
| 操作 | 行操作链接 | 编辑、启用/停用、删除 | 按角色权限展示 |`,
          },
        ],
      },
    ],
  },
  {
    id: "major-category-row-actions",
    targetId: "major-category-row-actions",
    number: 4,
    kind: "规则",
    title: "启用、停用与两阶段删除",
    content:
      "停用会保存下级状态快照并级联停用；启用只恢复原启用节点；删除必须先停用并扫描整树入库单。",
    details: [
      {
        title: "启停用规则",
        items: [
          {
            label: "停用",
            content:
              "【父级停用全树级联下发规则】(CAT-F02)：二次确认后保存品类与货品的当前状态快照，在同一事务内把大类、品类、货品全部置为停用；事务失败整体回滚。",
          },
          {
            label: "启用",
            content:
              "【父级启用快照恢复规则】(CAT-F03)：按快照只恢复停用前处于启用状态的品类与货品，原本主动停用的节点保持停用。",
          },
        ],
      },
      {
        title: "删除规则",
        items: [
          {
            label: "阶段一",
            content:
              "启用状态下点击删除，直接弹出模态警告：启用状态下的【大类】不可删除，请先停用。",
          },
          {
            label: "阶段二",
            content:
              "【两阶段删除强校验与级联逻辑删除规则】(CAT-F05)：扫描大类及全部下属品类、货品的入库单；有入库数据则阻断并提示该大类或其下级已有入库业务数据；无入库数据时二次确认后整树逻辑删除，删除后不可恢复。",
          },
        ],
      },
      {
        title: "并发与幂等",
        items: [
          {
            label: "乐观锁",
            content:
              "【并发控制与乐观锁幂等规则】(CAT-F06)：两名用户同时编辑同一大类时，后提交者提示数据已被他人修改，请刷新后重试。",
          },
        ],
      },
    ],
  },
  {
    id: "major-category-dialog",
    targetId: "major-category-dialog",
    number: 5,
    kind: "交互",
    title: "新建与编辑弹窗",
    content:
      "弹窗只维护大类名称，字数实时计数；保存时校验必填、长度与同租户重名。",
    details: [
      {
        title: "校验规则",
        items: [
          {
            label: "名称唯一",
            content:
              "【租户隔离与名称唯一性规则】(CAT-F01)：名称 1~20 个字符，前后去空格，同一租户内严格唯一，重复时提示大类名称已存在，请重新输入。",
          },
          {
            label: "编辑拦截",
            content:
              "【编辑操作入库单拦截规则】(CAT-F04)：该大类整棵子树已产生入库单时，保存被阻断并提示该大类已有业务数据产生，不可编辑。",
          },
        ],
      },
    ],
  },
]
