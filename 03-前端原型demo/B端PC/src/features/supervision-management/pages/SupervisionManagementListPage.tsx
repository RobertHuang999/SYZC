import { useMemo, useState } from "react"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PageHeader } from "@/shared/components/PageHeader"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { cn } from "@/lib/utils"
import { supervisionManagementListAnnotations } from "../annotations/supervision-management-list.annotations"
import { supervisionManagementDocuments } from "../documents/supervision-management-documents"
import { SupervisionLogDialog, SupervisionMaterialsDialog } from "../components/SupervisionDialogs"
import { SupervisionFiltersPanel } from "../components/SupervisionFiltersPanel"
import { SupervisionOrderTable } from "../components/SupervisionOrderTable"
import { SupervisionStatsCards } from "../components/SupervisionStatsCards"
import {
  DEFAULT_SUPERVISION_FILTERS,
  PAGE_SIZE,
  SUPERVISION_TABS,
  getSupervisionTabConfig,
  type SupervisionActionDef,
} from "../domain/constants"
import type {
  SupervisionOrderFilters,
  SupervisionOrderItem,
  SupervisionOrderTabKey,
} from "../domain/types"
import { supervisionOrdersMock } from "../mock/supervision-orders.mock"

function matchesFilters(item: SupervisionOrderItem, filters: SupervisionOrderFilters) {
  const orderNo = filters.orderNo.trim()
  if (orderNo && !item.orderNo.includes(orderNo)) return false

  const ownerKeyword = filters.ownerKeyword.trim()
  if (ownerKeyword) {
    const haystack = [item.ownerName, item.ownerIdentity, item.ownerIdentityFull ?? ""]
    if (!haystack.some((value) => value.includes(ownerKeyword))) return false
  }

  if (filters.status !== "全部" && item.status !== filters.status) return false
  if (filters.mode !== "全部" && item.businessMode !== filters.mode) return false
  if (filters.risk === "有风险" && !item.hasRisk) return false
  if (filters.risk === "无风险" && item.hasRisk) return false

  const goodsName = filters.goodsName.trim()
  if (goodsName && !item.goodsList.some((goods) => goods.name.includes(goodsName))) {
    return false
  }

  const org = filters.org.trim()
  if (org && !item.relatedOrgs.some((name) => name.includes(org))) return false

  const day = item.pledgeTime.slice(0, 10)
  if (filters.dateStart && day < filters.dateStart) return false
  if (filters.dateEnd && day > filters.dateEnd) return false

  return true
}

