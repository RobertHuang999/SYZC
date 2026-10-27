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
import { INBOUND_COLLECT_ITEMS } from "../domain/constants"
import type { GoodsInboundCollectConfig, InboundCollectItemDef } from "../domain/types"

type OtherCollectSelectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: GoodsInboundCollectConfig[]
  onConfirm: (items: GoodsInboundCollectConfig[]) => void
}

const CATEGORIES = ["全部", "货品基础类", "生产质检类", "仓储要求类"] as const
type CategoryType = (typeof CATEGORIES)[number]

const PAGE_SIZE = 10

// 对齐截图中的“输入方式”显示文案
function formatInputMethod(item: InboundCollectItemDef): string {
  if (item.control === "select") return "单选"
  if (item.control === "region") return "三级联动省市区"
  if (item.control === "text") return "普通文本"
  if (item.control === "date") return "日期"
  if (item.control === "period") return "周期组合"
  if (item.control === "range") return "数值区间"
  if (item.control === "number") return "单行数字"
  return item.controlLabel
}

// 对齐截图中的“说明”显示文案
function formatDescription(item: InboundCollectItemDef): string {
  if (item.key === "packaging") return "箱装/盒装、袋装、散装、桶装、集装箱、托盘"
  if (item.key === "origin") return "支持省市县三级联动"
  if (item.key === "batchNo") return "核心追溯字段"
  if (item.key === "producer") return "生产厂家全称"
  if (item.key === "hazardLevel") return "根据国家标准展示"
  if (item.key === "qualityGrade") return "特级、一级、二级、三级、国标、优等品、合格品"
  if (item.key === "productionDate") return "用于计算储存周期和临期预警"
  if (item.key === "expiryDate") return "关键风控字段"
  if (item.key === "shelfLife") return "正整数数值配天、月、年单位"
  if (item.key === "inspectDate") return "质检完成报告日期"
  if (item.key === "inspectOrg") return "第三方检测机构全称"
  if (item.key === "inspectReportNo") return "检测报告溯源唯一索引"
  if (item.key === "storageMode") return "常温、冷藏、冷冻"
  if (item.key === "temperature") return "温度控制标准 (℃)"
  if (item.key === "humidity") return "湿度控制标准 (%RH)"
  if (item.key === "moisture") return "水分含量指标 (0~100%)"
  if (item.key === "impurity") return "质检纯度与杂质率扣减指标"
  return item.description
}

export function OtherCollectSelectDialog({
  open,
  onOpenChange,
  selectedItems,
  onConfirm,
}: OtherCollectSelectDialogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("全部")
  const [selectedKeyMap, setSelectedKeyMap] = useState<Map<string, boolean>>(new Map())
  const [page, setPage] = useState(1)
  const [jumpPage, setJumpPage] = useState("1")

  // 打开弹窗时，将当前父组件选中的 item 初始化到临时状态
  useEffect(() => {
    if (open) {
      const map = new Map<string, boolean>()
      selectedItems.forEach((item) => {
        map.set(item.key, item.required)
      })
      setSelectedKeyMap(map)
      setActiveCategory("全部")
      setPage(1)
      setJumpPage("1")
    }
  }, [open, selectedItems])

  // 根据当前左侧分类过滤
  const filteredItems = useMemo(() => {
    if (activeCategory === "全部") return INBOUND_COLLECT_ITEMS
    return INBOUND_COLLECT_ITEMS.filter((item) => item.group === activeCategory)
  }, [activeCategory])

  const totalCount = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, currentPage])

  // 当前页全选判定
  const isAllCurrentSelected =
    currentPageItems.length > 0 &&
    currentPageItems.every((item) => selectedKeyMap.has(item.key))

  const isSomeCurrentSelected =
    currentPageItems.some((item) => selectedKeyMap.has(item.key)) &&
    !isAllCurrentSelected

  const handleToggleAllCurrent = (checked: boolean) => {
    setSelectedKeyMap((prev) => {
      const next = new Map(prev)
      currentPageItems.forEach((item) => {
        if (checked) {
          if (!next.has(item.key)) next.set(item.key, false)
        } else {
          next.delete(item.key)
        }
      })
      return next
    })
  }

  const handleToggleItem = (key: string) => {
    setSelectedKeyMap((prev) => {
      const next = new Map(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.set(key, false)
      }
      return next
    })
  }

  const handleConfirm = () => {
    // 按照原始定义顺序生成最终选中的项，同时继承之前的必填属性
    const result: GoodsInboundCollectConfig[] = []
    INBOUND_COLLECT_ITEMS.forEach((def) => {
      if (selectedKeyMap.has(def.key)) {
        const required = selectedKeyMap.get(def.key) ?? false
        result.push({
          key: def.key,
          label: def.label,
          required,
        })
      }
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
        {/* 无冗余标题栏，仅保留用于无障碍的隐藏标题 */}
        <DialogTitle className="sr-only">选择其他收集信息</DialogTitle>

        <div className="flex h-[450px] gap-6 pt-2">
          {/* 左侧分类导航 - 1:1 对齐用户截图 */}
          <div className="w-32 py-2 space-y-4 shrink-0 text-sm">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat)
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
                  {cat}
                </button>
              )
            })}
          </div>

          {/* 右侧表格区 - 1:1 对齐用户截图 */}
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
                    <TableHead className="w-36 px-3 text-left font-normal text-slate-500 text-xs">输入方式</TableHead>
                    <TableHead className="min-w-44 px-3 text-left font-normal text-slate-500 text-xs">说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-slate-400 text-xs">
                        暂无该分类下的收集项
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageItems.map((item, index) => {
                      const isSelected = selectedKeyMap.has(item.key)
                      return (
                        <TableRow
                          key={item.key}
                          className={cn(
                            "h-11 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50/60",
                            isSelected && "bg-[#d8832a]/[0.03]"
                          )}
                          onClick={() => handleToggleItem(item.key)}
                        >
                          <TableCell className="px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(item.key)}
                              className="size-4 rounded-[3px] border-slate-300 accent-[#d8832a] cursor-pointer align-middle"
                              aria-label={`选择${item.label}`}
                            />
                          </TableCell>
                          <TableCell className="px-3 text-left text-slate-700 text-xs">
                            {(currentPage - 1) * PAGE_SIZE + index + 1}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-800">
                            {item.label}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-700">
                            {formatInputMethod(item)}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-600 leading-relaxed">
                            {formatDescription(item)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 表格底部分页条 - 1:1 对齐用户截图 */}
            <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
              <div>
                共 {totalCount} 条
                {selectedKeyMap.size > 0 && (
                  <span className="ml-2 text-[#d8832a]">（已选 {selectedKeyMap.size} 项）</span>
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

        {/* 底部按钮栏 - 1:1 对齐用户截图 */}
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
