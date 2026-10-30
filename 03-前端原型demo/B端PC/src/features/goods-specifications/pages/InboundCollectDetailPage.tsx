import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DetailField,
  DetailSection,
} from "@/shared/components/DetailSection"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  INBOUND_COLLECT_CONFIG_PATH,
  inboundCollectEditPath,
} from "../domain/constants"
import {
  findInboundCollectField,
  getShelfLifeUnitConfig,
  setInboundCollectFieldStatus,
  useGoodsSpecRevision,
} from "../lib/store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundCollectDetailAnnotations } from "../annotations/inbound-collect.annotations"
import { inboundCollectDocuments } from "../documents/inbound-collect-documents"
import { InboundCollectPreviewCard } from "../components/InboundCollectPreviewCard"
import { ShelfLifeUnitConfigDialog } from "../components/ShelfLifeUnitConfigDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { StatusBadge } from "../components/StatusBadge"
import {
  INBOUND_COLLECT_SPEC_AUDIT_NOTE,
  INBOUND_COLLECT_SPEC_DOWNSTREAM_NOTE,
  INBOUND_COLLECT_SPEC_SHELF_LIFE_NOTE,
  INBOUND_COLLECT_SPEC_TENANT_NOTE,
} from "../lib/inbound-collect-ui-labels"
import {
  ArrowLeft,
  CalendarClock,
  Edit,
  ShieldCheck,
} from "lucide-react"
import { IterationPageTag } from "@/shared/components/IterationHighlight"

