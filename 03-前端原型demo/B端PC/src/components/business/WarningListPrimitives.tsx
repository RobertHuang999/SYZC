import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type WarningFilterHeaderProps = {
  expanded?: boolean
  onToggle?: () => void
  onReset?: () => void
  onSearch: () => void
  onAdd?: () => void
  addLabel?: string
}

export function WarningFilterHeader({
  expanded,
  onToggle,
  onReset,
  onSearch,
  onAdd,
  addLabel,
}: WarningFilterHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
      <span className="text-sm font-medium text-foreground">筛选条件</span>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {onToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            onClick={onToggle}
          >
            {expanded ? (
              <ChevronUpIcon className="size-4" />
            ) : (
              <ChevronDownIcon className="size-4" />
            )}
            {expanded ? "收起筛选" : "展开筛选"}
          </Button>
        )}
        {onAdd && (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <PlusIcon className="size-4" />
            {addLabel ?? "新增"}
          </Button>
        )}
        {onReset && (
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            <RotateCcwIcon className="size-4" />
            重置
          </Button>
        )}
        <Button type="button" size="sm" onClick={onSearch}>
          <SearchIcon className="size-4" />
          查询
        </Button>
      </div>
    </div>
  )
}

type WarningListPaginationProps = {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizes?: number[]
  totalLabel?: string
}

export function WarningListPagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 20, 50],
  totalLabel = "条",
}: WarningListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="shrink-0 text-sm text-muted-foreground">
        共 {total} {totalLabel}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground">每页</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} 条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination className="mx-0 w-auto shrink-0 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(Math.max(1, currentPage - 1))
                }}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1]
              const showEllipsis =
                previous !== undefined && pageNumber - previous > 1

              return (
                <span key={pageNumber} className="flex items-center">
                  {showEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        onPageChange(pageNumber)
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                </span>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground">前往</span>
          <Select
            value={String(currentPage)}
            onValueChange={(value) => onPageChange(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <SelectItem key={pageNumber} value={String(pageNumber)}>
                    {pageNumber}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">页</span>
        </div>
      </div>
    </div>
  )
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage])
  if (currentPage > 2) pages.add(currentPage - 1)
  if (currentPage < totalPages - 1) pages.add(currentPage + 1)
  return Array.from(pages).sort((a, b) => a - b)
}
