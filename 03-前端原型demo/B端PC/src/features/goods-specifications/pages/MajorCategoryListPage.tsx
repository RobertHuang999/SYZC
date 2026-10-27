import { useMemo, useState } from "react"
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
  DEFAULT_MAJOR_CATEGORY_FILTER,
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "../domain/constants"
import type { MajorCategory, MajorCategoryFilter } from "../domain/types"
import {
  createMajorCategory,
  deleteMajorCategory,
  disableMajorCategory,
  enableMajorCategory,
  isMajorCategoryNameTaken,
  listMajorCategories,
  updateMajorCategory,
  useGoodsSpecRevision,
} from "../lib/store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { MajorCategoryFormDialog } from "../components/MajorCategoryFormDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { StatusBadge } from "../components/StatusBadge"
import { majorCategoryListAnnotations } from "../annotations/major-category-list.annotations"
import { majorCategoryDocuments } from "../documents/goods-spec-documents"

type FormState = {
  mode: "create" | "edit"
  record?: MajorCategory
}

type AlertState = {
  title: string
  description: string
}

export function MajorCategoryListPage() {
  useGoodsSpecRevision()
  const categories = listMajorCategories()

  const [draftFilters, setDraftFilters] = useState<MajorCategoryFilter>(
    DEFAULT_MAJOR_CATEGORY_FILTER
  )
  const [appliedFilters, setAppliedFilters] = useState<MajorCategoryFilter>(
    DEFAULT_MAJOR_CATEGORY_FILTER
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [statusTarget, setStatusTarget] = useState<MajorCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MajorCategory | null>(null)
  const [alertState, setAlertState] = useState<AlertState | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const keyword = appliedFilters.name.trim().toLocaleLowerCase()
    return categories
      .filter((category) => {
        if (
          keyword &&
          !category.name.toLocaleLowerCase().includes(keyword)
        ) {
          return false
        }
        if (appliedFilters.status && category.status !== appliedFilters.status) {
          return false
        }
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [categories, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleStatusConfirm = () => {
    if (!statusTarget) return
    if (statusTarget.status === "ENABLED") {
      disableMajorCategory(statusTarget.id)
      showToast("停用成功，下属品类和货品已同步停用")
    } else {
      enableMajorCategory(statusTarget.id)
      showToast("启用成功，下属原启用的品类和货品已恢复")
    }
    setStatusTarget(null)
  }

  const handleDelete = (record: MajorCategory) => {
    if (record.status === "ENABLED") {
      setAlertState({
        title: "无法删除",
        description: "大类正在启用中，不能删除，请先停用。",
      })
      return
    }
    if (record.hasInboundOrders) {
      setAlertState({
        title: "无法删除",
        description: "该大类下已有入库业务数据，不能删除。",
      })
      return
    }
    setDeleteTarget(record)
  }

  return (
    <PrototypeAnnotationProvider
      title="大类管理 · 原型批注"
      annotations={majorCategoryListAnnotations}
      documents={majorCategoryDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["major-category-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">大类管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              维护货品规格体系的顶层分类，停用和启用会级联影响下属品类与货品
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["major-category-filter"]}>
          <Card>
            <CardContent className="space-y-4 pt-4">
              <WarningFilterHeader
                addLabel="添加大类"
                onAdd={() => setFormState({ mode: "create" })}
                onReset={() => {
                  setDraftFilters(DEFAULT_MAJOR_CATEGORY_FILTER)
                  setAppliedFilters(DEFAULT_MAJOR_CATEGORY_FILTER)
                  setPage(1)
                }}
                onSearch={() => {
                  setAppliedFilters(draftFilters)
                  setPage(1)
                }}
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="major-category-keyword" className="text-xs text-muted-foreground">大类名称</Label>
                  <Input
                    id="major-category-keyword"
                    value={draftFilters.name}
                    placeholder="请输入大类名称"
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        setAppliedFilters(draftFilters)
                        setPage(1)
                      }
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">状态</Label>
                  <Select
                    value={draftFilters.status || "ALL"}
                    onValueChange={(value) =>
                      setDraftFilters((current) => ({
                        ...current,
                        status:
                          value === "ALL"
                            ? ""
                            : (value as MajorCategoryFilter["status"]),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态">
                        {(val) => {
                          const option = STATUS_OPTIONS.find(
                            (opt) => (opt.value || "ALL") === val
                          )
                          return option ? option.label : "全部"
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value || "ALL"}
                          value={option.value || "ALL"}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["major-category-table", "major-category-row-actions"]}>
          <Card>
            <CardContent className="space-y-3 pt-4">
              <div className="overflow-hidden rounded-lg border">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow className="h-10 hover:bg-transparent bg-slate-100 dark:bg-slate-800">
                      <TableHead className="w-16 px-3 py-2.5 text-center">序号</TableHead>
                      <TableHead className="min-w-44 px-3 py-2.5">大类名称</TableHead>
                      <TableHead className="w-32 px-3 py-2.5">创建人</TableHead>
                      <TableHead className="w-48 px-3 py-2.5">创建时间</TableHead>
                      <TableHead className="w-48 px-3 py-2.5">更新时间</TableHead>
                      <TableHead className="w-24 px-3 py-2.5 text-center">状态</TableHead>
                      <TableHead className="w-44 px-3 py-2.5 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                        操作
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-32 text-center text-muted-foreground"
                        >
                          没有符合条件的大类，点击「添加大类」创建第一条
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageData.map((record, index) => {
                        const rowActions: TableRowActionItem[] = [
                          {
                            key: "edit",
                            label: "编辑",
                            onClick: () =>
                              setFormState({ mode: "edit", record }),
                          },
                          {
                            key: "status",
                            label: record.status === "ENABLED" ? "停用" : "启用",
                            onClick: () => setStatusTarget(record),
                          },
                          {
                            key: "delete",
                            label: "删除",
                            tone: "danger",
                            onClick: () => handleDelete(record),
                          },
                        ]

                        return (
                          <TableRow key={record.id} className="group h-12 hover:bg-muted/40">
                            <TableCell className="px-3 py-2.5 text-center text-muted-foreground">
                              {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell className="px-3 py-2.5 font-medium">
                              {record.name}
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-sm">{record.createdBy}</TableCell>
                            <TableCell className="px-3 py-2.5">
                              <TableDateTimeCell value={record.createdAt} plain />
                            </TableCell>
                            <TableCell className="px-3 py-2.5">
                              <TableDateTimeCell value={record.updatedAt} plain />
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-center">
                              <StatusBadge status={record.status} />
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                              <TableRowActionPanel actions={rowActions} fixedCols={3} />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <WarningListPagination
                total={filtered.length}
                page={currentPage}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setPage(1)
                }}
                totalLabel="个大类"
              />
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["major-category-dialog"]}>
          <MajorCategoryFormDialog
            open={formState !== null}
            mode={formState?.mode ?? "create"}
            initialName={formState?.record?.name}
            onOpenChange={(open) => {
              if (!open) setFormState(null)
            }}
            onSubmit={(name) => {
              if (formState?.mode === "edit" && formState.record) {
                if (formState.record.hasInboundOrders) {
                  setFormState(null)
                  setAlertState({
                    title: "无法编辑",
                    description:
                      "该大类已有业务数据产生，不可编辑！请先处理相关入库业务。",
                  })
                  return null
                }
                if (isMajorCategoryNameTaken(name, formState.record.id)) {
                  return "大类名称已存在，请重新输入"
                }
                updateMajorCategory(formState.record.id, name)
                showToast("保存成功")
                return null
              }
              if (isMajorCategoryNameTaken(name)) {
                return "大类名称已存在，请重新输入"
              }
              createMajorCategory(name)
              showToast("新建成功，已默认启用")
              return null
            }}
          />
        </PrototypeAnnotationTarget>

        <ConfirmActionDialog
          open={statusTarget !== null}
          title={
            statusTarget?.status === "ENABLED" ? "确认停用该大类？" : "确认启用该大类？"
          }
          description={
            statusTarget?.status === "ENABLED"
              ? `停用「${statusTarget?.name}」后，下属品类和货品会一并停用，确定停用吗？`
              : `启用「${statusTarget?.name}」后，下属原启用的品类和货品会一并恢复，确定启用吗？`
          }
          confirmLabel={statusTarget?.status === "ENABLED" ? "确认停用" : "确认启用"}
          tone={statusTarget?.status === "ENABLED" ? "danger" : "info"}
          onConfirm={handleStatusConfirm}
          onOpenChange={(open) => {
            if (!open) setStatusTarget(null)
          }}
        />

        <ConfirmActionDialog
          open={deleteTarget !== null}
          title="确认删除该大类？"
          description={`删除「${deleteTarget?.name}」后不可恢复，确定删除吗？`}
          confirmLabel="确认删除"
          tone="danger"
          onConfirm={() => {
            if (!deleteTarget) return
            deleteMajorCategory(deleteTarget.id)
            setDeleteTarget(null)
            showToast("删除成功")
          }}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
        />

        <ConfirmActionDialog
          open={alertState !== null}
          title={alertState?.title ?? "提示"}
          description={alertState?.description ?? ""}
          confirmLabel="好的"
          hideCancel
          tone="warning"
          onConfirm={() => setAlertState(null)}
          onOpenChange={(open) => {
            if (!open) setAlertState(null)
          }}
        />

        {/* 轻提示（居中黑底白字胶囊） */}
        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
