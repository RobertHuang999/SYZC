import { INBOUND_APPROVED_SEEDS } from "./inbound-approved-seed"

export type FormalInboundResolveResult =
  | { kind: "approved-record"; pcId: string; mobileId: string }
  | { kind: "demo-apply"; applyId: string }

/** P10 演示：正式单号仅挂在 PC 入库申请台账 */
const DEMO_APPLY_BY_ORDER_NO: Record<string, string> = {
  "2026101415101200008": "apply-staging-p10",
}

export function resolveFormalInboundByOrderNo(
  orderNo: string | null | undefined,
): FormalInboundResolveResult | null {
  const trimmed = orderNo?.trim()
  if (!trimmed) return null

  const seed = INBOUND_APPROVED_SEEDS.find((s) => s.orderNo === trimmed)
  if (seed) {
    return { kind: "approved-record", pcId: seed.pcId, mobileId: seed.mobileId }
  }

  const applyId = DEMO_APPLY_BY_ORDER_NO[trimmed]
  if (applyId) return { kind: "demo-apply", applyId }

  return null
}
