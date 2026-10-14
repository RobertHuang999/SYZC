import type { StagingInboundType } from "../domain/types"
import { H5_INBOUND_INITIATE_BASE, PC_INBOUND_FORM_ADD_PATH } from "../domain/constants"

export type ConvertSurface = "pc" | "h5"

export type ConvertTarget =
  | { kind: "pc"; path: string }
  | { kind: "h5"; path: string }
  | { kind: "mobile_only"; h5Path: string }

export function resolveConvertTarget(
  inboundType: StagingInboundType,
  surface: ConvertSurface,
  regNo: string,
): ConvertTarget {
  const q = `sourceRegId=${encodeURIComponent(regNo)}`
  const h5Path = `${H5_INBOUND_INITIATE_BASE}?${q}`

  if (surface === "pc" && inboundType === "仓单入库") {
    return { kind: "mobile_only", h5Path }
  }

  if (surface === "h5") {
    return { kind: "h5", path: h5Path }
  }

  return { kind: "pc", path: `${PC_INBOUND_FORM_ADD_PATH}?${q}` }
}
