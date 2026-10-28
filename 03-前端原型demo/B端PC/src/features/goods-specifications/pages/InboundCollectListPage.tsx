import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  WarningFilterHeader,
  WarningListPagination,
} from "@/components/business/WarningListPrimitives"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import {
  CONTROL_TYPE_OPTIONS,
  DEFAULT_INBOUND_COLLECT_FILTER,
  INBOUND_COLLECT_CREATE_PATH,
  PAGE_SIZE,
  STATUS_OPTIONS,
  inboundCollectDetailPath,
  inboundCollectEditPath,
} from "../domain/constants"
import type {
  InboundCollectFieldConfig,
  InboundCollectFilter,
} from "../domain/types"
import {
  countGoodsReferences,
  listInboundCollectFields,
  setInboundCollectFieldStatus,
  useGoodsSpecRevision,
} from "../lib/store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundCollectListAnnotations } from "../annotations/inbound-collect.annotations"
import { inboundCollectDocuments } from "../documents/inbound-collect-documents"
import { InboundCollectPreviewDialog } from "../components/InboundCollectPreviewDialog"
import { ShelfLifeUnitConfigDialog } from "../components/ShelfLifeUnitConfigDialog"
import { InboundCollectDeleteDialog } from "../components/InboundCollectDeleteDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { StatusBadge } from "../components/StatusBadge"

