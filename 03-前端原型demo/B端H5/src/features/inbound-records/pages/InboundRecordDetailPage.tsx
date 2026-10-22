import { useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getMobileInboundDetailById } from "../lib/mobile-detail-utils"
import { handleInboundDetailBack } from "../lib/inbound-detail-nav"
import { InboundGoodsDetailCardMobile } from "../components/InboundGoodsDetailCardMobile"
import { MobileQrModal } from "../components/MobileQrModal"
import { MobileImageModal } from "../components/MobileImageModal"
import { MobilePdfModal } from "../components/MobilePdfModal"
import { DocumentManagementTab } from "@/shared/document-management"

type TabKey = "goods" | "audit" | "modify" | "documents"

export function InboundRecordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const detail = useMemo(() => getMobileInboundDetailById(id), [id])

  const handleBack = () => handleInboundDetailBack(navigate, location)

  const [tab, setTab] = useState<TabKey>("goods")
  const [expandedGoods, setExpandedGoods] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  const [qrModalData, setQrModalData] = useState<{
    open: boolean
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
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
    fileName: string
    fileSize?: string
  }>({
    open: false,
    fileName: "",
  })

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!detail) {
    return (
      <MobileShell>
        <NavBar title="入库详情" onBack={handleBack} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该入库单
        </div>
      </MobileShell>
    )
  }

  const isGoodsExpanded = (lineId: string, index: number) =>
    expandedGoods[lineId] ?? index === 0

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-h5-detail"]}>
        <NavBar title="入库详情" onBack={handleBack} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">入库单号</span>
              <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-600">
                {detail.statusLabel}
              </span>
            </div>
            <p className="text-base font-bold text-[#232D39] leading-tight">{detail.orderNo}</p>
            <p className="text-[11px] text-[#232D39]/50 pt-0.5">
              制单人： {detail.creatorDisplay} {detail.createdAt}
            </p>
          </div>

          <div className="pt-2 border-t border-[#232D39]/5 space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">货主名称</span>
              <span className="font-medium text-[#232D39] text-right">{detail.ownerName}</span>
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">货主标识</span>
              <span className="text-[#232D39] text-right">{detail.ownerIdentifierMasked}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">入库日期</span>
              <span className="text-[#232D39] text-right">{detail.inboundDate}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">入库类型</span>
              <span className="text-[#232D39] text-right">{detail.inboundType}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">关联单号</span>
              <div className="flex items-center gap-1.5 text-right">
                <span className="text-[#232D39]">{detail.relatedOrderNo || "--"}</span>
                {detail.relatedOrderNo && (
                  <button
                    type="button"
                    onClick={() => showToast(`查看关联单: ${detail.relatedOrderNo}`)}
                    className="cursor-pointer font-medium text-blue-600 hover:underline"
                  >
                    查看
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">仓库名称</span>
              <span className="text-[#232D39] text-right truncate max-w-[210px]">
                {detail.warehouseName}
                {detail.houseNames ? ` · ${detail.houseNames}` : ""}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">备注信息</span>
              <span className="text-[#232D39] text-right">{detail.remark || "--"}</span>
            </div>
          </div>
        </section>

        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", "入库明细"],
              ["audit", "审核记录"],
              ["modify", "修改记录"],
              ["documents", "资料管理"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 min-w-0 whitespace-nowrap py-2 text-center text-xs font-medium cursor-pointer transition-colors ${
                tab === key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "goods" && (
          <div className="space-y-2.5">
            {detail.goodsLines.map((line, index) => (
              <InboundGoodsDetailCardMobile
                key={line.id}
                index={index}
                line={line}
                expanded={isGoodsExpanded(line.id, index)}
                onToggle={() =>
                  setExpandedGoods((prev) => ({
                    ...prev,
                    [line.id]: !isGoodsExpanded(line.id, index),
                  }))
                }
                onOpenQr={(payload) => setQrModalData({ open: true, ...payload })}
                onOpenPhotos={(images, initialIndex) =>
                  setImageModalData({ open: true, images, initialIndex })
                }
                onOpenPdf={(payload) =>
                  setPdfModalData({ open: true, fileName: payload.name, fileSize: payload.size })
                }
              />
            ))}
          </div>
        )}

        {tab === "audit" && (
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs text-xs space-y-3">
            {detail.auditTrail.map((step, idx) => (
              <div key={idx} className="border-b border-[#232D39]/5 pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#232D39]">{step.node}</span>
                  <span className="text-[#232D39]/50">{step.time}</span>
                </div>
                <p className="text-[#232D39]/70 mt-1">
                  {step.action}
                  {step.opinion ? `：${step.opinion}` : ""}
                </p>
                <p className="text-[11px] text-[#232D39]/50 mt-0.5">{step.actor}</p>
              </div>
            ))}
          </section>
        )}

        {tab === "modify" && (
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs text-xs">
            {detail.modifyLogs.length > 0 ? (
              <ul className="space-y-2">
                {detail.modifyLogs.map((log, idx) => (
                  <li key={idx} className="border-b border-[#232D39]/5 pb-2 last:border-0">
                    <p className="font-medium text-[#232D39]">{log.fieldLabel}</p>
                    <p className="text-[#232D39]/70">
                      {log.beforeValue} → {log.afterValue}
                    </p>
                    <p className="text-[11px] text-[#232D39]/50">
                      {log.operator} · {log.operatedAt}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#232D39]/40 py-6">暂无修改记录</p>
            )}
          </section>
        )}

        {tab === "documents" && (
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
            <DocumentManagementTab
              orderNo={detail.orderNo}
              orderType="inbound"
              ownerName={detail.ownerName}
              warehouseName={detail.warehouseName}
              onToast={showToast}
            />
          </section>
        )}
      </div>

      {qrModalData.open && (
        <MobileQrModal
          open={qrModalData.open}
          orderNo={detail.orderNo}
          onClose={() => setQrModalData((prev) => ({ ...prev, open: false }))}
          goodsName={qrModalData.goodsName}
          position={qrModalData.position}
          quantityLabel={qrModalData.quantityLabel}
          qrCodeNo={qrModalData.qrCodeNo}
        />
      )}

      {imageModalData.open && (
        <MobileImageModal
          open={imageModalData.open}
          onClose={() => setImageModalData((prev) => ({ ...prev, open: false }))}
          images={imageModalData.images}
          initialIndex={imageModalData.initialIndex}
        />
      )}

      {pdfModalData.open && (
        <MobilePdfModal
          open={pdfModalData.open}
          title="补充资料文档预览"
          fileName={pdfModalData.fileName}
          fileSize={pdfModalData.fileSize}
          orderNo={detail.orderNo}
          ownerName={detail.ownerName}
          warehouseName={detail.warehouseName}
          onClose={() => setPdfModalData((prev) => ({ ...prev, open: false }))}
        />
      )}

      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
    </MobileShell>
  )
}
