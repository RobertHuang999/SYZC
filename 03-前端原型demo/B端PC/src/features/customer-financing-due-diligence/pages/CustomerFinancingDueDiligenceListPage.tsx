import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PageHeader } from "@/shared/components/PageHeader"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DueDiligenceFiltersPanel } from "../components/DueDiligenceFiltersPanel"
import { DueDiligenceTable } from "../components/DueDiligenceTable"
import { SegmentedTabs } from "@/shared/components/SegmentedTabs"
import {
  TriggerDueDiligenceModal,
  ReassignTaskModal,
  ManualRejectModal,
  AssignFunderModal,
  ViewReportModal,
  CustomerDiligenceRecordsModal,
} from "../components/DueDiligenceActionModals"
import { customerFinancingDueDiligenceDocuments } from "../documents/customer-financing-due-diligence-documents"
import { customerFinancingDueDiligenceListAnnotations } from "../annotations/customer-financing-due-diligence-list.annotations"
import {
  DEFAULT_DUE_DILIGENCE_FILTERS,
  DUE_DILIGENCE_STORAGE_KEY,
  INITIAL_DUE_DILIGENCE_MOCK,
  PAGE_SIZE,
  dueDiligenceDetailPath,
} from "../domain/constants"
import type {
  CustomerFinancingDueDiligence,
  DiligenceFilters,
  DiligenceTab,
} from "../domain/types"
import { CheckCircle2Icon, ClockIcon, FileTextIcon } from "lucide-react"

