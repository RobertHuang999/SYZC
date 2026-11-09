import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Copy, Check, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { IterationPageTag } from "@/shared/components/IterationHighlight"
import { PageHeader } from "@/shared/components/PageHeader"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { inventoryCheckDocuments } from "../documents/inventory-check-documents"
import { inventoryCheckListAnnotations } from "../annotations/inventory-check-list.annotations"
import { InventoryCheckFiltersPanel } from "../components/InventoryCheckFiltersPanel"
import { RevokeConfirmDialog } from "../components/RevokeConfirmDialog"
import {
  CHECK_STATUS_MAP,
  CHECK_RESULT_MAP,
  ANOMALY_HANDLING_MAP,
  CHECK_TYPE_OPTIONS,
  DEFAULT_CHECK_FILTER_PARAMS,
} from "../domain/constants"
import type { InventoryCheckRecord, CheckListFilterParams } from "../domain/types"
import { filterCheckRecords } from "../lib/check-utils"
import { INITIAL_MOCK_CHECK_RECORDS } from "../mock/mock-data"

const CURRENT_USER_ID = "usr-01" // 当前登录操作人 (lxy)

export function InventoryCheckListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<InventoryCheckRecord[]>(() => [...INITIAL_MOCK_CHECK_RECORDS])
  const [draftFilters, setDraftFilters] = useState<CheckListFilterParams>(DEFAULT_CHECK_FILTER_PARAMS)
  const [appliedFilters, setAppliedFilters] = useState<CheckListFilterParams>(DEFAULT_CHECK_FILTER_PARAMS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedNo, setCopiedNo] = useState<string | null>(null)

  // 撤销弹窗状态
  const [revokingRecord, setRevokingRecord] = useState<InventoryCheckRecord | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedNo(text)
    setTimeout(() => setCopiedNo(null), 2000)
  }

  // 过滤与分页
  const filteredRecords = useMemo(() => {
    return filterCheckRecords(rows, appliedFilters)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, currentPage, pageSize])

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_CHECK_FILTER_PARAMS)
    setAppliedFilters(DEFAULT_CHECK_FILTER_PARAMS)
    setPage(1)
  }

  // 执行撤销
  const handleConfirmRevoke = () => {
    if (!revokingRecord) return
    setRows((prev) =>
      prev.map((r) =>
        r.id === revokingRecord.id
          ? {
              ...r,
              status: "REVOKED",
            }
          : r
      )
    )
    showToast(`盘点单 ${revokingRecord.checkNo} 已成功撤销！`)
    setRevokingRecord(null)
  }

  return (
    <PrototypeAnnotationProvider
      title="货物盘点"
      documents={inventoryCheckDocuments}
      annotations={inventoryCheckListAnnotations}
    >
      <div className="space-y-4 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* 页面标题区 */}
        <PrototypeAnnotationTarget annotationIds={["inventory-check-page"]}>
          <PageHeader
            title="货物盘点"
            description="实物存货定期核验与四大异常风控闭环，支持账面汇总与库存明细两种盘点模式"
            badge={
              <IterationPageTag
                version="6.3"
                title="V1.2 基准版"
                description="涵盖账面汇总盘点与库存明细盘点双模式、四大异常判别算法、原样PDF报告存证与解除闭环"
              />
            }
            actions={
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>当前登录人:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  lxy (四川享宇科技有限公司)
                </span>
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 顶部轻提示 Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs text-white shadow-lg animate-in fade-in slide-in-from-top-3">
            {toastMessage}
          </div>
        )}

        {/* 筛选面板打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-filters-panel"]}>
          <InventoryCheckFiltersPanel
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            onAdd={() => navigate("/仓储/货物盘点/新增")}
          />
        </PrototypeAnnotationTarget>

        {/* 核心台账表格区打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-table-main"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse" style={{ minWidth: 1848 }}>
                  <thead className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200/90 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-800 sticky top-0 z-20">
                    <tr className="h-11">
                      <th className="sticky left-0 z-10 w-16 bg-slate-50 px-3 py-2 text-center">序号</th>
                      <th className="w-48 px-3 py-2">盘点单号</th>
                      <th className="w-[208px] px-3 py-2">任务名称</th>
                      <th className="w-28 px-3 py-2 whitespace-nowrap">盘点开始时间</th>
                      <th className="w-28 px-3 py-2 whitespace-nowrap">盘点结束时间</th>
                      <th className="w-28 px-3 py-2">盘点类型</th>
                      <th className="w-44 px-3 py-2">盘点仓库</th>
                      <th className="w-[110px] px-3 py-2 text-center">盘点状态</th>
                      <th className="w-20 px-3 py-2 text-center">盘点结果</th>
                      <th className="w-20 px-3 py-2 text-center">异常处理</th>
                      <th className="w-28 px-3 py-2">实际盘点人员</th>
                      <th className="w-32 px-3 py-2">制单人</th>
                      <th className="w-36 px-3 py-2 whitespace-nowrap">制单时间</th>
                      <th className="w-[218px] px-3 py-2 text-center sticky right-0 bg-slate-50 dark:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-20">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {pagedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="py-16 text-center text-slate-400">
                          暂无符合条件的盘点任务记录，可调整筛选条件后重试
                        </td>
                      </tr>
                    ) : (
                      pagedRecords.map((item, idx) => {
                        const statusConfig = CHECK_STATUS_MAP[item.status]
                        const resultConfig = CHECK_RESULT_MAP[item.result]
                        const anomalyConfig = ANOMALY_HANDLING_MAP[item.anomalyHandling]
                        const typeLabel =
                          item.checkType === "BOOK_SUMMARY" ? "账面汇总盘点" : "库存明细盘点"

                        // 按钮动作权限判定 (R02)
                        const canCheck =
                          item.status === "PENDING_START" ||
                          item.status === "IN_PROGRESS" ||
                          item.status === "EXPIRED"

                        const canRevoke =
                          item.status === "PENDING_START" && item.creatorId === CURRENT_USER_ID

                        return (
                          <tr
                            key={item.id}
                            className="h-[72px] hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            {/* 1. 序号 */}
                            <td className="sticky left-0 z-10 bg-white px-3 py-2 text-center text-slate-400 group-hover:bg-slate-50">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>

                            {/* 2. 盘点单号 (不截断，可悬停复制) */}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5 font-medium text-primary hover:underline">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/仓储/货物盘点/详情/${item.id}`)}
                                  className="whitespace-normal break-all text-left cursor-pointer line-clamp-2"
                                >
                                  {item.checkNo}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.checkNo)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                                  title="复制单号"
                                >
                                  {copiedNo === item.checkNo ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* 3. 任务名称 (长文本在72px行高内折行换行) */}
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                              {item.taskName}
                            </td>

                            {/* 4. 盘点开始时间 */}
                            <td className="px-3 py-2 whitespace-nowrap text-slate-600 dark:text-slate-400">
                              {item.startDate}
                            </td>

                            {/* 5. 盘点结束时间 */}
                            <td className="px-3 py-2 whitespace-nowrap text-slate-600 dark:text-slate-400">
                              {item.endDate}
                            </td>

                            {/* 6. 盘点类型 */}
                            <td className="px-3 py-2">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {typeLabel}
                              </span>
                            </td>

                            {/* 7. 盘点仓库 */}
                            <td className="px-3 py-2 text-slate-800 dark:text-slate-200">
                              {item.warehouseName}
                            </td>

                            {/* 8. 盘点状态 */}
                            <td className="px-3 py-2 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.badgeClass}`}
                              >
                                {statusConfig.label}
                              </span>
                            </td>

                            {/* 9. 盘点结果 */}
                            <td className="px-3 py-2 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] ${resultConfig.badgeClass}`}
                              >
                                {resultConfig.label}
                              </span>
                            </td>

                            {/* 10. 异常处理 */}
                            <td className="px-3 py-2 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] ${anomalyConfig.badgeClass}`}
                              >
                                {anomalyConfig.label}
                              </span>
                            </td>

                            {/* 11. 实际盘点人员 */}
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                              {item.actualUsers}
                            </td>

                            {/* 12. 制单人 */}
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                              <div className="truncate max-w-[120px]" title={item.creatorName}>
                                {item.creatorName.split(" / ")[0]}
                              </div>
                            </td>

                            {/* 13. 制单时间 */}
                            <td className="px-3 py-2 whitespace-nowrap text-slate-500 text-[11px]">
                              {item.createdTime}
                            </td>

                            {/* 14. 操作列 (实色背景防横向滚动文字透出重叠) */}
                            <td className="px-3 py-2 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50/90 dark:group-hover:bg-slate-800/90 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-20">
                              <TableRowActionPanel
                                actions={[
                                  {
                                    key: "detail",
                                    label: "详情",
                                    onClick: () =>
                                      navigate(`/仓储/货物盘点/详情/${item.id}`),
                                  },
                                  ...(canCheck
                                    ? ([
                                        {
                                          key: "check",
                                          label: "盘点",
                                          tone: "amber",
                                          onClick: () =>
                                            navigate(`/仓储/货物盘点/待盘点/${item.id}`),
                                        },
                                      ] as TableRowActionItem[])
                                    : []),
                                  ...(canRevoke
                                    ? ([
                                        {
                                          key: "revoke",
                                          label: "撤销",
                                          tone: "danger",
                                          onClick: () => setRevokingRecord(item),
                                        },
                                      ] as TableRowActionItem[])
                                    : []),
                                ]}
                              />
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* 吸底分页组件 */}
              <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sticky bottom-0 z-30">
                <WarningListPagination
                  page={currentPage}
                  total={filteredRecords.length}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize)
                    setPage(1)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 撤销确认弹窗 */}
        {revokingRecord && (
          <RevokeConfirmDialog
            open={!!revokingRecord}
            checkNo={revokingRecord.checkNo}
            onOpenChange={(open) => !open && setRevokingRecord(null)}
            onConfirm={handleConfirmRevoke}
          />
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}

