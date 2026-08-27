import { useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { collateralWarningListAnnotations } from "@/features/collateral-warning-events/annotations/collateral-warning-list.annotations"
import { collateralWarningDocuments } from "@/features/collateral-warning-events/documents/collateral-warning-documents"
import { deviceWarningListAnnotations } from "@/features/device-warning-events/annotations/device-warning-list.annotations"
import { deviceWarningDocuments } from "@/features/device-warning-events/documents/device-warning-documents"
import {
  PrototypeAnnotationProvider,
  type PrototypeAnnotation,
  type PrototypeDocument,
} from "./PrototypeAnnotationLayer"

export function AppAnnotationWrapper({ children }: { children: ReactNode }) {
  const location = useLocation()

  let pageTitle = "森云科技 · SYZC 移动端原型"
  let currentAnnotations: PrototypeAnnotation[] = []
  let currentDocuments: PrototypeDocument[] = []

  if (location.pathname.startsWith("/m/supervision/order-warnings")) {
    pageTitle = "押品预警信息 · 移动端交互与 PRD 标注"
    currentAnnotations = collateralWarningListAnnotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.startsWith("/m/iot/device-warning-events")) {
    pageTitle = "IoT 设备预警事件 · 移动端交互与 PRD 标注"
    currentAnnotations = deviceWarningListAnnotations
    currentDocuments = deviceWarningDocuments
  } else {
    pageTitle = "森云·可信供应链数字中枢 · 移动端原型"
    currentAnnotations = [
      {
        id: "home-metrics-card",
        targetId: "home-metrics-card",
        number: 1,
        kind: "页面",
        title: "中枢运行指标看板与预警快捷入口",
        content: "展示存货质押总货值、在库监管设备在线率与风控预警数量，支持一键穿透到预警处置中枢。",
        details: [
          {
            title: "业务规则",
            items: [
              { label: "实时数据", content: "每 30 秒轮询一次后端风控指标，并在异常突破警戒线时闪烁提示。" },
            ],
          },
        ],
      },
    ]
    currentDocuments = [
      {
        id: "home-prd",
        title: "森云可信中枢移动端首页 PRD 规格",
        category: "PRD需求规格",
        badge: "v6.2.0",
        content: `### 移动端中枢首页
面向企业风控总监、驻库监管员与银行客户经理，提供实时的**仓储现场视频轮播、指标大盘、风控告警穿透与扫码巡检**入口。`,
      },
    ]
  }

  return (
    <PrototypeAnnotationProvider
      title={pageTitle}
      annotations={currentAnnotations}
      documents={currentDocuments}
    >
      {children}
    </PrototypeAnnotationProvider>
  )
}
