import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const deviceWarningDetailH5Annotations: PrototypeAnnotation[] = [
  {
    id: "h5-device-warning-detail-header",
    targetId: "h5-device-warning-detail-header",
    number: 1,
    kind: "页面",
    title: "移动端 · 设备预警详情与现场处置",
    content: "展示 IoT 硬件告警事实快照、现场抓拍凭证及处置流转历史；支持现场运维人员发起人工解除。",
    details: [
      {
        title: "生命周期与处置流转图",
        items: [
          {
            label: "状态流转",
            content: `flowchart TD
    A["IoT设备事件 (防抖通过)"] --> B["未处理(有效)"]
    B -->|"现场核验 / 人工解除"| C["已处理(有效)"]
    B -->|"规则删除/设备解绑"| D["未处理(无效) (只读归档)"]`,
          },
          {
            label: "业务定位",
            content: "移动端承载单条轮次事件的现场核查、抓拍调阅与快捷解除，保障一线监管与运维人员快速响应闭环。",
          },
        ],
      },
      {
        title: "上下游协同",
        items: [
          {
            label: "数据快照",
            content: "触发时固化规则快照（阈值、防抖参数、升级策略）、预警等级字典及抓拍凭证。",
          },
          {
            label: "下游联动",
            content: "解除成功后取消未完成的通知升级定时器，并同步更新 PC 大屏与移动端告警指标。",
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
    content: "展示事件系统标识、规则名称、预警大类/子类型、预警等级色块与当前状态。",
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
            label: "预警等级",
            content: "等级编码（01-04）及颜色快照（高危红/中危橙/低危黄/提示蓝）。",
          },
          {
            label: "预警状态",
            content: "未处理（有效）/ 未处理（无效）/ 已处理（有效）。",
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
    content: "未处理（有效）状态且支持人工解除的事件，底部展示【立即解除预警】操作入口。",
    details: [
      {
        title: "操作规范",
        items: [
          {
            label: "进入解除",
            content: "点击【立即解除预警】跳转至 `/m/iot/device-warning-events/:id/release` 填报现场处置材料。",
          },
          {
            label: "已处理状态",
            content: "展示解除人、解除时间与解除说明，全页面只读归档。",
          },
        ],
      },
    ],
  },
]
