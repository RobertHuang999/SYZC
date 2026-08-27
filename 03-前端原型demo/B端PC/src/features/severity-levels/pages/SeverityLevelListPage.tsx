import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DEFAULT_SEVERITY_LEVEL_FILTERS } from "../domain/constants"
import type { SeverityLevelFilters, SeverityLevelRecord } from "../domain/types"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { SeverityLevelFiltersPanel } from "../components/SeverityLevelFilters"
import { SeverityLevelTable } from "../components/SeverityLevelTable"
import { filterSeverityLevels } from "../lib/list-utils"
import { severityLevelsMock } from "../mock/severity-levels.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { severityLevelListAnnotations } from "../annotations/severity-level-list.annotations"
import { severityLevelDocuments } from "../documents/severity-level-documents"

export function SeverityLevelListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState<SeverityLevelFilters>(
    DEFAULT_SEVERITY_LEVEL_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<SeverityLevelFilters>(
    DEFAULT_SEVERITY_LEVEL_FILTERS
  )
  const [records, setRecords] = useState(severityLevelsMock)
  const [deleteTarget, setDeleteTarget] = useState<SeverityLevelRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredRecords = useMemo(
    () => filterSeverityLevels(records, appliedFilters),
    [records, appliedFilters]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setRecords((current) => {
      const next = [...current]
      const [movedItem] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, movedItem)
      return next.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      }))
    })
    showToast("预警等级排序已更新")
  }

  return (
    <PrototypeAnnotationProvider
      title="预警等级列表 · 原型批注"
      annotations={severityLevelListAnnotations}
      documents={severityLevelDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["severity-level-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">预警等级</h1>
          <p className="text-sm text-muted-foreground">
            维护租户预警等级字典，配置显示名称、标签颜色与订单同步范围
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            setAppliedFilters(draftFilters)
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["severity-level-filter"]}>
            <SeverityLevelFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={() => setAppliedFilters(draftFilters)}
              onReset={() => {
                setDraftFilters(DEFAULT_SEVERITY_LEVEL_FILTERS)
                setAppliedFilters(DEFAULT_SEVERITY_LEVEL_FILTERS)
              }}
              onAdd={() => navigate("/预警配置/预警等级/新增")}
            />
          </PrototypeAnnotationTarget>
        </form>

        <PrototypeAnnotationTarget annotationIds={["severity-level-table", "severity-level-row-actions"]}>
          <SeverityLevelTable
            records={filteredRecords}
            onEdit={(record) => navigate(`/预警配置/预警等级/编辑/${record.levelId}`)}
            onDelete={setDeleteTarget}
            onReorder={handleReorder}
          />
        </PrototypeAnnotationTarget>

        <div className="text-sm text-muted-foreground">
          共 {filteredRecords.length} 档
        </div>

        <DeleteConfirmDialog
          open={deleteTarget !== null}
          record={deleteTarget}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null)
            }
          }}
          onConfirm={(record) => {
            setRecords((current) => current.filter((item) => item.levelId !== record.levelId))
            setDeleteTarget(null)
            showToast("删除成功")
          }}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
