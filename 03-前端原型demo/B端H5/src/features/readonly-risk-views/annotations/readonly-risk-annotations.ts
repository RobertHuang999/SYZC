import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"
import type { ReadonlyRiskModule } from "../types"

const annotationContent: Record<ReadonlyRiskModule, {
  listTitle: string
  listContent: string
  filterContent: string
  rowContent: string
  detailContent: string
}> = {
  "mid-loan": {
    listTitle: "贷中风控管理移动端只读台账",
    listContent: "移动端只提供贷中风控记录列表与执行历史详情；执行、批量执行和任务中心联登均保留在 PC 端。",
    filterContent: "按订单号、货主、模型和最近执行状态检索，移动端不展示执行按钮。",
    rowContent: "列表展示订单、押品、最近执行状态、执行资格和预警次数，点击进入只读详情。",
    detailContent: "详情固化订单识别信息、执行资格、最近执行状态和智风控异步执行历史。",
  },
  "risk-disclosure": {
    listTitle: "风险公示移动端台账",
    listContent: "移动端风险公示菜单提供台账查询、快照详情与公示管理；首次公示与批量公示仍从押品预警路径（/m/supervision/order-warnings）发起。",
    filterContent: "列表固定仅展示已公示记录（RISK-PUB-ST02）；筛选区为「搜索字段下拉 + 关键词输入」，先选规则名称/订单号/货主/预警类型，再对所选字段做模糊匹配；不提供公示时间日期范围筛选项。",
    rowContent: "卡片头部展示预警订单号与公示状态；灰底摘要区展示预警类型与公示内容；底部展示公示时间、操作人与「详情 ▸」入口，样式对齐押品预警卡片。",
    detailContent: "详情按公示状态 + 公示信息/处置信息快照分区展示；底部操作区与 PC/押品侧一致，已公示展示【取消公示】【重新公示】，已取消展示【重新公示】。",
  },
}

function createAnnotations(module: ReadonlyRiskModule): PrototypeAnnotation[] {
  const content = annotationContent[module]
  const prefix = `h5-${module}`
  const detailAnnotations: PrototypeAnnotation[] =
    module === "risk-disclosure"
      ? [
          {
            id: "h5-risk-disclosure-detail-actions",
            targetId: "h5-risk-disclosure-detail-actions",
            number: 5,
            kind: "交互",
            title: "详情底部操作区",
            content:
              "与 PC 风险公示详情、押品侧公示详情对齐：已公示展示【重新公示】【取消公示】；已取消仅展示【重新公示】。重新公示跳转押品预警公示确认页（republish=true）。",
            details: [
              {
                title: "按钮呈现",
                items: [
                  {
                    label: "重新公示",
                    content: "需存在关联押品预警 ID；跳转 /m/supervision/order-warnings/:id/publish 并携带 republish 状态。",
                  },
                  {
                    label: "取消公示",
                    content: "仅最新状态=已公示时展示；需 R-RISK-MGR 权限（原型 Mock 不校验）。",
                  },
                ],
              },
            ],
          },
          {
            id: "h5-risk-disclosure-detail-cancel",
            targetId: "h5-risk-disclosure-detail-cancel",
            number: 6,
            kind: "交互",
            title: "取消公示 Bottom Sheet",
            content:
              "固定合规文案 + 取消说明必填（1~200 字）；提交成功后状态变为已取消，写入操作记录并 Toast 提示。",
            details: [
              {
                title: "校验规则",
                items: [
                  {
                    label: "RISK-PUB-C02/C03",
                    content: "说明为空时【确认取消】禁用；成功后列表默认筛选将不再展示该记录。",
                  },
                ],
              },
            ],
          },
        ]
      : []

  return [
    {
      id: `${prefix}-list-page`,
      targetId: `${prefix}-list-page`,
      number: 1,
      kind: "页面",
      title: content.listTitle,
      content: content.listContent,
      details: [
        {
          title: "页面边界",
          items: [
            { label: "只读范围", content: content.listContent },
            { label: "数据权限", content: "按当前登录账号对应的订单、仓库或租户数据权限过滤。" },
          ],
        },
      ],
    },
    {
      id: `${prefix}-list-filter`,
      targetId: `${prefix}-list-filter`,
      number: 2,
      kind: "交互",
      title: "移动端字段检索",
      content: content.filterContent,
      details: [
        {
          title: "查询行为",
          items: [
            { label: "字段 + 关键词", content: "下拉选择搜索字段（规则名称/订单号/货主/预警类型），输入框仅对所选字段模糊匹配；列表数据源固定为已公示；不含公示时间日期范围筛选。" },
            { label: "列表约束", content: "列表和筛选区域不出现新增、批量发起或删除按钮；写操作集中在详情底部操作区。" },
          ],
        },
      ],
    },
    {
      id: `${prefix}-list-row`,
      targetId: `${prefix}-list-row`,
      number: 3,
      kind: "字段",
      title: "列表摘要与详情入口",
      content: content.rowContent,
      details: [
        {
          title: "字段与跳转",
          items: [
            { label: "列表摘要", content: content.rowContent },
            { label: "详情", content: "点击单条记录进入详情页，详情沿用同一模块的 PRD、字段清单和规则规格。" },
          ],
        },
      ],
    },
    {
      id: `${prefix}-detail`,
      targetId: module === "risk-disclosure" ? "h5-risk-disclosure-detail" : `${prefix}-detail`,
      number: 4,
      kind: "字段",
      title: module === "risk-disclosure" ? "快照详情与不可变边界" : "只读详情与不可变边界",
      content: content.detailContent,
      details: [
        {
          title: "详情内容",
          items: [
            { label: "展示范围", content: content.detailContent },
            {
              label: "交互边界",
              content:
                module === "risk-disclosure"
                  ? "支持返回列表；取消/重新公示写入 Mock 状态与操作记录，不回写押品预警原始事实。"
                  : "支持返回列表与分区折叠；不改变业务状态、不写入 Mock 数据。",
            },
          ],
        },
      ],
    },
    ...detailAnnotations,
  ]
}

export const readonlyRiskAnnotations = {
  "mid-loan": createAnnotations("mid-loan"),
  "risk-disclosure": createAnnotations("risk-disclosure"),
} as const
