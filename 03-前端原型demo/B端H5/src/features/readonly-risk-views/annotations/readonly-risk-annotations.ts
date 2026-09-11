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
    listTitle: "风险公示移动端只读台账",
    listContent: "移动端只查看已生成的风险公示记录；首次确认、批量公示和取消公示均在 PC 端完成。",
    filterContent: "按公示标题、订单号、货主、预警类型和公示状态检索，不提供写操作。",
    rowContent: "列表展示公示标题、订单、预警类型、处理时间与公示状态，点击进入不可变快照详情。",
    detailContent: "详情展示公示副本、原预警事实、快照边界和操作时间轴，不提供取消入口。",
  },
}

function createAnnotations(module: ReadonlyRiskModule): PrototypeAnnotation[] {
  const content = annotationContent[module]
  const prefix = `h5-${module}`
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
      title: "移动端查询与状态筛选",
      content: content.filterContent,
      details: [
        {
          title: "查询行为",
          items: [
            { label: "关键词", content: "关键词与状态按 AND 组合；清空关键词立即恢复当前状态筛选结果。" },
            { label: "只读约束", content: "列表和筛选区域不出现新增、编辑、启停、删除或执行按钮。" },
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
      targetId: `${prefix}-detail`,
      number: 4,
      kind: "字段",
      title: "只读详情与不可变边界",
      content: content.detailContent,
      details: [
        {
          title: "详情内容",
          items: [
            { label: "展示范围", content: content.detailContent },
            { label: "交互边界", content: "支持返回列表与分区折叠；不改变业务状态、不写入 Mock 数据。" },
          ],
        },
      ],
    },
  ]
}

export const readonlyRiskAnnotations = {
  "mid-loan": createAnnotations("mid-loan"),
  "risk-disclosure": createAnnotations("risk-disclosure"),
} as const
