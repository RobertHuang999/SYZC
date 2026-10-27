import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CopyIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  GOODS_LIST_PATH,
  INBOUND_COLLECT_ITEMS,
  goodsEditPath,
} from "../domain/constants"
import {
  effectiveInvalidReason,
  findMajorCategory,
  findSku,
  findSubcategory,
  isSkuEffectivelyEnabled,
  setSkuPrice,
  useGoodsSpecRevision,
} from "../lib/store"
import { formatSpecSummary } from "../lib/format"
import { StatusBadge } from "../components/StatusBadge"
import { PriceDialog } from "../components/PriceDialog"
import { PriceTrendDialog } from "../components/PriceTrendDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { goodsDetailAnnotations } from "../annotations/goods-detail.annotations"
import { goodsDocuments } from "../documents/goods-spec-documents"

export function GoodsDetailPage() {
  useGoodsSpecRevision()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const sku = findSku(id)

  const [priceDialogOpen, setPriceDialogOpen] = useState(false)
  const [priceTrendDialogOpen, setPriceTrendDialogOpen] = useState(false)
  const [alertState, setAlertState] = useState<{ title: string; description: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const subcategory = useMemo(
    () => findSubcategory(sku?.subcategoryId),
    [sku?.subcategoryId]
  )
  const category = useMemo(
    () => findMajorCategory(subcategory?.categoryId),
    [subcategory?.categoryId]
  )

  const effectivelyEnabled = sku ? isSkuEffectivelyEnabled(sku) : false
  const invalidReason = sku ? effectiveInvalidReason(sku) : undefined

  if (!sku) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 border-b pb-3">
          <Link to={GOODS_LIST_PATH}>
            <Button variant="outline" size="sm">
              返回列表
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          未找到该货品信息或已被删除
        </div>
      </div>
    )
  }

  const specSummary = formatSpecSummary(sku, subcategory)

  const handleEditClick = () => {
    if (sku.hasInboundOrders) {
      setAlertState({
        title: "无法编辑",
        description: "该货品已有入库业务数据，不能编辑。",
      })
      return
    }
    navigate(goodsEditPath(sku.id))
  }

  return (
    <PrototypeAnnotationProvider
      title="货品档案详情 · 原型批注"
      annotations={goodsDetailAnnotations}
      documents={goodsDocuments}
    >
      <div className="space-y-4 p-6">
        {/* 页头面包屑与全局返回（对齐仓库管理与标杆详情规范） */}
        {/* 页头面包屑（对齐标杆详情规范） */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to={GOODS_LIST_PATH} className="hover:text-foreground">
                货品管理
              </Link>
              <span>/</span>
              <span className="font-medium text-foreground">货品详情</span>
            </div>
          </div>
        </div>

        {/* 顶部摘要卡片 */}
        <PrototypeAnnotationTarget annotationIds={["goods-detail-header"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {subcategory?.name ?? "货品"} · {specSummary || "标准规格"}
                </h1>
                <StatusBadge status={sku.status} />
                <Badge
                  variant="outline"
                  className={
                    effectivelyEnabled
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }
                >
                  <span
                    className={`mr-1.5 size-1.5 rounded-full ${
                      effectivelyEnabled ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {effectivelyEnabled ? "有效启用" : "无效停用"}
                </Badge>
                {!effectivelyEnabled && invalidReason && (
                  <span className="text-xs text-muted-foreground">
                    （{invalidReason}）
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  货品编号：<span className="font-medium text-foreground">{sku.id}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-5 text-muted-foreground hover:text-primary"
                  title="复制货品编号"
                  onClick={() => {
                    void navigator.clipboard.writeText(sku.id)
                    showToast("已复制货品编号")
                  }}
                >
                  <CopyIcon className="size-3" />
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(GOODS_LIST_PATH)}
              >
                返回列表
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPriceDialogOpen(true)}
              >
                设置价格
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleEditClick}
              >
                编辑货品
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 板块 1: 基础规格档案 */}
        <PrototypeAnnotationTarget annotationIds={["goods-detail-base"]}>
          <DetailSection title="基础规格档案">
            <DetailField label="所属大类">
              <span className="font-medium">{category?.name ?? "—"}</span>
            </DetailField>
            <DetailField label="所属品类">
              <span className="font-medium">{subcategory?.name ?? "—"}</span>
            </DetailField>
            <DetailField label="计量参数">
              <span>{sku.measureParam}</span>
            </DetailField>
            <DetailField label="计量单位">
              <span>{sku.measureUnit}</span>
            </DetailField>

            {/* 动态规格参数字段 */}
            {subcategory?.specDimensions.map((dimension) => (
              <DetailField key={dimension} label={`规格维度 · ${dimension}`}>
                <span className="font-medium text-foreground">
                  {sku.specValues[dimension] || "—"}
                </span>
              </DetailField>
            ))}

            <DetailField label="系统参考单价">
              {typeof sku.price === "number" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    ¥ {sku.price.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} 元 / {sku.measureUnit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(sku.price / 10000).toFixed(6)} 万元 / {sku.measureUnit})
                  </span>
                  {sku.priceTrend && sku.priceTrend.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs text-primary hover:text-primary/80"
                      onClick={() => setPriceTrendDialogOpen(true)}
                    >
                      <TrendingUpIcon className="mr-1 size-3" />
                      价格趋势
                    </Button>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">--（未设置参考单价）</span>
              )}
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 板块 2: 入库收集信息配置 */}
        <PrototypeAnnotationTarget annotationIds={["goods-detail-inbound"]}>
          <DetailSection title="入库收集信息配置">
            {sku.inboundCollect.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                当前货品未配置入库收集项，入库单仅需填写基础数量/重量。
              </div>
            ) : (
              <div className="col-span-full rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                      <TableHead className="w-16 text-center">序号</TableHead>
                      <TableHead className="w-52">收集项名称</TableHead>
                      <TableHead className="w-44">控件类型</TableHead>
                      <TableHead className="w-28 text-center">是否必填</TableHead>
                      <TableHead>说明与业务规范</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sku.inboundCollect.map((item, index) => {
                      const def = INBOUND_COLLECT_ITEMS.find((c) => c.key === item.key)
                      const isShelfLife = item.key === "shelfLife"
                      return (
                        <TableRow key={item.key}>
                          <TableCell className="text-center text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span>{item.label}</span>
                              {def?.group && (
                                <Badge variant="secondary" className="text-[11px] font-normal">
                                  {def.group}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {def?.controlLabel || "单行文本"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                item.required
                                  ? "border-sky-200 bg-sky-50 text-sky-700 font-medium"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }
                            >
                              {item.required ? "必填" : "选填"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {isShelfLife
                              ? "固定单位：年，建议数值：2 年（入库单已锁定为年，只填数值）"
                              : item.key === "origin"
                              ? "全国省-市-区三级联动选择"
                              : item.key === "packaging"
                              ? "箱装/盒装、袋装、散装、桶装等枚举校验"
                              : def?.description || "入库现场按实物或单据录入"}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 板块 3: 参考单价调价记录 */}
        <PrototypeAnnotationTarget annotationIds={["goods-detail-price"]}>
          <DetailSection title="参考单价调价记录">
            {sku.priceHistory.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                暂无调价记录，点击页面顶部【设置价格】可录入基准单价。
              </div>
            ) : (
              <div className="col-span-full rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                      <TableHead className="w-16 text-center">序号</TableHead>
                      <TableHead className="w-64">调整后单价</TableHead>
                      <TableHead className="w-32">计量单位</TableHead>
                      <TableHead className="w-40">操作人</TableHead>
                      <TableHead>调价时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sku.priceHistory.map((record, index) => (
                      <TableRow key={record.id || index}>
                        <TableCell className="text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          <span>
                            ¥ {record.price.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} 元
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            ({(record.price / 10000).toFixed(6)} 万元)
                          </span>
                        </TableCell>
                        <TableCell>{record.unit || sku.measureUnit}</TableCell>
                        <TableCell>{record.operator || "系统管理员"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          <TableDateTimeCell value={record.operatedAt} plain />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 板块 4: 系统与审计信息 */}
        <PrototypeAnnotationTarget annotationIds={["goods-detail-audit"]}>
          <DetailSection title="系统与审计信息">
            <DetailField label="创建人">
              <span>{sku.createdBy || "系统管理员"}</span>
            </DetailField>
            <DetailField label="创建时间">
              <TableDateTimeCell value={sku.createdAt || ""} plain />
            </DetailField>
            <DetailField label="最近更新人">
              <span>{sku.updatedBy || "—"}</span>
            </DetailField>
            <DetailField label="更新时间">
              <TableDateTimeCell value={sku.updatedAt || ""} plain />
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 设置价格模态框 */}
        {priceDialogOpen && (
          <PriceDialog
            sku={sku}
            subcategory={subcategory}
            categoryName={category?.name}
            open={priceDialogOpen}
            onOpenChange={setPriceDialogOpen}
            onSave={(price) => {
              setSkuPrice(sku.id, price)
            }}
          />
        )}

        {/* 价格趋势模态框 */}
        {priceTrendDialogOpen && (
          <PriceTrendDialog
            sku={sku}
            subcategory={subcategory}
            open={priceTrendDialogOpen}
            onOpenChange={setPriceTrendDialogOpen}
          />
        )}

        {/* 拦截弹窗（编辑入库业务阻断等） */}
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

        {/* 全局居中黑底白字 Toast 提示 */}
        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
