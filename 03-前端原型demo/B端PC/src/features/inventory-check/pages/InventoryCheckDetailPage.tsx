import { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  FileText,
  Download,
  AlertCircle,
  History,
  Search,
  RotateCcw,
  QrCode,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { inventoryCheckDocuments } from "../documents/inventory-check-documents"
import { inventoryCheckDetailAnnotations } from "../annotations/inventory-check-detail.annotations"
import { CheckHistoryTimelineDialog } from "../components/CheckHistoryTimelineDialog"
import { ResolveAnomalyDialog } from "../components/ResolveAnomalyDialog"
import { CheckDownloadRecordsDialog } from "../components/CheckDownloadRecordsDialog"
import { CHECK_STATUS_MAP } from "../domain/constants"
import type {
  InventoryCheckRecord,
  BookSummaryItem,
  InventoryDetailItem,
  CheckHistoryNode,
  CheckDownloadRecord,
} from "../domain/types"
import {
  calculateInventoryCheckStats,
  calculateBookSummaryStats,
  judgeRowAnomaly,
} from "../lib/check-utils"
import {
  INITIAL_MOCK_CHECK_RECORDS,
  INITIAL_MOCK_DOWNLOAD_RECORDS,
} from "../mock/mock-data"

export function InventoryCheckDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // 状态单据
  const [record, setRecord] = useState<InventoryCheckRecord>(() => {
    const found = INITIAL_MOCK_CHECK_RECORDS.find((r) => r.id === id)
    return found || INITIAL_MOCK_CHECK_RECORDS[0]
  })

  // 报告下载记录
  const [downloadRecords, setDownloadRecords] = useState<CheckDownloadRecord[]>(
    () => [...INITIAL_MOCK_DOWNLOAD_RECORDS]
  )

  const [activeTab, setActiveTab] = useState(record.checkType === "BOOK_SUMMARY" ? "summary" : "stats")
  const [copiedNo, setCopiedNo] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [historyTarget, setHistoryTarget] = useState<{
    goodsName: string
    historyList: CheckHistoryNode[]
  } | null>(null)

  const [resolveTarget, setResolveTarget] = useState<{
    itemId: string
    goodsName: string
  } | null>(null)

  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

  // 二次筛选状态 (库存明细模式)
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [filterRoom, setFilterRoom] = useState("ALL")

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedNo(text)
    setTimeout(() => setCopiedNo(null), 2000)
  }

  // 生成 PDF 盘点报告 (R13)
  const handleGenerateReport = () => {
    const now = new Date()
    const timeStr = now.toISOString().slice(0, 10)
    const newRecord: CheckDownloadRecord = {
      id: `dl-${Date.now()}`,
      checkId: record.id,
      fileName: `${record.warehouseName}_盘点报告_${timeStr}.pdf`,
      creator: "lxy",
      createTime: now.toLocaleString(),
      status: "SUCCESS",
      fileSize: "2.8MB",
      downloadUrl: "#",
    }

    setDownloadRecords((prev) => [newRecord, ...prev])
    showToast("PDF 盘点报告已成功生成并写入下载记录！")
  }

  // 解除异常确认 (R11)
  const handleConfirmResolve = (remark: string) => {
    if (!resolveTarget) return

    const now = new Date().toLocaleString()
    const newResolveItem = {
      id: `res-${Date.now()}`,
      resolveTime: now,
      resolveUser: "lxy",
      remark,
    }

    if (record.checkType === "BOOK_SUMMARY") {
      setRecord((prev) => {
        const updated = (prev.bookSummaryItems || []).map((item) => {
          if (item.id === resolveTarget.itemId) {
            const updatedHistory = (item.historyList || []).map((h, i) =>
              i === 0
                ? {
                    ...h,
                    statusLabel: "异常已处理" as const,
                    resolveList: [newResolveItem, ...h.resolveList],
                  }
                : h
            )
            return {
              ...item,
              anomalyStatus: "已处理" as const,
              historyList: updatedHistory,
            }
          }
          return item
        })
        return {
          ...prev,
          bookSummaryItems: updated,
          anomalyHandling: "RESOLVED",
        }
      })
    } else {
      setRecord((prev) => {
        const updated = (prev.inventoryDetailItems || []).map((item) => {
          if (item.id === resolveTarget.itemId) {
            const updatedHistory = (item.historyList || []).map((h, i) =>
              i === 0
                ? {
                    ...h,
                    statusLabel: "异常已处理" as const,
                    resolveList: [newResolveItem, ...h.resolveList],
                  }
                : h
            )
            return {
              ...item,
              anomalyStatus: "已处理" as const,
              historyList: updatedHistory,
            }
          }
          return item
        })
        return {
          ...prev,
          inventoryDetailItems: updated,
          anomalyHandling: "RESOLVED",
        }
      })
    }

    showToast(`货品「${resolveTarget.goodsName}」的盘点异常已成功解除闭环并存证！`)
    setResolveTarget(null)
  }

  // 统计计算
  const summaryStats = useMemo(() => {
    return calculateBookSummaryStats(record.bookSummaryItems || [])
  }, [record.bookSummaryItems])

  const detailStats = useMemo(() => {
    return calculateInventoryCheckStats(record.inventoryDetailItems || [])
  }, [record.inventoryDetailItems])

  // 库存明细二次筛选过滤
  const filteredDetailItems = useMemo(() => {
    if (!record.inventoryDetailItems) return []
    return record.inventoryDetailItems.filter((item) => {
      if (filterRoom !== "ALL" && !item.roomName.includes(filterRoom)) {
        return false
      }
      if (filterStartDate && item.checkTime && item.checkTime < filterStartDate) {
        return false
      }
      if (filterEndDate && item.checkTime && item.checkTime > filterEndDate) {
        return false
      }
      return true
    })
  }, [record.inventoryDetailItems, filterRoom, filterStartDate, filterEndDate])

  const statusConfig = CHECK_STATUS_MAP[record.status]

  return (
    <PrototypeAnnotationProvider
      title="盘点单详情"
      documents={inventoryCheckDocuments}
      annotations={inventoryCheckDetailAnnotations}
    >
      <div className="space-y-4 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* 顶部轻提示 Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs text-white shadow-lg animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* 详情头部概览打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-detail-overview"]}>
          <DetailPageHeader
            title="盘点单详情"
            number={record.checkNo}
            numberLabel="盘点单号"
            status={
              <>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  {record.checkType === "BOOK_SUMMARY" ? "账面汇总盘点" : "库存明细盘点"}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </span>
              </>
            }
            onBack={() => navigate("/仓储/货物盘点")}
            onCopy={() => handleCopy(record.checkNo)}
            copied={copiedNo === record.checkNo}
            actions={
              record.checkType === "INVENTORY_DETAIL" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDownloadDialogOpen(true)}
                    className="h-8 gap-1.5 px-3 text-xs text-slate-700 hover:text-amber-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    导出记录 ({downloadRecords.length})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateReport}
                    className="h-8 gap-1.5 px-3 text-xs font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    生成报告 (PDF)
                  </Button>
                </>
              ) : undefined
            }
          />

          {/* 盘点基础信息 */}
          <DetailSection title="基础信息">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DetailField label="制单人" value={record.creatorName} />
                <DetailField label="制单时间" value={record.createdTime} />
                <DetailField label="盘点任务名称" value={record.taskName} />
                <DetailField
                  label="盘点模式"
                  value={record.checkMode === "SINGLE_PERSON" ? "单人独立盘点" : "多人协作盘点"}
                />
                <DetailField label="盘点开始时间" value={`${record.startDate} 00:00:00`} />
                <DetailField label="盘点结束时间" value={`${record.endDate} 23:59:59`} />
                <DetailField label="计划盘点人员" value={record.plannedUsers} />
                <DetailField label="实际盘点人员" value={record.actualUsers} />
                <DetailField label="盘点仓库" value={record.warehouseName} />
                <DetailField label="备注说明" value={record.remarks || "—"} />
                <div className="md:col-span-2">
                  <span className="text-xs text-slate-400 block mb-1">附件照片：</span>
                  {record.attachments && record.attachments.length > 0 ? (
                    <div className="flex gap-2">
                      {record.attachments.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="附件"
                          className="h-12 w-12 rounded object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400">—</span>
                  )}
                </div>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 模式 A：账面汇总详情 */}
        {record.checkType === "BOOK_SUMMARY" ? (
          <DetailTabShell
            tabs={[{ key: "summary", label: "账面汇总明细" }]}
            active="summary"
            onChange={() => {}}
          >
            {/* 顶部合计指标栏 (严格对齐三件套与ASCII) */}
            <div className="mb-3 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-600">
                  货品类型: <strong className="text-slate-900">{summaryStats.goodsTypeTotal}</strong> | 已盘点:{" "}
                  <strong className="text-emerald-600">{summaryStats.goodsTypeCounted}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600">
                  库存总数量: <strong className="text-slate-900">{summaryStats.totalSnapshotQty.toLocaleString()}</strong> 吨 | 已盘点:{" "}
                  <strong className="text-emerald-600">{summaryStats.totalCountedSnapshotQty.toLocaleString()}</strong> 吨
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-rose-600 font-medium">
                  盘点异常: {summaryStats.anomalyCount} (不存在 {summaryStats.notExistCount} | 损坏 {summaryStats.damagedCount} | 移位 {summaryStats.locationMismatchCount} | 数量不符 {summaryStats.qtyMismatchCount})
                </span>
              </div>
            </div>

            {/* 账面汇总明细表 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                  <tr className="h-10">
                    <th className="w-12 px-3 py-2 text-center">序号</th>
                    <th className="px-3 py-2">货物名称</th>
                    <th className="w-28 px-3 py-2 text-right">本次数量</th>
                    <th className="w-32 px-3 py-2 text-right">盘点数量</th>
                    <th className="w-20 px-3 py-2 text-center">是否存在</th>
                    <th className="w-20 px-3 py-2 text-center">是否完好</th>
                    <th className="w-20 px-3 py-2 text-center">位置一致</th>
                    <th className="w-24 px-3 py-2">盘点人员</th>
                    <th className="w-36 px-3 py-2">盘点时间</th>
                    <th className="w-24 px-3 py-2 text-center">异常状态</th>
                    <th className="w-28 px-3 py-2 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {record.bookSummaryItems?.map((item, idx) => {
                    const anomaly = judgeRowAnomaly(
                      item.isExist,
                      item.isIntact,
                      item.isLocationMatch,
                      item.countedQty,
                      item.snapshotQty
                    )

                    return (
                      <tr key={item.id} className="h-14 hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                          {item.goodsName}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                          {item.snapshotQty.toLocaleString()} {item.unit}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {item.countedQty !== null ? (
                            <span
                              className={
                                anomaly.qtyMismatch
                                  ? "text-rose-600 font-semibold"
                                  : "text-slate-800 dark:text-slate-200"
                              }
                            >
                              {item.countedQty} {item.countedQty !== "无需盘点" ? item.unit : ""}
                              {anomaly.qtyMismatch && (
                                <span className="ml-1 text-[10px] px-1 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
                                  不符
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-400">未盘</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={
                              item.isExist === "否" ? "text-rose-600 font-bold" : "text-slate-600"
                            }
                          >
                            {item.isExist || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={
                              item.isIntact === "否" ? "text-rose-600 font-bold" : "text-slate-600"
                            }
                          >
                            {item.isIntact || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={
                              item.isLocationMatch === "否"
                                ? "text-rose-600 font-bold"
                                : "text-slate-600"
                            }
                          >
                            {item.isLocationMatch || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{item.actualUser || "—"}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-[11px]">
                          {item.checkTime || "—"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                              item.anomalyStatus === "待处理"
                                ? "bg-rose-50 text-rose-600 border border-rose-200 font-medium"
                                : item.anomalyStatus === "已处理"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "text-slate-400"
                            }`}
                          >
                            {item.anomalyStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setHistoryTarget({
                                  goodsName: item.goodsName,
                                  historyList: item.historyList || [],
                                })
                              }
                              className="h-7 px-2 text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                            >
                              查看
                            </Button>

                            {item.anomalyStatus === "待处理" && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setResolveTarget({
                                    itemId: item.id,
                                    goodsName: item.goodsName,
                                  })
                                }
                                className="h-7 px-2 text-xs text-amber-600 font-medium hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                              >
                                解除异常
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </DetailTabShell>
        ) : (
          /* 模式 B：库存明细详情 (含 4 张完成率看板与二次过滤) */
          <DetailTabShell
            tabs={[
              { key: "stats", label: "盘点进度" },
              { key: "detail", label: "盘点明细" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          >
            {/* 4 张完成率看板卡片打点 */}
            {activeTab === "stats" && (
            <PrototypeAnnotationTarget annotationIds={["check-detail-stats-card"]}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 看板 1: 条码已盘点率 */}
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">货物条码已盘点</span>
                    <span>{detailStats.barcodeRate.counted}/{detailStats.barcodeRate.total}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {detailStats.barcodeRate.percentage}%
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${detailStats.barcodeRate.percentage}%` }}
                    />
                  </div>
                </Card>

                {/* 看板 2: 分区完成率 */}
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">分区盘点完成率</span>
                    <span>{detailStats.partitionRate.counted}/{detailStats.partitionRate.total}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {detailStats.partitionRate.percentage}%
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${detailStats.partitionRate.percentage}%` }}
                    />
                  </div>
                </Card>

                {/* 看板 3: 库房完成率 */}
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">库房盘点完成率</span>
                    <span>{detailStats.roomRate.counted}/{detailStats.roomRate.total}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {detailStats.roomRate.percentage}%
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${detailStats.roomRate.percentage}%` }}
                    />
                  </div>
                </Card>

                {/* 看板 4: 异常货物数汇总与细分 */}
                <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">异常货物数</div>
                    <div className="text-2xl font-bold text-rose-600">
                      {detailStats.anomalyGoodsCount}
                    </div>
                  </div>
                  <div className="text-[11px] space-y-1 text-slate-500 border-l border-slate-100 pl-3 dark:border-slate-800">
                    <div>货物不存在: <strong className="text-slate-700">{detailStats.anomalyBreakdown.notExist}</strong></div>
                    <div>货物损坏: <strong className="text-rose-600">{detailStats.anomalyBreakdown.damaged}</strong></div>
                    <div>位置不符: <strong className="text-slate-700">{detailStats.anomalyBreakdown.locationMismatch}</strong></div>
                    <div>数量不符: <strong className="text-amber-600">{detailStats.anomalyBreakdown.qtyMismatch}</strong></div>
                  </div>
                </Card>
              </div>
            </PrototypeAnnotationTarget>
            )}

            {/* 二次检索栏与明细表格打点 */}
            {activeTab === "detail" && (
            <PrototypeAnnotationTarget annotationIds={["check-detail-actions"]}>
              <>
                {/* 二次检索条件 */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 whitespace-nowrap">盘点时间:</span>
                      <Input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="h-8 text-xs w-32"
                      />
                      <span className="text-xs text-slate-400">-</span>
                      <Input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="h-8 text-xs w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 whitespace-nowrap">库房/分区:</span>
                      <Select value={filterRoom} onValueChange={(val) => setFilterRoom(val ?? "ALL")}>
                        <SelectTrigger className="h-8 text-xs w-36">
                          <SelectValue placeholder="全部库房" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">全部库房</SelectItem>
                          <SelectItem value="1号板材立体库">1号板材立体库</SelectItem>
                          <SelectItem value="2号高架保税库">2号高架保税库</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilterStartDate("")
                        setFilterEndDate("")
                        setFilterRoom("ALL")
                      }}
                      className="h-8 px-2.5 text-xs text-slate-600"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      重置
                    </Button>
                  </div>

                  <span className="text-xs text-slate-400">
                    共 {filteredDetailItems.length} 条在库盘点流水
                  </span>
                </div>

                {/* 明细表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-xs text-left" style={{ minWidth: 1560 }}>
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                      <tr className="h-10">
                        <th className="w-10 px-2.5 py-2 text-center">序号</th>
                        <th className="w-40 px-2.5 py-2">货物编号</th>
                        <th className="w-44 px-2.5 py-2">货主</th>
                        <th className="w-48 px-2.5 py-2">货物名称</th>
                        <th className="w-20 px-2.5 py-2 text-right">本次数量</th>
                        <th className="w-28 px-2.5 py-2">库房/分区</th>
                        <th className="w-20 px-2.5 py-2">货品状态</th>
                        <th className="w-20 px-2.5 py-2 text-center">是否存在</th>
                        <th className="w-20 px-2.5 py-2 text-center">是否完好</th>
                        <th className="w-20 px-2.5 py-2 text-center">位置一致</th>
                        <th className="w-24 px-2.5 py-2 text-right">盘点数量</th>
                        <th className="w-20 px-2.5 py-2">实际人员</th>
                        <th className="w-32 px-2.5 py-2 whitespace-nowrap">盘点时间</th>
                        <th className="w-20 px-2.5 py-2 text-center">异常状态</th>
                        <th className="w-24 px-2.5 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredDetailItems.map((item, idx) => {
                        const anomaly = judgeRowAnomaly(
                          item.isExist,
                          item.isIntact,
                          item.isLocationMatch,
                          item.countedQty,
                          item.snapshotQty
                        )

                        return (
                          <tr key={item.id} className="h-14 hover:bg-slate-50/50">
                            <td className="px-2.5 py-2 text-center text-slate-400">{idx + 1}</td>
                            <td className="px-2.5 py-2 font-medium text-slate-800 dark:text-slate-200">
                              {item.inventoryNo}
                            </td>
                            <td className="px-2.5 py-2">
                              <div className="font-medium text-slate-800 dark:text-slate-200">{item.ownerName}</div>
                              <div className="text-[10px] text-slate-400">{item.ownerCode}</div>
                            </td>
                            <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 font-medium">
                              {item.goodsName}
                            </td>
                            <td className="px-2.5 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                              {item.snapshotQty} {item.unit}
                            </td>
                            <td className="px-2.5 py-2 text-slate-600 dark:text-slate-400 text-[11px]">
                              <div>{item.roomName}</div>
                              <div className="text-slate-400">{item.partitionName}</div>
                            </td>
                            <td className="px-2.5 py-2">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                                {item.goodsStatus}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-center">
                              <span className={item.isExist === "否" ? "text-rose-600 font-bold" : "text-slate-600"}>
                                {item.isExist || "—"}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-center">
                              <span className={item.isIntact === "否" ? "text-rose-600 font-bold" : "text-slate-600"}>
                                {item.isIntact || "—"}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-center">
                              <span className={item.isLocationMatch === "否" ? "text-rose-600 font-bold" : "text-slate-600"}>
                                {item.isLocationMatch || "—"}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-right font-medium">
                              {item.countedQty !== null ? (
                                <span className={anomaly.qtyMismatch ? "text-rose-600 font-semibold" : "text-slate-800"}>
                                  {item.countedQty} {item.countedQty !== "无需盘点" ? item.unit : ""}
                                </span>
                              ) : (
                                <span className="text-slate-400">未盘</span>
                              )}
                            </td>
                            <td className="px-2.5 py-2 text-slate-600">{item.actualUser || "—"}</td>
                            <td className="px-2.5 py-2 text-slate-500 whitespace-nowrap text-[11px]">
                              {item.checkTime || "—"}
                            </td>
                            <td className="px-2.5 py-2 text-center">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                                  item.anomalyStatus === "待处理"
                                    ? "bg-rose-50 text-rose-600 border border-rose-200 font-medium"
                                    : item.anomalyStatus === "已处理"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "text-slate-400"
                                }`}
                              >
                                {item.anomalyStatus}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setHistoryTarget({
                                      goodsName: item.goodsName,
                                      historyList: item.historyList || [],
                                    })
                                  }
                                  className="h-7 px-1.5 text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                                >
                                  查看
                                </Button>

                                {item.anomalyStatus === "待处理" && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setResolveTarget({
                                        itemId: item.id,
                                        goodsName: item.goodsName,
                                      })
                                    }
                                    className="h-7 px-1.5 text-xs text-amber-600 font-medium hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                                  >
                                    解除异常
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            </PrototypeAnnotationTarget>
            )}
          </DetailTabShell>
        )}

        {/* 盘点历史时间轴弹窗 */}
        {historyTarget && (
          <CheckHistoryTimelineDialog
            open={!!historyTarget}
            goodsName={historyTarget.goodsName}
            historyList={historyTarget.historyList}
            onOpenChange={(open) => !open && setHistoryTarget(null)}
          />
        )}

        {/* 解除异常弹窗 */}
        {resolveTarget && (
          <ResolveAnomalyDialog
            open={!!resolveTarget}
            goodsName={resolveTarget.goodsName}
            onOpenChange={(open) => !open && setResolveTarget(null)}
            onConfirm={handleConfirmResolve}
          />
        )}

        {/* 报告下载记录弹窗 */}
        <CheckDownloadRecordsDialog
          open={downloadDialogOpen}
          records={downloadRecords}
          onOpenChange={setDownloadDialogOpen}
          onDownload={(rec) => {
            showToast(`正在导出并下载文件: ${rec.fileName}`)
          }}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

