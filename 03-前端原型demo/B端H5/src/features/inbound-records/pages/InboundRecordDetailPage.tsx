import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import {
  QrCode,
  FileText,
  Camera,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react"
import {
  buildInboundRecordDetail,
  getCanonicalRowByOrderNo,
  type InboundCheckStatus,
  type InboundListRowForDetail,
} from "@prototype/shared/inbound/build-inbound-detail"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { INBOUND_LIST_ROUTE } from "../domain/constants"
import { getMobileInboundById } from "../mock/inbound-records.mock"
import type { MobileInboundRecord } from "../domain/types"
import { MobileQrModal } from "../components/MobileQrModal"
import { MobileImageModal } from "../components/MobileImageModal"
import { MobilePdfModal } from "../components/MobilePdfModal"

type TabKey = "goods" | "audit" | "modify"

const STATUS_CLASS: Record<MobileInboundRecord["flowStatus"], { badge: string; label: string }> = {
  PENDING: { badge: "bg-blue-50 text-blue-700 border-blue-200", label: "待审核" },
  PROCESSING: { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "审核中" },
  APPROVED: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "已通过" },
  REJECTED: { badge: "bg-red-50 text-red-700 border-red-200", label: "未通过" },
  WITHDRAWN: { badge: "bg-gray-100 text-gray-600 border-gray-200", label: "已撤销" },
}

const statusToCheckStatus: Record<MobileInboundRecord["flowStatus"], InboundCheckStatus> = {
  PENDING: 0,
  PROCESSING: 1,
  APPROVED: 2,
  REJECTED: 3,
  WITHDRAWN: 4,
}

