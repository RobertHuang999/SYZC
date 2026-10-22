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
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { OUTBOUND_MGR_ROUTE } from "../domain/constants"
import { mobileOutboundRecordsMock } from "../mock/outbound-records.mock"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MobilePdfModal } from "@/features/inbound-records/components/MobilePdfModal"
import { DocumentManagementTab } from "@/shared/document-management"

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
  const [activeTab, setActiveTab] = useState<
    "goods" | "pickup" | "audit" | "documents"
  >("goods")
  const [toast, setToast] = useState<string | null>(null)
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

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const isTransferOrAssign =
    record.type === "移库出库" || record.type === "转让出库"

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["outbound-h5-detail"]}>
        <NavBar title="出库单详情" backTo={OUTBOUND_MGR_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        {/* 单号与基础信息（对齐入库详情排版） */}
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">出库单号</span>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                已通过
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="text-base font-bold leading-tight text-[#232D39] break-all">
                {record.orderNo}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(record.orderNo)}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              制单人： {record.createdByName} {record.createTime}
            </p>
          </div>

          <div className="pt-2 border-t border-[#232D39]/5 space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">货主主体</span>
              <span className="font-medium text-[#232D39] text-right">{record.ownerName}</span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">货主标识</span>
              <span className="text-[#232D39] text-right">
                {record.ownerIdentifier}（{record.ownerType}）
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">出库日期</span>
              <span className="text-[#232D39] text-right">{record.outboundTime}</span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">出库类型</span>
              <span className="text-[#232D39] text-right">{record.type}</span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">关联业务单</span>
              <span className="text-[#232D39] text-right">
                {record.relatedNo && record.relatedNo !== "—" ? record.relatedNo : "--"}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">监管仓库</span>
              <span className="text-[#232D39] text-right truncate max-w-[210px]">
                {record.warehouseName}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">备注信息</span>
              <span className="text-[#232D39] text-right">{record.notes || "--"}</span>
            </div>
          </div>
        </section>

        {/* Tab 选项卡（与入库详情同一套样式） */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", `货物明细 (${record.goodsList.length})`],
              ["pickup", "提货记录"],
              ["audit", "审批履历"],
              ["documents", "资料管理"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 min-w-0 whitespace-nowrap py-2 text-center text-xs font-medium cursor-pointer transition-colors ${
                activeTab === key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {label}
              {key === "pickup" && (
                <span
                  aria-hidden
                  className={`ml-1 inline-block size-1.5 rounded-full align-middle ${
                    record.pickCompleted
                      ? "bg-emerald-500"
                      : isTransferOrAssign
                        ? "bg-gray-300"
                        : "bg-blue-500"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: 货物明细列表 */}
        {activeTab === "goods" && (
          <div className="space-y-2.5">
            {/* 汇总条 */}
            <div className="flex items-center justify-between rounded-xl border border-blue-200/60 bg-blue-50/80 px-3.5 py-2.5 text-xs text-[#232D39]/80">
              <span>出库货品总计：{record.categoryCount} 种品类</span>
              <span className="font-bold text-sm text-blue-600">
                {record.totalAmount.toLocaleString()} {record.amountUnit}
              </span>
            </div>

            {record.goodsList.map((g, idx) => (
              <div
                key={g.id || idx}
                className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#232D39]">{g.goodsName}</h4>
                    <p className="text-[11px] text-[#232D39]/50">
                      规格/牌号：{g.specName} {g.extraInfo && `· ${g.extraInfo}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-base font-bold text-blue-600">
                      {g.totalOutboundAmount}
                    </span>
                    <span className="text-[11px] text-[#232D39]/50 ml-1">{g.unit}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px] text-[#232D39]/70 space-y-1">
                  <div className="flex justify-between gap-3">
                    <span className="shrink-0 text-[#232D39]/45">库位路径</span>
                    <span className="text-[#232D39] text-right">{g.locationPath || "—"}</span>
                  </div>
                  {g.barcode && (
                    <div className="flex justify-between gap-3">
                      <span className="shrink-0 text-[#232D39]/45">货物条码</span>
                      <span className="text-[#232D39] text-right">{g.barcode}</span>
                    </div>
                  )}
                  {g.beforeAmount !== undefined && g.afterAmount !== undefined && (
                    <div className="flex justify-between gap-3 border-t border-dashed border-[#232D39]/10 pt-1">
                      <span className="shrink-0 text-[#232D39]/45">库存变动</span>
                      <span className="text-[#232D39] text-right">
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
          <div className="space-y-2.5">
            {isTransferOrAssign ? (
              <div className="rounded-xl border border-dashed border-[#232D39]/15 bg-white p-6 text-center text-xs text-[#232D39]/60 space-y-2">
                <Truck className="size-8 mx-auto text-[#232D39]/25" />
                <p className="font-medium text-[#232D39]">
                  {record.type}无需生成提货单
                </p>
                <p className="text-[11px] text-[#232D39]/45">
                  移库出库与转让出库由移库管理与货物转让终审自动联动写入，不生成提货单。
                </p>
              </div>
            ) : !record.pickCompleted ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-center text-xs text-blue-800 space-y-2">
                <Clock className="size-7 mx-auto text-blue-500" />
                <p className="font-semibold text-blue-900">待现场提货核销</p>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  出库单已通过审批并生成提货单，提货码已下发。提货人完成装车复磅并出场核销后，将在此展示提货记录。
                </p>
              </div>
            ) : (
              <>
                {/* 提货人核验信息 */}
                {record.pickupInfo && (
                  <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2 text-xs">
                    <div className="font-bold text-[#232D39] pb-2 border-b border-[#232D39]/5 flex items-center gap-1.5">
                      <UserCheck className="size-4 text-emerald-600" />
                      提货人信息（申请时登记）
                    </div>

                    <div className="space-y-1.5 text-[#232D39]/70 text-[11px]">
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">提货人</span>
                        <span className="font-medium text-[#232D39] text-right">
                          {record.pickupInfo.name}（{record.pickupInfo.personType}）
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">联系电话</span>
                        <span className="text-[#232D39] text-right">
                          {record.pickupInfo.phone}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">证件号码</span>
                        <span className="text-[#232D39] text-right">
                          {record.pickupInfo.idCardNo}
                        </span>
                      </div>
                      {record.pickupInfo.plateNo && (
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">提货车牌</span>
                          <span className="font-medium text-blue-600 text-right">
                            {record.pickupInfo.plateNo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 现场提货核销记录 */}
                {record.pickupRecord && (
                  <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2 text-xs">
                    <div className="font-bold text-[#232D39] pb-2 border-b border-[#232D39]/5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="size-4 text-emerald-600" />
                        现场提货核销记录
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-medium border border-emerald-200">
                        提货完成
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[#232D39]/70 text-[11px]">
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">现场核销人</span>
                        <span className="font-medium text-[#232D39] text-right">
                          {record.pickupRecord.operatorName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">核销出库时间</span>
                        <span className="text-[#232D39] text-right">
                          {record.pickupRecord.pickupTime}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="shrink-0 text-[#232D39]/45">提货方式</span>
                        <span className="text-[#232D39] text-right">
                          {record.pickupRecord.isSelfPickup ? "客户自提" : "委托配送"}
                        </span>
                      </div>
                      {record.pickupRecord.notes && (
                        <div className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[#232D39]/70 leading-relaxed">
                          <span className="text-[#232D39]/45">现场说明：</span>
                          {record.pickupRecord.notes}
                        </div>
                      )}
                    </div>

                    {/* 现场照片与抓拍 */}
                    {record.pickupRecord.sitePhotos &&
                      record.pickupRecord.sitePhotos.length > 0 && (
                        <div className="pt-2 border-t border-[#232D39]/5 space-y-1.5">
                          <span className="text-[11px] text-[#232D39]/50 flex items-center gap-1">
                            <Camera className="size-3 text-[#232D39]/35" />
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
                                className="size-16 shrink-0 rounded-lg overflow-hidden border border-[#232D39]/10"
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
          <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs text-xs space-y-3">
            <div className="font-bold text-[#232D39] pb-2 border-b border-[#232D39]/5 flex items-center gap-1.5">
              <Clock className="size-4 text-blue-600" />
              全流程审核轨迹
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#232D39]/10">
              {(record.auditHistory || []).map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-5 top-1 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-semibold text-[#232D39]">
                      {step.nodeName}
                    </span>
                    <span className="shrink-0 text-[10px] text-[#232D39]/45">
                      {step.actionTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#232D39]/70 mt-0.5">
                    经办人：{step.handlerName} ·{" "}
                    <span className="font-medium text-emerald-700">
                      {step.actionName}
                    </span>
                  </p>
                  {step.comment && (
                    <p className="mt-1 rounded-lg bg-[#232D39]/[0.03] p-2 text-[11px] text-[#232D39]/70">
                      意见：{step.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "documents" && (
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
            <DocumentManagementTab
              orderNo={record.orderNo}
              orderType="outbound"
              ownerName={record.ownerName}
              warehouseName={record.warehouseName}
              onToast={showToast}
            />
          </section>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}

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
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md active:bg-blue-700"
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
