import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import {
  GOODS_ADD_PATH,
  PAGE_SIZE,
  goodsDetailPath,
  goodsEditPath,
} from "../domain/constants"
import type { GoodsSku, PriceDisplayUnit } from "../domain/types"
import { GOODS_USER_TREE_HINT } from "../lib/goods-spec-ui-labels"
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
  const [searchParams] = useSearchParams()

  const categories = listMajorCategories()
  const subcategories = listSubcategories()
  const skus = listSkus()

  const defaultSubcategoryId = useMemo(() => {
    const fromQuery = searchParams.get("subcategoryId")
    if (fromQuery && subcategories.some((item) => item.id === fromQuery)) {
      return fromQuery
    }
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
    return enabledSubcategory?.id ?? subcategories[0]?.id ?? ""
  }, [categories, subcategories, searchParams])

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    defaultSubcategoryId
  )
  const [keyword, setKeyword] = useState("")
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
    return skus.filter((sku) => {
      if (sku.subcategoryId !== selectedSubcategoryId) return false
      if (!showDisabled && sku.status !== "ENABLED") return false
      return true
    })
  }, [skus, selectedSubcategoryId, showDisabled])

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
        description: "该货品已有业务数据产生，不可编辑！",
      })
      return
    }
    navigate(goodsEditPath(sku.id))
  }

  const handleDelete = (sku: GoodsSku) => {
    if (sku.status === "ENABLED") {
      setAlertState({
        title: "无法删除",
        description: "启用状态下的【大类/品类/货品】不可删除，请先停用。",
      })
      return
    }
    if (sku.hasInboundOrders) {
      setAlertState({
        title: "无法删除",
        description: "该【大类/品类/货品】已有业务数据产生，不可删除！",
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
      <div className="goods-list-page-shell flex min-h-full flex-col gap-4 p-6">
        {/* 顶部标题与主操作栏 */}
        <PrototypeAnnotationTarget annotationIds={["goods-page"]}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">货品管理</h1>
              <ProductFieldHint>{GOODS_USER_TREE_HINT}</ProductFieldHint>
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

        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          <div className="flex shrink-0 self-stretch">
            <PrototypeAnnotationTarget
              annotationIds={["goods-tree"]}
              className="flex h-full min-h-0 flex-col self-stretch"
            >
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
              <GoodsTable
                subcategory={selectedSubcategory}
                skus={pageData}
                pageStart={(currentPage - 1) * pageSize}
                priceUnit={priceUnit}
                onTogglePriceUnit={() =>
                  setPriceUnit((unit) => (unit === "YUAN" ? "WAN" : "YUAN"))
                }
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
