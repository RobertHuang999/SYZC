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
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import {
  DEFAULT_SUBCATEGORY_FILTER,
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "../domain/constants"
import type { Subcategory, SubcategoryFilter } from "../domain/types"
import {
  createSubcategory,
  deleteSubcategory,
  disableSubcategory,
  enableSubcategory,
  findMajorCategory,
  isSubcategoryNameTaken,
  listMajorCategories,
  listSubcategories,
  updateSubcategory,
  useGoodsSpecRevision,
} from "../lib/store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  SubcategoryFormDialog,
  type SubcategoryFormValues,
} from "../components/SubcategoryFormDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { StatusBadge } from "../components/StatusBadge"
import { subcategoryListAnnotations } from "../annotations/subcategory-list.annotations"
import { subcategoryDocuments } from "../documents/goods-spec-documents"

type FormState = {
  mode: "create" | "edit"
  record?: Subcategory
}

type AlertState = {
  title: string
  description: string
}

export function SubcategoryListPage() {
  useGoodsSpecRevision()
  const categories = listMajorCategories()
  const subcategories = listSubcategories()

  const [draftFilters, setDraftFilters] = useState<SubcategoryFilter>(
    DEFAULT_SUBCATEGORY_FILTER
  )
  const [appliedFilters, setAppliedFilters] = useState<SubcategoryFilter>(
    DEFAULT_SUBCATEGORY_FILTER
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [statusTarget, setStatusTarget] = useState<Subcategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Subcategory | null>(null)
  const [alertState, setAlertState] = useState<AlertState | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filterCategoryOptions = categories.filter(
    (category) => category.status === "ENABLED"
  )

  const filtered = useMemo(() => {
    const keyword = appliedFilters.name.trim().toLocaleLowerCase()
    return subcategories
      .filter((subcategory) => {
        if (
          appliedFilters.categoryId &&
          subcategory.categoryId !== appliedFilters.categoryId
        ) {
          return false
        }
        if (keyword && !subcategory.name.toLocaleLowerCase().includes(keyword)) {
          return false
        }
        if (appliedFilters.status && subcategory.status !== appliedFilters.status) {
          return false
        }
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [subcategories, appliedFilters])

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
      disableSubcategory(statusTarget.id)
      showToast("停用成功，已级联停用下属货品")
    } else {
      enableSubcategory(statusTarget.id)
      showToast("启用成功，已按快照恢复原启用货品")
    }
    setStatusTarget(null)
  }

  const handleToggleStatus = (record: Subcategory) => {
    const category = findMajorCategory(record.categoryId)
    if (record.status === "DISABLED" && category?.status === "DISABLED") {
      setAlertState({
        title: "无法启用",
        description: "所属大类处于停用状态，请先启用大类。",
      })
      return
    }
    setStatusTarget(record)
  }

  const handleDelete = (record: Subcategory) => {
    if (record.status === "ENABLED") {
      setAlertState({
        title: "无法删除",
        description: "品类正在启用中，不能删除，请先停用。",
      })
      return
    }
    if (record.hasInboundOrders) {
      setAlertState({
        title: "无法删除",
        description: "该品类下已有入库业务数据，不能删除。",
      })
      return
    }
    setDeleteTarget(record)
  }

  const handleSubmit = (values: SubcategoryFormValues) => {
    const category = findMajorCategory(values.categoryId)
    if (!category || category.status !== "ENABLED") {
      return "所属大类已停用，请先启用大类"
    }

    if (formState?.mode === "edit" && formState.record) {
      if (formState.record.hasInboundOrders) {
        setFormState(null)
        setAlertState({
          title: "无法编辑",
          description: "该品类下已有入库业务数据，不能编辑。",
        })
        return null
      }
      if (
        isSubcategoryNameTaken(
          values.categoryId,
          values.name,
          formState.record.id
        )
      ) {
        return "该大类下已存在同名品类，请重新输入"
      }
      updateSubcategory(formState.record.id, values)
      showToast("保存成功")
      return null
    }

    if (isSubcategoryNameTaken(values.categoryId, values.name)) {
      return "该大类下已存在同名品类，请重新输入"
    }
    createSubcategory(values)
    showToast("新建成功，已默认启用")
    return null
  }

  return (
    <PrototypeAnnotationProvider
      title="品类管理 · 原型批注"
      annotations={subcategoryListAnnotations}
      documents={subcategoryDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["subcategory-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">品类管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              维护大类下的品类与规格参数维度，规格维度会决定货品建档时要填哪些规格值
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["subcategory-filter"]}>
          <Card>
        <CardContent className="space-y-4 pt-4">
          <WarningFilterHeader
            addLabel="添加品类"
            onAdd={() =>
              setFormState({
                mode: "create",
              })
            }
            onReset={() => {
              setDraftFilters(DEFAULT_SUBCATEGORY_FILTER)
              setAppliedFilters(DEFAULT_SUBCATEGORY_FILTER)
              setPage(1)
            }}
            onSearch={() => {
              setAppliedFilters(draftFilters)
              setPage(1)
            }}
          />
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>大类名称</Label>
              <Select
                value={draftFilters.categoryId || "ALL"}
                onValueChange={(value) =>
                  setDraftFilters((current) => ({
                    ...current,
                    categoryId: !value || value === "ALL" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择大类名称">
                    {(val) => {
                      if (!val || val === "ALL") return "全部"
                      const cat = categories.find((c) => c.id === val)
                      return cat ? cat.name : "全部"
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部</SelectItem>
                  {filterCategoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ProductFieldHint>仅展示启用中的大类</ProductFieldHint>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory-keyword">品类</Label>
              <Input
                id="subcategory-keyword"
                value={draftFilters.name}
                placeholder="请输入品类"
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
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={draftFilters.status || "ALL"}
                onValueChange={(value) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status:
                      value === "ALL"
                        ? ""
                        : (value as SubcategoryFilter["status"]),
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

    <PrototypeAnnotationTarget annotationIds={["subcategory-table", "subcategory-row-actions"]}>
      <Card>
        <CardContent className="space-y-3 pt-4">
          <div className="overflow-hidden rounded-lg border">
            <Table className="min-w-[1240px]">
              <TableHeader>
                <TableRow className="h-10 hover:bg-transparent bg-slate-100 dark:bg-slate-800">
                  <TableHead className="w-16 px-3 py-2.5 text-center">序号</TableHead>
                  <TableHead className="min-w-32 px-3 py-2.5">品类</TableHead>
                  <TableHead className="w-28 px-3 py-2.5">所属大类</TableHead>
                  <TableHead className="min-w-44 px-3 py-2.5">货品规格参数</TableHead>
                  <TableHead className="w-28 px-3 py-2.5">创建人</TableHead>
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
                      colSpan={9}
                      className="h-32 text-center text-muted-foreground"
                    >
                      没有符合条件的品类，点击「添加品类」创建第一条
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((record, index) => {
                    const rowActions: TableRowActionItem[] = [
                      {
                        key: "edit",
                        label: "编辑",
                        onClick: () => {
                          if (record.hasInboundOrders) {
                            setAlertState({
                              title: "无法编辑",
                              description:
                                "该品类已有业务数据产生，不可编辑！请先处理相关入库业务。",
                            })
                            return
                          }
                          setFormState({ mode: "edit", record })
                        },
                      },
                      {
                        key: "status",
                        label: record.status === "ENABLED" ? "停用" : "启用",
                        onClick: () => handleToggleStatus(record),
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
                        <TableCell className="px-3 py-2.5">
                          {findMajorCategory(record.categoryId)?.name ?? "—"}
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <span className="text-sm text-foreground">
                            {record.specDimensions.join("、") || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-2.5 text-sm">{record.createdBy}</TableCell>
                        <TableCell className="px-3 py-2.5">
                          <TableDateTimeCell value={record.createdAt} stackedPlain />
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <TableDateTimeCell value={record.updatedAt} stackedPlain />
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
                totalLabel="个品类"
              />
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["subcategory-dialog"]}>
          <SubcategoryFormDialog
            open={formState !== null}
            mode={formState?.mode ?? "create"}
            initial={formState?.record}
            categories={categories}
            defaultCategoryId={appliedFilters.categoryId || undefined}
            onOpenChange={(open) => {
              if (!open) setFormState(null)
            }}
            onSubmit={handleSubmit}
          />
        </PrototypeAnnotationTarget>

        <ConfirmActionDialog
          open={statusTarget !== null}
          title={
            statusTarget?.status === "ENABLED"
              ? "确认停用该品类？"
              : "确认启用该品类？"
          }
          description={
            statusTarget?.status === "ENABLED"
              ? `停用「${statusTarget?.name}」后，下属货品会一并停用，确定停用吗？`
              : `启用「${statusTarget?.name}」后，下属原启用的货品会一并恢复，确定启用吗？`
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
          title="确认删除该品类？"
          description={`删除「${deleteTarget?.name}」后不可恢复，确定删除吗？`}
          confirmLabel="确认删除"
          tone="danger"
          onConfirm={() => {
            if (!deleteTarget) return
            deleteSubcategory(deleteTarget.id)
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
