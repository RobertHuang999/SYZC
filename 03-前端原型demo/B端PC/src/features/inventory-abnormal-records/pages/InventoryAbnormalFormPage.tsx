import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  RotateCcw,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import { abnormalRecordDocuments } from "../documents/abnormal-record-documents"
import { FormPageHeader } from "@/shared/components/FormPageHeader"
import { FormPageStickyFooter } from "@/shared/components/FormPageStickyFooter"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { abnormalRecordFormAnnotations } from "../annotations/abnormal-record-form.annotations"
import { AbnormalGoodsPickerModal } from "../components/AbnormalGoodsPickerModal"
import { AbnormalSubmitConfirmDialog } from "../components/AbnormalSubmitConfirmDialog"
import { ImageViewerModal } from "../components/ImageViewerModal"
import {
  ABNORMAL_RECORD_LIST_PATH,
  ABNORMAL_TYPE_OPTIONS,
} from "../domain/constants"
import type { InStockItem } from "../domain/form-types"
import type { AbnormalTypeLabel } from "../domain/types"
import { calculateAbnormalDiff } from "../lib/form-utils"
import { inStockItemsMock } from "../mock/abnormal-form.mock"

export function InventoryAbnormalFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const stockIdParam = searchParams.get("stockId")

  // 当前选中的存货
  const [selectedStock, setSelectedStock] = useState<InStockItem>(() => {
    if (stockIdParam) {
      const found = inStockItemsMock.find((s) => s.stockId === stockIdParam)
      if (found) return found
    }
    return inStockItemsMock[0]
  })

  // 重新选择存货弹窗
  const [pickerOpen, setPickerOpen] = useState(false)

  // 异动表单输入
  const [afterQty, setAfterQty] = useState("")
  const [abnormalType, setAbnormalType] = useState<AbnormalTypeLabel | "">("其他")
  const [reason, setReason] = useState("")
  const [photos, setPhotos] = useState<string[]>([])

  // 确认弹窗与状态
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 未保存离开拦截：有改动时先确认
  const isDirty =
    reason.trim() !== "" ||
    photos.length > 0 ||
    abnormalType !== "其他" ||
    afterQty !== ""

  const handleBack = () => {
    if (isDirty) {
      setLeaveOpen(true)
      return
    }
    navigate(ABNORMAL_RECORD_LIST_PATH)
  }

  useEffect(() => {
    if (stockIdParam) {
      const found = inStockItemsMock.find((s) => s.stockId === stockIdParam)
      if (found) {
        setSelectedStock(found)
      }
    }
  }, [stockIdParam])

  // 差额动态试算
  const diffResult = useMemo(() => {
    if (!selectedStock) {
      return {
        beforeQty: 0,
        afterQty: 0,
        diffQty: 0,
        diffText: "",
        trend: "INVALID" as const,
      }
    }
    return calculateAbnormalDiff(selectedStock.availableQty, afterQty, selectedStock.unit)
  }, [selectedStock, afterQty])

  const handleReset = () => {
    setAfterQty("")
    setAbnormalType("其他")
    setReason("")
    setPhotos([])
  }

  const handleSelectDifferentStock = (item: InStockItem) => {
    setSelectedStock(item)
    setAfterQty("")
    setAbnormalType("其他")
    setReason("")
  }

  // 模拟图片上传
  const handleSimulateUpload = () => {
    if (photos.length >= 3) return
    const demoPhotos = [
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
    ]
    setPhotos((prev) => [...prev, demoPhotos[prev.length % demoPhotos.length]])
  }

  const handleDeletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmitClick = () => {
    if (!afterQty.trim() || diffResult.trend === "INVALID") {
      alert("请输入合法的异动后可用数量（必须大于0）")
      return
    }
    if (diffResult.trend === "EQUAL") {
      alert("异动后数量未发生改变，无需提交异动申请")
      return
    }
    if (!abnormalType) {
      alert("请选择异动类型")
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirmSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setConfirmOpen(false)
      setSubmitSuccess(true)
      setTimeout(() => {
        navigate(ABNORMAL_RECORD_LIST_PATH)
      }, 1500)
    }, 900)
  }

  return (
    <PrototypeAnnotationProvider
      title="货物异动申报"
      documents={abnormalRecordDocuments}
      annotations={abnormalRecordFormAnnotations}
    >
      <div className="flex min-h-full flex-col font-sans">
      <div className="flex-1 space-y-6 p-6 pb-6">
        {/* 顶部标题区 */}
        <FormPageHeader
          title="新增异动"
          description="盘盈、盘亏、损耗或其他原因导致实物账目不符时发起调账，提交后进入审批流程"
          onBack={handleBack}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="h-8 text-xs cursor-pointer"
            >
              更换存货
            </Button>
          }
        />

        <PrototypeSpecCallout>
          异动后数量必须大于 0 且不能超过该货位可用量；必须选择异动类型并填写变动原因；需上传现场证明附件，最多 3 张、单张不超过 5MB。
        </PrototypeSpecCallout>

        {submitSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <span>异动申请提交成功！货位状态已锁定为【异动申请中】，正在返回列表页...</span>
          </div>
        )}

        <div className="space-y-6">
          {/* 卡片1：基础信息 (只读快照) */}
          <PrototypeAnnotationTarget annotationIds={["abnormal-form-picker"]}>
            <DetailSection title="基础信息">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="货主" value={`${selectedStock.ownerName} (${selectedStock.ownerIdentity})`} />
                <DetailField label="制单人" value={selectedStock.creatorName} />
                <DetailField label="制单时间" value={selectedStock.creatorTime} />
                <DetailField label="入库类型" value={selectedStock.inboundType} />
                <DetailField label="货物信息" value={selectedStock.goodsTitle} />
                <DetailField label="入库日期" value={selectedStock.inboundDate} />
                <DetailField
                  label="入库单号"
                  value={
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedStock.inboundOrderId}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/仓储/入库管理/入库记录/详情/${selectedStock.inboundOrderId}`)
                        }
                        className="flex items-center text-primary hover:underline text-[11px] cursor-pointer"
                      >
                        [查看]
                        <ExternalLink className="size-3 ml-0.5" />
                      </button>
                    </div>
                  }
                />
                <DetailField label="备注信息" value={selectedStock.remark || "--"} />
                <DetailField label="仓库" value={selectedStock.warehouseName} />
                <DetailField label="库房" value={selectedStock.storeroomName} />
                <DetailField label="分区" value={selectedStock.partitionName} />
                <DetailField label="其他信息" value={selectedStock.otherInfo || "--"} />
              </div>
            </DetailSection>
          </PrototypeAnnotationTarget>

          {/* 卡片2：附件信息 (原入库凭据) */}
          <DetailSection title="附件信息">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">原现场照片</label>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedStock.livePhotos && selectedStock.livePhotos.length > 0 ? (
                    selectedStock.livePhotos.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImage(url)}
                        className="group relative size-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 cursor-pointer hover:shadow-md transition-shadow dark:border-slate-800"
                      >
                        <img
                          src={url}
                          alt="现场照片"
                          className="size-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white">
                          点击放大
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">无原现场照片</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <DetailField
                  label="补充资料"
                  value={
                    selectedStock.supplements && selectedStock.supplements.length > 0
                      ? selectedStock.supplements.join("、")
                      : "--"
                  }
                />
                <DetailField
                  label="设备抓拍图"
                  value={
                    selectedStock.snapshots && selectedStock.snapshots.length > 0
                      ? selectedStock.snapshots.join("、")
                      : "无设备抓拍图"
                  }
                />
              </div>
            </div>
          </DetailSection>

          {/* 卡片3：存货信息明细 */}
          <DetailSection title="存货信息">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-medium border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5 w-12 text-center">序号</th>
                    <th className="px-3 py-2.5">库房</th>
                    <th className="px-3 py-2.5">分区</th>
                    <th className="px-3 py-2.5">具体位置</th>
                    <th className="px-3 py-2.5">期初堆放数量</th>
                    <th className="px-3 py-2.5">可用数量</th>
                    <th className="px-3 py-2.5">冻结数量</th>
                    <th className="px-3 py-2.5 text-center">存货条码</th>
                    <th className="px-3 py-2.5">状态</th>
                    <th className="px-3 py-2.5 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-3 text-center text-slate-400">1</td>
                    <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {selectedStock.storeroomName}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {selectedStock.partitionName}
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {selectedStock.specificLocation || "--"}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                      {selectedStock.initialQty} {selectedStock.unit}
                    </td>
                    <td className="px-3 py-3 text-primary font-bold text-sm">
                      {selectedStock.availableQty} {selectedStock.unit}
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {selectedStock.frozenQty} {selectedStock.unit}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <QrCode className="size-4 text-slate-500" />
                        <span>{selectedStock.barcode}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                        {selectedStock.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-400">--</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DetailSection>

          {/* 卡片4：异动申请录入表单 (核心试算与规则交互) */}
          <PrototypeAnnotationTarget annotationIds={["abnormal-form-diff"]}>
            <DetailSection title="异动申请录入">
              <div className="space-y-6">
                {/* 异动前剩余可用数量 & 差额即时反馈 */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      异动前剩余可用数量：
                    </span>
                    <span className="ml-2 text-base font-bold text-slate-800 dark:text-slate-200">
                      {selectedStock.availableQty} {selectedStock.unit}
                    </span>
                  </div>

                  {/* 试算高亮提示 */}
                  {diffResult.trend === "INCREASE" && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md dark:bg-rose-950/40 dark:border-rose-900">
                      <span>⬆ 增量 +{diffResult.diffQty} {selectedStock.unit}</span>
                      <span className="text-slate-500 text-[11px]">(试算现存量: {diffResult.afterQty} {selectedStock.unit})</span>
                    </div>
                  )}
                  {diffResult.trend === "DECREASE" && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md dark:bg-emerald-950/40 dark:border-emerald-900">
                      <span>⬇ 减量 {diffResult.diffQty} {selectedStock.unit}</span>
                      <span className="text-slate-500 text-[11px]">(试算现存量: {diffResult.afterQty} {selectedStock.unit})</span>
                    </div>
                  )}
                  {diffResult.trend === "EQUAL" && (
                    <div className="text-xs text-amber-600 font-medium">
                      数量未发生变动
                    </div>
                  )}
                </div>

                {/* 异动后可用数量输入 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-1">*</span>
                      异动后可用数量
                    </label>
                    <span className="text-[11px] text-slate-400">
                      输入调整后的实物数量，必须严格大于0
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={afterQty}
                      onChange={(e) => setAfterQty(e.target.value)}
                      placeholder="请输入异动后可用数量"
                      className="h-10 text-sm pr-14 font-medium"
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 select-none">
                      {selectedStock.unit}
                    </div>
                  </div>
                  {diffResult.errorMsg && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3.5" />
                      {diffResult.errorMsg}
                    </p>
                  )}
                </div>

                {/* 异动类型下拉 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>
                    异动类型
                  </label>
                  <select
                    value={abnormalType}
                    onChange={(e) => setAbnormalType(e.target.value as AbnormalTypeLabel)}
                    className="flex h-[34px] w-full rounded-md border border-slate-200 bg-white px-3 py-0 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                  >
                    <option value="" disabled>请选择异动类型</option>
                    {ABNORMAL_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                </div>

                {/* 异动原因 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      异动原因
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {reason.length}/500 字
                    </span>
                  </div>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value.slice(0, 500))}
                    placeholder="请输入变动原因（如：例行盘点复核磅差、自然水分挥发脱水、装卸轻微货损纠偏等）"
                    rows={4}
                    className="text-xs resize-none"
                  />
                </div>

                {/* 附件上传 */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    现场证明附件
                  </label>
                  <p className="text-[11px] text-slate-400">
                    图片格式支持 jpg/png/jpeg，单张小于等于 5MB，最多上传 3 张
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative size-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800"
                      >
                        <img src={url} alt="证明照片" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(idx)}
                          className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}

                    {photos.length < 3 && (
                      <button
                        type="button"
                        onClick={handleSimulateUpload}
                        className="flex size-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 hover:border-primary hover:text-primary transition-colors cursor-pointer dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <Plus className="size-5 mb-1" />
                        <span className="text-[10px]">上传照片</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </DetailSection>
          </PrototypeAnnotationTarget>
        </div>

      </div>

        <FormPageStickyFooter
          left={
            <div className="flex flex-wrap items-center gap-3">
              <span>
                当前货位：
                <strong className="text-foreground">
                  {selectedStock.warehouseName}-{selectedStock.storeroomName}
                </strong>
              </span>
              <span>•</span>
              <span>
                期初数量：{selectedStock.initialQty} {selectedStock.unit}
              </span>
              <span>•</span>
              <span>
                异动前可用：{selectedStock.availableQty} {selectedStock.unit}
              </span>
            </div>
          }
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs cursor-pointer"
          >
            <RotateCcw className="mr-1.5 size-3.5" />
            重置表单
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmitClick}
            disabled={diffResult.trend === "INVALID" || diffResult.trend === "EQUAL"}
            className="h-8 text-xs font-semibold px-4 cursor-pointer"
          >
            <Send className="mr-1.5 size-3.5" />
            提交审核
          </Button>
        </FormPageStickyFooter>

        {/* 更换存货弹窗 */}
        <AbnormalGoodsPickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleSelectDifferentStock}
        />

        {/* 提交二次确认弹窗 */}
        <AbnormalSubmitConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          stock={selectedStock}
          diffResult={diffResult}
          abnormalType={abnormalType}
          submitting={submitting}
        />

        {/* 现场图片大图预览 */}
        <ImageViewerModal
          url={previewImage}
          onClose={() => setPreviewImage(null)}
        />

        {/* 未保存离开确认 */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前异动申请还有未提交的内容，离开将丢失已填写的数量和说明。确定返回列表吗？
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
                  navigate(ABNORMAL_RECORD_LIST_PATH)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrototypeAnnotationProvider>
  )
}

