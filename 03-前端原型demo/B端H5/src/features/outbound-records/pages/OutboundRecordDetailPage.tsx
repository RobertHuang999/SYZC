import { useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Copy,
  Check,
  FileText,
  Camera,
  Clock,
  UserCheck,
  Truck,
  Building2,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { OUTBOUND_MGR_ROUTE } from "../domain/constants"
import { mobileOutboundRecordsMock } from "../mock/outbound-records.mock"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MobilePdfModal } from "@/features/inbound-records/components/MobilePdfModal"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"

export function OutboundRecordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const record = useMemo(() => {
    return (
      mobileOutboundRecordsMock.find((r) => r.id === id) ||
      mobileOutboundRecordsMock[0]
    )
  }, [id])

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"goods" | "pickup" | "audit">(
    "goods"
  )
  const [imageModalData, setImageModalData] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  }>({
    open: false,
    images: [],
    initialIndex: 0,
  })
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isTransferOrAssign =
    record.type === "移库出库" || record.type === "转让出库"

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["outbound-h5-detail"]}>
        <NavBar title="出库单详情" backTo={OUTBOUND_MGR_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="flex-1 overflow-y-auto bg-[#F5F6F8] pb-20">
        {/* 顶部单号与审批状态卡片 */}
        <div className="relative overflow-hidden bg-white px-4 py-3.5 border-b border-gray-100 shadow-xs">
          {/* 绿色审批通过印章 */}
          <div className="pointer-events-none absolute right-4 top-2 flex size-18 items-center justify-center rounded-full border-2 border-emerald-600/70 text-[11px] font-bold text-emerald-600/80 -rotate-12 select-none">
            <div className="text-center leading-tight">
              <p>审批通过</p>
              <p className="text-[9px] font-normal">森云质押核销</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-gray-900">
                {record.orderNo}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(record.orderNo)}
                className="text-gray-400 active:text-orange-600"
                title="复制单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                {record.type}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {record.outboundTime}
              </span>
            </div>
          </div>
        </div>

        {/* 基础信息卡片 */}
        <div className="px-3.5 pt-3">
          <NativeInfoCard title="基础信息" icon={<Building2 className="size-4" />}>
            <NativeFormRow label="货主主体">
              <span className="font-medium text-gray-900">{record.ownerName}</span>
            </NativeFormRow>
            <NativeFormRow label="货主标识">
              <span className="font-mono text-gray-600 text-xs">
                {record.ownerIdentifier} ({record.ownerType})
              </span>
            </NativeFormRow>
            <NativeFormRow label="出库类型">
              <span className="font-medium text-orange-600">{record.type}</span>
            </NativeFormRow>
            <NativeFormRow label="监管仓库">
              <span className="text-gray-900">{record.warehouseName}</span>
            </NativeFormRow>
            {record.relatedNo && record.relatedNo !== "—" && (
              <NativeFormRow label="关联业务单">
                <span className="font-mono font-bold text-orange-600">
                  {record.relatedNo}
                </span>
              </NativeFormRow>
            )}
            <NativeFormRow label="制单人">
              <span className="text-gray-700">{record.createdByName}</span>
            </NativeFormRow>
            <NativeFormRow label="制单时间">
              <span className="font-mono text-gray-500 text-xs">{record.createTime}</span>
            </NativeFormRow>
            {record.notes && (
              <div className="py-2.5 text-xs text-gray-600">
                <span className="text-gray-400">备注：</span>
                {record.notes}
              </div>
            )}
          </NativeInfoCard>
        </div>

        {/* Tab 选项卡（标准下划线切换） */}
        <div className="sticky top-0 z-10 flex border-y border-gray-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("goods")}
            className={`flex-1 py-3 text-center text-xs font-semibold transition-all border-b-2 ${
              activeTab === "goods"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500"
            }`}
          >
            货物明细 ({record.goodsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pickup")}
            className={`flex-1 py-3 text-center text-xs font-semibold transition-all border-b-2 ${
              activeTab === "pickup"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500"
            }`}
          >
            提货记录{" "}
            {record.pickCompleted ? (
              <span className="ml-1 rounded-full bg-emerald-100 px-1 text-[9px] text-emerald-700">
                已提货
              </span>
            ) : isTransferOrAssign ? (
              <span className="ml-1 rounded-full bg-gray-200 px-1 text-[9px] text-gray-600">
                免提货
              </span>
            ) : (
              <span className="ml-1 rounded-full bg-orange-100 px-1 text-[9px] text-orange-700">
                待提货
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-3 text-center text-xs font-semibold transition-all border-b-2 ${
              activeTab === "audit"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500"
            }`}
          >
            审批履历
          </button>
        </div>

        {/* Tab 1: 货物明细列表 */}
        {activeTab === "goods" && (
          <div className="p-3.5 space-y-2.5">
            {/* 汇总条 */}
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 px-3.5 py-2.5 text-xs text-orange-950 border border-orange-200/60">
              <span>出库货品总计：{record.categoryCount} 种品类</span>
              <span className="font-bold font-mono text-sm text-orange-600">
                {record.totalAmount.toLocaleString()} {record.amountUnit}
              </span>
            </div>

            {record.goodsList.map((g, idx) => (
              <div
                key={g.id || idx}
                className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{g.goodsName}</h4>
                    <p className="text-[11px] text-gray-500">
                      规格/牌号：{g.specName} {g.extraInfo && `· ${g.extraInfo}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-orange-600">
                      {g.totalOutboundAmount}
                    </span>
                    <span className="text-[11px] text-gray-500 ml-1">{g.unit}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-2.5 text-[11px] text-gray-600 space-y-1 font-mono">
                  <div className="flex justify-between font-sans">
                    <span className="text-gray-400">库位路径：</span>
                    <span className="text-gray-800">{g.locationPath || "—"}</span>
                  </div>
                  {g.barcode && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">货物条码：</span>
                      <span className="text-gray-700">{g.barcode}</span>
                    </div>
                  )}
                  {g.beforeAmount !== undefined && g.afterAmount !== undefined && (
                    <div className="flex justify-between border-t border-dashed border-gray-200 pt-1 font-sans">
                      <span className="text-gray-400">库存变动：</span>
                      <span className="text-gray-700">
                        前 {g.beforeAmount} {g.unit} → 后 {g.afterAmount} {g.unit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 提货记录 (回显提货信息与提货记录) */}
        {activeTab === "pickup" && (
          <div className="p-3.5 space-y-3">
            {isTransferOrAssign ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-xs text-gray-500 space-y-2">
                <Truck className="size-8 mx-auto text-gray-300" />
                <p className="font-medium text-gray-700">
                  {record.type}无需生成提货单
                </p>
                <p className="text-[11px] text-gray-400">
                  移库出库与转让出库由移库管理与货物转让终审自动联动写入，不生成提货单。
                </p>
              </div>
            ) : !record.pickCompleted ? (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 text-center text-xs text-orange-800 space-y-2">
                <Clock className="size-7 mx-auto text-orange-500" />
                <p className="font-semibold text-orange-900">待现场提货核销</p>
                <p className="text-[11px] text-orange-700 leading-relaxed">
                  出库单已通过审批并生成提货单，提货码已下发。提货人完成装车复磅并出场核销后，将在此展示提货记录。
                </p>
              </div>
            ) : (
              <>
                {/* 提货人核验信息 */}
                {record.pickupInfo && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm space-y-2 text-xs">
                    <div className="font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                      <UserCheck className="size-4 text-emerald-600" />
                      提货人信息（申请时登记）
                    </div>

                    <div className="space-y-1.5 text-gray-600 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">提货人：</span>
                        <span className="font-medium text-gray-900">
                          {record.pickupInfo.name} ({record.pickupInfo.personType})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">联系电话：</span>
                        <span className="font-mono text-gray-800">
                          {record.pickupInfo.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">证件号码：</span>
                        <span className="font-mono text-gray-800">
                          {record.pickupInfo.idCardNo}
                        </span>
                      </div>
                      {record.pickupInfo.plateNo && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">提货车牌：</span>
                          <span className="font-mono font-medium text-orange-600">
                            {record.pickupInfo.plateNo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 现场提货核销记录 */}
                {record.pickupRecord && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm space-y-2 text-xs">
                    <div className="font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="size-4 text-emerald-600" />
                        现场提货核销记录
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-medium border border-emerald-200">
                        提货完成
                      </span>
                    </div>

                    <div className="space-y-1.5 text-gray-600 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">现场核销人：</span>
                        <span className="font-medium text-gray-900">
                          {record.pickupRecord.operatorName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">核销出库时间：</span>
                        <span className="font-mono text-gray-700">
                          {record.pickupRecord.pickupTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">提货方式：</span>
                        <span className="text-gray-800">
                          {record.pickupRecord.isSelfPickup ? "客户自提" : "委托配送"}
                        </span>
                      </div>
                      {record.pickupRecord.notes && (
                        <div className="rounded-xl bg-gray-50 p-2.5 text-gray-700 leading-relaxed">
                          <span className="text-gray-400">现场说明：</span>
                          {record.pickupRecord.notes}
                        </div>
                      )}
                    </div>

                    {/* 现场照片与抓拍 */}
                    {record.pickupRecord.sitePhotos &&
                      record.pickupRecord.sitePhotos.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-1.5">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Camera className="size-3 text-gray-400" />
                            现场照片与装车抓拍（点击放大）
                          </span>
                          <div className="flex gap-2 overflow-x-auto">
                            {record.pickupRecord.sitePhotos.map((url, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setImageModalData({
                                    open: true,
                                    images: record.pickupRecord!.sitePhotos,
                                    initialIndex: idx,
                                  })
                                }
                                className="size-16 shrink-0 rounded-xl overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={url}
                                  alt="现场照片"
                                  className="size-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 3: 审批履历 */}
        {activeTab === "audit" && (
          <div className="p-3.5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-xs space-y-4">
              <div className="font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Clock className="size-4 text-orange-600" />
                全流程审核轨迹
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {(record.auditHistory || []).map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-5 top-1 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-gray-900">
                        {step.nodeName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {step.actionTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      经办人：{step.handlerName} ·{" "}
                      <span className="font-medium text-emerald-700">
                        {step.actionName}
                      </span>
                    </p>
                    {step.comment && (
                      <p className="mt-1 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-700">
                        意见：{step.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作固定栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={() => navigate(OUTBOUND_MGR_ROUTE)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 active:bg-gray-50"
        >
          返回台账
        </button>

        <button
          type="button"
          onClick={() => setPdfModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-md active:bg-orange-700"
        >
          <FileText className="size-3.5" />
          出库单据凭证
        </button>
      </div>

      {/* 弹窗：图片全屏预览 */}
      <MobileImageModal
        open={imageModalData.open}
        images={imageModalData.images}
        initialIndex={imageModalData.initialIndex}
        onClose={() =>
          setImageModalData({ open: false, images: [], initialIndex: 0 })
        }
      />

      {/* 弹窗：PDF 预览 */}
      <MobilePdfModal
        open={pdfModalOpen}
        title="监管仓库出库凭证"
        fileName={`出库单_${record.orderNo}.pdf`}
        orderNo={record.orderNo}
        ownerName={record.ownerName}
        warehouseName={record.warehouseName}
        onClose={() => setPdfModalOpen(false)}
      />
    </MobileShell>
  )
}
