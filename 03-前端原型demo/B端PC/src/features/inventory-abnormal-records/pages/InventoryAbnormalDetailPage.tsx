import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { abnormalRecordDocuments } from "../documents/abnormal-record-documents"
import { abnormalRecordDetailAnnotations } from "../annotations/abnormal-record-detail.annotations"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { ABNORMAL_RECORD_LIST_PATH } from "../domain/constants"
import { abnormalRecordsMock } from "../mock/abnormal-records.mock"
import type { AbnormalRecord, AbnormalOrderTypeLabel } from "../domain/types"

/** 数量统一按 3 位小数展示（业务计量精度） */
const fmtQty = (value: number) =>
  value.toLocaleString("zh-CN", { maximumFractionDigits: 3 })

function OrderTypeTag({ type }: { type: AbnormalOrderTypeLabel }) {
  switch (type) {
    case "质押单":
      return (
        <Badge
          variant="outline"
          className="border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 text-xs px-2.5 py-0.5"
        >
          质押单
        </Badge>
      )
    case "抵押单":
      return (
        <Badge
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 text-xs px-2.5 py-0.5"
        >
          抵押单
        </Badge>
      )
    case "监管业务单":
      return (
        <Badge
          variant="outline"
          className="border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 text-xs px-2.5 py-0.5"
        >
          监管业务单
        </Badge>
      )
    case "存货单":
    default:
      return (
        <Badge
          variant="outline"
          className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs px-2.5 py-0.5"
        >
          存货单
        </Badge>
      )
  }
}

export function InventoryAbnormalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("goods")

  // 匹配异动记录
  const record: AbnormalRecord =
    abnormalRecordsMock.find((r) => r.id === id) || abnormalRecordsMock[0]

  const handleCopyNo = () => {
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <PrototypeAnnotationProvider
      title="货物异动详情"
      documents={abnormalRecordDocuments}
      annotations={abnormalRecordDetailAnnotations}
    >
      <div className="min-h-[calc(100vh-64px)] p-6 pb-20 font-sans">
        <div className="space-y-6">
          <DetailPageHeader
            title="异动详情"
            number={record.id}
            numberLabel="异动单号"
            status={
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 px-2.5 text-xs font-normal text-emerald-700"
              >
                已生效归档
              </Badge>
            }
            onBack={() => navigate(ABNORMAL_RECORD_LIST_PATH)}
            onCopy={handleCopyNo}
            copied={copied}
            actions={<OrderTypeTag type={record.relateOrderType} />}
          />

          {/* 异动信息（业务摘要字段） */}
          <PrototypeAnnotationTarget annotationIds={["abnormal-detail-card"]}>
            <DetailSection title="基础信息">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DetailField label="关联单据">{record.relateId || "—"}</DetailField>
                <DetailField label="单据类型">
                  <OrderTypeTag type={record.relateOrderType} />
                </DetailField>
                <DetailField label="货主">{record.owner.ownerName}</DetailField>
                <DetailField label="货主标识">{record.owner.ownerIdentity}</DetailField>
                <DetailField label="申请人">{record.applicantName}</DetailField>
                <DetailField label="申请时间">{record.applyTime}</DetailField>
                <DetailField label="审批流程">{record.processTitle}</DetailField>
              </div>
            </DetailSection>
          </PrototypeAnnotationTarget>

          <DetailTabShell
            tabs={[
              { key: "goods", label: "调账货品明细" },
              { key: "audit", label: "审核记录" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          >
          {activeTab === "goods" && (
          <PrototypeAnnotationTarget annotationIds={["abnormal-detail-card"]}>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[960px] table-fixed text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                    <tr className="h-10">
                      <th className="w-[48px] px-2 text-center font-semibold">序号</th>
                      <th className="w-[150px] px-3 text-left font-semibold">货物名称</th>
                      <th className="w-[140px] px-3 text-left font-semibold">存放位置</th>
                      <th className="w-[86px] px-2 text-right font-semibold">变动前</th>
                      <th className="w-[86px] px-2 text-right font-semibold">变动后</th>
                      <th className="w-[96px] px-2 text-right font-semibold">变动数量</th>
                      <th className="w-[86px] px-2 text-left font-semibold">变动类型</th>
                      <th className="w-[170px] px-3 text-left font-semibold">变动原因</th>
                      <th className="w-[100px] px-2 text-center font-semibold">现场凭据</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {record.goodsLines.map((line, idx) => (
                      <tr
                        key={line.id}
                        className="h-[72px] transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="px-3 font-medium text-slate-800 dark:text-slate-200">
                          {line.goodsName}
                        </td>
                        <td className="px-3 text-slate-600 dark:text-slate-400">
                          {line.location}
                        </td>
                        <td className="px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                          {fmtQty(line.beforeQty)} {line.unit}
                        </td>
                        <td className="px-3 text-right font-medium tabular-nums text-slate-800 dark:text-slate-200">
                          {fmtQty(line.afterQty)} {line.unit}
                        </td>
                        <td className="px-3 text-right font-medium tabular-nums">
                          {line.diffQty > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              ↑ +{fmtQty(line.diffQty)} {line.unit}
                            </span>
                          ) : line.diffQty < 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ↓ {fmtQty(line.diffQty)} {line.unit}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 text-slate-600 dark:text-slate-400">
                          {line.abnormalType}
                        </td>
                        <td className="px-3 text-slate-600 dark:text-slate-400">
                          <div className="line-clamp-2" title={line.reason || undefined}>
                            {line.reason || "—"}
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          {line.photos && line.photos.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(line.photos![0])}
                              className="relative inline-flex size-10 overflow-hidden rounded border border-slate-200 bg-slate-100 cursor-pointer hover:shadow-md dark:border-slate-700"
                              title={`查看现场凭据（共 ${line.photos.length} 张）`}
                            >
                              <img src={line.photos[0]} alt="现场凭据" className="size-full object-cover" />
                              {line.photos.length > 1 && (
                                <span className="absolute bottom-0 right-0 bg-black/60 px-1 text-[10px] text-white">
                                  {line.photos.length}
                                </span>
                              )}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </PrototypeAnnotationTarget>
          )}

          {activeTab === "audit" && (
          <PrototypeAnnotationTarget annotationIds={["abnormal-detail-timeline"]}>
              <div className="space-y-4">
                {/* 时间轴节点列表 */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {record.approvalNodes.map((node, idx) => (
                    <div key={node.id} className="relative">
                      {/* 时间轴圆点 */}
                      <span className="absolute -left-6 top-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white ring-4 ring-white dark:ring-slate-900 shadow-xs">
                        <span className="size-2 rounded-full bg-white" />
                      </span>

                      {/* 节点内容卡片 */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {node.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {node.handleTime}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <div>
                            <span>{node.roleDesc || "处理人"}：</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {node.handlerName}
                            </span>
                          </div>

                          {node.hasTaskDetail && (
                            <button
                              type="button"
                              onClick={() => alert(`跳转至工作中心任务详情：${node.taskId}`)}
                              className="text-primary hover:underline text-[11px] font-medium flex items-center cursor-pointer"
                            >
                              任务详情
                              <ExternalLink className="size-3 ml-0.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </PrototypeAnnotationTarget>
          )}
          </DetailTabShell>
        </div>

        {/* 现场影像凭据大图预览 */}
        <ImageViewerModal
          url={previewPhoto}
          onClose={() => setPreviewPhoto(null)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

