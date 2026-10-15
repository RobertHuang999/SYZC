import type { NavigateFunction } from "react-router-dom"
import { resolveFormalInboundByOrderNo } from "@prototype/shared/inbound/formal-inbound-link"
import { inboundDetailRoute } from "@/features/inbound-records/domain/constants"
import { mobileInboundRecordsMock } from "@/features/inbound-records/mock/inbound-records.mock"

export function navigateToFormalInbound(
  orderNo: string | null | undefined,
  navigate: NavigateFunction,
  showToast: (message: string) => void,
): void {
  const trimmed = orderNo?.trim()
  if (!trimmed) {
    showToast("暂无关联正式单号")
    return
  }

  const catalog = resolveFormalInboundByOrderNo(trimmed)
  if (catalog?.kind === "approved-record") {
    navigate(inboundDetailRoute(catalog.mobileId))
    return
  }

  const dynamic = mobileInboundRecordsMock.find((row) => row.orderNo === trimmed)
  if (dynamic) {
    navigate(inboundDetailRoute(dynamic.id))
    return
  }

  if (catalog?.kind === "demo-apply") {
    showToast("该正式单在 PC 入库申请审核中（P10 演示），移动端暂无申请详情页")
    return
  }

  showToast(`未找到正式单 ${trimmed} 的可跳转详情（演示）`)
}