export function InboundRecordDetailPage() {
  const { id } = useParams()
  const baseRecord = useMemo(() => getMobileInboundById(id), [id])

  // 支持页面内撤销后动态刷新状态
  const [currentRecord, setCurrentRecord] = useState<MobileInboundRecord | undefined>(baseRecord)
  const [tab, setTab] = useState<TabKey>("goods")
  const [expandedGoods, setExpandedGoods] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  // 弹窗状态管理
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [qrModalData, setQrModalData] = useState<{
    open: boolean
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
    qrCodeUrl?: string
  }>({
    open: false,
    goodsName: "",
    position: "",
    quantityLabel: "",
    qrCodeNo: "",
  })

  const [imageModalData, setImageModalData] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  }>({
    open: false,
    images: [],
    initialIndex: 0,
  })

  const [pdfModalData, setPdfModalData] = useState<{
    open: boolean
    title: string
    fileName: string
    fileSize: string
  }>({
    open: false,
    title: "",
    fileName: "",
    fileSize: "1.2 MB",
  })

  // 深度解析全状态详情
  const detail = useMemo(() => {
    if (!currentRecord) return undefined
    const canonical = getCanonicalRowByOrderNo(currentRecord.orderNo)
    if (canonical && currentRecord.flowStatus === "APPROVED") {
      return buildInboundRecordDetail(canonical)
    }

    const checkStatus = statusToCheckStatus[currentRecord.flowStatus] ?? 2
    const qty = parseFloat(currentRecord.quantityLabel) || 50
    const unit = currentRecord.quantityLabel.includes("吨") ? "吨" : "公斤"

    const row: InboundListRowForDetail = {
      id: currentRecord.id,
      orderNo: currentRecord.orderNo,
      ownerName: currentRecord.ownerName,
      ownerType: currentRecord.ownerIdentifierMasked.startsWith("91") ? "2" : "1",
      ownerIdentifierMasked: currentRecord.ownerIdentifierMasked,
      inboundType: currentRecord.inboundType,
      inboundDate: currentRecord.inboundDate,
      warehouseName: currentRecord.warehouseName,
      houseNames: currentRecord.warehouseName.includes("海霸王") ? "1号冷冻库" : "1号标准库",
      relatedOrderNo: null,
      goodsNames: [currentRecord.goodsSummary],
      inboundQuantity: qty,
      unit,
      creatorDisplay: currentRecord.creatorDisplay,
      createdAt: currentRecord.createdAt,
      checkStatus,
      revokedTime: currentRecord.flowStatus === "WITHDRAWN" ? "2026-05-18 14:18:22" : null,
      remark: "进场验收核对一致，已按供应链金融存货质押指引完成现场核验。",
    }
    return buildInboundRecordDetail(row)
  }, [currentRecord])

  if (!currentRecord || !detail) {
    return (
      <MobileShell>
        <NavBar title="入库详情" backTo={INBOUND_LIST_ROUTE} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
          未找到该入库单
        </div>
      </MobileShell>
    )
  }

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleRevokeConfirm = () => {
    setCurrentRecord((prev) => (prev ? { ...prev, flowStatus: "WITHDRAWN" } : prev))
    setRevokeOpen(false)
    showToast("入库申请已撤销（P08）")
  }

  const statusMeta = STATUS_CLASS[currentRecord.flowStatus]

  const tabs: Array<[TabKey, string]> = [
    ["goods", "入库明细"],
    ["audit", "审核记录"],
    ["modify", "修改记录"],
  ]

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-h5-detail"]}>
        <NavBar title="入库详情" backTo={INBOUND_LIST_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#F4F5F8] p-3 pb-28">
        {/* 顶部主卡片 */}
        <section className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {/* 印章状态展示 */}
          {currentRecord.flowStatus === "APPROVED" && (
            <div className="pointer-events-none absolute right-3 top-3 flex size-16 items-center justify-center rounded-full border-2 border-emerald-500/80 text-[10px] font-bold text-emerald-600 -rotate-12">
              <div className="text-center">
                <p>森云监管</p>
                <p>已通过</p>
              </div>
            </div>
          )}
          {currentRecord.flowStatus === "WITHDRAWN" && (
            <div className="pointer-events-none absolute right-3 top-3 flex size-16 items-center justify-center rounded-full border-2 border-gray-400 text-[10px] font-bold text-gray-500 -rotate-12">
              <div className="text-center">
                <p>单据作废</p>
                <p>已撤销</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">入库流水号</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMeta.badge}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <p className="mt-1 font-mono text-sm font-bold text-gray-900">{currentRecord.orderNo}</p>
          <p className="mt-1.5 text-xs text-gray-500">
            制单人：{currentRecord.creatorDisplay} · {currentRecord.createdAt}
          </p>

          <dl className="mt-3 divide-y divide-gray-50 text-xs">
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-500">存货方/货主</dt>
              <dd className="max-w-[210px] truncate text-right font-medium text-gray-900">
                {currentRecord.ownerName}
                <span className="ml-1 text-gray-400 font-normal">
                  ({currentRecord.ownerIdentifierMasked})
                </span>
              </dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-500">入库类型</dt>
              <dd className="font-medium text-gray-900">{currentRecord.inboundType}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-500">入库时间</dt>
              <dd className="font-mono text-gray-800">{currentRecord.inboundDate}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-500">监管仓库</dt>
              <dd className="font-medium text-gray-900">{currentRecord.warehouseName}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-500">涉及库房</dt>
              <dd className="font-medium text-gray-900">{detail.houseNames}</dd>
            </div>
            {detail.revokedTime && (
              <div className="flex justify-between py-1.5 text-gray-500">
                <dt>撤销时间</dt>
                <dd className="font-mono text-gray-600">{detail.revokedTime}</dd>
              </div>
            )}
          </dl>

          {/* 归档单据快捷下载 */}
          {currentRecord.flowStatus === "APPROVED" && (
            <div className="mt-3 flex items-center justify-end gap-3 border-t border-gray-100 pt-2.5">
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-orange-600 active:opacity-75"
                onClick={() => {
                  setPdfModalData({
                    open: true,
                    title: "入库记录下载",
                    fileName: `入库明细清单_${currentRecord.orderNo}.xlsx`,
                    fileSize: "48 KB",
                  })
                }}
              >
                <FileCheck className="size-3.5" />
                下载记录
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-orange-600 active:opacity-75"
                onClick={() => {
                  setPdfModalData({
                    open: true,
                    title: "入库单据凭证下载",
                    fileName: `入库验收凭证_${currentRecord.orderNo}.pdf`,
                    fileSize: "1.4 MB",
                  })
                }}
              >
                <FileText className="size-3.5" />
                单据下载
              </button>
            </div>
          )}
        </section>

        {/* Tab 导航切换 */}
        <div className="flex rounded-xl bg-white p-1 shadow-sm">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                tab === key
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-gray-600 active:bg-gray-50"
              }`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: 入库明细 */}
        {tab === "goods" && (
          <div className="space-y-3">
            {/* 影像存证区块 (IoT 联动) */}
            <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <Camera className="size-4 text-orange-600" />
                  <span>进场影像存证 (IoT 抓拍)</span>
                </div>
                <span className="text-[10px] text-gray-400">R18 规则联动</span>
              </div>
              <div className="space-y-2">
                {detail.iotCaptures.map((cap) => (
                  <div
                    key={cap.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {cap.imageUrl ? (
                        <img
                          src={cap.imageUrl}
                          alt={cap.thumbnailLabel}
                          className="size-11 rounded-lg object-cover"
                          onClick={() => {
                            setImageModalData({
                              open: true,
                              images: [cap.imageUrl!],
                              initialIndex: 0,
                            })
                          }}
                        />
                      ) : (
                        <div className="flex size-11 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
                          <Camera className="size-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{cap.thumbnailLabel}</p>
                        <p className="text-[10px] text-gray-500">{cap.deviceName}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        cap.status === "成功" ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {cap.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 货品明细卡片列表 */}
            {detail.goodsLines.map((line, idx) => {
              const isExpanded = expandedGoods[line.id] ?? idx === 0
              return (
                <section
                  key={line.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div
                    className="flex cursor-pointer items-start justify-between"
                    onClick={() =>
                      setExpandedGoods((prev) => ({ ...prev, [line.id]: !isExpanded }))
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
                          序号 0{idx + 1}
                        </span>
                        <h4 className="truncate text-sm font-bold text-gray-900">{line.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{line.otherInfo}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-2 text-right">
                      <span className="text-xs font-bold text-orange-600">
                        {line.totalQuantityLabel}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* 展开的堆放明细与条码 */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-[11px] font-bold text-gray-700">理货堆放位置：</p>
                        <div className="mt-1.5 space-y-1.5">
                          {line.stacks.map((stk, sIdx) => (
                            <div
                              key={sIdx}
                              className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-xs"
                            >
                              <div className="flex justify-between font-medium text-gray-800">
                                <span>
                                  {stk.storeroom} / {stk.zone} / {stk.position}
                                </span>
                                <span className="font-bold text-orange-600">
                                  {stk.quantityLabel}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-between border-t border-gray-200/50 pt-2 text-[11px] text-gray-500">
                                <span className="font-mono text-gray-600">
                                  条码：{stk.qrCodeNo}
                                </span>
                                <button
                                  type="button"
                                  className="flex items-center gap-1 text-orange-600 active:opacity-75"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setQrModalData({
                                      open: true,
                                      goodsName: line.name,
                                      position: `${stk.storeroom} / ${stk.position}`,
                                      quantityLabel: stk.quantityLabel,
                                      qrCodeNo: stk.qrCodeNo,
                                      qrCodeUrl: stk.qrCodeUrl,
                                    })
                                  }}
                                >
                                  <QrCode className="size-3.5" />
                                  查看二维码
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 现场物料照片 */}
                      {line.scenePhotos && line.scenePhotos.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">物料现场抓拍照片：</p>
                          <div className="mt-1.5 flex gap-2 overflow-x-auto">
                            {line.scenePhotos.map((photo, pIdx) => (
                              <img
                                key={pIdx}
                                src={photo}
                                alt={`现场照片 ${pIdx + 1}`}
                                className="size-16 shrink-0 rounded-lg object-cover"
                                onClick={() => {
                                  setImageModalData({
                                    open: true,
                                    images: line.scenePhotos,
                                    initialIndex: pIdx,
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 质检与补充文件 */}
                      {line.supplementaryDocuments && line.supplementaryDocuments.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">质检证明与补充资料：</p>
                          <div className="mt-1.5 space-y-1">
                            {line.supplementaryDocuments.map((doc, dIdx) => (
                              <button
                                key={dIdx}
                                type="button"
                                className="flex w-full items-center justify-between rounded-lg bg-orange-50/50 px-2.5 py-1.5 text-left text-xs text-orange-900 active:bg-orange-100/50"
                                onClick={() => {
                                  setPdfModalData({
                                    open: true,
                                    title: "质检与补充材料预览",
                                    fileName: doc.name,
                                    fileSize: doc.size,
                                  })
                                }}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <FileText className="size-3.5 text-orange-600" />
                                  {doc.name}
                                </span>
                                <span className="text-[10px] text-gray-400">{doc.size}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}

        {/* Tab 2: 审核记录 */}
        {tab === "audit" && (
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <ShieldCheck className="size-4 text-emerald-600" />
              入库审批流转记录
            </h3>
            <div className="mt-4 space-y-4 border-l-2 border-orange-100 pl-4 text-xs">
              {detail.auditTrail.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-orange-500 ring-4 ring-orange-50" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{step.node}</span>
                    <span className="font-mono text-[11px] text-gray-400">{step.time}</span>
                  </div>
                  <p className="mt-0.5 text-gray-600">
                    处理人：{step.actor} · 动作：{step.action}
                  </p>
                  {step.opinion && (
                    <div className="mt-1.5 rounded-lg bg-gray-50 p-2 text-gray-700">
                      审核意见：{step.opinion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: 修改记录 */}
        {tab === "modify" && (
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-xs">
            {detail.modifyLogs && detail.modifyLogs.length > 0 ? (
              <div className="space-y-3">
                {detail.modifyLogs.map((log, idx) => (
                  <div key={idx} className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>{log.fieldLabel}</span>
                      <span className="font-mono text-[10px] text-gray-400">{log.operatedAt}</span>
                    </div>
                    <p className="mt-1 text-gray-500">操作人：{log.operator}</p>
                    <div className="mt-2 space-y-1 rounded border border-gray-200 bg-white p-2 text-[11px]">
                      <p className="text-gray-400 line-through">修改前：{log.beforeValue}</p>
                      <p className="font-medium text-emerald-700">修改后：{log.afterValue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <AlertCircle className="mx-auto size-6 text-gray-300" />
                <p className="mt-2">暂无入库信息修改记录</p>
                <p className="text-[10px] text-gray-400">（审批特权纠偏记录将公示于此）</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* 底部撤销操作栏（仅待审核、审核中状态支持制单人撤销） */}
      {(currentRecord.flowStatus === "PROCESSING" || currentRecord.flowStatus === "PENDING") && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white p-3 pb-safe shadow-lg">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-600 active:bg-red-100"
            onClick={() => setRevokeOpen(true)}
          >
            <RotateCcw className="size-4" />
            撤销入库申请
          </button>
        </div>
      )}

      {/* 撤销确认对话框 */}
      {revokeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900">确认撤销入库申请？</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              撤销后该入库单将直接作废，货品将释放，不可再继续审核。此操作不可逆。
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs text-gray-700 active:bg-gray-50"
                onClick={() => setRevokeOpen(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-medium text-white active:bg-red-700"
                onClick={handleRevokeConfirm}
              >
                确认撤销
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 存货二维码预览弹窗 */}
      <MobileQrModal
        open={qrModalData.open}
        orderNo={currentRecord.orderNo}
        goodsName={qrModalData.goodsName}
        position={qrModalData.position}
        quantityLabel={qrModalData.quantityLabel}
        qrCodeNo={qrModalData.qrCodeNo}
        qrCodeUrl={qrModalData.qrCodeUrl}
        onClose={() => setQrModalData((prev) => ({ ...prev, open: false }))}
      />

      {/* 现场照片大图切换预览 */}
      <MobileImageModal
        open={imageModalData.open}
        images={imageModalData.images}
        initialIndex={imageModalData.initialIndex}
        onClose={() => setImageModalData((prev) => ({ ...prev, open: false }))}
      />

      {/* 单据 PDF 预览 */}
      <MobilePdfModal
        open={pdfModalData.open}
        title={pdfModalData.title}
        fileName={pdfModalData.fileName}
        fileSize={pdfModalData.fileSize}
        orderNo={currentRecord.orderNo}
        ownerName={currentRecord.ownerName}
        warehouseName={currentRecord.warehouseName}
        onClose={() => setPdfModalData((prev) => ({ ...prev, open: false }))}
      />

      {/* 轻量 Toast 提示 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-xl bg-gray-900/95 px-4 py-2.5 text-xs text-white shadow-xl">
          {toast}
        </div>
      )}
    </MobileShell>
  )
}
