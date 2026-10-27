import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  GOODS_ADD_PATH,
  PAGE_SIZE,
  PRICE_DISPLAY_OPTIONS,
  goodsDetailPath,
  goodsEditPath,
} from "../domain/constants"
import type { GoodsSku, PriceDisplayUnit } from "../domain/types"
import {
  deleteSku,
  findMajorCategory,
  findSubcategory,
  listMajorCategories,
  listSkus,
  listSubcategories,
  setSkuPrice,
  setSkuStatus,
  useGoodsSpecRevision,
} from "../lib/store"
import { GoodsTreeSidebar } from "../components/GoodsTreeSidebar"
import { GoodsTable } from "../components/GoodsTable"
import { PriceDialog } from "../components/PriceDialog"
import { PriceTrendDialog } from "../components/PriceTrendDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { goodsListAnnotations } from "../annotations/goods-list.annotations"
import { goodsDocuments } from "../documents/goods-spec-documents"

type AlertState = {
  title: string
  description: string
}

export function GoodsListPage() {
  useGoodsSpecRevision()
  const navigate = useNavigate()

  const categories = listMajorCategories()
  const subcategories = listSubcategories()
  const skus = listSkus()

  const defaultSubcategoryId = useMemo(() => {
    const enabledCategory = categories.find(
      (category) => category.status === "ENABLED"
    )
    const enabledSubcategory = enabledCategory
      ? subcategories.find(
          (subcategory) =>
            subcategory.categoryId === enabledCategory.id &&
            subcategory.status === "ENABLED"
        )
      : undefined
    return (
      enabledSubcategory?.id ?? subcategories[0]?.id ?? ""
    )
  }, [categories, subcategories])

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    defaultSubcategoryId
  )
  const [keyword, setKeyword] = useState("")
  const [skuKeyword, setSkuKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [showDisabled, setShowDisabled] = useState(false)
  const [priceUnit, setPriceUnit] = useState<PriceDisplayUnit>("YUAN")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [priceTarget, setPriceTarget] = useState<GoodsSku | null>(null)
  const [trendTarget, setTrendTarget] = useState<GoodsSku | null>(null)
  const [statusTarget, setStatusTarget] = useState<{
    sku: GoodsSku
    nextStatus: "ENABLED" | "DISABLED"
  } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GoodsSku | null>(null)
  const [alertState, setAlertState] = useState<AlertState | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!subcategories.some((item) => item.id === selectedSubcategoryId)) {
      setSelectedSubcategoryId(defaultSubcategoryId)
    }
  }, [subcategories, selectedSubcategoryId, defaultSubcategoryId])

  const selectedSubcategory = findSubcategory(selectedSubcategoryId)
  const selectedCategory = findMajorCategory(selectedSubcategory?.categoryId)

  const filteredSkus = useMemo(() => {
    const kw = skuKeyword.trim().toLowerCase()
    return skus.filter((sku) => {
      if (sku.subcategoryId !== selectedSubcategoryId) return false
      if (!showDisabled && sku.status !== "ENABLED") return false
      if (statusFilter !== "ALL" && sku.status !== statusFilter) return false
      if (kw) {
        const specMatch = Object.values(sku.specValues).some((v) =>
          v.toLowerCase().includes(kw)
        )
        const measureMatch =
          sku.measureParam.toLowerCase().includes(kw) ||
          sku.measureUnit.toLowerCase().includes(kw)
        if (!specMatch && !measureMatch) return false
      }
      return true
    })
  }, [skus, selectedSubcategoryId, showDisabled, statusFilter, skuKeyword])

  const totalPages = Math.max(1, Math.ceil(filteredSkus.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = filteredSkus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleEdit = (sku: GoodsSku) => {
    if (sku.hasInboundOrders) {
      setAlertState({
        title: "无法编辑",
        description: "该货品已有入库业务数据，不能编辑。",
      })
      return
    }
    navigate(goodsEditPath(sku.id))
  }

  const handleDelete = (sku: GoodsSku) => {
    if (sku.status === "ENABLED") {
      setAlertState({
        title: "无法删除",
        description: "货品正在启用中，不能删除，请先停用。",
      })
      return
    }
    if (sku.hasInboundOrders) {
      setAlertState({
        title: "无法删除",
        description: "该货品已有入库业务数据，不能删除。",
      })
      return
    }
    setDeleteTarget(sku)
  }

  return (
    <PrototypeAnnotationProvider
      title="货品管理 · 原型批注"
      annotations={goodsListAnnotations}
      documents={goodsDocuments}
    >
      <div className="space-y-4 p-6">
        {/* 顶部标题与主操作栏 - 对齐老系统截图 */}
        <PrototypeAnnotationTarget annotationIds={["goods-page"]}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">货品管理</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                维护 SKU 规格取值、计量单位、其他收集信息与参考单价，左侧选品类、右侧看货品
              </p>
            </div>
            <Button
              type="button"
              disabled={!selectedSubcategory}
              onClick={() =>
                navigate(
                  `${GOODS_ADD_PATH}?subcategoryId=${selectedSubcategoryId || ""}`
                )
              }
            >
              添加货品
            </Button>
          </div>
        </PrototypeAnnotationTarget>

        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <PrototypeAnnotationTarget annotationIds={["goods-tree"]}>
              <GoodsTreeSidebar
                categories={categories}
                subcategories={subcategories}
                selectedSubcategoryId={selectedSubcategoryId}
                keyword={keyword}
                showDisabled={showDisabled}
                onKeywordChange={setKeyword}
                onSelectSubcategory={(id) => {
                  setSelectedSubcategoryId(id)
                  setPage(1)
                }}
                onShowDisabledChange={(value) => {
                  setShowDisabled(value)
                  setPage(1)
                }}
              />
            </PrototypeAnnotationTarget>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <PrototypeAnnotationTarget
              annotationIds={["goods-table", "goods-price", "goods-row-actions"]}
            >
              <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold">
                      {selectedSubcategory?.name ?? "请选择品类"}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    共 {filteredSkus.length} 条货品
                    {!showDisabled ? "（仅启用）" : "（含停用）"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">单价单位</span>
                    <div className="inline-flex rounded-lg border bg-background p-0.5">
                      {PRICE_DISPLAY_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          size="xs"
                          variant={
                            priceUnit === option.value ? "secondary" : "ghost"
                          }
                          className="rounded-md"
                          onClick={() => setPriceUnit(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧货品筛选检索区 */}
              <div className="flex flex-wrap items-end gap-3 pt-3 border-t">
                <div className="space-y-1.5 flex-1 min-w-[200px]">
                  <Label htmlFor="sku-keyword-filter" className="text-xs">规格参数</Label>
                  <Input
                    id="sku-keyword-filter"
                    value={skuKeyword}
                    placeholder="请输入规格参数值搜索"
                    className="h-8 text-xs"
                    onChange={(e) => {
                      setSkuKeyword(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
                <div className="space-y-1.5 w-[140px]">
                  <Label className="text-xs">状态</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(val) => {
                      if (val) {
                        setStatusFilter(val)
                        setPage(1)
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="请选择状态">
                        {(val) => {
                          if (val === "ENABLED") return "启用"
                          if (val === "DISABLED") return "停用"
                          return "全部状态"
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">全部状态</SelectItem>
                      <SelectItem value="ENABLED">启用</SelectItem>
                      <SelectItem value="DISABLED">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(skuKeyword || statusFilter !== "ALL") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="h-8 text-xs text-muted-foreground"
                    onClick={() => {
                      setSkuKeyword("")
                      setStatusFilter("ALL")
                      setPage(1)
                    }}
                  >
                    重置筛选
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <GoodsTable
              subcategory={selectedSubcategory}
              skus={pageData}
              pageStart={(currentPage - 1) * pageSize}
              priceUnit={priceUnit}
              onOpenPriceTrend={setTrendTarget}
              onDetail={(sku) => navigate(goodsDetailPath(sku.id))}
              onEdit={handleEdit}
              onToggleStatus={(sku) =>
                setStatusTarget({
                  sku,
                  nextStatus:
                    sku.status === "ENABLED" ? "DISABLED" : "ENABLED",
                })
              }
              onSetPrice={setPriceTarget}
              onDelete={handleDelete}
            />

                <WarningListPagination
                  total={filteredSkus.length}
                  page={currentPage}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPage(1)
                  }}
                  totalLabel="条货品"
                />
              </div>
            </PrototypeAnnotationTarget>
          </div>
        </div>

        <PriceDialog
          open={priceTarget !== null}
          sku={priceTarget ?? undefined}
          subcategory={selectedSubcategory}
          categoryName={selectedCategory?.name}
          onOpenChange={(open) => {
            if (!open) setPriceTarget(null)
          }}
          onSave={(price) => {
            if (!priceTarget) return
            setSkuPrice(priceTarget.id, price)
            showToast("价格设置成功，已写入修改记录")
          }}
        />

        <PriceTrendDialog
          open={trendTarget !== null}
          sku={trendTarget ?? undefined}
          subcategory={selectedSubcategory}
          onOpenChange={(open) => {
            if (!open) setTrendTarget(null)
          }}
        />

        <ConfirmActionDialog
          open={statusTarget !== null}
          title={
            statusTarget?.nextStatus === "DISABLED"
              ? "确认停用该货品？"
              : "确认启用该货品？"
          }
          description={
            statusTarget?.nextStatus === "DISABLED"
              ? `停用后，「${statusTarget?.sku.specValues[selectedSubcategory?.specDimensions[0] ?? ""] ?? ""}」将无法在下游新建单据中选择；历史单据不受影响。`
              : "启用后，该货品可以在后续新建单据中正常选择使用。"
          }
          confirmLabel={
            statusTarget?.nextStatus === "DISABLED" ? "确认停用" : "确认启用"
          }
          tone={statusTarget?.nextStatus === "DISABLED" ? "danger" : "info"}
          onConfirm={() => {
            if (!statusTarget) return
            setSkuStatus(statusTarget.sku.id, statusTarget.nextStatus)
            showToast(
              statusTarget.nextStatus === "DISABLED" ? "停用成功" : "启用成功"
            )
            setStatusTarget(null)
          }}
          onOpenChange={(open) => {
            if (!open) setStatusTarget(null)
          }}
        />

        <ConfirmActionDialog
          open={deleteTarget !== null}
          title="确认删除该货品？"
          description="删除后不可恢复，货品将不再出现在列表和下游选择器中。"
          confirmLabel="确认删除"
          tone="danger"
          onConfirm={() => {
            if (!deleteTarget) return
            deleteSku(deleteTarget.id)
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

        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
