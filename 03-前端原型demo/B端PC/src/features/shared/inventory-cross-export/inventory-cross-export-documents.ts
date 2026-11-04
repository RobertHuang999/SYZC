import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import deltaMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/15-仓储-库存查询-跨菜单批量导出规格.md?raw"

export const inventoryCrossExportDeltaDocument: PrototypeDocument = {
  id: "delta63-cross-export",
  title: "6.3 跨菜单批量导出",
  content: deltaMarkdown,
  category: "版本增量规格",
}

export function withInventoryCrossExportDelta(base: PrototypeDocument[]): PrototypeDocument[] {
  return [...base, inventoryCrossExportDeltaDocument]
}