export function InboundCollectListPage() {
  useGoodsSpecRevision()
  const navigate = useNavigate()

  const allFields = listInboundCollectFields()

  // 筛选状态（草稿 / 已生效分离）
  const [queryInput, setQueryInput] = useState<InboundCollectFilter>(
    DEFAULT_INBOUND_COLLECT_FILTER
  )
  const [filter, setFilter] = useState<InboundCollectFilter>(
    DEFAULT_INBOUND_COLLECT_FILTER
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  // 弹窗状态
  const [unitConfigOpen, setUnitConfigOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] =
    useState<InboundCollectFieldConfig | null>(null)
  const [statusTarget, setStatusTarget] =
    useState<InboundCollectFieldConfig | null>(null)
  const [previewTarget, setPreviewTarget] =
    useState<InboundCollectFieldConfig | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // 筛选过滤（默认按创建时间倒序，与字段清单口径一致）
  const filteredFields = useMemo(() => {
    const kw = filter.name.trim().toLowerCase()
    const [createdStart, createdEnd] = filter.createdAtRange ?? ["", ""]
    return allFields
      .filter((item) => {
        if (kw && !item.name.toLowerCase().includes(kw)) return false
        if (filter.controlType && item.controlType !== filter.controlType) {
          return false
        }
        if (filter.status && item.status !== filter.status) return false
        const createdDate = item.createdAt.slice(0, 10)
        if (createdStart && createdDate < createdStart) return false
        if (createdEnd && createdDate > createdEnd) return false
        return true
      })
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  }, [allFields, filter])

  // 分页数据
  const paginatedFields = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredFields.slice(start, start + pageSize)
  }, [filteredFields, page, pageSize])

  const handleSearch = () => {
    setFilter({ ...queryInput })
    setPage(1)
  }

  const handleReset = () => {
    setQueryInput(DEFAULT_INBOUND_COLLECT_FILTER)
    setFilter(DEFAULT_INBOUND_COLLECT_FILTER)
    setPage(1)
  }

  const handleToggleStatus = () => {
    if (!statusTarget) return
    const nextStatus = statusTarget.status === "ENABLED" ? "DISABLED" : "ENABLED"
    setInboundCollectFieldStatus(statusTarget.id, nextStatus)
    showToast(
      `已${nextStatus === "ENABLED" ? "启用" : "停用"}收集项「${statusTarget.name}」`
    )
    setStatusTarget(null)
  }

  return (
    <PrototypeAnnotationProvider
      annotations={inboundCollectListAnnotations}
      documents={inboundCollectDocuments}
      title="入库收集项配置列表 · 原型批注"
    >
      <div className="space-y-4 p-6">
        {/* 轻提示 Toast */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 页面标题与导引 */}
        <PrototypeAnnotationTarget annotationIds={["collect-page-header"]}>
          <h1 className="text-2xl font-semibold tracking-tight">入库收集项配置</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            维护全租户通用的货品入库数据采集标准池，规范控件类型与保质期度量单位，为品类与货品提供统一元数据底座
          </p>
        </PrototypeAnnotationTarget>

        {/* 筛选区域（标准 4 项栅格） */}
        <PrototypeAnnotationTarget annotationIds={["collect-filter"]}>
          <Card>
            <CardContent className="space-y-4 pt-4">
              <WarningFilterHeader
                addLabel="新增收集项"
                onAdd={() => navigate(INBOUND_COLLECT_CREATE_PATH)}
                onReset={handleReset}
                onSearch={handleSearch}
              />
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  handleSearch()
                }}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* 收集项名称 */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="search-name"
                      className="text-xs text-muted-foreground"
                    >
                      收集项名称
                    </Label>
                    <Input
                      id="search-name"
                      placeholder="请输入收集项名称"
                      value={queryInput.name}
                      onChange={(e) =>
                        setQueryInput((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  {/* 控件类型 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">控件类型</Label>
                    <Select
                      value={queryInput.controlType || "ALL"}
                      onValueChange={(val) =>
                        setQueryInput((prev) => ({
                          ...prev,
                          controlType: val === "ALL" ? "" : (val || ""),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="全部控件类型">
                          {(val) =>
                            CONTROL_TYPE_OPTIONS.find(
                              (option) => option.value === val
                            )?.label ?? "全部控件类型"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部控件类型</SelectItem>
                        {CONTROL_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 状态 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">状态</Label>
                    <Select
                      value={queryInput.status || "ALL"}
                      onValueChange={(val) =>
                        setQueryInput((prev) => ({
                          ...prev,
                          status:
                            val === "ALL"
                              ? ""
                              : (val as InboundCollectFilter["status"]),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="全部状态">
                          {(val) => {
                            if (val === "ENABLED") return "启用"
                            if (val === "DISABLED") return "停用"
                            return "全部状态"
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部状态</SelectItem>
                        {STATUS_OPTIONS.filter((opt) => opt.value !== "").map(
                          (opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 创建时间范围 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      创建时间范围
                    </Label>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="date"
                        aria-label="创建时间开始日期"
                        value={queryInput.createdAtRange?.[0] ?? ""}
                        className="min-w-0 flex-1 px-2 text-xs"
                        onChange={(event) =>
                          setQueryInput((prev) => ({
                            ...prev,
                            createdAtRange: [
                              event.target.value,
                              prev.createdAtRange?.[1] ?? "",
                            ],
                          }))
                        }
                      />
                      <span className="shrink-0 text-xs text-muted-foreground">
                        至
                      </span>
                      <Input
                        type="date"
                        aria-label="创建时间结束日期"
                        value={queryInput.createdAtRange?.[1] ?? ""}
                        className="min-w-0 flex-1 px-2 text-xs"
                        onChange={(event) =>
                          setQueryInput((prev) => ({
                            ...prev,
                            createdAtRange: [
                              prev.createdAtRange?.[0] ?? "",
                              event.target.value,
                            ],
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 7 维主表格展示 */}
        <PrototypeAnnotationTarget
          annotationIds={[
            "collect-table",
            "collect-shelf-life-action",
            "collect-delete-action",
          ]}
        >
          <Card>
            <CardContent className="space-y-3 pt-4">
              <div className="overflow-hidden rounded-lg border">
                <Table className="min-w-[1080px]">
                  <TableHeader>
                    <TableRow className="h-10 hover:bg-transparent bg-slate-100 dark:bg-slate-800">
                      <TableHead className="w-16 px-3 py-2.5 text-center">
                        序号
                      </TableHead>
                      <TableHead className="min-w-44 px-3 py-2.5">
                        收集项名称
                      </TableHead>
                      <TableHead className="w-40 px-3 py-2.5 whitespace-nowrap">
                        控件类型
                      </TableHead>
                      <TableHead className="min-w-52 px-3 py-2.5">
                        度量单位 / 选项摘要
                      </TableHead>
                      <TableHead className="w-24 px-3 py-2.5 text-center">
                        状态
                      </TableHead>
                      <TableHead className="w-48 px-3 py-2.5 whitespace-nowrap">
                        创建时间
                      </TableHead>
                      <TableHead className="w-[218px] px-3 py-2.5 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                        操作
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-32 text-center text-muted-foreground"
                        >
                          没有符合条件的收集项配置
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedFields.map((item, idx) => {
                        const rowNum = (page - 1) * pageSize + idx + 1
                        const isEnabled = item.status === "ENABLED"
                        const isShelfLife = Boolean(item.isShelfLife)

                        const rowActions: TableRowActionItem[] = [
                          {
                            key: "detail",
                            label: "详情",
                            onClick: () =>
                              navigate(inboundCollectDetailPath(item.id)),
                          },
                          {
                            key: "preview",
                            label: "预览",
                            title: "查看该收集项在仓储入库单中的录入样式",
                            onClick: () => setPreviewTarget(item),
                          },
                          {
                            key: "edit",
                            label: "编辑",
                            onClick: () =>
                              navigate(inboundCollectEditPath(item.id)),
                          },
                          ...(isShelfLife
                            ? [
                                {
                                  key: "unit",
                                  label: "配置单位",
                                  title:
                                    "集中维护全平台/租户允许使用的保质期单位白名单与推荐基准单位",
                                  onClick: () => setUnitConfigOpen(true),
                                },
                              ]
                            : []),
                          {
                            key: "status",
                            label: isEnabled ? "停用" : "启用",
                            tone: isEnabled ? "amber" : "primary",
                            onClick: () => setStatusTarget(item),
                          },
                          item.isCore
                            ? {
                                key: "delete",
                                label: "删除",
                                disabled: true,
                                title: "系统核心字段，禁止删除",
                              }
                            : {
                                key: "delete",
                                label: "删除",
                                tone: "danger",
                                onClick: () => setDeleteTarget(item),
                              },
                        ]

                        return (
                          <TableRow
                            key={item.id}
                            className="group h-12 hover:bg-muted/40"
                          >
                            <TableCell className="px-3 py-2.5 text-center text-muted-foreground">
                              {rowNum}
                            </TableCell>
                            <TableCell className="px-3 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(inboundCollectDetailPath(item.id))
                                  }
                                  className="cursor-pointer text-left font-medium text-foreground transition-colors hover:text-primary hover:underline"
                                >
                                  {item.name}
                                </button>
                                {item.isCore && (
                                  <span
                                    className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.2 text-[11px] font-medium text-blue-700"
                                    title="系统核心字段，控件类型锁定且禁止删除"
                                  >
                                    核心
                                  </span>
                                )}
                                {item.hasDownstreamRef && (
                                  <span
                                    className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[11px] font-normal text-slate-600"
                                    title={`当前被 ${countGoodsReferences(item.id)} 个货品使用，不可删除`}
                                  >
                                    已引用
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-sm whitespace-nowrap">
                              {item.controlType}
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-sm text-muted-foreground">
                              <span
                                className="block max-w-[240px] truncate"
                                title={item.summary}
                              >
                                {item.summary}
                              </span>
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-center">
                              <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell className="px-3 py-2.5 whitespace-nowrap">
                              <TableDateTimeCell value={item.createdAt} plain />
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                              <TableRowActionPanel
                                actions={rowActions}
                                fixedCols={3}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <WarningListPagination
                total={filteredFields.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setPage(1)
                }}
              />
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 弹窗：保质期度量单位白名单配置 */}
        <ShelfLifeUnitConfigDialog
          open={unitConfigOpen}
          onOpenChange={setUnitConfigOpen}
          onSuccess={showToast}
        />

        {/* 弹窗：两阶段安全删除拦截与二次确认 */}
        <InboundCollectDeleteDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          field={deleteTarget}
          onSuccess={showToast}
        />

        {/* 弹窗：录入效果预览 */}
        <InboundCollectPreviewDialog
          open={previewTarget !== null}
          onOpenChange={(open) => !open && setPreviewTarget(null)}
          field={previewTarget}
        />

        {/* 弹窗：停用 / 启用二次确认 */}
        <ConfirmActionDialog
          open={statusTarget !== null}
          title={statusTarget?.status === "ENABLED" ? "确认停用" : "确认启用"}
          description={
            statusTarget?.status === "ENABLED"
              ? `确定停用收集项「${statusTarget?.name}」吗？停用后新建货品将无法选择此项，已有货品和历史入库单不受影响。`
              : `确定恢复启用收集项「${statusTarget?.name}」吗？启用后下游新建货品可以重新勾选此项。`
          }
          confirmLabel={statusTarget?.status === "ENABLED" ? "确认停用" : "确认启用"}
          tone={statusTarget?.status === "ENABLED" ? "warning" : "info"}
          onOpenChange={(open) => !open && setStatusTarget(null)}
          onConfirm={handleToggleStatus}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
