import type { InboundStagingReg } from "../domain/types"
import type { InboundStagingFilters } from "../domain/staging-list-types"

export function filterStagingRegs(
  rows: InboundStagingReg[],
  filters: InboundStagingFilters,
): InboundStagingReg[] {
  return rows.filter((row) => {
    if (filters.status !== "全部" && row.status !== filters.status) return false
    if (filters.inboundType !== "全部" && row.inboundType !== filters.inboundType) return false
    if (filters.regNo.trim()) {
      const q = filters.regNo.trim().toLowerCase()
      if (!row.regNo.toLowerCase().includes(q)) return false
    }
    if (filters.ownerKeyword.trim()) {
      const q = filters.ownerKeyword.trim().toLowerCase()
      if (
        !row.ownerDisplay.toLowerCase().includes(q) &&
        !(row.relatedOrderNo ?? "").toLowerCase().includes(q)
      )
        return false
    }
    if (filters.relatedFormalNo.trim()) {
      const q = filters.relatedFormalNo.trim()
      if (!(row.relatedFormalNo ?? "").includes(q)) return false
    }
    if (filters.warehouseCascadeKeys.length > 0) {
      const wh = filters.warehouseCascadeKeys[0]
      if (wh && !row.warehouseName.includes(wh)) return false
    }
    if (filters.inboundDateStart) {
      const day = row.inboundDate.slice(0, 10)
      if (day < filters.inboundDateStart) return false
    }
    if (filters.inboundDateEnd) {
      const day = row.inboundDate.slice(0, 10)
      if (day > filters.inboundDateEnd) return false
    }
    if (filters.registrantKeyword.trim()) {
      const q = filters.registrantKeyword.trim().toLowerCase()
      if (!row.registrant.toLowerCase().includes(q)) return false
    }
    return true
  })
}

export function paginateStagingRegs<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
