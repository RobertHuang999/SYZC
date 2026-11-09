import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  RotateCcw,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DropdownFilterPill } from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { CheckHistorySheet } from "../components/CheckHistorySheet"
import { CheckResolveSheet } from "../components/CheckResolveSheet"
import {
  ANOMALY_HANDLING_MAP,
  CHECK_LIST_ROUTE,
  CHECK_MODE_LABEL,
  CHECK_RESULT_MAP,
  CHECK_STATUS_MAP,
  CHECK_TYPE_LABEL,
} from "../domain/constants"
import type {
  AnomalyResolveRecord,
  BookSummaryItem,
  CheckHistoryNode,
  InventoryCheckRecord,
  InventoryDetailItem,
} from "../domain/types"
import {
  calculateBookSummaryStats,
  calculateInventoryCheckStats,
  judgeRowAnomaly,
} from "../lib/check-utils"
import { INVENTORY_CHECK_RECORDS } from "../mock/inventory-checks.mock"

type Target = {
  kind: "book" | "detail"
  id: string
  goodsName: string
}

function formatNow(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="min-w-0 text-right text-[#232D39]">{value}</span>
    </div>
  )
}

function AnomalyBadge({ status }: { status: "待处理" | "已处理" | "——" }) {
  if (status === "——") return null
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
        status === "待处理"
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {status}
    </span>
  )
}

