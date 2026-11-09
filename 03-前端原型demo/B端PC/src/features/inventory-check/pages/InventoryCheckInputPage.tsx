import { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Copy, Check, AlertCircle, Camera, CheckCircle2, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { inventoryCheckDocuments } from "../documents/inventory-check-documents"
import { inventoryCheckInputAnnotations } from "../annotations/inventory-check-input.annotations"
import { RevokeConfirmDialog } from "../components/RevokeConfirmDialog"
import { CHECK_STATUS_MAP } from "../domain/constants"
import type { InventoryCheckRecord } from "../domain/types"
import type { CheckInputRowState } from "../domain/form-types"
import { INITIAL_MOCK_CHECK_RECORDS } from "../mock/mock-data"
import { judgeRowAnomaly } from "../lib/check-utils"

const CURRENT_USER_ID = "usr-01" // lxy

export function InventoryCheckInputPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // 加载单据
  const [record, setRecord] = useState<InventoryCheckRecord>(() => {
    const found = INITIAL_MOCK_CHECK_RECORDS.find((r) => r.id === id)
    return found || INITIAL_MOCK_CHECK_RECORDS[1] // 默认取第2条待盘点记录
  })

  const [copiedNo, setCopiedNo] = useState<string | null>(null)
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 初始化明细行录入状态
  const [rowStates, setRowStates] = useState<Record<string, CheckInputRowState>>(() => {
    const map: Record<string, CheckInputRowState> = {}

    if (record.checkType === "BOOK_SUMMARY" && record.bookSummaryItems) {
      record.bookSummaryItems.forEach((item) => {
        const isNoNeed = item.countedQty === "无需盘点"
        map[item.id] = {
          id: item.id,
          countedQty: isNoNeed ? null : (item.countedQty as number | null),
          isNoNeedCheck: isNoNeed,
          isExist: item.isExist || "",
          isIntact: item.isIntact || "",
          isLocationMatch: item.isLocationMatch || "",
          attachments: item.attachments || [],
        }
      })
    } else if (record.inventoryDetailItems) {
      record.inventoryDetailItems.forEach((item) => {
        const isNoNeed = item.countedQty === "无需盘点"
        map[item.id] = {
          id: item.id,
          countedQty: isNoNeed ? null : (item.countedQty as number | null),
          isNoNeedCheck: isNoNeed,
          isExist: item.isExist || "",
          isIntact: item.isIntact || "",
          isLocationMatch: item.isLocationMatch || "",
          attachments: item.attachments || [],
        }
      })
    }

    return map
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedNo(text)
    setTimeout(() => setCopiedNo(null), 2000)
  }

  const updateRow = <K extends keyof CheckInputRowState>(
    rowId: string,
    field: K,
    val: CheckInputRowState[K]
  ) => {
    setRowStates((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: val,
      },
    }))
    if (errorMessage) setErrorMessage(null)
  }

  // 快捷模拟上传照片
  const handleUploadPhoto = (rowId: string) => {
    const mockPhoto =
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80"
    setRowStates((prev) => {
      const current = prev[rowId]?.attachments || []
      return {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          attachments: [...current, mockPhoto],
        },
      }
    })
  }

  // 提交校验 (逐行扫描)
  const handleSubmit = () => {
    setErrorMessage(null)

    const items =
      record.checkType === "BOOK_SUMMARY"
        ? record.bookSummaryItems || []
        : record.inventoryDetailItems || []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const state = rowStates[item.id]

      if (!state) continue

      const hasQty = state.isNoNeedCheck || (state.countedQty !== null && !isNaN(state.countedQty))
      const hasExist = state.isExist === "是" || state.isExist === "否"
      const hasIntact = state.isIntact === "是" || state.isIntact === "否"
      const hasLoc = state.isLocationMatch === "是" || state.isLocationMatch === "否"

      if (!hasQty || !hasExist || !hasIntact || !hasLoc) {
        setErrorMessage(
          `请完善第 ${i + 1} 行「${item.goodsName}」的盘点数据（盘点数量及是否存在/是否完好/位置一致必选）后再提交`
        )
        return
      }
    }

    setSubmitSuccess(true)
    setTimeout(() => {
      navigate(`/仓储/货物盘点/详情/${record.id}`)
    }, 1500)
  }

  const statusConfig = CHECK_STATUS_MAP[record.status]
  const canRevoke = record.status === "PENDING_START" && record.creatorId === CURRENT_USER_ID

  return (
    <PrototypeAnnotationProvider
      title="待盘点录入"
      documents={inventoryCheckDocuments}
      annotations={inventoryCheckInputAnnotations}
    >
      <div className="space-y-4 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif] max-w-7xl mx-auto">
        {/* 单据概览区打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-input-header"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden">
            <CardContent className="p-6">
              {/* 头部单号与按钮组 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    盘点单号: {record.checkNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(record.checkNo)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                    title="复制单号"
                  >
                    {copiedNo === record.checkNo ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {record.checkType === "BOOK_SUMMARY" ? "账面汇总盘点" : "库存明细盘点"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/仓储/货物盘点")}
                    className="h-8 px-3 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                    返回
                  </Button>

                  {canRevoke && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRevokeOpen(true)}
                      className="h-8 px-3 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300"
                    >
                      撤 销
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="h-8 px-5 text-xs font-medium shadow-xs"
                  >
                    提交
                  </Button>
                </div>
              </div>

              {/* 单据元数据双列网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs text-slate-600 dark:text-slate-400 pt-4">
                <div>
                  <span className="text-slate-400">制单人：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.creatorName}</span>
                </div>
                <div>
                  <span className="text-slate-400">制单时间：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.createdTime}</span>
                </div>
                <div>
                  <span className="text-slate-400">盘点任务名称：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.taskName}</span>
                </div>
                <div>
                  <span className="text-slate-400">盘点开始时间：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.startDate} 00:00:00</span>
                </div>
                <div>
                  <span className="text-slate-400">盘点结束时间：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.endDate} 23:59:59</span>
                </div>
                <div>
                  <span className="text-slate-400">盘点模式：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {record.checkMode === "SINGLE_PERSON" ? "单人独立盘点" : "多人协作盘点"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">计划盘点人员：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.plannedUsers}</span>
                </div>
                <div>
                  <span className="text-slate-400">盘点仓库：</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{record.warehouseName}</span>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="text-slate-400">备注信息：</span>
                  <span className="text-slate-800 dark:text-slate-200">{record.remarks || "—"}</span>
                </div>
              </div>

              {/* 状态大印章徽标 */}
              <div className="hidden sm:block absolute right-6 top-16 pointer-events-none select-none">
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 font-bold text-sm tracking-wider uppercase rotate-[-12deg] shadow-xs ${statusConfig.sealClass}`}
                >
                  {statusConfig.label}
                </div>
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 提交校验错误提示条 */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 提交成功轻提示 */}
        {submitSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>盘点数据已成功提交！正在生成盘点结论并跳转详情页...</span>
          </div>
        )}

        {/* 明细核验录入表格打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-input-table"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="h-3 w-1 bg-amber-600 rounded-full" />
                货品核验录入明细
              </span>
              <span className="text-xs text-slate-500">
                请逐行核验实物是否存在、是否完好、位置一致，并录入实盘数量（或勾选【无需盘点】）
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                  <tr className="h-10">
                    <th className="w-12 px-3 py-2 text-center">序号</th>
                    <th className="px-3 py-2">货物名称</th>
                    <th className="w-28 px-3 py-2 text-right">本次数量(快照)</th>
                    <th className="w-56 px-3 py-2">
                      <span className="text-rose-500 mr-0.5">*</span>盘点数量
                    </th>
                    <th className="w-28 px-3 py-2">
                      <span className="text-rose-500 mr-0.5">*</span>是否存在
                    </th>
                    <th className="w-28 px-3 py-2">
                      <span className="text-rose-500 mr-0.5">*</span>是否完好
                    </th>
                    <th className="w-28 px-3 py-2">
                      <span className="text-rose-500 mr-0.5">*</span>位置一致
                    </th>
                    <th className="w-32 px-3 py-2 text-center">现场附件照片</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {record.checkType === "BOOK_SUMMARY"
                    ? record.bookSummaryItems?.map((item, idx) => {
                        const st = rowStates[item.id] || {
                          id: item.id,
                          countedQty: null,
                          isNoNeedCheck: false,
                          isExist: "",
                          isIntact: "",
                          isLocationMatch: "",
                          attachments: [],
                        }

                        return (
                          <tr key={item.id} className="h-14 hover:bg-slate-50/50">
                            <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                              {item.goodsName}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                              {item.snapshotQty} {item.unit}
                            </td>

                            {/* 盘点数量 + 无需盘点 */}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  disabled={st.isNoNeedCheck}
                                  placeholder={st.isNoNeedCheck ? "无需盘点" : "输入实盘数"}
                                  value={st.isNoNeedCheck ? "" : st.countedQty ?? ""}
                                  onChange={(e) =>
                                    updateRow(
                                      item.id,
                                      "countedQty",
                                      e.target.value === "" ? null : parseFloat(e.target.value)
                                    )
                                  }
                                  className="h-8 text-xs w-28 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                                <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer whitespace-nowrap">
                                  <Checkbox
                                    checked={st.isNoNeedCheck}
                                    onCheckedChange={(c) => {
                                      updateRow(item.id, "isNoNeedCheck", !!c)
                                      if (c) updateRow(item.id, "countedQty", null)
                                    }}
                                  />
                                  无需盘点
                                </label>
                              </div>
                            </td>

                            {/* 是否存在 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isExist}
                                onValueChange={(val) => updateRow(item.id, "isExist", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 是否完好 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isIntact}
                                onValueChange={(val) => updateRow(item.id, "isIntact", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 位置一致 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isLocationMatch}
                                onValueChange={(val) => updateRow(item.id, "isLocationMatch", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 上传附件 */}
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUploadPhoto(item.id)}
                                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                >
                                  <Camera className="h-3.5 w-3.5 mr-1" />
                                  拍照/上传
                                </Button>
                                {st.attachments.length > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                                    {st.attachments.length}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    : record.inventoryDetailItems?.map((item, idx) => {
                        const st = rowStates[item.id] || {
                          id: item.id,
                          countedQty: null,
                          isNoNeedCheck: false,
                          isExist: "",
                          isIntact: "",
                          isLocationMatch: "",
                          attachments: [],
                        }

                        return (
                          <tr key={item.id} className="h-14 hover:bg-slate-50/50">
                            <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-slate-800 dark:text-slate-200">{item.goodsName}</div>
                              <div className="text-[11px] text-slate-400">
                                货主: {item.ownerName} | 库位: {item.roomName}/{item.partitionName}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                              {item.snapshotQty} {item.unit}
                            </td>

                            {/* 盘点数量 */}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  disabled={st.isNoNeedCheck}
                                  placeholder={st.isNoNeedCheck ? "无需盘点" : "输入实盘数"}
                                  value={st.isNoNeedCheck ? "" : st.countedQty ?? ""}
                                  onChange={(e) =>
                                    updateRow(
                                      item.id,
                                      "countedQty",
                                      e.target.value === "" ? null : parseFloat(e.target.value)
                                    )
                                  }
                                  className="h-8 text-xs w-28 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                                <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer whitespace-nowrap">
                                  <Checkbox
                                    checked={st.isNoNeedCheck}
                                    onCheckedChange={(c) => {
                                      updateRow(item.id, "isNoNeedCheck", !!c)
                                      if (c) updateRow(item.id, "countedQty", null)
                                    }}
                                  />
                                  无需盘点
                                </label>
                              </div>
                            </td>

                            {/* 是否存在 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isExist}
                                onValueChange={(val) => updateRow(item.id, "isExist", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 是否完好 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isIntact}
                                onValueChange={(val) => updateRow(item.id, "isIntact", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 位置一致 */}
                            <td className="px-3 py-2">
                              <Select
                                value={st.isLocationMatch}
                                onValueChange={(val) => updateRow(item.id, "isLocationMatch", val as '是' | '否')}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* 上传附件 */}
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUploadPhoto(item.id)}
                                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                >
                                  <Camera className="h-3.5 w-3.5 mr-1" />
                                  拍照/上传
                                </Button>
                                {st.attachments.length > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                                    {st.attachments.length}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
            </div>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 撤销确认弹窗 */}
        {revokeOpen && (
          <RevokeConfirmDialog
            open={revokeOpen}
            checkNo={record.checkNo}
            onOpenChange={setRevokeOpen}
            onConfirm={() => {
              navigate("/仓储/货物盘点")
            }}
          />
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}

