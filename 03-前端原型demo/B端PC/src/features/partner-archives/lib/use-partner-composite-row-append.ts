import { useCallback, useState } from "react"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { PartnerSubject } from "../domain/types"
import { commitPartnerArchive } from "./detail-utils"
import { appendLinkedPartnerMenus } from "./linked-partner-archives"
export type PartnerCompositeFlowMode = "confirm" | "failure" | "success"
import {
  appendTargetMenusForPartner,
  buildCompositeAppendPlanForRowAppend,
  successLinesFromAppendPlan,
  type AppendPlanItem,
  type CompositePrecheckFailure,
  type CompositeSaveResultLine,
} from "./composite-append-save"

type UsePartnerCompositeRowAppendOptions = {
  getPartnerList: () => PartnerSubject[]
  onPartnerUpdated: (next: PartnerSubject) => void
}

export function usePartnerCompositeRowAppend({
  getPartnerList,
  onPartnerUpdated,
}: UsePartnerCompositeRowAppendOptions) {
  const [compositeOpen, setCompositeOpen] = useState(false)
  const [compositeMode, setCompositeMode] =
    useState<PartnerCompositeFlowMode>("confirm")
  const [compositePlan, setCompositePlan] = useState<AppendPlanItem[]>([])
  const [compositeFailures, setCompositeFailures] = useState<CompositePrecheckFailure[]>(
    [],
  )
  const [compositeSuccessLines, setCompositeSuccessLines] = useState<
    CompositeSaveResultLine[]
  >([])
  const [rowPartner, setRowPartner] = useState<PartnerSubject | null>(null)
  const [pendingMenus, setPendingMenus] = useState<PartnerArchiveMenuLabel[]>([])

  const resetCompositeFlow = useCallback(() => {
    setCompositeOpen(false)
    setRowPartner(null)
    setPendingMenus([])
    setCompositePlan([])
    setCompositeFailures([])
    setCompositeSuccessLines([])
  }, [])

  const submitAppendSelection = useCallback(
    (partner: PartnerSubject, menus: PartnerArchiveMenuLabel[]) => {
      const allowed = new Set(appendTargetMenusForPartner(partner))
      const safeMenus = menus.filter((menu) => allowed.has(menu))
      if (safeMenus.length === 0) {
        return
      }
      setRowPartner(partner)
      setPendingMenus(safeMenus)
      const { plan, failures } = buildCompositeAppendPlanForRowAppend(
        getPartnerList(),
        partner,
        safeMenus,
      )
      setCompositePlan(plan)
      if (failures.length > 0) {
        setCompositeFailures(failures)
        setCompositeMode("failure")
        setCompositeOpen(true)
        return
      }
      setCompositeFailures([])
      setCompositeMode("confirm")
      setCompositeOpen(true)
    },
    [getPartnerList],
  )

  const confirmCompositeAppend = useCallback(() => {
    if (!rowPartner || pendingMenus.length === 0) {
      return
    }
    const detail = `追加合作方档案：${pendingMenus
      .map((menu: PartnerArchiveMenuLabel) => `【${menu}】`)
      .join("、")}`
    const next = appendLinkedPartnerMenus(rowPartner, pendingMenus, detail)
    commitPartnerArchive(next)
    onPartnerUpdated(next)
    setCompositeSuccessLines(successLinesFromAppendPlan(compositePlan))
    setCompositeMode("success")
    setCompositeOpen(true)
  }, [compositePlan, onPartnerUpdated, pendingMenus, rowPartner])

  return {
    rowPartner,
    pendingMenus,
    compositeOpen,
    compositeMode,
    compositePlan,
    compositeFailures,
    compositeSuccessLines,
    setCompositeOpen,
    submitAppendSelection,
    confirmCompositeAppend,
    resetCompositeFlow,
  }
}
