import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundBasicInfoSection } from "@/features/inbound-records/components/InboundBasicInfoSection"
import { InboundGoodsSection } from "@/features/inbound-records/components/InboundGoodsSection"
import { InboundFormSummaryBar } from "@/features/inbound-records/components/InboundFormSummaryBar"
import { RelatedOrderPickerDialog } from "@/features/inbound-records/components/RelatedOrderPickerDialog"
import { ImageViewerModal } from "@/features/inbound-records/components/ImageViewerModal"
import type { InboundFormState } from "@/features/inbound-records/domain/form-types"
import { getRelatedOrdersByType } from "@/features/inbound-records/mock/inbound-form.mock"
import { inboundStagingFormAnnotations } from "../annotations/inbound-staging-reg.annotations"
import { inboundStagingRegDocuments } from "../documents/inbound-staging-reg-documents"
import {
  INBOUND_STAGING_LIST_PATH,
  inboundStagingDetailPath,
} from "../domain/constants"
import {
  buildSavePayload,
  calcFormTotals,
  createEmptyGoodsLine,
  createStagingInitialForm,
  formFromFormalInbound,
  formFromStagingReg,
  formHasDirtyFields,
  validateStagingWeakSave,
} from "../lib/staging-form-utils"
import { getStagingRegById, saveStagingReg } from "../mock/inbound-staging.mock"

export function InboundStagingFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: editId } = useParams()
  const copyFromFormal = (location.state as { copyFromFormal?: InboundFormState } | null)
    ?.copyFromFormal

  const [form, setForm] = useState(() => createStagingInitialForm())
  const [basicExpanded, setBasicExpanded] = useState(true)
  const [goodsExpanded, setGoodsExpanded] = useState(true)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [relatedOpen, setRelatedOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const totals = useMemo(() => calcFormTotals(form.goodsLines), [form.goodsLines])
  const isEdit = Boolean(editId)

  useEffect(() => {
    if (editId) {
      const reg = getStagingRegById(editId)
      if (reg) {
        if (reg.status !== "待补全") {
          navigate(inboundStagingDetailPath(reg.id), { replace: true })
          return
        }
        setForm(formFromStagingReg(reg))
      }
      return
    }
    if (copyFromFormal) {
      setForm(formFromFormalInbound(copyFromFormal))
    }
  }, [editId, copyFromFormal, navigate])

  const patchForm = (patch: Partial<InboundFormState>) => {
    setDirty(true)
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2800)
  }

  const handleCancel = () => {
    if (dirty || formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(INBOUND_STAGING_LIST_PATH)
  }

  const handleSave = () => {
    const err = validateStagingWeakSave(form)
    if (err) {
      showToast(err)
      return
    }
    const payload = buildSavePayload(form, editId)
    if (!payload) {
      showToast("保存数据不完整")
      return
    }
    const saved = saveStagingReg(payload)
    setDirty(false)
    showToast(`已保存登记单 ${saved.regNo}（待补全）`)
    window.setTimeout(() => navigate(inboundStagingDetailPath(saved.id)), 700)
  }

  return (
    <PrototypeAnnotationProvider
      title="入库暂存登记 · 新增/编辑"
      documents={inboundStagingRegDocuments}
      annotations={inboundStagingFormAnnotations}
    >
      <div className="flex min-h-full flex-col bg-muted/10">
        <div className="flex-1 space-y-4 p-6 pb-4">
          <PrototypeAnnotationTarget annotationIds={["inbound-staging-form-page"]}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {isEdit ? "编辑入库暂存登记" : "新增入库暂存登记"}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  与入库记录共用货品 SKU、库位与影像口径；暂存阶段弱校验保存（P02~P05）
                </p>
              </div>
              <PrototypeAnnotationTarget annotationIds={["inbound-staging-form-save"]}>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    取 消
                  </Button>
                  <Button type="button" size="sm" onClick={handleSave}>
                    保存登记 / 暂存
                  </Button>
                </div>
              </PrototypeAnnotationTarget>
            </div>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["inbound-staging-form-basic"]}>
            <InboundBasicInfoSection
              variant="staging"
              form={form}
              expanded={basicExpanded}
              onToggle={() => setBasicExpanded((v) => !v)}
              onChange={patchForm}
              onPickRelatedOrder={() => setRelatedOpen(true)}
              onFormHint={showToast}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["inbound-staging-form-goods"]}>
          <InboundGoodsSection
            form={form}
            expanded={goodsExpanded}
            highlightGoodsId={null}
            onToggle={() => setGoodsExpanded((v) => !v)}
            onAddGoods={() => {
              if (!form.warehouseId) {
                showToast("请先选择入库仓库")
                return
              }
              patchForm({ goodsLines: [...form.goodsLines, createEmptyGoodsLine()] })
            }}
            onUpdateLine={(lineId, nextLine) => {
              patchForm({
                goodsLines: form.goodsLines.map((line) => (line.id === lineId ? nextLine : line)),
              })
            }}
            onRemoveLine={(lineId) => {
              patchForm({ goodsLines: form.goodsLines.filter((l) => l.id !== lineId) })
            }}
            onPreviewImage={(url) => setPreviewImageUrl(url)}
          />
          </PrototypeAnnotationTarget>
        </div>

        <div className="sticky bottom-0 z-20 border-t bg-card/95 px-6 py-3 shadow-xs backdrop-blur">
          <InboundFormSummaryBar
            categoryCount={totals.categoryCount}
            goodsTotal={totals.goodsTotal}
            stackedTotal={totals.stackedTotal}
            noStackTotal={totals.noStackTotal}
            variant="footer"
          />
          {totals.noStackTotal > 0 ? (
            <p className="mt-1 text-xs text-amber-700">未堆放数量为弱提示，暂存允许直接保存（P04）</p>
          ) : null}
        </div>

        <RelatedOrderPickerDialog
          open={relatedOpen}
          inboundType={form.inboundType || "质押入库"}
          currentOwnerName={form.ownerName}
          rows={getRelatedOrdersByType(form.inboundType || "质押入库")}
          onOpenChange={setRelatedOpen}
          onSelect={(order) => {
            patchForm({
              relatedOrderNo: order.orderNo,
              relatedOrderLabel: `${order.orderNo} · ${order.ownerName}`,
              ownerName: order.ownerName,
            })
            setRelatedOpen(false)
          }}
        />

        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>离开将丢失未保存的暂存内容，确定返回吗？</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                继续编辑
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLeaveOpen(false)
                  navigate(INBOUND_STAGING_LIST_PATH)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ImageViewerModal
          open={previewImageUrl !== null}
          images={previewImageUrl ? [previewImageUrl] : []}
          initialIndex={0}
          onClose={() => setPreviewImageUrl(null)}
        />

        {toast ? (
          <div className="fixed right-6 bottom-16 z-50 rounded-lg border bg-foreground px-4 py-3 text-xs text-background shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
