import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link2, Search, Filter, Layers } from "lucide-react"
import type { RelatedOrderOption } from "../domain/form-types"

type RelatedOrderPickerDialogProps = {
  open: boolean
  title?: string
  inboundType?: string
  currentOwnerName?: string
  rows: RelatedOrderOption[]
  onOpenChange: (open: boolean) => void
  onSelect: (row: RelatedOrderOption) => void
}

export function RelatedOrderPickerDialog({
  open,
  title,
  inboundType,
  currentOwnerName,
  rows,
  onOpenChange,
  onSelect,
}: RelatedOrderPickerDialogProps) {
  const [keyword, setKeyword] = useState("")
  // 如果已存在货主，优先过滤当前货主的单据；若当前货主无单据则默认查看全部
  const [filterCurrentOwnerOnly, setFilterCurrentOwnerOnly] = useState(false)

  useEffect(() => {
    if (open) {
      setKeyword("")
      // 如果传入了当前货主且当前货主在候选列表里有单据，默认开启过滤当前货主
      const hasMatch = currentOwnerName
        ? rows.some(
            (r) =>
              r.ownerName.trim().toLowerCase() ===
              currentOwnerName.trim().toLowerCase()
          )
        : false
      setFilterCurrentOwnerOnly(hasMatch)
    }
  }, [open, currentOwnerName, rows])

  // 根据当前入库类型自适应标题与表头（参考源码 receipt-select-goods.vue）
  const dialogTitle = useMemo(() => {
    if (title) return title
    if (inboundType === "质押入库") return "选择质押货物"
    if (inboundType === "抵押入库") return "选择抵押货物"
    if (inboundType === "监管服务入库") return "选择监管服务货物"
    return "选择关联业务单据"
  }, [title, inboundType])

  const orderNoHeader = useMemo(() => {
    if (inboundType === "质押入库") return "质押单号"
    if (inboundType === "抵押入库") return "抵押单号"
    if (inboundType === "监管服务入库") return "监管服务单号"
    return "关联单号"
  }, [inboundType])

  const timeHeader = useMemo(() => {
    if (inboundType === "质押入库") return "质押时间"
    if (inboundType === "抵押入库") return "抵押时间"
    if (inboundType === "监管服务入库") return "监管服务时间"
    return "业务时间"
  }, [inboundType])

  const filteredRows = useMemo(() => {
    let result = rows

    if (filterCurrentOwnerOnly && currentOwnerName) {
      const matchOwner = currentOwnerName.trim().toLowerCase()
      result = result.filter(
        (r) => r.ownerName.trim().toLowerCase() === matchOwner
      )
    }

    const kw = keyword.trim().toLowerCase()
    if (!kw) return result

    return result.filter(
      (r) =>
        r.orderNo.toLowerCase().includes(kw) ||
        r.ownerName.toLowerCase().includes(kw) ||
        r.ownerIdentifier.toLowerCase().includes(kw) ||
        r.goodsSummary.some((g) => g.toLowerCase().includes(kw))
    )
  }, [rows, filterCurrentOwnerOnly, currentOwnerName, keyword])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[1180px] max-h-[85vh] overflow-hidden flex flex-col p-6 gap-3.5">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Link2 className="size-5 text-primary" />
            <DialogTitle className="text-base font-semibold">
              {dialogTitle}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* 顶部搜索与货主过滤栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索单号、货主、货物规格..."
                className="h-8 pl-8 text-xs"
              />
            </div>

            {currentOwnerName ? (
              <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    filterCurrentOwnerOnly
                      ? "bg-background text-primary font-medium shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setFilterCurrentOwnerOnly(true)}
                >
                  <Filter className="size-3" />
                  仅当前货主（{currentOwnerName}）
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    !filterCurrentOwnerOnly
                      ? "bg-background text-primary font-medium shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setFilterCurrentOwnerOnly(false)}
                >
                  <Layers className="size-3" />
                  全部单据
                </button>
              </div>
            ) : null}
          </div>

          <span className="text-xs text-muted-foreground">
            找到 <strong className="text-foreground">{filteredRows.length}</strong> 笔在押单据
          </span>
        </div>

        {/* 表格主体 */}
        <div className="flex-1 min-h-[360px] max-h-[55vh] overflow-auto rounded-md border text-xs">
          <Table className="w-full min-w-[1050px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
                <TableHead className="w-12 text-center">序号</TableHead>
                <TableHead className="w-40">{orderNoHeader}</TableHead>
                <TableHead className="w-24">单据类型</TableHead>
                <TableHead className="w-36">货主名称</TableHead>
                <TableHead className="w-20">货主类型</TableHead>
                <TableHead className="w-36">货主标识</TableHead>
                <TableHead className="min-w-[180px]">货物明细</TableHead>
                <TableHead className="w-36">{timeHeader}</TableHead>
                <TableHead className="w-20 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    <div className="space-y-1">
                      <p>未找到符合条件的关联单据</p>
                      {filterCurrentOwnerOnly ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-xs text-primary"
                          onClick={() => setFilterCurrentOwnerOnly(false)}
                        >
                          切换查看全部货主单据
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/20">
                    <TableCell className="text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-foreground">
                      {row.orderNo}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {row.orderType}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {row.ownerName}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-[11px] font-medium ${
                          row.ownerType === "企业货主" ? "text-blue-600" : "text-amber-600"
                        }`}
                      >
                        {row.ownerType === "企业货主" ? "企业" : "个人"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {row.ownerIdentifierMasked}
                    </TableCell>
                    <TableCell className="leading-snug">
                      {row.goodsSummary.map((g, gIdx) => (
                        <div key={gIdx} className="line-clamp-1 font-medium text-foreground/90">
                          {g}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {row.businessTime}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => {
                          onSelect(row)
                          onOpenChange(false)
                        }}
                      >
                        选 择
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-2 text-[11px] text-muted-foreground">
          <span>💡 提示：选择关联单后，将自动反显货主信息、身份证号/税号及监管仓库</span>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            关 闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
