import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, Trash2, Camera, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordFormAnnotations } from "../annotations/transfer-record-form.annotations"
import { TransferBasicInfoSection } from "../components/TransferBasicInfoSection"
import { TransferGoodsSection } from "../components/TransferGoodsSection"
import { TransferPledgeTableSection } from "../components/TransferPledgeTableSection"
import { TransferFormSummaryBar } from "../components/TransferFormSummaryBar"
import { TransferSubmitConfirmDialog } from "../components/TransferSubmitConfirmDialog"
import { TRANSFER_RECORD_LIST_PATH } from "../domain/constants"
import type { TransferFormState } from "../domain/form-types"
import { calcFormTotals, validateTransferForm } from "../lib/form-utils"

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
]

export function TransferRecordFormPage() {
  const navigate = useNavigate()

  // 默认当前时间字符串 YYYY-MM-DD HH:mm:ss
  const now = new Date()
  const defaultDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

  const [formState, setFormState] = useState<TransferFormState>({
    transferTime: defaultDateStr,
    ownerType: "ENTERPRISE",
    ownerName: "上海物产金属国际贸易有限公司",
    ownerId: "OWN-01",
    ownerIdentity: "91310000717865432X",
    idCardNo: "",
    transferType: "NORMAL",
    relatedId: "",
    remark: "",
    normalGroups: [],
    pledgeItems: [],
    scenePhotos: [SAMPLE_PHOTOS[0]],
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleUpdate = (updated: Partial<TransferFormState>) => {
    setFormState((prev) => ({
      ...prev,
      ...updated,
    }))
  }

  // 试算品类数与总数量
  const totals = calcFormTotals(formState)

  const handleAddSamplePhoto = () => {
    if (formState.scenePhotos.length >= 10) {
      alert("现场照片最多只允许上传 10 张")
      return
    }
    const nextPhoto = SAMPLE_PHOTOS[formState.scenePhotos.length % SAMPLE_PHOTOS.length]
    handleUpdate({
      scenePhotos: [...formState.scenePhotos, nextPhoto],
    })
  }

  const handleRemovePhoto = (index: number) => {
    handleUpdate({
      scenePhotos: formState.scenePhotos.filter((_, i) => i !== index),
    })
  }

  const handleSubmitClick = () => {
    const { isValid, errors } = validateTransferForm(formState)
    if (!isValid) {
      alert("表单校验失败：\n" + errors.join("\n"))
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirmSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setConfirmOpen(false)
      alert("移库申请已成功提交至工作中心审批流，并已施加库存移库占用锁定！")
      navigate(TRANSFER_RECORD_LIST_PATH)
    }, 800)
  }

  return (
    <PrototypeAnnotationProvider
      documents={transferRecordDocuments}
      annotations={transferRecordFormAnnotations}
    >
      <div className="space-y-6 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif] pb-24">
        {/* 顶部导航与快捷操作 */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(TRANSFER_RECORD_LIST_PATH)}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4 mr-1" />
              返回
            </Button>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-base font-semibold text-foreground">
              新增移库申请
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(TRANSFER_RECORD_LIST_PATH)}
              className="h-8 px-3 text-xs"
            >
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-xs font-medium"
            >
              提交审核
            </Button>
          </div>
        </div>

        {/* Card 1：基础信息 */}
        <PrototypeAnnotationTarget annotationIds={["transfer-form-type-select"]}>
          <TransferBasicInfoSection form={formState} onChange={handleUpdate} />
        </PrototypeAnnotationTarget>

        {/* Card 2：货品明细区（普通移库折叠树形 vs 抵质押平铺） */}
        {formState.transferType === "NORMAL" ? (
          <PrototypeAnnotationTarget annotationIds={["transfer-form-picker-boundary", "transfer-form-batch-modal"]}>
            <TransferGoodsSection
              groups={formState.normalGroups}
              onChange={(groups) => handleUpdate({ normalGroups: groups })}
            />
          </PrototypeAnnotationTarget>
        ) : (
          <PrototypeAnnotationTarget annotationIds={["transfer-form-pledge-sync"]}>
            <TransferPledgeTableSection
              items={formState.pledgeItems}
              relatedId={formState.relatedId}
              onChange={(items) => handleUpdate({ pledgeItems: items })}
            />
          </PrototypeAnnotationTarget>
        )}

        {/* Card 3：现场照片上传 (R08) */}
        <PrototypeAnnotationTarget annotationIds={["transfer-form-scene-photo"]}>
          <Card className="shadow-sm border-border">
            <CardHeader className="py-3 px-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-1.5">
                  <span className="text-red-500">*</span> 现场移库作业照片
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  必须上传现场调拨实物抓拍照片（最多 10 张，支持 JPG / PNG，单张 ≤ 5MB）。
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSamplePhoto}
                disabled={formState.scenePhotos.length >= 10}
                className="h-8 text-xs font-normal"
              >
                <Plus className="size-3.5 mr-1" />
                模拟添加现场拍照 ({formState.scenePhotos.length}/10)
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <PrototypeSpecCallout>
                【现场照片必传与设备抓拍】(R08)：移库申请强制挂载现场移库作业照片原件；审批通过后向中仓登与司法存证中心存管链上分发
                (R09)。
              </PrototypeSpecCallout>

              <div className="flex flex-wrap gap-4">
                {formState.scenePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group size-28 rounded-lg overflow-hidden border border-border shadow-sm"
                  >
                    <img
                      src={photo}
                      alt="现场作业图"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-[10px] text-white text-center py-0.5">
                      照片 #{idx + 1}
                    </div>
                  </div>
                ))}

                {formState.scenePhotos.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="size-28 rounded-lg border-2 border-dashed border-border hover:border-primary/60 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <Camera className="size-6 mb-1 text-muted-foreground" />
                    <span className="text-xs">上传/拍照</span>
                    <span className="text-[10px] text-muted-foreground/70">
                      {formState.scenePhotos.length}/10
                    </span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 底部固定汇总与提交条 */}
        <TransferFormSummaryBar
          categoryCount={totals.categoryCount}
          totalQuantity={totals.totalQuantity}
          unit={totals.unit}
          submitting={submitting}
          onCancel={() => navigate(TRANSFER_RECORD_LIST_PATH)}
          onSubmit={handleSubmitClick}
        />

        {/* 提交确认弹窗 */}
        <TransferSubmitConfirmDialog
          open={confirmOpen}
          categoryCount={totals.categoryCount}
          totalQuantity={totals.totalQuantity}
          unit={totals.unit}
          submitting={submitting}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

