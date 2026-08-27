import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const severityLevelListAnnotations: PrototypeAnnotation[] = [
  {
    id: "severity-level-page",
    targetId: "severity-level-page",
    number: 1,
    kind: "页面",
    title: "预警等级公共底座定位与流转",
    content: "维护租户统一预警等级公共字典，为设备侧与订单侧规则配置严重度档位及订单穿透开关。",
    details: [
      {
        title: "等级字典全生命周期流转图",
        items: [
          {
            label: "生命周期流转图",
            content: `flowchart TD
    A["预警等级字典 (2~20档)"] -->|"新增/启用"| B["已启用 (可被规则选择)"]
    B -->|"配置引用"| C["03/02 设备预警配置 / 03/03 订单预警配置"]
    C -->|"告警触发"| D["固化等级快照 (永久不可变)"]
    B -->|"停用/删除保护"| E["停用/已删除 (历史流水保留不受影响)"]`,
          },
          {
            label: "核心定位",
            content: "单租户支持 2~20 档动态严重度档位；下游规则与流水通过 UUID 稳定绑定，编码/名称修改不破坏历史追溯。",
          },
        ],
      },
      {
        title: "上下游影响",
        items: [
          {
            label: "下游配置引用",
            content: "设备预警配置与订单预警配置下拉仅展示【已启用】等级档位。",
          },
          {
            label: "下游流水快照",
            content: "事件命中时固化等级 ID、编码、名称、颜色与 sync_to_order_warn 开关快照，字典修改不回溯历史流水。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-filter",
    targetId: "severity-level-filter",
    number: 2,
    kind: "交互",
    title: "状态筛选与新增等级入口",
    content: "支持按启用/停用状态筛选列表，提供【新增预警等级】快捷操作入口。",
    details: [
      {
        title: "筛选与准入",
        items: [
          {
            label: "状态筛选",
            content: "全部、已启用、已停用；按严重度权重 sort_order 从高到低排序。",
          },
          {
            label: "档位数限制",
            content: "单租户等级档位数限制在 2~20 档；达到 20 档上限时【新增】按钮禁用并提示档位已满。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-table",
    targetId: "severity-level-table",
    number: 3,
    kind: "字段",
    title: "表格字段与属性定义",
    content: "展示严重度排序、等级编码、显示名称、标签颜色、同步至订单预警开关及启用状态。",
    details: [
      {
        title: "列定义",
        items: [
          {
            label: "严重度排序 (sort_order)",
            content: "数值越大代表严重级别越高（如 5 为最高危紧急），用于规则匹配与优先级决策。",
          },
          {
            label: "等级编码 / 显示名称",
            content: "如 01-高危/02-中危 或 L1~L5；展示对应颜色色块与文字。",
          },
          {
            label: "同步至订单预警 (sync_to_order_warn)",
            content: "开关开启时，命中该等级的设备安防/越界高危事件将触发物联穿透生成订单侧押品预警流水。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-row-actions",
    targetId: "severity-level-table",
    number: 4,
    kind: "规则",
    title: "行操作权限与删除保护约束",
    content: "提供【编辑】与【删除】操作，对已绑定存量规则的等级实施强校验删除阻断保护。",
    details: [
      {
        title: "保护规则与操作约束",
        items: [
          {
            label: "删除校验约束",
            content: "若该等级已被任何启用的设备预警配置或订单预警配置引用，系统禁止删除，提示【该等级已被N条规则引用，不可删除，请先解绑或改为停用】。",
          },
          {
            label: "最低档位保护",
            content: "租户内有效等级少于或等于 2 档时禁止继续删除，必须保证至少 2 档以维持风控分级基础运行。",
          },
        ],
      },
    ],
  },
]