function loadInitialDiligenceData(): CustomerFinancingDueDiligence[] {
  try {
    const raw = localStorage.getItem(DUE_DILIGENCE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load diligence records from localStorage", e)
  }
  return INITIAL_DUE_DILIGENCE_MOCK
}

export function CustomerFinancingDueDiligenceListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<CustomerFinancingDueDiligence[]>(
    loadInitialDiligenceData
  )

  // 双标签页当前选中
  const [activeTab, setActiveTab] = useState<DiligenceTab>("PENDING")

  // 筛选状态
  const [draftFilters, setDraftFilters] = useState<DiligenceFilters>(
    DEFAULT_DUE_DILIGENCE_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<DiligenceFilters>(
    DEFAULT_DUE_DILIGENCE_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗交互状态
  const [activeItem, setActiveItem] =
    useState<CustomerFinancingDueDiligence | null>(null)
  const [triggerModalOpen, setTriggerModalOpen] = useState(false)
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [viewReportModalOpen, setViewReportModalOpen] = useState(false)
  const [recordsModalOpen, setRecordsModalOpen] = useState(false)

  // 持久化存储
  useEffect(() => {
    try {
      localStorage.setItem(DUE_DILIGENCE_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Failed to save diligence data to localStorage", e)
    }
  }, [data])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  // 切换标签页
  const handleTabChange = (newTab: DiligenceTab) => {
    setActiveTab(newTab)
    const updated = { ...draftFilters, status: "ALL" }
    setDraftFilters(updated)
    setAppliedFilters(updated)
    setPage(1)
  }

  // 筛选与匹配
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. 标签页范围过滤
      if (activeTab === "PENDING") {
        if (
          item.status !== "PENDING_DILIGENCE" &&
          item.status !== "IN_PROCESSING"
        ) {
          return false
        }
      } else {
        if (
          item.status !== "DILIGENCE_SUCCESS" &&
          item.status !== "DILIGENCE_FAILED" &&
          item.status !== "MANUAL_REJECTED"
        ) {
          return false
        }
      }

      // 2. 关键字搜索 (产品名称 / 申请人 / 单号 / 信用代码)
      if (appliedFilters.keyword.trim()) {
        const kw = appliedFilters.keyword.trim().toLowerCase()
        const matchProduct = item.productName.toLowerCase().includes(kw)
        const matchApplicant = item.applicantName.toLowerCase().includes(kw)
        const matchId = item.id.toLowerCase().includes(kw)
        const matchIdentifier = item.applicantIdentifier
          .toLowerCase()
          .includes(kw)
        if (!matchProduct && !matchApplicant && !matchId && !matchIdentifier) {
          return false
        }
      }

      // 3. 尽调人员过滤
      if (
        appliedFilters.surveyor &&
        appliedFilters.surveyor !== "ALL" &&
        item.surveyor !== appliedFilters.surveyor
      ) {
        return false
      }

      // 4. 尽调分配时间区间过滤
      if (appliedFilters.assignedFrom) {
        const assignedDate = item.assignedAt.slice(0, 10)
        if (assignedDate < appliedFilters.assignedFrom) return false
      }
      if (appliedFilters.assignedTo) {
        const assignedDate = item.assignedAt.slice(0, 10)
        if (assignedDate > appliedFilters.assignedTo) return false
      }

      // 5. 状态过滤
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status) {
        return false
      }

      return true
    })
  }, [data, activeTab, appliedFilters])

  // 分页截取
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  // 查询与重置
  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters({ ...DEFAULT_DUE_DILIGENCE_FILTERS })
    setAppliedFilters({ ...DEFAULT_DUE_DILIGENCE_FILTERS })
    setPage(1)
    showToast("筛选条件已重置")
  }

  // -------------------------------------------------------------
  // 核心业务交互 Handlers (闭环状态机)
  // -------------------------------------------------------------

  // 1. 发起尽调
  const handleOpenTriggerModal = (item: CustomerFinancingDueDiligence) => {
    setActiveItem(item)
    setTriggerModalOpen(true)
  }

  const handleConfirmTrigger = (item: CustomerFinancingDueDiligence) => {
    setTriggerModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    // 更新为受理中
    const updated: CustomerFinancingDueDiligence = {
      ...item,
      status: "IN_PROCESSING",
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "发起智风控尽调",
          operator: item.surveyor,
          time: now,
          detail:
            "专员核对主体三要素齐全，异步调用智风控接口，状态推进至【受理中】",
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast("已发起智风控核验，单据状态变更为【受理中】（保留在待尽调标签页）")

    // 模拟 3.5 秒后智风控网关异步回调 PASS
    window.setTimeout(() => {
      const callbackTime = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19)
      const successItem: CustomerFinancingDueDiligence = {
        ...updated,
        status: "DILIGENCE_SUCCESS",
        riskConclusion: "PASS",
        riskScore: 89,
        riskDetailSummary:
          "第三方智风控网关自动回调：大数据评分89分（通过），主体资信优良，无不良司法涉诉",
        processedAt: callbackTime,
        logs: [
          {
            id: `LOG_${Date.now() + 1}`,
            action: "智风控网关回调 PASS",
            operator: "智风控平台",
            time: callbackTime,
            detail:
              "外部大数据模型核验通过，单据自动变更为【受理成功】，已移入【尽调完成标签页】",
          },
          ...updated.logs,
        ],
      }

      setData((prev) => prev.map((d) => (d.id === item.id ? successItem : d)))
      showToast(
        `【异步回调通知】尽调单 ${item.id} 智风控审核通过（PASS），已自动移入【尽调完成】标签页！`
      )
    }, 3500)
  }

  // 2. 任务转交
  const handleOpenReassignModal = (item: CustomerFinancingDueDiligence) => {
    setActiveItem(item)
    setReassignModalOpen(true)
  }

  const handleConfirmReassign = (
    item: CustomerFinancingDueDiligence,
    targetSurveyor: string,
    reason: string
  ) => {
    setReassignModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    const updated: CustomerFinancingDueDiligence = {
      ...item,
      surveyor: targetSurveyor,
      processedAt: now,
      transferHistory: [
        ...(item.transferHistory || []),
        {
          fromSurveyor: item.surveyor,
          toSurveyor: targetSurveyor,
          reason: reason || "同组织专员交接",
          time: now,
        },
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "同组织任务转交",
          operator: item.surveyor,
          time: now,
          detail: `将尽调任务转交给同机构专员【${targetSurveyor}】${
            reason ? `，原因：${reason}` : ""
          }，状态保持待尽调`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(`任务已成功转交至【${targetSurveyor}】，保持待尽调状态并留痕`)
  }

  // 3. 手动拒绝并入池
  const handleOpenRejectModal = (item: CustomerFinancingDueDiligence) => {
    setActiveItem(item)
    setRejectModalOpen(true)
  }

  const handleConfirmReject = (
    item: CustomerFinancingDueDiligence,
    category: string,
    detail: string
  ) => {
    setRejectModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    const updated: CustomerFinancingDueDiligence = {
      ...item,
      status: "MANUAL_REJECTED",
      rejectCategory: category,
      rejectDetail: detail,
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "现场勘验手动拒绝",
          operator: item.surveyor,
          time: now,
          detail: `专员现场排查异常手动拒绝，原因分类：【${category}】，说明：${detail}。单据标记为【申请失败】并写入被拒退回池`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(
      "尽调单已手动拒绝（申请失败），已移入【尽调完成】标签页并可靠投递至被拒退回池"
    )
  }

  // 4. 分配给资方
  const handleOpenAssignFunderModal = (item: CustomerFinancingDueDiligence) => {
    setActiveItem(item)
    setAssignModalOpen(true)
  }

  const handleConfirmAssignFunder = (
    item: CustomerFinancingDueDiligence,
    funderName: string,
    remark: string
  ) => {
    setAssignModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    const updated: CustomerFinancingDueDiligence = {
      ...item,
      partnerFunderName: funderName,
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "分配给合作资方",
          operator: item.surveyor,
          time: now,
          detail: `尽调报告齐备，专员选派资方机构【${funderName}】${
            remark ? `（备注：${remark}）` : ""
          }，任务已向【客户融资授信办理】推送`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    showToast(
      `已成功分配至【${funderName}】，已向【客户融资授信办理】推送授信任务！`
    )
  }

  // 快捷模拟上传尽调报告
  const handleUploadMockReport = (item: CustomerFinancingDueDiligence) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const newReport = {
      id: `ATT_${Date.now()}`,
      name: `${item.applicantName}_现场实地核查与综合尽调报告_盖章件.pdf`,
      size: "5.8 MB",
      type: "pdf",
      uploadedAt: now,
      isReport: true,
    }

    const updated: CustomerFinancingDueDiligence = {
      ...item,
      attachments: [newReport, ...item.attachments],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "归档盖章尽调报告",
          operator: item.surveyor,
          time: now,
          detail: `上传《${newReport.name}》，尽调报告门禁核验通过`,
        },
        ...item.logs,
      ],
    }

    setData((prev) => prev.map((d) => (d.id === item.id ? updated : d)))
    setActiveItem(updated)
    showToast("已成功归档正式盖章版尽调报告，门禁校验通过！")
  }

  // 查看报告弹窗
  const handleOpenViewReport = (item: CustomerFinancingDueDiligence) => {
    setActiveItem(item)
    setViewReportModalOpen(true)
  }

  const handleDownloadReport = (fileName: string) => {
    showToast(`正在安全下载报告文件：${fileName}`)
  }

  // 跳转详情页
  const handleViewDetail = (item: CustomerFinancingDueDiligence) => {
    navigate(dueDiligenceDetailPath(item.id))
  }

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingDueDiligenceDocuments}
      annotations={customerFinancingDueDiligenceListAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示浮窗 */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg transition-all">
            <CheckCircle2Icon className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部标题区 */}
        <PrototypeAnnotationTarget annotationIds={["diligence-page"]}>
          <PageHeader
            title="客户融资尽调办理"
            description="融资监管/融资管理核心风控执行台账：承接需要尽调的任务单据，推进企业资质核验、同组织任务转交、第三方智风控模型调用、实地尽调报告归档与合作资方机构分流派发。"
          />
        </PrototypeAnnotationTarget>

        {/* 双标签页切换 (待尽调 / 尽调完成) */}
        <PrototypeAnnotationTarget annotationIds={["diligence-tabs"]}>
          <SegmentedTabs<DiligenceTab>
            items={[
              {
                key: "PENDING",
                label: "待尽调",
                icon: <ClockIcon className="h-3.5 w-3.5" />,
              },
              {
                key: "COMPLETED",
                label: "尽调完成",
                icon: <CheckCircle2Icon className="h-3.5 w-3.5" />,
              },
            ]}
            value={activeTab}
            onChange={handleTabChange}
          />
        </PrototypeAnnotationTarget>

        {/* 筛选区 */}
        <PrototypeAnnotationTarget annotationIds={["diligence-filters"]}>
          <DueDiligenceFiltersPanel
            activeTab={activeTab}
            filters={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            extraActions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecordsModalOpen(true)}
                className="gap-1.5"
              >
                <FileTextIcon className="size-4" />
                客户尽调记录
              </Button>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 数据表格呈现 */}
        <Card>
          <CardContent className="space-y-3 pt-4">
            <PrototypeAnnotationTarget annotationIds={["diligence-table"]}>
              <DueDiligenceTable
                data={paginatedData}
                startIndex={(page - 1) * pageSize}
                onViewDetail={handleViewDetail}
                onTriggerDiligence={handleOpenTriggerModal}
                onReassignTask={handleOpenReassignModal}
                onManualReject={handleOpenRejectModal}
                onAssignFunder={handleOpenAssignFunderModal}
                onViewReport={handleOpenViewReport}
                onReviewRisk={handleOpenTriggerModal}
                onResetFilters={handleReset}
              />
            </PrototypeAnnotationTarget>
          </CardContent>
        </Card>

        {/* 底部吸底分页 */}
        <div className="sticky bottom-0 z-30 flex items-center justify-between border-t border-border/70 bg-card/95 px-4 py-3 backdrop-blur-xs">
          <div className="text-xs text-muted-foreground">
            共检索到 <span className="font-semibold text-foreground">{filteredData.length}</span> 条尽调任务
          </div>
          <WarningListPagination
            total={filteredData.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setPage(1)
            }}
          />
        </div>

        {/* 交互模态弹窗与打点 */}
        <PrototypeAnnotationTarget
          annotationIds={[
            "diligence-action-trigger",
            "diligence-action-transfer",
            "diligence-action-reject",
            "diligence-action-assign",
          ]}
        >
          <div>
            <TriggerDueDiligenceModal
              open={triggerModalOpen}
              item={activeItem}
              onClose={() => setTriggerModalOpen(false)}
              onConfirm={handleConfirmTrigger}
            />

            <ReassignTaskModal
              open={reassignModalOpen}
              item={activeItem}
              onClose={() => setReassignModalOpen(false)}
              onConfirm={handleConfirmReassign}
            />

            <ManualRejectModal
              open={rejectModalOpen}
              item={activeItem}
              onClose={() => setRejectModalOpen(false)}
              onConfirm={handleConfirmReject}
            />

            <AssignFunderModal
              open={assignModalOpen}
              item={activeItem}
              onClose={() => setAssignModalOpen(false)}
              onConfirm={handleConfirmAssignFunder}
              onUploadMockReport={handleUploadMockReport}
            />

            <ViewReportModal
              open={viewReportModalOpen}
              item={activeItem}
              onClose={() => setViewReportModalOpen(false)}
              onDownload={handleDownloadReport}
            />

            <CustomerDiligenceRecordsModal
              open={recordsModalOpen}
              records={data}
              onClose={() => setRecordsModalOpen(false)}
              onViewRecordDetail={(record) => {
                navigate(dueDiligenceDetailPath(record.id))
              }}
            />
          </div>
        </PrototypeAnnotationTarget>
      </div>
    </PrototypeAnnotationProvider>
  )
}
