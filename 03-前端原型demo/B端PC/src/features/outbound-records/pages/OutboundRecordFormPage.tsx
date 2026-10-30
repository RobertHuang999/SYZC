import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PartnerChangeFocusBanner } from "@/features/partner-synergy/components/PartnerChangeFocusBanner"
import {
  isPartnerChangeReviewMode,
  scrollToPartnerChangeMark,
} from "@/features/partner-synergy/lib/partner-change-review"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  ApprovalFlowSelectDialog,
  OUTBOUND_APPROVAL_FLOWS,
} from "@/features/inbound-records/components/ApprovalFlowSelectDialog"
import { outboundRecordDocuments } from "../documents/outbound-record-documents"
import { outboundRecordFormAnnotations } from "../annotations/outbound-record-form.annotations"
import { OutboundBasicInfoSection } from "../components/OutboundBasicInfoSection"
import { OutboundGoodsPickerModal } from "../components/OutboundGoodsPickerModal"
import { OutboundGoodsSection } from "../components/OutboundGoodsSection"
import { OutboundPickupInfoSection } from "../components/OutboundPickupInfoSection"
import { OutboundFormSummaryBar } from "../components/OutboundFormSummaryBar"
import { OutboundSubmitConfirmDialog } from "../components/OutboundSubmitConfirmDialog"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { OUTBOUND_RECORD_LIST_PATH } from "../domain/constants"
import type { OutboundFormState } from "../domain/form-types"
import type { OutboundGoodsItem, OutboundRecord } from "../domain/types"
import {
  calcFormTotals,
  createInitialFormState,
  formHasDirtyFields,
  validateOutboundForm,
} from "../lib/outbound-form-utils"
import type { RelatedOrderItem } from "../mock/outbound-form.mock"
import {
  CURRENT_USER_NAME,
  CURRENT_USER_ORG,
  outboundRecordsMock,
} from "../mock/outbound-records.mock"
import { addDeliveryOrderFromOutbound } from "@/features/delivery-orders/mock/delivery-orders.mock"

