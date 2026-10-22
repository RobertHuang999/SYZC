import { SOURCE_TYPE_LABELS, type PartnerSubject } from "../domain/types"

/** 详情只读展示：货主可为 C端注册/人工建档；其余三菜单固定人工建档（字段清单 7.3） */
export function resolveCreateSourceDisplayLabel(partner: PartnerSubject): string {
  if (partner.archiveMenu !== "货主信息") {
    return "人工建档"
  }
  return SOURCE_TYPE_LABELS[partner.source]
}
