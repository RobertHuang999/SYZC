import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PageHeader } from "@/shared/components/PageHeader"
import { LeadsFiltersPanel } from "../components/LeadsFiltersPanel"
import { LeadsTable } from "../components/LeadsTable"
import {
  AssignLeadModal,
  RejectLeadModal,
  LeadDetailModal,
} from "../components/LeadActionModals"
import { customerFinancingLeadsDocuments } from "../documents/customer-financing-leads-documents"
import { customerFinancingLeadsListAnnotations } from "../annotations/customer-financing-leads-list.annotations"
import { customerFinancingLeadsMock } from "../mock/customer-financing-leads.mock"
import {
  DEFAULT_LEAD_FILTERS,
  LEADS_STORAGE_KEY,
  PAGE_SIZE,
} from "../domain/constants"
import type { CustomerFinancingLead, LeadFilters } from "../domain/types"

function loadInitialLeads(): CustomerFinancingLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load leads from localStorage", e)
  }
  return customerFinancingLeadsMock
}

export function CustomerFinancingLeadsListPage() {
  const [leads, setLeads] = useState<CustomerFinancingLead[]>(loadInitialLeads)
  const [draftFilters, setDraftFilters] =
    useState<LeadFilters>(DEFAULT_LEAD_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<LeadFilters>(DEFAULT_LEAD_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [activeLead, setActiveLead] = useState<CustomerFinancingLead | null>(
    null,
  )
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // 持久化存储到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads))
    } catch (e) {
      console.error("Failed to save leads to localStorage", e)
    }
  }, [leads])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  // 筛选匹配逻辑
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // 关键字：产品名称 / 申请人
      if (appliedFilters.keyword.trim()) {
        const kw = appliedFilters.keyword.trim().toLowerCase()
        const matchProduct = item.productName.toLowerCase().includes(kw)
        const matchApplicant = item.applicantName.toLowerCase().includes(kw)
        const matchIdentifier = (item.applicantIdentifier || "")
          .toLowerCase()
          .includes(kw)
        if (!matchProduct && !matchApplicant && !matchIdentifier) {
          return false
        }
      }

      // 需要尽调
      if (appliedFilters.requiresSurvey === "YES" && !item.requiresSurvey) {
        return false
      }
      if (appliedFilters.requiresSurvey === "NO" && item.requiresSurvey) {
        return false
      }

      // 融资状态
      if (
        appliedFilters.status !== "ALL" &&
        item.status !== appliedFilters.status
      ) {
        return false
      }

      // 抵/质押物
      if (
        appliedFilters.collateralType !== "ALL" &&
        item.collateralType !== appliedFilters.collateralType
      ) {
        return false
      }

      return true
    })
  }, [leads, appliedFilters])

  // 分页数据截取
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredLeads.slice(start, start + pageSize)
  }, [filteredLeads, page, pageSize])

  // 查询与重置
  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters({ ...DEFAULT_LEAD_FILTERS })
    setAppliedFilters({ ...DEFAULT_LEAD_FILTERS })
    setPage(1)
    showToast("筛选条件已重置")
  }

  const handleExport = () => {
    showToast(`正在导出 ${filteredLeads.length} 条客户融资需求线索报表...`)
  }

  // 打开弹窗 handlers
  const handleOpenAssign = (lead: CustomerFinancingLead) => {
    setActiveLead(lead)
    setAssignModalOpen(true)
  }

  const handleOpenReject = (lead: CustomerFinancingLead) => {
    setActiveLead(lead)
    setRejectModalOpen(true)
  }

  const handleOpenDetail = (lead: CustomerFinancingLead) => {
    setActiveLead(lead)
    setDetailModalOpen(true)
  }

  // 1. 确认路由分配 (方案 B: 一键派发直接流转至处理中，遵循R03/R07)
  const handleConfirmAssign = (
    leadId: string,
    targetType: "SURVEYOR" | "FUNDER",
    targetName: string,
  ) => {
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19)
    setLeads((prev) =>
      prev.map((item) => {
        if (item.id !== leadId) return item
        return {
          ...item,
          status: "PROCESSING",
          assignedTargetType: targetType,
          assignedTargetName: targetName,
          lastOperator: "王强（森云运营调度员）",
          lastOperatedAt: nowStr,
          logs: [
            ...item.logs,
            {
              id: `LOG_${Date.now()}`,
              action:
                targetType === "SURVEYOR"
                  ? "已指派尽调专员并分流"
                  : "已直接指派合作资方并分流",
              operator: "王强（森云运营调度员）",
              time: nowStr,
              detail:
                targetType === "SURVEYOR"
                  ? `依据快照需要尽调=是，成功指派尽调专员【${targetName}】，状态变更为处理中，已生成下游待尽调工单。`
                  : `依据快照无需尽调，成功分配资方【${targetName}】，状态变更为处理中，已生成授信已受理任务。`,
            },
          ],
        }
      }),
    )
    showToast(
      targetType === "SURVEYOR"
        ? `成功指派尽调专员【${targetName}】，工单状态已变更为「处理中」！`
        : `成功指派资方【${targetName}】，任务状态已变更为「处理中」！`,
    )
  }

  // 2. 确认驳回入池 (R04/C03)
  const handleConfirmReject = (
    leadId: string,
    reasonCategory: string,
    reasonDetail: string,
  ) => {
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19)
    setLeads((prev) =>
      prev.map((item) => {
        if (item.id !== leadId) return item
        return {
          ...item,
          status: "APPLY_FAILED",
          rejectReasonCategory: reasonCategory,
          rejectReasonDetail: reasonDetail,
          lastOperator: "周晓峰（森云风控审查员）",
          lastOperatedAt: nowStr,
          logs: [
            ...item.logs,
            {
              id: `LOG_${Date.now()}`,
              action: "运营审核驳回并写入被拒池",
              operator: "周晓峰（森云风控审查员）",
              time: nowStr,
              detail: `驳回分类：${reasonCategory}。详细理由：${reasonDetail.replace(/[。.]$/, "")}。已归集入被拒退回池。`,
            },
          ],
        }
      }),
    )
    showToast(`线索 ${leadId} 已驳回，状态更新为「申请失败」，并归集入被拒退回池！`)
  }

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingLeadsDocuments}
      annotations={customerFinancingLeadsListAnnotations}
    >
      <div className="space-y-4 p-6 font-sans">
        {/* 全局轻提示 Toast */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg transition-all">
            {toastMessage}
          </div>
        )}

        {/* 标题区 */}
        <PrototypeAnnotationTarget annotationIds={["leads-page"]}>
          <PageHeader
            title="客户融资需求线索"
            description="融资监管与融资管理首节点核心台账：承接外部动产质押意向申请，执行运营核验受理、自动化尽调路由分流派单及异常驳回入池。"
          />
        </PrototypeAnnotationTarget>

        {/* 筛选卡区 */}
        <Card>
          <CardContent className="space-y-4 pt-4">
            <PrototypeAnnotationTarget annotationIds={["leads-filters"]}>
              <LeadsFiltersPanel
                draftFilters={draftFilters}
                onDraftChange={setDraftFilters}
                onSearch={handleSearch}
                onReset={handleReset}
                onExport={handleExport}
              />
            </PrototypeAnnotationTarget>
          </CardContent>
        </Card>

        {/* 列表卡区 */}
        <Card>
          <CardContent className="space-y-3 pt-4">
            <PrototypeAnnotationTarget annotationIds={["leads-table"]}>
              <LeadsTable
                data={paginatedData}
                total={filteredLeads.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setPage(1)
                }}
                onViewDetail={handleOpenDetail}
                onAssign={handleOpenAssign}
                onReject={handleOpenReject}
              />
            </PrototypeAnnotationTarget>
          </CardContent>
        </Card>

        {/* 交互操作弹窗 */}
        <PrototypeAnnotationTarget annotationIds={["leads-action-assign"]}>
          <AssignLeadModal
            open={assignModalOpen}
            lead={activeLead}
            onClose={() => setAssignModalOpen(false)}
            onConfirm={handleConfirmAssign}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["leads-action-reject"]}>
          <RejectLeadModal
            open={rejectModalOpen}
            lead={activeLead}
            onClose={() => setRejectModalOpen(false)}
            onConfirm={handleConfirmReject}
          />
        </PrototypeAnnotationTarget>

        <LeadDetailModal
          open={detailModalOpen}
          lead={activeLead}
          onClose={() => setDetailModalOpen(false)}
          onAssignClick={handleOpenAssign}
          onRejectClick={handleOpenReject}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