export function OutboundRecordFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const partnerReviewActive = isPartnerChangeReviewMode(searchParams.get("review"))
  const partnerMapId = searchParams.get("mapId")
  const [form, setForm] = useState<OutboundFormState>(() => createInitialFormState())

  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false)
  const [flowSelectOpen, setFlowSelectOpen] = useState(false)

  const [basicExpanded, setBasicExpanded] = useState(true)
  const [goodsExpanded, setGoodsExpanded] = useState(true)
  const [pickupExpanded, setPickupExpanded] = useState(true)

  const [leaveOpen, setLeaveOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const isRelated =
    form.type === "仓单出库" || form.type === "质押出库" || form.type === "抵押出库"

  const totals = useMemo(
    () => calcFormTotals(form.goodsList, form.type),
    [form.goodsList, form.type]
  )

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  useEffect(() => {
    if (!partnerReviewActive) return
    const markId =
      partnerMapId === "outbound-record" ? "outbound-owner" : "outbound-owner"
    const timer = window.setTimeout(() => scrollToPartnerChangeMark(markId), 120)
    return () => window.clearTimeout(timer)
  }, [partnerReviewActive, partnerMapId])

  const patchForm = (p: Partial<OutboundFormState>) => {
    setForm((prev) => ({ ...prev, ...p }))
  }

  const handleCancel = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(OUTBOUND_RECORD_LIST_PATH)
  }

  const handleOpenGoodsPicker = () => {
    if (!form.ownerPartnerId && !form.ownerName) {
      showToast("还没选货主，请先选好货主再继续")
      return
    }
    setPickerOpen(true)
  }

  const handleConfirmGoodsPick = (selectedGoods: OutboundGoodsItem[]) => {
    setForm((prev) => {
      const currentList = [...prev.goodsList]
      selectedGoods.forEach((newItem) => {
        const existingIdx = currentList.findIndex((g) => g.goodsName === newItem.goodsName)
        if (existingIdx >= 0) {
          currentList[existingIdx] = newItem
        } else {
          currentList.push(newItem)
        }
      })
      return { ...prev, goodsList: currentList }
    })
    showToast(`成功添加 ${selectedGoods.length} 项货品`)
  }

  const handleSelectRelatedOrder = (order: RelatedOrderItem) => {
    const convertedItems: OutboundGoodsItem[] = order.items.map((item, idx) => ({
      id: `REL-${idx + 1}`,
      categoryName: item.categoryName,
      subCategoryName: item.subCategoryName,
      specName: item.specName,
      goodsName: item.goodsName,
      extraInfo: item.extraInfo,
      totalOutboundAmount: item.availableAmount,
      unit: item.unit,
      price: item.price,
      selected: true,
      availableAmount: item.availableAmount,
      locationPath: item.locationPath,
      warehouseName: item.warehouseName,
      storeroomName: item.storeroomName,
      partitionName: item.partitionName,
      barcode: item.barcode,
    }))

    setForm((prev) => ({
      ...prev,
      relatedNo: order.orderNo,
      warehouseName: order.warehouseName,
      goodsList: convertedItems,
    }))
    showToast(`已带出关联单据【${order.orderNo}】下的货物信息`)
  }

  const handleRemoveGoodsLine = (goodsId: string) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.filter((g) => g.id !== goodsId),
    }))
  }

  const handleToggleGoodsSelect = (goodsId: string, selected: boolean) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.map((g) =>
        g.id === goodsId ? { ...g, selected } : g
      ),
    }))
  }

  const handleUpdateGoodsAmount = (goodsId: string, amount: number) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.map((g) =>
        g.id === goodsId ? { ...g, totalOutboundAmount: amount } : g
      ),
    }))
  }

  const handleSubmit = () => {
    const valResult = validateOutboundForm(form)
    if (!valResult.valid) {
      showToast(valResult.message || "表单填写有误，请核实")
      return
    }
    setConfirmSubmitOpen(true)
  }

  const handleProceedFlowSelect = () => {
    setConfirmSubmitOpen(false)
    setFlowSelectOpen(true)
  }

  const handleFinalSubmit = (selectedFlowId: string) => {
    setSubmitLoading(true)

    window.setTimeout(() => {
      setSubmitLoading(false)
      setFlowSelectOpen(false)

      const flowLabel =
        OUTBOUND_APPROVAL_FLOWS.find((f) => f.id === selectedFlowId)?.name ??
        "标准出库流程"

      const newId = `2061${Date.now().toString().slice(-15)}`
      const newRecord: OutboundRecord = {
        id: newId,
        orderNo: newId,
        ownerType: form.ownerType,
        ownerName: form.ownerName,
        ownerIdentifier: form.ownerIdentifier,
        ownerPhone: form.contactPhone,
        ownerIdCard: form.ownerIdCard,
        type: form.type,
        typeCode:
          form.type === "普通出库"
            ? "NORMAL"
            : form.type === "仓单出库"
            ? "RECEIPT"
            : form.type === "质押出库"
            ? "PLEDGE"
            : "MORTGAGE",
        outboundTime: form.outboundDate,
        warehouseName: form.warehouseName || "海霸王仓库",
        relatedNo: isRelated ? form.relatedNo : "—",
        notes: form.notes || "--",
        status: "已通过",
        statusCode: "APPROVED",
        goodsSummary: form.goodsList[0]?.goodsName || "大宗货物出库",
        goodsList: form.goodsList,
        totalAmount: totals.totalAmount,
        amountUnit: totals.unit,
        categoryCount: totals.categoryCount,
        totalValueWan: totals.totalValueWan,
        createdByName: CURRENT_USER_NAME,
        createdByOrg: CURRENT_USER_ORG,
        createTime: form.outboundDate,
        pickCompleted: false,
        pickupInfo: {
          personType: form.pickupPersonType,
          name: form.pickupName,
          idCardNo: form.pickupIdCardNo,
          phone: form.pickupPhone,
          identity: form.pickupIdentity,
          operatorName: form.pickupOperator,
          plateNo: form.plateNo,
          sitePhotos: form.sitePhotos,
          deviceSnapshots: [
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
          ],
        },
        auditRecord: {
          flowName: `${form.type}审批流转（${flowLabel}）`,
          nodes: [
            {
              id: "NEW-1",
              nodeName: "申请提交",
              handlerName: `${CURRENT_USER_NAME}（${CURRENT_USER_ORG}）`,
              action: "SUBMIT",
              actionName: "提交审核",
              actionTime: form.outboundDate,
              comment: form.notes || "出库申报提交",
            },
            {
              id: "NEW-2",
              nodeName: "审批通过",
              handlerName: "库管主管（张明远）",
              action: "APPROVE",
              actionName: "审批通过",
              actionTime: form.outboundDate,
              comment: "库存校验通过，已扣减可用库存并生成提货单",
            },
          ],
        },
      }

      outboundRecordsMock.unshift(newRecord)
      const newDelivery = addDeliveryOrderFromOutbound(newRecord)

      showToast(
        `出库单【${newId}】审批通过，可用库存已扣减，提货单【${newDelivery.orderNo}】已生成！`
      )
      navigate(OUTBOUND_RECORD_LIST_PATH)
    }, 700)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增出库"
      documents={outboundRecordDocuments}
      annotations={outboundRecordFormAnnotations}
    >
      <div className="flex min-h-full flex-col bg-muted/10">
        <div className="flex-1 space-y-4 p-6 pb-4">
          <PrototypeAnnotationTarget annotationIds={["outbound-form-header"]}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  新增出库
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  支持普通/仓单/质押/抵押出库；普通出库从可用库存选货，关联出库由业务单号带出明细并生成提货单
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  取 消
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                >
                  {submitLoading ? "提交中..." : "提交审核"}
                </Button>
              </div>
            </div>
          </PrototypeAnnotationTarget>

          {partnerReviewActive && partnerMapId ? (
            <PartnerChangeFocusBanner mapId={partnerMapId} />
          ) : null}

          <PrototypeAnnotationTarget annotationIds={["outbound-form-basic"]}>
            <OutboundBasicInfoSection
              form={form}
              onPatch={patchForm}
              onSelectRelatedOrder={handleSelectRelatedOrder}
              expanded={basicExpanded}
              onToggle={() => setBasicExpanded(!basicExpanded)}
              onHint={showToast}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["outbound-form-goods"]}>
            <OutboundGoodsSection
              type={form.type}
              goodsList={form.goodsList}
              relatedNo={form.relatedNo}
              expanded={goodsExpanded}
              onToggle={() => setGoodsExpanded(!goodsExpanded)}
              onOpenGoodsPicker={handleOpenGoodsPicker}
              onRemoveGoodsLine={handleRemoveGoodsLine}
              onToggleGoodsSelect={handleToggleGoodsSelect}
              onUpdateGoodsAmount={handleUpdateGoodsAmount}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["outbound-form-pickup"]}>
            <OutboundPickupInfoSection
              form={form}
              onPatch={patchForm}
              expanded={pickupExpanded}
              onToggle={() => setPickupExpanded(!pickupExpanded)}
              onPreviewImage={setPreviewImageUrl}
            />
          </PrototypeAnnotationTarget>
        </div>

        <div className="sticky bottom-0 z-20 border-t bg-card/95 px-6 py-3 backdrop-blur shadow-xs">
          <OutboundFormSummaryBar
            categoryCount={totals.categoryCount}
            totalAmount={totals.totalAmount}
            unit={totals.unit}
            totalValueWan={totals.totalValueWan}
            showValue={isRelated}
            variant="footer"
          />
        </div>

        <OutboundGoodsPickerModal
          open={pickerOpen}
          ownerName={form.ownerName}
          onClose={() => setPickerOpen(false)}
          onConfirm={handleConfirmGoodsPick}
        />

        <ImageViewerModal
          url={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />

        <OutboundSubmitConfirmDialog
          open={confirmSubmitOpen}
          onOpenChange={setConfirmSubmitOpen}
          outboundType={form.type}
          ownerName={form.ownerName}
          relatedNo={form.relatedNo}
          totalAmount={totals.totalAmount}
          unit={totals.unit}
          categoryCount={totals.categoryCount}
          pickupName={form.pickupName}
          pickupPhone={form.pickupPhone}
          plateNo={form.plateNo}
          warehouseName={form.warehouseName || "海霸王仓库"}
          onBack={() => setConfirmSubmitOpen(false)}
          onConfirm={handleProceedFlowSelect}
        />

        <ApprovalFlowSelectDialog
          open={flowSelectOpen}
          loading={submitLoading}
          onOpenChange={setFlowSelectOpen}
          onCancel={() => {
            setFlowSelectOpen(false)
            setConfirmSubmitOpen(true)
          }}
          onConfirm={handleFinalSubmit}
          title="流程确认"
          description={`该条【${form.type}】申请需系统审批，请选择具体流程。审批通过后将扣减可用库存并自动生成提货单。`}
          flows={OUTBOUND_APPROVAL_FLOWS}
          confirmLabel="确认提交审批并生成提货单"
          noticeTitle="💡 出库审批须知："
          noticeContent="提交后单据进入待审核状态；终审通过后系统锁定并扣减库存行，同步生成提货单供现场核销。超时请勿重复提交，可在出库申请列表查看进度。"
        />

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
                  navigate(OUTBOUND_RECORD_LIST_PATH)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage ? (
          <div className="fixed right-6 bottom-16 z-50 rounded-lg border bg-foreground px-4 py-3 text-xs text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
