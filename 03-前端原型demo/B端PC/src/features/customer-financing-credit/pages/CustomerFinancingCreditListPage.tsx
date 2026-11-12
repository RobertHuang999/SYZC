import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PageHeader } from "@/shared/components/PageHeader"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { CreditFiltersPanel } from "../components/CreditFiltersPanel"
import { CreditTable } from "../components/CreditTable"
import {
  ApproveCreditModal,
  RejectCreditModal,
  ChangeToFailedModal,
  ChangeToSuccessModal,
} from "../components/CreditActionModals"
import { customerFinancingCreditDocuments } from "../documents/customer-financing-credit-documents"
import { customerFinancingCreditListAnnotations } from "../annotations/customer-financing-credit-list.annotations"
import {
  CREDIT_STORAGE_KEY,
  DEFAULT_CREDIT_FILTERS,
  INITIAL_CREDIT_MOCK,
  PAGE_SIZE,
  creditDetailPath,
} from "../domain/constants"
import type {
  CreditFilters,
  CustomerFinancingCredit,
  RejectCategory,
} from "../domain/types"

function loadInitialCreditData(): CustomerFinancingCredit[] {
  try {
    const raw = localStorage.getItem(CREDIT_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load credit records from localStorage", e)
  }
  return INITIAL_CREDIT_MOCK
}

export function CustomerFinancingCreditListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<CustomerFinancingCredit[]>(loadInitialCreditData)

  // 筛选器状态（草稿与已应用）
  const [draftFilters, setDraftFilters] = useState<CreditFilters>(DEFAULT_CREDIT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<CreditFilters>(DEFAULT_CREDIT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 交互弹窗操作状态
  const [activeItem, setActiveItem] = useState<CustomerFinancingCredit | null>(null)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [changeToFailedModalOpen, setChangeToFailedModalOpen] = useState(false)
  const [changeToSuccessModalOpen, setChangeToSuccessModalOpen] = useState(false)

  // 数据持久化
  useEffect(() => {
    try {
      localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Failed to save credit data to localStorage", e)
    }
  }, [data])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  // 筛选过滤
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. 综合搜索：产品名称 / 申请人
      if (appliedFilters.keyword.trim()) {
        const kw = appliedFilters.keyword.trim().toLowerCase()
        const matchProduct = item.productName.toLowerCase().includes(kw)
        const matchApplicant = item.applicantName.toLowerCase().includes(kw)
        if (!matchProduct && !matchApplicant) return false
      }

      // 2. 融资状态
      if (appliedFilters.status !== "ALL") {
        if (item.status !== appliedFilters.status) return false
      }

      // 3. 申请人类型
      if (appliedFilters.applicantType !== "ALL") {
        if (item.applicantType !== appliedFilters.applicantType) return false
      }

      // 4. 需要尽调
      if (appliedFilters.needDiligence !== "ALL") {
        const isYes = appliedFilters.needDiligence === "YES"
        if (item.needDiligence !== isYes) return false
      }

      return true
    })
  }, [data, appliedFilters])

  // 分页截取
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  // 查询与重置
  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_CREDIT_FILTERS)
    setAppliedFilters(DEFAULT_CREDIT_FILTERS)
    setPage(1)
    showToast("已重置所有筛选条件")
  }

  // 1. 标记申请成功确认回调 (R04 / R06)
  const handleConfirmApprove = (
    item: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    remark?: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...item,
      status: "APPLY_SUCCESS",
      creditAmount,
      creditPeriods,
      creditRemark: remark,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "核准授信额度",
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          detail: `标记申请成功：核准授信金额 ${creditAmount.toFixed(4)} 元，授信期数 ${creditPeriods} 期。已激活下游【线上监管业务办理】(R04/R06)。`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(`【${item.applicantName}】授信核准成功，已即刻激活下游线上抵质押办理！`)
  }

  // 2. 标记申请失败确认回调 (R05 / C03)
  const handleConfirmReject = (
    item: CustomerFinancingCredit,
    category: RejectCategory,
    detail: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...item,
      status: "APPLY_FAILED",
      rejectCategory: category,
      rejectDetail: detail,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "审批拒绝入池",
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          detail: `标记申请失败：【${category}】${detail}。已写入被拒退回池 -> 授信失败标签页 (R05)。`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(`【${item.applicantName}】已标记申请失败，记录已可靠同步至被拒退回池！`)
  }

  // 3. 改标为申请失败回调 (R03 / C01)
  const handleConfirmChangeToFailed = (
    item: CustomerFinancingCredit,
    category: RejectCategory,
    reason: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...item,
      status: "APPLY_FAILED",
      rejectCategory: category,
      rejectDetail: reason,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      changeRecords: [
        {
          id: `CHG_${Date.now()}`,
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          fromStatus: "APPLY_SUCCESS",
          toStatus: "APPLY_FAILED",
          reason,
          creditAmount: item.creditAmount,
          creditPeriods: item.creditPeriods,
        },
        ...item.changeRecords,
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "改标为申请失败",
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          detail: `资方自纠偏改标：从申请成功改为申请失败，作废授信额度并撤销下游抵质押权限 (R03)。原因：${reason}`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(`【${item.applicantName}】已改标为申请失败，并同步写入被拒池！`)
  }

  // 4. 改标为申请成功回调 (R03)
  const handleConfirmChangeToSuccess = (
    item: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    reason: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...item,
      status: "APPLY_SUCCESS",
      creditAmount,
      creditPeriods,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      changeRecords: [
        {
          id: `CHG_${Date.now()}`,
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          fromStatus: "APPLY_FAILED",
          toStatus: "APPLY_SUCCESS",
          reason,
          creditAmount,
          creditPeriods,
        },
        ...item.changeRecords,
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "改标为申请成功",
          operator: "当前资方审核专员",
          organization: item.funderOrgName,
          time: nowStr,
          detail: `资方重申改标：从申请失败改为申请成功，核准授信额度 ${creditAmount.toFixed(4)} 元，重新激活下游线上监管业务办理 (R03)。原因：${reason}`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(`【${item.applicantName}】已重申改标为申请成功，重新激活抵质押办理！`)
  }

  // 查看详情
  const handleViewDetail = (item: CustomerFinancingCredit) => {
    navigate(creditDetailPath(item.id))
  }

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingCreditDocuments}
      annotations={customerFinancingCreditListAnnotations}
    >
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        {/* 全局操作反馈 Toast */}
        {toastMessage && (
          <div className="fixed right-6 top-20 z-50 rounded-md bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-lg transition-all">
            {toastMessage}
          </div>
        )}

        {/* 1. 页面顶栏 */}
        <PrototypeAnnotationTarget annotationIds={["credit-page"]}>
          <PageHeader
            title="客户融资授信办理"
            description="融资监管与融资管理核心台账 · 承接上游锁定合作资方的融资申请，资方机构全员共享审核，录入核准授信额度与期数并激活下游线上抵质押办理，未发起抵质押前支持双向改标自纠偏 (遵循 R01~R06、C01~C03)。"
          />
        </PrototypeAnnotationTarget>

        {/* 2. 筛选查询面板 */}
        <PrototypeAnnotationTarget annotationIds={["credit-filters"]}>
          <CreditFiltersPanel
            filters={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </PrototypeAnnotationTarget>

        {/* 3. 数据表格 */}
        <PrototypeAnnotationTarget annotationIds={["credit-table", "credit-actions"]}>
          <CreditTable
            data={pagedData}
            total={filteredData.length}
            page={page}
            pageSize={pageSize}
            onViewDetail={handleViewDetail}
            onApproveCredit={(item) => {
              setActiveItem(item)
              setApproveModalOpen(true)
            }}
            onRejectCredit={(item) => {
              setActiveItem(item)
              setRejectModalOpen(true)
            }}
            onChangeToFailed={(item) => {
              setActiveItem(item)
              setChangeToFailedModalOpen(true)
            }}
            onChangeToSuccess={(item) => {
              setActiveItem(item)
              setChangeToSuccessModalOpen(true)
            }}
            onResetFilters={handleReset}
          />
        </PrototypeAnnotationTarget>

        {/* 4. 分页组件 */}
        {filteredData.length > 0 && (
          <div className="flex justify-end">
            <WarningListPagination
              page={page}
              pageSize={pageSize}
              total={filteredData.length}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
            />
          </div>
        )}

        {/* 5. 模态表单弹窗集合 */}
        <ApproveCreditModal
          open={approveModalOpen}
          item={activeItem}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={handleConfirmApprove}
        />

        <RejectCreditModal
          open={rejectModalOpen}
          item={activeItem}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleConfirmReject}
        />

        <ChangeToFailedModal
          open={changeToFailedModalOpen}
          item={activeItem}
          onClose={() => setChangeToFailedModalOpen(false)}
          onConfirm={handleConfirmChangeToFailed}
        />

        <ChangeToSuccessModal
          open={changeToSuccessModalOpen}
          item={activeItem}
          onClose={() => setChangeToSuccessModalOpen(false)}
          onConfirm={handleConfirmChangeToSuccess}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
