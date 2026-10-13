import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { InboundBasicInfoSection } from "../components/InboundBasicInfoSection"
import { InboundFormSummaryBar } from "../components/InboundFormSummaryBar"
import { InboundGoodsSection } from "../components/InboundGoodsSection"
import { RelatedOrderPickerDialog } from "../components/RelatedOrderPickerDialog"
import { RELATED_ORDER_DIALOG_TITLE } from "../domain/form-constants"
import { INBOUND_FORM_MESSAGES } from "@prototype/shared/inbound/form-messages"
import { INBOUND_APPLY_LIST_PATH } from "../domain/constants"
import type { InboundFormState } from "../domain/form-types"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import { inboundRecordFormAnnotations } from "../annotations/inbound-record-form.annotations"
import {
  calcFormTotals,
  createEmptyGoodsLine,
  createInitialFormState,
  findFirstUnstackedLine,
  formHasDirtyFields,
} from "../lib/inbound-form-utils"
import {
  FORM_WAREHOUSES,
  getRelatedOrdersByType,
} from "../mock/inbound-form.mock"

export function InboundRecordFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<InboundFormState>(() => createInitialFormState())
  const [basicExpanded, setBasicExpanded] = useState(true)
  const [goodsExpanded, setGoodsExpanded] = useState(true)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [relatedOpen, setRelatedOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [highlightGoodsId, setHighlightGoodsId] = useState<string | null>(null)

  const totals = useMemo(() => calcFormTotals(form.goodsLines), [form.goodsLines])

  const patchForm = (patch: Partial<InboundFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const handleCancel = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(-1)
  }

  const handleOcr = () => {
    patchForm({
      ownerType: "企业货主",
      ownerName: "四川华西大宗商品供应链管理有限公司",
      ownerIdentifier: "91510100MA6289B51X",
      contactPhone: "028-87654321",
    })
    showToast("营业执照 OCR 拍照识别成功：已自动填入公司全称与统一信用代码")
  }

  const handleSubmit = () => {
    if (!form.inboundDate) {
      showToast("请填写入库日期")
      return
    }
    if (!form.ownerName.trim()) {
      showToast("请填写货主名称")
      return
    }
    if (!form.ownerIdentifier.trim()) {
      showToast("请填写货主标识（统一社会信用代码或手机号）")
      return
    }
    if (!form.warehouseId) {
      showToast("请选择入库仓库")
      return
    }
    if (form.storeroomIds.length === 0) {
      showToast("请选择入库库房")
      return
    }

    if (form.goodsLines.length === 0) {
      showToast(INBOUND_FORM_MESSAGES.needGoods)
      return
    }

    const emptyMeasure = form.goodsLines.find(
      (line) => line.measureValue.trim() === ""
    )
    if (emptyMeasure) {
      setHighlightGoodsId(emptyMeasure.id)
      showToast(INBOUND_FORM_MESSAGES.needMeasure)
      return
    }

    // 未堆放数量清零强阻断校验（对齐 11yuanma store-apply-info.vue line 2489）
    const badLine = findFirstUnstackedLine(form.goodsLines)
    if (badLine) {
      setHighlightGoodsId(badLine.id)
      showToast(`货品还有未堆放数量，请完成全部堆放后再提交`)
      return
    }

    const needsPhoto = form.goodsLines.some((line) => line.sitePhotoCount < 1)
    if (needsPhoto) {
      showToast(INBOUND_FORM_MESSAGES.needPhoto)
      return
    }

    // 格式校验
    if (form.ownerType === "个人货主") {
      if (form.idCardNo && form.idCardNo.length < 18) {
        showToast("请输入正确的身份证号码（18位）")
        return
      }
    } else if (form.ownerType === "企业货主") {
      if (form.ownerIdentifier.length < 18) {
        showToast("请输入正确的公司统一社会信用编码（18位）")
        return
      }
    }

    // 现网逻辑：直接进行基础信息校验后提交
    showToast("提交审核成功，入库申请已进入审批流程！")
    window.setTimeout(() => {
      navigate(INBOUND_APPLY_LIST_PATH)
    }, 800)
  }

  const relatedTitle =
    form.inboundType === "抵押入库" || form.inboundType === "质押入库"
      ? RELATED_ORDER_DIALOG_TITLE[form.inboundType]
      : "选择关联单"

  return (
    <PrototypeAnnotationProvider
      title="新增入库"
      documents={inboundRecordDocuments}
      annotations={inboundRecordFormAnnotations}
    >
      <div className="flex min-h-full flex-col">
        <div className="flex-1 space-y-4 p-6 pb-4">
          <PrototypeAnnotationTarget annotationIds={["inbound-form-page"]}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">新增入库</h1>
                <p className="text-sm text-muted-foreground">
                  支持普通/质押/抵押/仓单/监管服务入库；货品三级规格联动与多库位理货堆放分配
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  取 消
                </Button>
                <Button type="button" size="sm" onClick={handleSubmit}>
                  提交审核
                </Button>
              </div>
            </div>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["inbound-form-basic"]}>
            <InboundBasicInfoSection
              form={form}
              expanded={basicExpanded}
              onToggle={() => setBasicExpanded((v) => !v)}
              onChange={patchForm}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              onPickRelatedOrder={() => setRelatedOpen(true)}
              onOcrHint={handleOcr}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["inbound-form-goods"]}>
            <InboundGoodsSection
              form={form}
              expanded={goodsExpanded}
              highlightGoodsId={highlightGoodsId}
              onToggle={() => setGoodsExpanded((v) => !v)}
              onAddGoods={() => {
                if (!form.warehouseId || form.storeroomIds.length === 0) {
                  showToast("请先选择入库仓库与库房")
                  return
                }
                patchForm({
                  goodsLines: [
                    ...form.goodsLines,
                    createEmptyGoodsLine(),
                  ],
                })
              }}
              onUpdateLine={(lineId, nextLine) => {
                patchForm({
                  goodsLines: form.goodsLines.map((line) =>
                    line.id === lineId ? nextLine : line
                  ),
                })
              }}
              onRemoveLine={(lineId) => {
                patchForm({
                  goodsLines: form.goodsLines.filter((l) => l.id !== lineId),
                })
              }}
            />
          </PrototypeAnnotationTarget>
        </div>

        <div className="flex flex-col gap-4 border-t pt-4">
          <InboundFormSummaryBar
            categoryCount={totals.categoryCount}
            goodsTotal={totals.goodsTotal}
            stackedTotal={totals.stackedTotal}
            noStackTotal={totals.noStackTotal}
            variant="footer"
          />
          <div className="flex justify-end gap-3 pb-8">
            <Button type="button" variant="outline" onClick={handleCancel}>
              取消返回
            </Button>
            <Button type="button" onClick={handleSubmit}>
              提交入库申请
            </Button>
          </div>
        </div>

        {/* 关联单据选择弹窗 */}
        <RelatedOrderPickerDialog
          open={relatedOpen}
          title={relatedTitle}
          rows={getRelatedOrdersByType(form.inboundType)}
          onOpenChange={setRelatedOpen}
          onSelect={(order) => {
            patchForm({
              relatedOrderNo: order.orderNo,
              relatedOrderLabel: `${order.orderNo} · ${order.ownerName}`,
              ownerName: order.ownerName,
              ownerType: "企业货主",
              warehouseId: FORM_WAREHOUSES[0].id,
            })
            setRelatedOpen(false)
          }}
        />

        {/* 离开确认对话框 */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前表单存在已编辑内容，离开将丢失未提交的数据。确定返回吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                继续编辑
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLeaveOpen(false)
                  navigate(-1)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toast ? (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-foreground px-4 py-3 text-xs text-background shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
