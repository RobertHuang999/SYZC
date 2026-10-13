import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
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
import { outboundRecordDocuments } from "../documents/outbound-record-documents"
import { outboundRecordFormAnnotations } from "../annotations/outbound-record-form.annotations"
import { OutboundBasicInfoSection } from "../components/OutboundBasicInfoSection"
import { OutboundGoodsPickerModal } from "../components/OutboundGoodsPickerModal"
import { OutboundGoodsSection } from "../components/OutboundGoodsSection"
import { OutboundPickupInfoSection } from "../components/OutboundPickupInfoSection"
import { OutboundFormSummaryBar } from "../components/OutboundFormSummaryBar"
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

export function OutboundRecordFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<OutboundFormState>(() => createInitialFormState())

  // 折叠状态
  const [basicExpanded, setBasicExpanded] = useState(true)
  const [goodsExpanded, setGoodsExpanded] = useState(true)
  const [pickupExpanded, setPickupExpanded] = useState(true)

  // 弹窗状态
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

  const patchForm = (p: Partial<OutboundFormState>) => {
    setForm((prev) => ({ ...prev, ...p }))
  }

  // 尝试返回或取消
  const handleCancel = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(OUTBOUND_RECORD_LIST_PATH)
  }

  // 点击添加货品
  const handleOpenGoodsPicker = () => {
    if (!form.ownerName) {
      showToast("请输入货主名称（C01）")
      return
    }
    setPickerOpen(true)
  }

  // 普通选货确认回填
  const handleConfirmGoodsPick = (selectedGoods: OutboundGoodsItem[]) => {
    // 合并货品明细 (O01 / O07)
    setForm((prev) => {
      const currentList = [...prev.goodsList]
      selectedGoods.forEach((newItem) => {
        const existingIdx = currentList.findIndex((g) => g.goodsName === newItem.goodsName)
        if (existingIdx >= 0) {
          // 同一规格货物合并位置
          currentList[existingIdx] = newItem
        } else {
          currentList.push(newItem)
        }
      })
      return { ...prev, goodsList: currentList }
    })
    showToast(`成功添加 ${selectedGoods.length} 项货品`)
  }

  // 关联单号确认带出
  const handleSelectRelatedOrder = (order: RelatedOrderItem) => {
    const convertedItems: OutboundGoodsItem[] = order.items.map((item, idx) => ({
      id: `REL-${idx + 1}`,
      categoryName: item.categoryName,
      subCategoryName: item.subCategoryName,
      specName: item.specName,
      goodsName: item.goodsName,
      extraInfo: item.extraInfo,
      totalOutboundAmount: item.availableAmount, // 默认带出全部可用量
      unit: item.unit,
      price: item.price,
      selected: true, // 默认勾选
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
    showToast(`已成功带出关联单据【${order.orderNo}】项下货物信息（O02）`)
  }

  // 移除普通货品行
  const handleRemoveGoodsLine = (goodsId: string) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.filter((g) => g.id !== goodsId),
    }))
  }

  // 关联货品行勾选切换
  const handleToggleGoodsSelect = (goodsId: string, selected: boolean) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.map((g) =>
        g.id === goodsId ? { ...g, selected } : g
      ),
    }))
  }

  // 关联货品出库数量修改
  const handleUpdateGoodsAmount = (goodsId: string, amount: number) => {
    setForm((prev) => ({
      ...prev,
      goodsList: prev.goodsList.map((g) =>
        g.id === goodsId ? { ...g, totalOutboundAmount: amount } : g
      ),
    }))
  }

  // 提交审核
  const handleSubmit = () => {
    const valResult = validateOutboundForm(form)
    if (!valResult.valid) {
      showToast(valResult.message || "表单填写有误，请核实")
      return
    }

    setSubmitLoading(true)

    setTimeout(() => {
      setSubmitLoading(false)

      // 生成新出库记录并写入 Mock 数据 (模拟审批流原子完成落库归档)
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
        pickCompleted: false, // 新制单默认生成提货单，待提货
        pickupInfo: {
          personType: form.pickupPersonType,
          name: form.pickupName,
          idCardNo: form.pickupIdCardNo,
          phone: form.pickupPhone,
          plateNo: form.plateNo,
          sitePhotos: form.sitePhotos,
          deviceSnapshots: [
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
          ],
        },
        auditRecord: {
          flowName: `${form.type}审批流转`,
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
              handlerName: "自动审批引擎",
              action: "APPROVE",
              actionName: "审批通过",
              actionTime: form.outboundDate,
              comment: "库存行级锁短时校验通过，扣减可用库存并已生成提货单（O09/O11）",
            },
          ],
        },
      }

      outboundRecordsMock.unshift(newRecord)
      showToast(`出库单【${newId}】提交成功，已归档进入出库台账并生成提货单！`)
      navigate(OUTBOUND_RECORD_LIST_PATH)
    }, 800)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增出库"
      documents={outboundRecordDocuments}
      annotations={outboundRecordFormAnnotations}
    >
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between">
        <div className="space-y-4 p-6">
          {/* 页头打点 */}
          <PrototypeAnnotationTarget annotationIds={["outbound-form-header"]}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 gap-1 text-xs"
                >
                  <ArrowLeft className="size-4" />
                  返回
                </Button>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                    新增出库申请
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    出库制单（P-CKG-010-ADD）· 先解押后发货，现场照片与设备抓拍双重存证
                  </p>
                </div>
              </div>
            </div>
          </PrototypeAnnotationTarget>

          {/* 折叠面板 1：基础信息 */}
          <PrototypeAnnotationTarget annotationIds={["outbound-form-basic"]}>
            <OutboundBasicInfoSection
              form={form}
              onPatch={patchForm}
              onSelectRelatedOrder={handleSelectRelatedOrder}
              expanded={basicExpanded}
              onToggle={() => setBasicExpanded(!basicExpanded)}
            />
          </PrototypeAnnotationTarget>

          {/* 折叠面板 2：货品明细 */}
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

          {/* 折叠面板 3：提货信息 */}
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

        {/* 固定底栏打点 */}
        <PrototypeAnnotationTarget annotationIds={["outbound-form-summary"]}>
          <OutboundFormSummaryBar
            categoryCount={totals.categoryCount}
            totalAmount={totals.totalAmount}
            unit={totals.unit}
            totalValueWan={totals.totalValueWan}
            isRelated={isRelated}
            loading={submitLoading}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </PrototypeAnnotationTarget>

        {/* 普通出库选货弹窗 */}
        <OutboundGoodsPickerModal
          open={pickerOpen}
          ownerName={form.ownerName}
          onClose={() => setPickerOpen(false)}
          onConfirm={handleConfirmGoodsPick}
        />

        {/* 图片大图预览 */}
        <ImageViewerModal
          url={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />

        {/* 未保存离开确认 Dialog */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-gray-900">
                未保存提示
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600">
                当前出库表单已有录入内容，离开后已填数据与已选货品将不予保留。确认退出吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeaveOpen(false)}
                className="text-xs"
              >
                继续编辑
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setLeaveOpen(false)
                  navigate(OUTBOUND_RECORD_LIST_PATH)
                }}
                className="text-xs"
              >
                放弃并离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 提示 Toast */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 rounded-lg bg-gray-900/90 px-4 py-2.5 text-xs text-white shadow-xl animate-in slide-in-from-bottom-2">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