export function SupervisionManagementListPage() {
  const [activeTab, setActiveTab] = useState<SupervisionOrderTabKey>("MORTGAGE")
  const [draftFilters, setDraftFilters] = useState<SupervisionOrderFilters>({
    ...DEFAULT_SUPERVISION_FILTERS,
  })
  const [appliedFilters, setAppliedFilters] = useState<SupervisionOrderFilters>({
    ...DEFAULT_SUPERVISION_FILTERS,
  })
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [logTarget, setLogTarget] = useState<SupervisionOrderItem | null>(null)
  const [materialsTarget, setMaterialsTarget] = useState<SupervisionOrderItem | null>(null)

  const tabConfig = getSupervisionTabConfig(activeTab)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const tabRows = useMemo(
    () => supervisionOrdersMock.filter((item) => item.tab === activeTab),
    [activeTab],
  )

  const stats = useMemo(() => {
    const activeRows = tabRows.filter((item) => !item.status.startsWith("解"))
    return {
      total: tabRows.length,
      activeCount: activeRows.length,
      valueTotal: activeRows.reduce(
        (sum, item) => sum + (item.unpriced ? 0 : (item.appraisedValue ?? 0)),
        0,
      ),
      unpricedCount: tabRows.filter((item) => item.unpriced).length,
      riskCount: tabRows.filter((item) => item.hasRisk).length,
    }
  }, [tabRows])

  const filteredRows = useMemo(() => {
    return tabRows
      .filter((item) => matchesFilters(item, appliedFilters))
      .sort((a, b) => b.pledgeTime.localeCompare(a.pledgeTime))
  }, [tabRows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, currentPage, pageSize])

  const handleSearch = (next?: SupervisionOrderFilters) => {
    setAppliedFilters({ ...(next ?? draftFilters) })
    setPage(1)
  }

  const resetFilters = () => {
    setDraftFilters({ ...DEFAULT_SUPERVISION_FILTERS })
    setAppliedFilters({ ...DEFAULT_SUPERVISION_FILTERS })
    setPage(1)
  }

  const handleTabChange = (tab: SupervisionOrderTabKey) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    resetFilters()
    setFiltersExpanded(false)
  }

  const handleRiskCardClick = () => {
    const next = { ...draftFilters, risk: "有风险" }
    setDraftFilters(next)
    setAppliedFilters(next)
    setFiltersExpanded(true)
    setPage(1)
  }

  const handleAction = (item: SupervisionOrderItem, action: SupervisionActionDef) => {
    if (action.key === "logs") {
      setLogTarget(item)
      return
    }
    if (action.key === "materials") {
      setMaterialsTarget(item)
      return
    }
    if (action.key === "detail") {
      showToast(
        `正在打开订单【${item.orderNo}】详情：基础信息、资产明细、IoT 设备、风险流水与流程时间轴（详情页后续按三件套交付）。`,
      )
      return
    }
    if (action.key === "industryPrice") {
      showToast(`已打开【行业参考价】行情走势与估值明细，订单 ${item.orderNo}。`)
      return
    }
    if (action.key === "appraisedValue") {
      showToast(`已打开【货物评估价值】估值明细，订单 ${item.orderNo}。`)
      return
    }
    if (action.key === "close") {
      showToast(
        `已进入【平仓】处置申请：订单 ${item.orderNo}。买受人统一社会信用代码不得等于原货主，需上传处置材料后提交审批。`,
      )
      return
    }
    showToast(
      `已打开【${action.label}】业务办理入口，订单 ${item.orderNo}。原型先演示入口，具体表单按操作业务三件套后续交付。`,
    )
  }

  const handleExport = () => {
    showToast(
      `已按当前${tabConfig.label}与筛选条件生成导出任务，共 ${filteredRows.length} 条，完成后可在下载中心下载 Excel。`,
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="监管管理"
      documents={supervisionManagementDocuments}
      annotations={supervisionManagementListAnnotations}
    >
      <div className="space-y-4 p-6 font-sans">
        <PrototypeAnnotationTarget annotationIds={["supervision-management-page"]}>
          <PageHeader
            title="监管管理"
            description="承接监管办理终审生单后的存续期台账：盯货值、盯抵押率、盯风险，24 项存续期操作在行尾发起。"
            actions={
              <PrototypeAnnotationTarget annotationIds={["supervision-management-export"]}>
                <Button type="button" size="sm" onClick={handleExport}>
                  <DownloadIcon className="size-4" />
                  导出为Excel
                </Button>
              </PrototypeAnnotationTarget>
            }
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["supervision-management-tabs"]}>
          <div className="inline-flex overflow-hidden rounded-lg border border-border bg-card shadow-xs">
            {SUPERVISION_TABS.map((tab) => {
              const isActive = tab.key === activeTab
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  aria-pressed={isActive}
                  className={cn(
                    "h-8 border-r border-border px-5 text-[13px] font-medium transition-colors last:border-r-0",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </PrototypeAnnotationTarget>

        <SupervisionStatsCards
          total={stats.total}
          activeCount={stats.activeCount}
          activeLabel={tabConfig.statusOptions[0]}
          valueTotal={stats.valueTotal}
          unpricedCount={stats.unpricedCount}
          riskCount={stats.riskCount}
          onRiskClick={handleRiskCardClick}
        />

        <SupervisionFiltersPanel
          filters={draftFilters}
          tabConfig={tabConfig}
          expanded={filtersExpanded}
          onToggleExpand={() => setFiltersExpanded((prev) => !prev)}
          onChange={setDraftFilters}
          onSearch={handleSearch}
        />

        <Card>
          <CardContent className="space-y-3 pt-4">
            <SupervisionOrderTable
              key={activeTab}
              rows={pagedRows}
              page={currentPage}
              pageSize={pageSize}
              tabConfig={tabConfig}
              onAction={handleAction}
              onResetFilters={resetFilters}
            />

            <WarningListPagination
              total={filteredRows.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize)
                setPage(1)
              }}
            />
          </CardContent>
        </Card>

        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm leading-relaxed text-background shadow-lg animate-in fade-in">
            {toastMessage}
          </div>
        ) : null}
      </div>

      <SupervisionLogDialog
        open={logTarget !== null}
        order={logTarget}
        onClose={() => setLogTarget(null)}
      />
      <SupervisionMaterialsDialog
        open={materialsTarget !== null}
        order={materialsTarget}
        onClose={() => setMaterialsTarget(null)}
      />
    </PrototypeAnnotationProvider>
  )
}
