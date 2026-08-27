import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { SyncToOrderWarningLabel } from "../components/SyncToOrderWarningLabel"
import { getSeverityLevelById } from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { severityLevelDetailAnnotations } from "../annotations/severity-level-detail.annotations"
import { severityLevelDocuments } from "../documents/severity-level-documents"

const listPath = "/预警配置/预警等级"

export function SeverityLevelDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const record = useMemo(() => getSeverityLevelById(id), [id])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!record) {
    return (
      <div className="space-y-4 p-6">
        <Link to={listPath}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到该预警等级
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="预警等级详情 · 原型批注"
      annotations={severityLevelDetailAnnotations}
      documents={severityLevelDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["severity-level-detail-header", "severity-level-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                <SeverityLevelDisplay
                  severityCode={record.severityCode}
                  severityName={record.displayName}
                  severityColor={record.labelColor}
                />
              </h1>
              <Badge
                variant="outline"
                className={
                  record.enabled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }
              >
                {record.enabled ? "已启用" : "已停用"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to={listPath}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => navigate(`${listPath}/编辑/${record.levelId}`)}
              >
                编辑
              </Button>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                删除
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["severity-level-detail-base"]}>
          <DetailSection title="基本信息">
            <div className="grid gap-3 lg:grid-cols-2">
              <DetailField label="序号">{record.sortOrder}</DetailField>
              <DetailField label="严重度排序">
                <div className="space-y-1">
                  <span>{record.sortOrder}</span>
                  <p className="text-xs text-muted-foreground">越高越严重</p>
                </div>
              </DetailField>
              <DetailField label="等级编码">{record.severityCode}</DetailField>
              <DetailField label="显示名称">{record.displayName}</DetailField>
              <DetailField label="标签颜色">
                <span
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: record.labelColor }}
                  aria-label={record.displayName}
                />
              </DetailField>
              <DetailField label={<SyncToOrderWarningLabel />}>
                {record.syncToOrderWarning ? "是" : "否"}
              </DetailField>
              <DetailField label="是否启用">
                <div className="space-y-1">
                  <span>{record.enabled ? "是" : "否"}</span>
                  {!record.enabled && (
                    <p className="text-xs text-muted-foreground">
                      停用后，预警规则配置中不可选本档
                    </p>
                  )}
                </div>
              </DetailField>
              <DetailField label="等级说明">
                {formatEmptyValue(record.description ?? undefined)}
              </DetailField>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <DeleteConfirmDialog
          open={deleteOpen}
          record={record}
          onOpenChange={setDeleteOpen}
          onConfirm={() => {
            setDeleteOpen(false)
            showToast("删除成功")
            window.setTimeout(() => navigate(listPath), 400)
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
