import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const deviceWarningDetailH5Annotations: PrototypeAnnotation[] = [
  {
    id: "h5-device-warning-detail-header",
    targetId: "h5-device-warning-detail-header",
    number: 1,
    kind: "页面",
    title: "移动端 · 设备预警详情与现场处置",
    content: "展示单条 IoT 硬件告警事实快照、现场抓拍凭证及处置留痕；一事件一条记录，无频次聚合。",
    details: [
      {
        title: "生命周期与处置流转图",
        items: [
          {
            label: "状态流转",
            content: `flowchart TD
    V["厂商预过滤回调"] --> B["待处置·有效 (逐条落账 R01)"]
    B -->|"现场核验 / 人工解除"| C["已结案·有效"]
    B -->|"规则删除/设备解绑"| D["已作废 (只读归档)"]`,
          },
          {
            label: "业务定位",
            content: "移动端承载单条独立流水的现场核查、抓拍调阅与快捷解除，保障一线监管与运维人员快速响应闭环。",
          },
        ],
      },
      {
        title: "上下游协同",
        items: [
          {
            label: "数据快照",
            content: "触发时固化规则快照（阈值、处置策略、规则 Version、升级策略）、预警等级字典及抓拍凭证。",
          },
          {
            label: "下游联动",
            content: "解除成功后取消该条流水挂起的升级定时器，并同步更新 PC 大屏与移动端告警指标。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-device-warning-detail-base",
    targetId: "h5-device-warning-detail-base",
    number: 2,
    kind: "字段",
    title: "基本信息与生命周期状态",
    content: "展示事件标识、规则名称、预警大类/子类型、预警等级色块、预警时间与当前状态。",
    details: [
      {
        title: "字段规范",
        items: [
          {
            label: "事件流水号",
            content: "系统全局唯一标识（如 evt-b2c3d4e5），只读不可篡改。",
          },
          {
            label: "规则快照",
            content: "展示触发时的规则名称与监控阈值快照，保持历史数据一致性。",
          },
          {
            label: "预警时间",
            content: "本条独立流水的触发时间 warningTime，作为升级计时起点。",
          },
          {
            label: "预警状态",
            content: "待处置 · 有效/ 已作废/ 已结案 · 有效。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-device-warning-detail-facts",
    targetId: "h5-device-warning-detail-facts",
    number: 3,
    kind: "字段",
    title: "触发事实、位置与抓拍凭证",
    content: "展示物理仓库、库区、关联硬件设备编码、结构化事实文本及防篡改抓拍大图。",
    details: [
      {
        title: "现场核查要点",
        items: [
          {
            label: "所属仓库 / 库区",
            content: "格式如【一号钢材仓 · B库区】；严格基于 P02 管辖仓库数据权限控制。",
          },
          {
            label: "关联设备",
            content: "设备名称与编号（如 CAM-01 / DEV-2026-0881）。",
          },
          {
            label: "抓拍凭证调阅",
            content: "支持点击抓拍缩略图放大查看高清防篡改水印大图，辅助现场人员确认异常事实。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-device-warning-detail-actions",
    targetId: "h5-device-warning-detail-actions",
    number: 4,
    kind: "交互",
    title: "底部处置操作与解除入口",
    content: "待处置 · 有效且快照 disposition=人工解除结案（R14'）时，底部展示【解除预警】；AUTO_RECOVER/RECORD_ONLY 无入口。",
    details: [
      {
        title: "操作规范",
        items: [
          {
            label: "进入解除",
            content: "点击【解除预警】跳转至 `/m/iot/device-warning-events/:id/release` 填报现场处置材料。",
          },
          {
            label: "已结案 · 有效",
            content: "展示解除人、解除时间与解除说明，全页面只读归档。",
          },
        ],
      },
    ],
  },
]
