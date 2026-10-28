import { useMemo, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { COLLECT_CONTROL_TABS } from "../domain/constants"
import type {
  GoodsInboundCollectConfig,
  InboundCollectFieldConfig,
} from "../domain/types"
import {
  listSelectableCollectFields,
  useGoodsSpecRevision,
} from "../lib/store"

type OtherCollectSelectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: GoodsInboundCollectConfig[]
  onConfirm: (items: GoodsInboundCollectConfig[]) => void
}

type ControlTab = (typeof COLLECT_CONTROL_TABS)[number]

const PAGE_SIZE = 10

/** 说明列：优先展示 07 配置的输入提示，其次展示备注 */
function formatDescription(field: InboundCollectFieldConfig): string {
  return field.placeholder?.trim() || field.remark?.trim() || "—"
}

export function OtherCollectSelectDialog({
  open,
  onOpenChange,
  selectedItems,
  onConfirm,
}: OtherCollectSelectDialogProps) {
  useGoodsSpecRevision()
  const fields = listSelectableCollectFields()

  const [activeTab, setActiveTab] = useState<ControlTab>("全部")
  const [selectedMap, setSelectedMap] = useState<Map<string, boolean>>(new Map())
  const [page, setPage] = useState(1)
  const [jumpPage, setJumpPage] = useState("1")

  // 打开弹窗时，将当前父组件选中的项初始化到临时状态
  useEffect(() => {
    if (open) {
      const map = new Map<string, boolean>()
      selectedItems.forEach((item) => {
        map.set(item.fieldId, item.required)
      })
      setSelectedMap(map)
      setActiveTab("全部")
      setPage(1)
      setJumpPage("1")
    }
  }, [open, selectedItems])

  // 左侧按控件类型筛选（不再使用 06 本地写死的三分类）
  const filteredItems = useMemo(() => {
    if (activeTab === "全部") return fields
    return fields.filter((item) => item.controlType === activeTab)
  }, [activeTab, fields])

  const totalCount = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, currentPage])

  const isAllCurrentSelected =
    currentPageItems.length > 0 &&
    currentPageItems.every((item) => selectedMap.has(item.id))

  const isSomeCurrentSelected =
    currentPageItems.some((item) => selectedMap.has(item.id)) &&
    !isAllCurrentSelected

  const handleToggleAllCurrent = (checked: boolean) => {
    setSelectedMap((prev) => {
      const next = new Map(prev)
      currentPageItems.forEach((item) => {
        if (checked) {
          if (!next.has(item.id)) next.set(item.id, false)
        } else {
          next.delete(item.id)
        }
      })
      return next
    })
  }

  const handleToggleItem = (id: string) => {
    setSelectedMap((prev) => {
      const next = new Map(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.set(id, false)
      }
      return next
    })
  }

  const handleConfirm = () => {
    const previousMap = new Map(selectedItems.map((item) => [item.fieldId, item]))
    // 按字段池原始顺序生成最终选中的项，同时继承已配好的必填与保质期参数
    const result: GoodsInboundCollectConfig[] = []
    fields.forEach((field) => {
      if (!selectedMap.has(field.id)) return
      const previous = previousMap.get(field.id)
      result.push({
        fieldId: field.id,
        required: selectedMap.get(field.id) ?? previous?.required ?? false,
        shelfLifeUnit: previous?.shelfLifeUnit,
        suggestedValue: previous?.suggestedValue,
      })
    })
    onConfirm(result)
    onOpenChange(false)
  }

  const handleJump = () => {
    const parsed = parseInt(jumpPage, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setPage(parsed)
    } else {
      setJumpPage(String(currentPage))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 overflow-hidden sm:max-w-4xl bg-white shadow-xl rounded-lg">
        <DialogTitle className="sr-only">选择其他收集信息</DialogTitle>

        <div className="flex h-[450px] gap-6 pt-2">
          {/* 左侧：按控件类型筛选 */}
          <div className="w-32 py-2 space-y-3 shrink-0 text-sm">
            {COLLECT_CONTROL_TABS.map((tab) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    setPage(1)
                    setJumpPage("1")
                  }}
                  className={cn(
                    "block w-full text-left font-normal transition-colors py-1 cursor-pointer",
                    active
                      ? "text-[#d8832a] font-medium"
                      : "text-slate-800 hover:text-[#d8832a]"
                  )}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* 右侧表格区 */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-auto rounded-none border-0">
              <Table>
                <TableHeader className="bg-[#f7f8fa] sticky top-0 z-10">
                  <TableRow className="h-10 border-b border-slate-100 hover:bg-[#f7f8fa]">
                    <TableHead className="w-12 px-3 text-center">
                      <input
                        type="checkbox"
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeCurrentSelected
                        }}
                        checked={isAllCurrentSelected}
                        onChange={(e) => handleToggleAllCurrent(e.target.checked)}
                        className="size-4 rounded-[3px] border-slate-300 accent-[#d8832a] cursor-pointer align-middle"
                        aria-label="全选本页"
                      />
                    </TableHead>
                    <TableHead className="w-14 px-3 text-left font-normal text-slate-500 text-xs">序号</TableHead>
                    <TableHead className="w-28 px-3 text-left font-normal text-slate-500 text-xs">名称</TableHead>
                    <TableHead className="w-36 px-3 text-left font-normal text-slate-500 text-xs">控件类型</TableHead>
                    <TableHead className="w-32 px-3 text-left font-normal text-slate-500 text-xs">单位 / 选项</TableHead>
                    <TableHead className="min-w-44 px-3 text-left font-normal text-slate-500 text-xs">说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-slate-400 text-xs">
                        暂无该类型的收集项，可前往「入库收集项配置」新增
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageItems.map((item, index) => {
                      const isSelected = selectedMap.has(item.id)
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            "h-11 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50/60",
                            isSelected && "bg-[#d8832a]/[0.03]"
                          )}
                          onClick={() => handleToggleItem(item.id)}
                        >
                          <TableCell className="px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(item.id)}
                              className="size-4 rounded-[3px] border-slate-300 accent-[#d8832a] cursor-pointer align-middle"
                              aria-label={`选择${item.name}`}
                            />
                          </TableCell>
                          <TableCell className="px-3 text-left text-slate-700 text-xs">
                            {(currentPage - 1) * PAGE_SIZE + index + 1}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-800">
                            {item.name}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-700">
                            {item.controlType}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-700">
                            <span className="block max-w-[120px] truncate" title={item.summary}>
                              {item.summary || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-600 leading-relaxed">
                            <span className="block max-w-[220px] truncate" title={formatDescription(item)}>
                              {formatDescription(item)}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 表格底部分页条 */}
            <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
              <div>
                共 {totalCount} 条
                {selectedMap.size > 0 && (
                  <span className="ml-2 text-[#d8832a]">（已选 {selectedMap.size} 项）</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const prev = currentPage - 1
                    setPage(prev)
                    setJumpPage(String(prev))
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1
                  const isCurrent = currentPage === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPage(p)
                        setJumpPage(String(p))
                      }}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center rounded text-xs transition-colors",
                        isCurrent
                          ? "bg-[#d8832a] text-white font-medium shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const next = currentPage + 1
                    setPage(next)
                    setJumpPage(String(next))
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>

                <span className="ml-2 text-slate-500">前往</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJump()
                  }}
                  onBlur={handleJump}
                  className="w-10 h-7 text-center rounded border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#d8832a]"
                />
                <span className="text-slate-500">页</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 h-8 rounded border border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 h-8 rounded bg-[#d8832a] hover:bg-[#c27322] text-white text-xs font-medium transition-colors shadow-none cursor-pointer"
          >
            确定
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
