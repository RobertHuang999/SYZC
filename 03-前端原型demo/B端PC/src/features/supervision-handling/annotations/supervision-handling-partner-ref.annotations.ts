import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const supervisionHandlingPartnerRefAnnotations: PrototypeAnnotation[] = [
  {
    id: "supervision-handling-page",
    targetId: "supervision-handling-page",
    number: 1,
    kind: "页面",
    title: "监管办理 · 合作方引用域（6.3）",
    content:
      "抵押/质押单权人仅查资金方信息域；监管服务单质权人仅查服务方信息域；货主统一货主信息域。选择器按 archiveMenu 硬隔离（PA-R12）。",
    details: [
      {
        title: "单据类型与档案域对照",
        items: [
          {
            label: "域对照表",
            content: `| 单据类型 | 权人界面称谓 | 合作方档案域 |
| 抵押单 / 质押单 | 抵押权人 / 质押权人 | 资金方信息 · R-PLG-14 · FN-R01 |
| 监管服务单 | 质权人（服务方） | 服务方信息 · R-PLG-15 · SP-R01 |
| 共用 | 货主 | 货主信息 · R-PLG-16 · WH-R01 |`,
          },
          {
            label: "选择流转示意",
            content: `flowchart LR
  A[选择单据类型] --> B[货主 · 货主信息域]
  A --> C{抵押/质押?}
  C -->|是| D[权人 · 资金方信息域]
  C -->|否| E[质权人 · 服务方信息域]
  B --> F[提交固化快照]
  D --> F
  E --> F`,
          },
        ],
      },
    ],
  },
  {
    id: "supervision-handling-holder-picker",
    targetId: "supervision-handling-holder-picker",
    number: 2,
    kind: "字段",
    title: "权人 / 质权人嵌入式选择器",
    content:
      "PartnerArchiveEmbeddedPicker 绑定 archiveMenu；监管服务单界面禁止「资金方」文案；详情深链带档案归属菜单。",
    details: [
      {
        title: "字段与规则",
        items: [
          {
            label: "权人合作方引用",
            content:
              "抵押/质押 → archiveMenu=资金方信息；【抵质押权人合作方引用规则】(R-PLG-14)。监管服务 → archiveMenu=服务方信息；【监管服务质权人合作方引用规则】(R-PLG-15)。",
          },
          {
            label: "域间隔离",
            content: "【合作方子菜单分视图与隐式角色规则】(PA-R12)：Mock 列表不得跨菜单域混选。",
          },
        ],
      },
    ],
  },
]
