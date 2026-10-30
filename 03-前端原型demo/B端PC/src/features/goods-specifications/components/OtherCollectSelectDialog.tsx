import { useMemo, useState, useEffect, useRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from "lucide-react"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { GOODS_USER_DIALOG_SELECT_HINT } from "../lib/goods-spec-ui-labels"
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
  const revision = useGoodsSpecRevision()
  const fields = useMemo(() => listSelectableCollectFields(), [revision])

  const [activeTab, setActiveTab] = useState<ControlTab>("全部")
  const [searchName, setSearchName] = useState("")
  const [selectedMap, setSelectedMap] = useState<Map<string, boolean>>(new Map())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const wasOpenRef = useRef(false)

  // 仅在弹窗从关闭变为打开的瞬间初始化选中态与默认分类，避免切换左侧分类或勾选时被重置
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      const selectableIds = new Set(fields.map((f) => f.id))
      const map = new Map<string, boolean>()
      selectedItems.forEach((item) => {
        if (selectableIds.has(item.fieldId)) {
          map.set(item.fieldId, item.required)
        }
      })
      setSelectedMap(map)
      setActiveTab("全部")
      setSearchName("")
      setPage(1)
    }
    wasOpenRef.current = open
  }, [open, selectedItems, fields])

  // 按搜索名称预过滤（供左侧分类计数与右侧表格共用）
  const keywordFilteredFields = useMemo(() => {
    const kw = searchName.trim().toLowerCase()
    if (!kw) return fields
    return fields.filter((item) => item.name.toLowerCase().includes(kw))
  }, [fields, searchName])

  // 左侧按控件类型筛选
  const filteredItems = useMemo(() => {
    if (activeTab === "全部") return keywordFilteredFields
    return keywordFilteredFields.filter((item) => item.controlType === activeTab)
  }, [activeTab, keywordFilteredFields])

  const totalCount = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(page, totalPages)

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage, pageSize])

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
    const selectableIds = new Set(fields.map((f) => f.id))
    // 按字段池原始顺序生成最终选中的项，同时继承已配好的必填、保质期与下拉候选选项参数
    const result: GoodsInboundCollectConfig[] = []
    fields.forEach((field) => {
      if (!selectedMap.has(field.id)) return
      const previous = previousMap.get(field.id)
      result.push({
        fieldId: field.id,
        required: selectedMap.get(field.id) ?? previous?.required ?? false,
        shelfLifeUnit: previous?.shelfLifeUnit,
        suggestedValue: previous?.suggestedValue,
        customOptions:
          previous?.customOptions ??
          (field.controlType === "下拉单选框" && field.options
            ? [...field.options]
            : undefined),
      })
    })
    // 【收集项引用联动规则】(SKU-F12)：存量货品已绑定的「底座已停用」收集项不在可选池中，确认弹窗时必须原样保留，仅允许在外部卡片上主动移除
    selectedItems.forEach((prevItem) => {
      if (!selectableIds.has(prevItem.fieldId)) {
        result.push({ ...prevItem })
      }
    })
    onConfirm(result)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 overflow-hidden sm:max-w-4xl bg-background shadow-xl rounded-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-semibold">
            选择其他收集信息
          </DialogTitle>
          <ProductFieldHint>{GOODS_USER_DIALOG_SELECT_HINT}</ProductFieldHint>
        </DialogHeader>

        <div className="flex h-[390px] gap-4 pt-1">
          {/* 左侧：按控件类型筛选 */}
          <div className="w-36 border-r pr-3 py-1 space-y-1 shrink-0 text-xs overflow-y-auto">
            {COLLECT_CONTROL_TABS.map((tab) => {
              const active = activeTab === tab
              const count =
                tab === "全部"
                  ? keywordFilteredFields.length
                  : keywordFilteredFields.filter((f) => f.controlType === tab).length
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    setPage(1)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors cursor-pointer",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-700 hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="truncate">{tab}</span>
                  <span
                    className={cn(
                      "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                      active
                        ? "bg-primary/20 text-primary"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 右侧：名称搜索 + 表格区 */}
          <div className="flex-1 flex flex-col min-w-0 gap-2.5">
            <div className="relative w-64">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchName}
                placeholder="请输入收集项名称搜索"
                className="h-8 pl-8 pr-7 text-xs"
                onChange={(e) => {
                  setSearchName(e.target.value)
                  setPage(1)
                }}
              />
              {searchName && (
                <button
                  type="button"
                  aria-label="清空搜索"
                  onClick={() => {
                    setSearchName("")
                    setPage(1)
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-md border">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
                  <TableRow className="h-9 border-b hover:bg-slate-100">
                    <TableHead className="w-10 px-3 text-center">
                      <input
                        type="checkbox"
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeCurrentSelected
                        }}
                        checked={isAllCurrentSelected}
                        onChange={(e) => handleToggleAllCurrent(e.target.checked)}
                        className="size-4 rounded border-slate-300 accent-primary cursor-pointer align-middle"
                        aria-label="全选本页"
                      />
                    </TableHead>
                    <TableHead className="w-14 px-3 text-left font-medium text-slate-600 text-xs">
                      序号
                    </TableHead>
                    <TableHead className="w-32 px-3 text-left font-medium text-slate-600 text-xs">
                      名称
                    </TableHead>
                    <TableHead className="w-36 px-3 text-left font-medium text-slate-600 text-xs">
                      控件类型
                    </TableHead>
                    <TableHead className="w-32 px-3 text-left font-medium text-slate-600 text-xs">
                      单位 / 选项
                    </TableHead>
                    <TableHead className="min-w-44 px-3 text-left font-medium text-slate-600 text-xs">
                      说明
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-44 text-center text-slate-400 text-xs">
                        暂无符合条件的启用收集项
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageItems.map((item, index) => {
                      const isSelected = selectedMap.has(item.id)
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            "h-10 border-b cursor-pointer transition-colors hover:bg-slate-50",
                            isSelected && "bg-primary/[0.04]"
                          )}
                          onClick={() => handleToggleItem(item.id)}
                        >
                          <TableCell
                            className="px-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(item.id)}
                              className="size-4 rounded border-slate-300 accent-primary cursor-pointer align-middle"
                              aria-label={`选择${item.name}`}
                            />
                          </TableCell>
                          <TableCell className="px-3 text-left text-slate-600 text-xs">
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs font-medium text-slate-900">
                            {item.name}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-700">
                            {item.controlType}
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-700">
                            <span
                              className="block max-w-[120px] truncate"
                              title={item.summary}
                            >
                              {item.summary || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 text-left text-xs text-slate-600 leading-relaxed">
                            <span
                              className="block max-w-[220px] truncate"
                              title={formatDescription(item)}
                            >
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
          </div>
        </div>

        {/* 底部栏：左侧统计与翻页器，右侧取消/确定操作按钮 */}
        <DialogFooter className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              共 {totalCount} 条启用项（当前已勾选{" "}
              <strong className="font-medium text-foreground">
                {selectedMap.size}
              </strong>{" "}
              项）
            </span>
            <div className="flex items-center gap-1.5">
              <span>每页</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  if (val) {
                    setPageSize(Number(val))
                    setPage(1)
                  }
                }}
              >
                <SelectTrigger className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} 条
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeftIcon className="size-3.5" />
                <span>上一页</span>
              </Button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    type="button"
                    variant={pageNum === currentPage ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "h-7 min-w-7 px-2 text-xs",
                      pageNum === currentPage && "font-semibold text-primary"
                    )}
                  >
                    {pageNum}
                  </Button>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2 text-xs"
              >
                <span>下一页</span>
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="button" size="sm" onClick={handleConfirm}>
              确定
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