function CheckFlag({
  label,
  value,
}: {
  label: string
  value: "是" | "否" | null
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-[#232D39]/[0.03] py-1.5">
      <span className="text-[10px] text-[#232D39]/45">{label}</span>
      <span
        className={`text-xs font-semibold ${
          value === "否" ? "text-rose-600" : "text-[#232D39]/75"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  )
}

function StatCard({
  title,
  counted,
  total,
  percentage,
  barClass,
}: {
  title: string
  counted: number
  total: number
  percentage: number
  barClass: string
}) {
  return (
    <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
      <div className="flex items-center justify-between text-[11px] text-[#232D39]/55">
        <span className="font-medium text-[#232D39]/70">{title}</span>
        <span>
          {counted}/{total}
        </span>
      </div>
      <div className="mt-1 text-xl font-bold text-[#232D39]">{percentage}%</div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#232D39]/10">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function InventoryCheckDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [record, setRecord] = useState<InventoryCheckRecord>(() => {
    return (
      INVENTORY_CHECK_RECORDS.find((item) => item.id === id) ||
      INVENTORY_CHECK_RECORDS[0]
    )
  })
  // 同一路由下切换盘点单时，重新载入对应单据与默认页签
  useEffect(() => {
    const next =
      INVENTORY_CHECK_RECORDS.find((item) => item.id === id) ||
      INVENTORY_CHECK_RECORDS[0]
    setRecord(next)
    setActiveTab("progress")
    setFilterStart("")
    setFilterEnd("")
    setFilterRoom("ALL")
  }, [id])
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"progress" | "items">("progress")
  const [filterStart, setFilterStart] = useState("")
  const [filterEnd, setFilterEnd] = useState("")
  const [filterRoom, setFilterRoom] = useState("ALL")
  const [resolveTarget, setResolveTarget] = useState<Target | null>(null)
  const [historyTarget, setHistoryTarget] = useState<{
    goodsName: string
    historyList: CheckHistoryNode[]
  } | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const copyNo = () => {
    navigator.clipboard.writeText(record.checkNo)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const summaryStats = useMemo(
    () => calculateBookSummaryStats(record.bookSummaryItems ?? []),
    [record.bookSummaryItems]
  )
  const detailStats = useMemo(
    () => calculateInventoryCheckStats(record.inventoryDetailItems ?? []),
    [record.inventoryDetailItems]
  )

  const roomOptions = useMemo(() => {
    const rooms = Array.from(
      new Set((record.inventoryDetailItems ?? []).map((item) => item.roomName))
    )
    return [
      { label: "全部库房", value: "ALL" },
      ...rooms.map((room) => ({ label: room, value: room })),
    ]
  }, [record.inventoryDetailItems])

  const filteredDetailItems = useMemo(() => {
    return (record.inventoryDetailItems ?? []).filter((item) => {
      if (filterRoom !== "ALL" && item.roomName !== filterRoom) return false
      if (filterStart && item.checkTime && item.checkTime.slice(0, 10) < filterStart) {
        return false
      }
      if (filterEnd && item.checkTime && item.checkTime.slice(0, 10) > filterEnd) {
        return false
      }
      return true
    })
  }, [record.inventoryDetailItems, filterRoom, filterStart, filterEnd])

  const statusConfig = CHECK_STATUS_MAP[record.status]
  const resultConfig = CHECK_RESULT_MAP[record.result]
  const anomalyConfig = ANOMALY_HANDLING_MAP[record.anomalyHandling]
  const isBookSummary = record.checkType === "BOOK_SUMMARY"

  const openResolve = (item: BookSummaryItem | InventoryDetailItem, kind: "book" | "detail") => {
    setResolveTarget({ kind, id: item.id, goodsName: item.goodsName })
  }

  const handleConfirmResolve = (remark: string) => {
    if (!resolveTarget) return
    const resolveRecord: AnomalyResolveRecord = {
      id: `res-${Date.now()}`,
      resolveTime: formatNow(),
      resolveUser: "lxy",
      remark,
    }

    setRecord((prev) => {
      const patchHistory = (historyList: CheckHistoryNode[]): CheckHistoryNode[] => {
        if (historyList.length === 0) {
          return [
            {
              id: `hist-${Date.now()}`,
              timestamp: resolveRecord.resolveTime,
              actualUser: "lxy",
              statusLabel: "异常已处理",
              isExist: "是",
              isIntact: "是",
              isLocationMatch: "是",
              countedQty: 0,
              snapshotQty: 0,
              unit: "",
              remarks: "现场异常已解除",
              resolveList: [resolveRecord],
            },
          ]
        }
        return historyList.map((node, index) =>
          index === 0
            ? {
                ...node,
                statusLabel: "异常已处理",
                resolveList: [resolveRecord, ...node.resolveList],
              }
            : node
        )
      }

      if (resolveTarget.kind === "book") {
        return {
          ...prev,
          anomalyHandling: "RESOLVED",
          bookSummaryItems: (prev.bookSummaryItems ?? []).map((item) =>
            item.id === resolveTarget.id
              ? {
                  ...item,
                  anomalyStatus: "已处理",
                  historyList: patchHistory(item.historyList),
                }
              : item
          ),
        }
      }

      return {
        ...prev,
        anomalyHandling: "RESOLVED",
        inventoryDetailItems: (prev.inventoryDetailItems ?? []).map((item) =>
          item.id === resolveTarget.id
            ? {
                ...item,
                anomalyStatus: "已处理",
                historyList: patchHistory(item.historyList),
              }
            : item
        ),
      }
    })

    showToast(`「${resolveTarget.goodsName}」的盘点异常已解除并写入历史`)
    setResolveTarget(null)
  }

  const resetDetailFilters = () => {
    setFilterStart("")
    setFilterEnd("")
    setFilterRoom("ALL")
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["check-h5-detail"]}>
        <NavBar title="盘点单详情" backTo={CHECK_LIST_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#232D39]/60">盘点单号</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${CHECK_STATUS_MAP[record.status].badgeClass}`}
                >
                  {statusConfig.label}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  {CHECK_TYPE_LABEL[record.checkType]}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="break-all text-base font-bold leading-tight text-[#232D39]">
                {record.checkNo}
              </p>
              <button
                type="button"
                onClick={copyNo}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制盘点单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              制单人：{record.creatorName} {record.createdTime}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow label="盘点任务名称" value={record.taskName} />
            <FieldRow label="盘点模式" value={CHECK_MODE_LABEL[record.checkMode]} />
            <FieldRow label="盘点开始时间" value={`${record.startDate} 00:00:00`} />
            <FieldRow label="盘点结束时间" value={`${record.endDate} 23:59:59`} />
            <FieldRow label="计划盘点人员" value={record.plannedUsers} />
            <FieldRow label="实际盘点人员" value={record.actualUsers || "——"} />
            <FieldRow label="盘点仓库" value={record.warehouseName} />
            <FieldRow
              label="盘点结果"
              value={
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${resultConfig.badgeClass}`}
                >
                  {resultConfig.label}
                </span>
              }
            />
            <FieldRow
              label="异常处理"
              value={
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${anomalyConfig.badgeClass}`}
                >
                  {anomalyConfig.label}
                </span>
              }
            />
            {record.remarks && (
              <div className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px] leading-relaxed text-[#232D39]/70">
                <span className="text-[#232D39]/45">备注：</span>
                {record.remarks}
              </div>
            )}
          </div>
        </section>

        {isBookSummary ? (
          <PrototypeAnnotationTarget annotationIds={["check-h5-summary-table"]}>
            <div className="space-y-2.5">
              <div className="rounded-xl border border-blue-200/60 bg-blue-50/70 p-3 text-[11px] text-[#232D39]/75">
                <div className="flex items-center justify-between">
                  <span>货品类型</span>
                  <span className="font-semibold text-[#232D39]">
                    已盘 {summaryStats.goodsTypeCounted}/{summaryStats.goodsTypeTotal}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span>库存总数量</span>
                  <span className="font-semibold text-[#232D39]">
                    {summaryStats.totalSnapshotQty.toLocaleString()} 吨
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span>已盘点数量</span>
                  <span className="font-semibold text-emerald-700">
                    {summaryStats.totalCountedSnapshotQty.toLocaleString()} 吨
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-blue-200/60 pt-1">
                  <span className="text-rose-600">盘点异常</span>
                  <span className="font-semibold text-rose-600">
                    {summaryStats.anomalyCount} 项（不存在 {summaryStats.notExistCount} · 损坏{" "}
                    {summaryStats.damagedCount} · 移位 {summaryStats.locationMismatchCount} · 数量{" "}
                    {summaryStats.qtyMismatchCount}）
                  </span>
                </div>
              </div>

              {(record.bookSummaryItems ?? []).map((item, index) => {
                const anomaly = judgeRowAnomaly(
                  item.isExist,
                  item.isIntact,
                  item.isLocationMatch,
                  item.countedQty,
                  item.snapshotQty
                )
                return (
                  <div
                    key={item.id}
                    className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold leading-snug text-[#232D39]">
                          {index + 1}. {item.goodsName}
                        </h3>
                      </div>
                      <AnomalyBadge status={item.anomalyStatus} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                      <div>
                        <span className="block text-[#232D39]/45">本次数量</span>
                        <span className="font-semibold text-[#232D39]">
                          {item.snapshotQty.toLocaleString()} {item.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[#232D39]/45">盘点数量</span>
                        <span
                          className={`font-semibold ${
                            anomaly.qtyMismatch ? "text-rose-600" : "text-[#232D39]"
                          }`}
                        >
                          {item.countedQty === null
                            ? "未盘"
                            : item.countedQty === "无需盘点"
                              ? "无需盘点"
                              : `${item.countedQty} ${item.unit}`}
                          {anomaly.qtyMismatch && (
                            <span className="ml-1 text-[10px] font-normal text-rose-500">不符</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <CheckFlag label="是否存在" value={item.isExist} />
                      <CheckFlag label="是否完好" value={item.isIntact} />
                      <CheckFlag label="位置一致" value={item.isLocationMatch} />
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-[#232D39]/10 pt-2 text-[11px] text-[#232D39]/50">
                      <span>{item.actualUser || "——"}</span>
                      <span>{item.checkTime || "——"}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setHistoryTarget({
                            goodsName: item.goodsName,
                            historyList: item.historyList,
                          })
                        }
                        className="rounded-full border border-[#232D39]/20 px-2.5 py-1 text-[11px] font-medium text-[#232D39]/75 active:bg-gray-50"
                      >
                        查看历史
                      </button>
                      {item.anomalyStatus === "待处理" && (
                        <button
                          type="button"
                          onClick={() => openResolve(item, "book")}
                          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 active:bg-amber-100"
                        >
                          解除异常
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {(record.bookSummaryItems ?? []).length === 0 && (
                <div className="rounded-xl border border-dashed border-[#232D39]/15 bg-white p-8 text-center text-xs text-[#232D39]/50">
                  <ClipboardList className="mx-auto mb-2 size-7 text-[#232D39]/20" />
                  该盘点单暂无账面汇总明细
                </div>
              )}
            </div>
          </PrototypeAnnotationTarget>
        ) : (
          <>
            <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
              {(
                [
                  ["progress", "盘点进度"],
                  ["items", `盘点明细 (${(record.inventoryDetailItems ?? []).length})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`min-w-0 flex-1 whitespace-nowrap py-2 text-center text-xs font-medium transition-colors ${
                    activeTab === key
                      ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                      : "text-[#232D39]/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "progress" && (
              <PrototypeAnnotationTarget annotationIds={["check-h5-progress"]}>
                <div className="grid grid-cols-2 gap-2.5">
                  <StatCard
                    title="货物条码已盘点"
                    counted={detailStats.barcodeRate.counted}
                    total={detailStats.barcodeRate.total}
                    percentage={detailStats.barcodeRate.percentage}
                    barClass="bg-amber-500"
                  />
                  <StatCard
                    title="分区盘点完成率"
                    counted={detailStats.partitionRate.counted}
                    total={detailStats.partitionRate.total}
                    percentage={detailStats.partitionRate.percentage}
                    barClass="bg-emerald-500"
                  />
                  <StatCard
                    title="库房盘点完成率"
                    counted={detailStats.roomRate.counted}
                    total={detailStats.roomRate.total}
                    percentage={detailStats.roomRate.percentage}
                    barClass="bg-blue-500"
                  />
                  <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
                    <div className="text-[11px] font-medium text-[#232D39]/70">异常货物数</div>
                    <div className="mt-1 text-xl font-bold text-rose-600">
                      {detailStats.anomalyGoodsCount}
                    </div>
                    <div className="mt-1.5 space-y-0.5 border-t border-[#232D39]/5 pt-1.5 text-[10px] text-[#232D39]/55">
                      <div className="flex justify-between">
                        <span>货物不存在</span>
                        <span className="font-medium text-[#232D39]/75">
                          {detailStats.anomalyBreakdown.notExist}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>货物损坏</span>
                        <span className="font-medium text-rose-600">
                          {detailStats.anomalyBreakdown.damaged}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>位置不符</span>
                        <span className="font-medium text-[#232D39]/75">
                          {detailStats.anomalyBreakdown.locationMismatch}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>数量不符</span>
                        <span className="font-medium text-amber-600">
                          {detailStats.anomalyBreakdown.qtyMismatch}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PrototypeAnnotationTarget>
            )}

            {activeTab === "items" && (
              <PrototypeAnnotationTarget annotationIds={["check-h5-detail-items"]}>
                <div className="space-y-2.5">
                  <div className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={filterStart}
                        onChange={(event) => setFilterStart(event.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] text-[#232D39]"
                        aria-label="盘点开始日期"
                      />
                      <span className="shrink-0 text-[11px] text-[#232D39]/45">至</span>
                      <input
                        type="date"
                        value={filterEnd}
                        onChange={(event) => setFilterEnd(event.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] text-[#232D39]"
                        aria-label="盘点结束日期"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <DropdownFilterPill
                        label="全部库房"
                        value={filterRoom}
                        options={roomOptions}
                        onChange={setFilterRoom}
                      />
                      <button
                        type="button"
                        onClick={resetDetailFilters}
                        className="inline-flex items-center gap-1 rounded-full border border-[#232D39]/20 px-2.5 py-1 text-[11px] text-[#232D39]/70"
                      >
                        <RotateCcw className="size-3" />
                        重置
                      </button>
                    </div>
                    <p className="text-[10px] text-[#232D39]/45">
                      共 {filteredDetailItems.length} 条在库盘点流水
                    </p>
                  </div>

                  {filteredDetailItems.map((item) => {
                    const anomaly = judgeRowAnomaly(
                      item.isExist,
                      item.isIntact,
                      item.isLocationMatch,
                      item.countedQty,
                      item.snapshotQty
                    )
                    return (
                      <div
                        key={item.id}
                        className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold leading-snug text-[#232D39]">
                              {item.goodsName}
                            </h3>
                            <p className="mt-0.5 text-[10px] text-[#232D39]/45">
                              货物编号：{item.inventoryNo}
                            </p>
                            <p className="text-[10px] text-[#232D39]/45 break-all">
                              条码：{item.barcode}
                            </p>
                          </div>
                          <AnomalyBadge status={item.anomalyStatus} />
                        </div>

                        <div className="flex justify-between gap-3 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                          <div className="min-w-0">
                            <span className="block text-[#232D39]/45">货主</span>
                            <span className="block truncate font-medium text-[#232D39]">
                              {item.ownerName}
                            </span>
                            <span className="block truncate text-[10px] text-[#232D39]/40">
                              {item.ownerCode}
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="block text-[#232D39]/45">货物状态</span>
                            <span className="rounded border border-[#232D39]/10 bg-white px-1.5 py-0.5 text-[10px] text-[#232D39]/70">
                              {item.goodsStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between gap-3 text-[11px] text-[#232D39]/60">
                          <span>{item.warehouseName}</span>
                          <span>
                            {item.roomName} · {item.partitionName}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-lg bg-[#232D39]/[0.03] p-2">
                            <span className="block text-[#232D39]/45">账面数量</span>
                            <span className="font-semibold text-[#232D39]">
                              {item.snapshotQty} {item.unit}
                            </span>
                          </div>
                          <div className="rounded-lg bg-[#232D39]/[0.03] p-2 text-right">
                            <span className="block text-[#232D39]/45">盘点数量</span>
                            <span
                              className={`font-semibold ${
                                anomaly.qtyMismatch ? "text-rose-600" : "text-[#232D39]"
                              }`}
                            >
                              {item.countedQty === null
                                ? "未盘"
                                : item.countedQty === "无需盘点"
                                  ? "无需盘点"
                                  : `${item.countedQty} ${item.unit}`}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          <CheckFlag label="是否存在" value={item.isExist} />
                          <CheckFlag label="是否完好" value={item.isIntact} />
                          <CheckFlag label="位置一致" value={item.isLocationMatch} />
                        </div>

                        <div className="flex items-center justify-between border-t border-dashed border-[#232D39]/10 pt-2 text-[11px] text-[#232D39]/50">
                          <span>{item.actualUser || "——"}</span>
                          <span>{item.checkTime || "——"}</span>
                        </div>

                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setHistoryTarget({
                                goodsName: item.goodsName,
                                historyList: item.historyList,
                              })
                            }
                            className="rounded-full border border-[#232D39]/20 px-2.5 py-1 text-[11px] font-medium text-[#232D39]/75 active:bg-gray-50"
                          >
                            查看历史
                          </button>
                          {item.anomalyStatus === "待处理" && (
                            <button
                              type="button"
                              onClick={() => openResolve(item, "detail")}
                              className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 active:bg-amber-100"
                            >
                              解除异常
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {filteredDetailItems.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#232D39]/15 bg-white p-8 text-center text-xs text-[#232D39]/50">
                      当前筛选条件下没有盘点流水
                    </div>
                  )}
                </div>
              </PrototypeAnnotationTarget>
            )}
          </>
        )}

        {record.status === "COMPLETED" && record.result === "ABNORMAL" && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              该盘点单存在异常货品。异常未全部解除前，系统会持续提示，请到明细中逐项处理并写清处理说明。
            </span>
          </div>
        )}

        {record.status === "COMPLETED" && record.result === "NORMAL" && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] leading-relaxed text-emerald-800">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
            <span>本次盘点结果正常，货在、货好、位对、数准，未发现异常。</span>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={() => navigate(CHECK_LIST_ROUTE)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 active:bg-gray-50"
        >
          返回台账
        </button>
        {record.checkType === "INVENTORY_DETAIL" && (
          <button
            type="button"
            onClick={() => showToast("盘点报告生成后可在 PC 端下载，本页只做移动查看")}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md active:bg-blue-700"
          >
            生成盘点报告
          </button>
        )}
      </div>

      <CheckHistorySheet
        open={historyTarget !== null}
        goodsName={historyTarget?.goodsName ?? ""}
        historyList={historyTarget?.historyList ?? []}
        onClose={() => setHistoryTarget(null)}
      />

      <CheckResolveSheet
        open={resolveTarget !== null}
        goodsName={resolveTarget?.goodsName ?? ""}
        onClose={() => setResolveTarget(null)}
        onConfirm={handleConfirmResolve}
      />
    </MobileShell>
  )
}