export function InboundCollectDetailPage() {
  useGoodsSpecRevision()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const field = findInboundCollectField(id)
  const shelfLifeConfig = getShelfLifeUnitConfig()

  const [unitConfigOpen, setUnitConfigOpen] = useState(false)
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  useEffect(() => {
    const toast = searchParams.get("toast")
    if (toast === "created") {
      showToast("新增收集项成功")
      setSearchParams({}, { replace: true })
    } else if (toast === "updated") {
      showToast("保存收集项成功")
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  if (!field) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500 text-sm">未找到指定的收集项配置</p>
        <Button
          variant="outline"
          onClick={() => navigate(INBOUND_COLLECT_CONFIG_PATH)}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          返回收集项列表
        </Button>
      </div>
    )
  }

  const isEnabled = field.status === "ENABLED"
  const isShelfLife = Boolean(field.isShelfLife)

  const handleToggleStatus = () => {
    const nextStatus = isEnabled ? "DISABLED" : "ENABLED"
    setInboundCollectFieldStatus(field.id, nextStatus)
    showToast(`已${nextStatus === "ENABLED" ? "启用" : "停用"}收集项「${field.name}」`)
    setStatusConfirmOpen(false)
  }

  const unitMap = {
    DAY: "按【天】计量 (DAY)",
    MONTH: "按【月】计量 (MONTH)",
    YEAR: "按【年】计量 (YEAR)",
  }

  return (
    <PrototypeAnnotationProvider
      annotations={inboundCollectDetailAnnotations}
      documents={inboundCollectDocuments}
      title="入库收集项详情 · 原型批注"
    >
      <div className="space-y-4 p-6">
        {/* 轻提示 Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 页头面包屑 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={INBOUND_COLLECT_CONFIG_PATH} className="hover:text-foreground">
              入库收集项配置
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">收集项详情</span>
          </div>
        </div>

        <IterationPageTag
          title="收集项只读详情（本菜单 6.3 全新上线）"
          description="只读展示字段元数据、保质期单位白名单与下游引用状态；删除走「停用 + 引用扫描」两阶段校验。"
        />

        {/* 页头摘要卡片 */}
        <PrototypeAnnotationTarget annotationIds={["detail-header-card"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {field.name}
                </h1>
                {field.isCore ? (
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    <ShieldCheck className="mr-1 size-3" />
                    系统核心项
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-50 text-slate-600"
                  >
                    自定义扩展项
                  </Badge>
                )}
                <StatusBadge status={field.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  {field.isCore
                    ? "系统内置，名称与控件类型锁定，永久不可删除"
                    : field.hasDownstreamRef
                      ? "自定义字段，已被下游引用，控件类型锁定"
                      : "自定义字段，停用且无下游引用时可删除"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(inboundCollectEditPath(field.id))}
                className="h-9 gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                编辑
              </Button>
              {isShelfLife && (
                <Button
                  variant="outline"
                  onClick={() => setUnitConfigOpen(true)}
                  className="h-9 gap-1.5"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  配置单位
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setStatusConfirmOpen(true)}
                className="h-9"
              >
                {isEnabled ? "停用" : "启用"}
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 分区 1: 字段基础规格（右侧并列入库单录入样式） */}
        <PrototypeAnnotationTarget annotationIds={["detail-section-specs"]}>
          <DetailSection title="字段基础规格">
            <div className="col-span-full grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="space-y-5">
                <DetailField label="控件类型">{field.controlType}</DetailField>
                <DetailField label="度量单位 / 选项摘要">
                  {field.summary}
                </DetailField>
                <DetailField label="输入提示">
                  {field.placeholder || "—"}
                </DetailField>
                <DetailField label="说明 / 备注">
                  {field.remark || "暂无备注说明"}
                </DetailField>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                <div className="mb-4 text-sm font-medium text-slate-700">
                  入库单录入样式
                </div>
                <InboundCollectPreviewCard field={field} compact />
              </div>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 分区 2: 保质期度量单位白名单与下游规则（仅保质期专属） */}
        {isShelfLife && (
          <PrototypeAnnotationTarget annotationIds={["detail-section-shelf-life"]}>
            <DetailSection title="保质期度量单位白名单">
              <DetailField label="允许启用【天】">
                {shelfLifeConfig.allowDay ? "已开启（生鲜冷链）" : "已关闭"}
              </DetailField>
              <DetailField label="允许启用【月】">
                {shelfLifeConfig.allowMonth ? "已开启（粮油调味）" : "已关闭"}
              </DetailField>
              <DetailField label="允许启用【年】">
                {shelfLifeConfig.allowYear ? "已开启（花椒中药）" : "已关闭"}
              </DetailField>
              <DetailField label="推荐基准单位">
                {unitMap[shelfLifeConfig.recommendedUnit]}
              </DetailField>

              <PrototypeSpecCallout>
                <div className="space-y-1">
                  <p>{INBOUND_COLLECT_SPEC_SHELF_LIFE_NOTE}</p>
                  <p>{INBOUND_COLLECT_SPEC_DOWNSTREAM_NOTE}</p>
                </div>
              </PrototypeSpecCallout>
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {/* 分区 3: 系统与审计信息 */}
        <PrototypeAnnotationTarget annotationIds={["detail-section-audit"]}>
          <DetailSection title="系统与审计信息">
            <DetailField label="数据版本号">第 {field.version} 版</DetailField>
            <DetailField label="租户">当前租户</DetailField>
            <DetailField label="创建人">
              <span className="flex flex-col leading-tight">
                <span>{field.createdBy}</span>
                <span className="text-xs text-muted-foreground">
                  {field.createdAt}
                </span>
              </span>
            </DetailField>
            <DetailField label="最近修改人">
              <span className="flex flex-col leading-tight">
                <span>{field.updatedBy}</span>
                <span className="text-xs text-muted-foreground">
                  {field.updatedAt}
                </span>
              </span>
            </DetailField>

            <PrototypeSpecCallout>
              <div className="space-y-1">
                <p>{INBOUND_COLLECT_SPEC_AUDIT_NOTE}</p>
                <p>{INBOUND_COLLECT_SPEC_TENANT_NOTE}</p>
              </div>
            </PrototypeSpecCallout>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 弹窗：保质期度量单位配置 */}
        <ShelfLifeUnitConfigDialog
          open={unitConfigOpen}
          onOpenChange={setUnitConfigOpen}
          onSuccess={showToast}
        />

        {/* 弹窗：停用 / 启用二次确认 */}
        <ConfirmActionDialog
          open={statusConfirmOpen}
          title={isEnabled ? "确认停用" : "确认启用"}
          description={
            isEnabled
              ? `确定停用收集项「${field.name}」吗？停用后新建货品将无法选择此项，已有货品和历史入库单不受影响。`
              : `确定恢复启用收集项「${field.name}」吗？启用后下游新建货品可以重新勾选此项。`
          }
          confirmLabel={isEnabled ? "确认停用" : "确认启用"}
          tone={isEnabled ? "warning" : "info"}
          onOpenChange={setStatusConfirmOpen}
          onConfirm={handleToggleStatus}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
