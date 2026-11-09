import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronDown, ChevronRight, QrCode, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordDetailAnnotations } from "../annotations/transfer-record-detail.annotations"
import { transferRecordsMock } from "../mock/transfer-records.mock"
import { TRANSFER_RECORD_LIST_PATH } from "../domain/constants"
import type { TransferRecord } from "../domain/types"


export function TransferRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("goods")
  const [expandedGoods, setExpandedGoods] = useState<Record<string, boolean>>({ "0": true })
  const [previewQrCode, setPreviewQrCode] = useState<{
    code: string
    url?: string
    title: string
  } | null>(null)

  const record: TransferRecord | undefined =
    transferRecordsMock.find((r) => r.id === id) || transferRecordsMock[0]

  const copyId = () => {
    if (!record) return
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const toggleGoodsExpand = (index: number) => {
    setExpandedGoods((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (!record) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <p className="text-sm text-slate-500">未找到该转让单据</p>
        <Button variant="outline" size="sm" onClick={() => navigate(TRANSFER_RECORD_LIST_PATH)}>
          返回列表
        </Button>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="转让详情原型批注"
      annotations={transferRecordDetailAnnotations}
      documents={transferRecordDocuments}
    >
      <div className="min-h-screen p-6 space-y-5 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DetailPageHeader
          title="转让单详情"
          number={record.id}
          numberLabel="转让单号"
          onBack={() => navigate(TRANSFER_RECORD_LIST_PATH)}
          onCopy={copyId}
          copied={copied}
        />

        {/* 纯净 6 项基础信息卡片（全面采用 DetailSection/DetailField，纯货权交易严格无照片无抓拍 R06） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-detail-basic-card"]}>
          <div className="relative">
            {/* 终态归档印章（大绿章【已通过】） */}
            <div className="pointer-events-none absolute right-8 top-8 select-none z-10">
              <div className="flex h-14 w-14 rotate-[-12deg] items-center justify-center rounded-full border-[3px] border-emerald-600 bg-emerald-50/70 p-1 text-center shadow-xs">
                <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-emerald-500 font-bold tracking-wider text-emerald-700 text-[11px]">
                  已通过
                </div>
              </div>
            </div>

            <DetailSection title="基础信息">
              <>
                <DetailField label="制单人">
                  {record.createByName}({record.createOrgName})
                </DetailField>
                <DetailField label="制单时间">
                  {record.createTime}
                </DetailField>

                <DetailField label="接收人">
                  <span className="font-medium text-slate-900">
                    {record.targetOwner.ownerName}
                  </span>
                  <span className="ml-1 text-slate-500">
                    ({record.targetOwner.ownerIdentity})
                  </span>
                </DetailField>
                <DetailField label="转让人">
                  <span className="font-medium text-slate-900">
                    {record.sourceOwner.ownerName}
                  </span>
                  <span className="ml-1 text-slate-500">
                    ({record.sourceOwner.ownerIdentity})
                  </span>
                </DetailField>

                <DetailField label="转让时间">
                  {record.assignTime}
                </DetailField>
                <DetailField label="所属仓库">
                  {record.warehouseName}
                </DetailField>

                <div>
                  <DetailField label="转让原因">
                    <span className="text-slate-700 leading-relaxed">
                      {record.assignReason || "—"}
                    </span>
                  </DetailField>
                </div>
              </>
            </DetailSection>
          </div>
        </PrototypeAnnotationTarget>

        {/* 转让明细与审核记录统一按页签展示 */}
        <DetailTabShell
          tabs={[
            { key: "goods", label: "转让明细" },
            { key: "audit", label: "审核记录" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        >
          {activeTab === "goods" && (
              <PrototypeAnnotationTarget annotationIds={["transfer-detail-goods-table"]}>
                <div className="space-y-3">
                  {record.goodsList.map((goods, gIdx) => (
                    <div
                      key={goods.id}
                      className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs"
                    >
                      {/* 一级规格主行 */}
                      <div
                        className="flex items-center justify-between bg-slate-50/80 px-4 py-3 cursor-pointer select-none"
                        onClick={() => toggleGoodsExpand(gIdx)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedGoods[gIdx] ? (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="font-semibold text-slate-900 text-sm">
                            {gIdx + 1}. {goods.goodsName}
                          </span>
                          <span className="text-slate-500 text-xs">
                            [{goods.warehouseName}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">转让数量：</span>
                          <span className="font-semibold text-slate-900 text-sm">
                            {goods.amount} {goods.unit}
                          </span>
                        </div>
                      </div>

                      {/* 二级储位明细表 */}
                      {expandedGoods[gIdx] && (
                        <div className="border-t border-slate-100 overflow-x-auto">
                          <Table className="w-full text-xs">
                            <TableHeader>
                              <TableRow className="bg-slate-50/50 text-slate-500 h-9">
                                <TableHead className="w-12 text-center">序号</TableHead>
                                <TableHead>位置 (储位)</TableHead>
                                <TableHead className="w-24">具体位置</TableHead>
                                <TableHead className="w-40">入库时间</TableHead>
                                <TableHead className="w-32">其他信息</TableHead>
                                <TableHead className="w-20 text-center">存货条码</TableHead>
                                <TableHead className="w-20 text-center">状态</TableHead>
                                <TableHead className="w-28 text-right pr-6">转让数量</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {goods.locations.map((loc, lIdx) => (
                                <TableRow key={loc.id} className="h-11">
                                  <TableCell className="text-center text-slate-400">
                                    {lIdx + 1}
                                  </TableCell>
                                  <TableCell className="font-medium text-slate-800">
                                    {loc.locationName}
                                  </TableCell>
                                  <TableCell className="text-slate-500">
                                    {loc.specificLocation}
                                  </TableCell>
                                  <TableCell className="text-slate-500">
                                    {loc.inboundTime}
                                  </TableCell>
                                  <TableCell className="text-slate-500">
                                    {loc.otherInfo || "—"}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPreviewQrCode({
                                          code: loc.barcode,
                                          url: loc.barcodeQrUrl,
                                          title: `${goods.goodsName} - 条码凭证`,
                                        })
                                      }
                                      className="text-primary hover:text-primary/80 transition-colors p-1"
                                      title="查看二维码条码大图"
                                    >
                                      <QrCode className="h-4 w-4" />
                                    </button>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {loc.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-slate-900 pr-6">
                                    {loc.amount} {loc.unit}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PrototypeAnnotationTarget>
          )}

          {activeTab === "audit" && (
              <PrototypeAnnotationTarget annotationIds={["transfer-detail-audit-timeline"]}>
                <div className="space-y-6 max-w-2xl py-2">
                  {record.auditLogs.map((log, index) => {
                    const isLast = index === record.auditLogs.length - 1
                    return (
                      <div key={log.id} className="relative flex items-start gap-4 text-xs">
                        {/* 左侧节点圆点与连线 */}
                        <div className="flex flex-col items-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          {!isLast && <div className="h-12 w-0.5 bg-slate-200 my-1" />}
                        </div>

                        {/* 右侧节点信息 */}
                        <div className="space-y-1 pt-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">
                                {log.nodeName}
                              </span>
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 border border-emerald-200">
                                {log.actionName}
                              </span>
                            </div>
                            <span className="text-slate-400 text-[11px]">{log.time}</span>
                          </div>

                          <div className="text-slate-500 flex items-center gap-2">
                            <span>处理人: {log.operatorName}</span>
                            <span>({log.operatorOrg})</span>
                          </div>

                          {log.comment && (
                            <div className="rounded bg-slate-50 p-2 text-slate-600 border border-slate-100 text-[11px]">
                              审核意见: {log.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </PrototypeAnnotationTarget>
          )}
        </DetailTabShell>

        {/* 二维码大图预览弹窗 */}
        {previewQrCode && (
          <Dialog open={!!previewQrCode} onOpenChange={() => setPreviewQrCode(null)}>
            <DialogContent className="max-w-xs text-center p-6">
              <DialogHeader>
                <DialogTitle className="text-sm font-semibold">
                  {previewQrCode.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-4 space-y-2">
                <img
                  src={
                    previewQrCode.url ||
                    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      previewQrCode.code
                    )}`
                  }
                  alt="存货条码"
                  className="h-44 w-44 rounded border p-2"
                />
                <div className="text-xs text-slate-500">
                  条码编号: {previewQrCode.code}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
