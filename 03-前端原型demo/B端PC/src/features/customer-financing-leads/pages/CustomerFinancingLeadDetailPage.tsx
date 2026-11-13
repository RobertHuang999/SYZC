import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import {
  DetailSection,
  DetailField,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import {
  AssignLeadModal,
  RejectLeadModal,
} from "../components/LeadActionModals"
import { customerFinancingLeadsDocuments } from "../documents/customer-financing-leads-documents"
import { customerFinancingLeadsDetailAnnotations } from "../annotations/customer-financing-leads-detail.annotations"
import { customerFinancingLeadsMock } from "../mock/customer-financing-leads.mock"
import {
  CUSTOMER_FINANCING_LEADS_LIST_PATH,
  LEADS_STORAGE_KEY,
  LEAD_STATUS_CONFIG,
  formatAmountWan,
} from "../domain/constants"
import type { CustomerFinancingLead } from "../domain/types"
import {
  CheckCircle2Icon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileCheck2Icon,
  PaperclipIcon,
} from "lucide-react"

export function CustomerFinancingLeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [lead, setLead] = useState<CustomerFinancingLead | null>(null)
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  // 加载单据
  useEffect(() => {
    let allLeads: CustomerFinancingLead[] = customerFinancingLeadsMock
    try {
      const raw = localStorage.getItem(LEADS_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          allLeads = parsed
        }
      }
    } catch (e) {
      console.error(e)
    }

    const found = allLeads.find((item) => item.id === id) || allLeads[0]
    setLead(found)
  }, [id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyId = () => {
    if (lead) {
      navigator.clipboard.writeText(lead.id)
      setCopied(true)
      showToast("线索单号已复制到剪贴板")
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  const updateLeadInStorage = (updated: CustomerFinancingLead) => {
    setLead(updated)
    try {
      const raw = localStorage.getItem(LEADS_STORAGE_KEY)
      let list: CustomerFinancingLead[] = customerFinancingLeadsMock
      if (raw) {
        list = JSON.parse(raw)
      }
      const nextList = list.map((item) =>
        item.id === updated.id ? updated : item,
      )
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(nextList))
    } catch (e) {
      console.error(e)
    }
  }

  // 路由分配成功 (方案 B: 一键派发更新为处理中)
  const handleConfirmAssign = (
    leadId: string,
    targetType: "SURVEYOR" | "FUNDER",
    targetName: string,
  ) => {
    if (!lead) return
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19)
    const updated: CustomerFinancingLead = {
      ...lead,
      status: "PROCESSING",
      assignedTargetType: targetType,
      assignedTargetName: targetName,
      lastOperator: "王强（森云调度专员）",
      lastOperatedAt: nowStr,
      logs: [
        ...lead.logs,
        {
          id: `LOG_${Date.now()}`,
          action:
            targetType === "SURVEYOR"
              ? "已指派尽调专员并分流"
              : "已直接指派合作资方并分流",
          operator: "王强（森云调度专员）",
          time: nowStr,
          detail:
            targetType === "SURVEYOR"
              ? `依据快照锁定需要尽调=是，成功指派尽调专员【${targetName}】，单据状态更新为处理中，已生成待尽调工单。`
              : `依据快照锁定无需尽调，成功分配资方机构【${targetName}】，单据状态更新为处理中，已生成授信任务。`,
        },
      ],
    }
    updateLeadInStorage(updated)
    showToast(
      targetType === "SURVEYOR"
        ? `成功指派尽调专员【${targetName}】，状态变更为「处理中」！`
        : `成功指派资方【${targetName}】，状态变更为「处理中」！`,
    )
  }

  // 驳回成功
  const handleConfirmReject = (
    leadId: string,
    reasonCategory: string,
    reasonDetail: string,
  ) => {
    if (!lead) return
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19)
    const updated: CustomerFinancingLead = {
      ...lead,
      status: "APPLY_FAILED",
      rejectReasonCategory: reasonCategory,
      rejectReasonDetail: reasonDetail,
      lastOperator: "周晓峰（森云风控审查员）",
      lastOperatedAt: nowStr,
      logs: [
        ...lead.logs,
        {
          id: `LOG_${Date.now()}`,
          action: "运营审核驳回并写入被拒池",
          operator: "周晓峰（森云风控审查员）",
          time: nowStr,
          detail: `驳回理由：${reasonCategory}。详细说明：${reasonDetail.replace(/[。.]$/, "")}。已归集入被拒退回池。`,
        },
      ],
    }
    updateLeadInStorage(updated)
    showToast(`线索 ${leadId} 已驳回并归集入被拒退回池！`)
  }

  if (!lead) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        正在加载客户融资需求线索详情...
      </div>
    )
  }

  const statusCfg = LEAD_STATUS_CONFIG[lead.status]

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingLeadsDocuments}
      annotations={customerFinancingLeadsDetailAnnotations}
    >
      <div className="space-y-4 p-6 font-sans">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg transition-all">
            {toastMessage}
          </div>
        )}

        {/* 顶部通用 Header */}
        <PrototypeAnnotationTarget annotationIds={["lead-detail-header"]}>
          <DetailPageHeader
            title="客户融资需求线索详情"
            number={lead.id}
            numberLabel="线索编号"
            status={
              <Badge variant="outline" className={`ml-2 text-xs ${statusCfg.badgeClass}`}>
                {statusCfg.label}
              </Badge>
            }
            onBack={() => navigate(CUSTOMER_FINANCING_LEADS_LIST_PATH)}
            onCopy={handleCopyId}
            copied={copied}
            actions={
              <div className="flex items-center gap-2">
                {lead.status === "PENDING_ACCEPT" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectModalOpen(true)}
                    >
                      驳 回
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary"
                      onClick={() => setAssignModalOpen(true)}
                    >
                      分配跟进
                    </Button>
                  </>
                )}

                {lead.status === "APPLY_FAILED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate("/融资/监管/融资管理/被拒退回记录池")
                    }
                  >
                    前往被拒退回池调阅
                  </Button>
                )}
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 板块 1：基本信息 */}
        <DetailSection title="业务基本信息">
          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="融资产品名称" value={lead.productName} />
            <DetailField label="外部申请流水号" value={lead.externalApplyNo} />
            <DetailField
              label="需要现场尽调"
              value={
                <Badge
                  variant="outline"
                  className={
                    lead.requiresSurvey
                      ? "border-sky-300 bg-sky-50 text-sky-800"
                      : "border-slate-300 bg-slate-100 text-slate-800"
                  }
                >
                  {lead.requiresSurvey ? "是（需现场勘验）" : "否（免尽调准入）"}
                </Badge>
              }
            />
            <DetailField label="质押资产大类形态" value={lead.collateralType} />
            <DetailField label="申请接入时间" value={lead.appliedAt} />
            <DetailField
              label="运营受理人员"
              value={formatEmptyValue(lead.acceptedBy)}
            />
            <DetailField
              label="正式受理时间"
              value={formatEmptyValue(lead.acceptedAt)}
            />
            <DetailField label="最新处理人" value={lead.lastOperator} />
            <DetailField label="最新处理时间" value={lead.lastOperatedAt} />
            {lead.assignedTargetName && (
              <DetailField
                label={
                  lead.assignedTargetType === "SURVEYOR"
                    ? "已指派尽调专员"
                    : "已指派合作资方"
                }
                value={
                  <span className="font-medium text-primary">
                    {lead.assignedTargetName}
                  </span>
                }
              />
            )}
            <DetailField
              label="开单/存放仓库"
              value={formatEmptyValue(lead.warehouseName)}
            />
          </div>
        </DetailSection>

        {/* 板块 2：申请主体资质 */}
        <PrototypeAnnotationTarget annotationIds={["lead-detail-applicant"]}>
          <DetailSection title="申请主体资质">
            <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="申请主体类型"
                value={lead.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
              />
              <DetailField label="申请人名称" value={lead.applicantName} />
              <DetailField
                label={
                  lead.applicantType === "ENTERPRISE"
                    ? "统一社会信用代码"
                    : "个人货主身份证号"
                }
                value={
                  lead.applicantIdentifier || lead.applicantIdCard || "—"
                }
              />
              <DetailField label="联系电话" value={lead.applicantPhone} />

              {lead.applicantType === "ENTERPRISE" && (
                <>
                  <DetailField
                    label="企业经办人姓名"
                    value={formatEmptyValue(lead.agentName)}
                  />
                  <DetailField
                    label="经办人手机号"
                    value={formatEmptyValue(lead.agentPhone)}
                  />
                  <DetailField
                    label="经办人证件号"
                    value={formatEmptyValue(lead.agentIdCard)}
                  />
                  <DetailField
                    label="营业执照凭证"
                    value={
                      lead.businessLicense ? (
                        <div className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer">
                          <PaperclipIcon className="size-3.5" />
                          <span>{lead.businessLicense}</span>
                        </div>
                      ) : (
                        "—"
                      )
                    }
                  />
                </>
              )}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 板块 3：融资意向与口径隔离 */}
        <DetailSection title="融资金额与期数口径隔离">
          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField
              label="意向融资金额 (客户申请)"
              value={
                <span className="font-semibold text-primary">
                  {formatAmountWan(lead.intendedAmount)}
                </span>
              }
            />
            <DetailField
              label="意向融资期数"
              value={`${lead.intendedPeriods} 期`}
            />
            <DetailField
              label="授信金额 (资方回写)"
              value={
                lead.creditAmount !== null
                  ? formatAmountWan(lead.creditAmount)
                  : "— (下游授信完成后回写)"
              }
            />
            <DetailField
              label="授信期数 (资方回写)"
              value={
                lead.creditPeriods !== null
                  ? `${lead.creditPeriods} 期`
                  : "—"
              }
            />
            <DetailField
              label="贷款金额 (订单放款回写)"
              value={
                lead.loanAmount !== null
                  ? formatAmountWan(lead.loanAmount)
                  : "— (放款完成后回写)"
              }
            />
            <DetailField
              label="贷款期数 (借款合同回写)"
              value={
                lead.loanPeriods !== null ? `${lead.loanPeriods} 期` : "—"
              }
            />
          </div>
        </DetailSection>

        {/* 板块 4：抵/质押资产清单 */}
        <PrototypeAnnotationTarget annotationIds={["lead-detail-assets"]}>
          <DetailSection title="抵/质押资产清单">
            {lead.collateralType === "仓单" && lead.warehouseReceiptNo && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground">数字仓单编号：</span>
                  <span className="font-semibold text-foreground">
                    {lead.warehouseReceiptNo}
                  </span>
                  <span className="ml-3 text-muted-foreground">
                    开单仓库：{lead.warehouseName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-primary"
                  onClick={() =>
                    navigate(
                      `/仓储/仓单管理/详情/${encodeURIComponent(
                        lead.warehouseReceiptNo!,
                      )}`,
                    )
                  }
                >
                  <span>穿透调阅仓单档案详情</span>
                  <ExternalLinkIcon className="ml-1 size-3" />
                </Button>
              </div>
            )}

            {lead.inventoryDetails && lead.inventoryDetails.length > 0 ? (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-foreground dark:bg-slate-800">
                    <tr>
                      <th className="p-2.5">货物大类</th>
                      <th className="p-2.5">货物细类</th>
                      <th className="p-2.5">规格型号</th>
                      <th className="p-2.5">数量</th>
                      <th className="p-2.5">申报货值（万元）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.inventoryDetails.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="p-2.5 font-medium">{item.category}</td>
                        <td className="p-2.5">{item.subcategory}</td>
                        <td className="p-2.5 text-muted-foreground">
                          {item.specification}
                        </td>
                        <td className="p-2.5 font-medium">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="p-2.5 font-semibold text-primary">
                          {item.declaredValue.toFixed(4)} 万元
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                该单据无额外存货明细数据。
              </p>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 板块 5：附件材料凭据 (若有) */}
        {lead.attachments && lead.attachments.length > 0 && (
          <DetailSection title="附件材料清单">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lead.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck2Icon className="size-4 shrink-0 text-primary" />
                    <div className="truncate">
                      <p className="truncate font-medium text-foreground">
                        {att.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {att.size} · 上传于 {att.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-primary"
                    onClick={() => showToast(`已请求下载：${att.name}`)}
                  >
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {/* 板块 6：驳回记录 (若状态为 APPLY_FAILED) */}
        {lead.status === "APPLY_FAILED" && (
          <DetailSection title="异常驳回与被拒入池留痕">
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-950 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-destructive">
                  单据已驳回并流转至被拒退回池
                </span>
                <span>操作时间：{lead.lastOperatedAt}</span>
              </div>
              <p>
                <strong>驳回原因分类：</strong>
                {lead.rejectReasonCategory || "—"}
              </p>
              <p>
                <strong>详细情况说明：</strong>
                {lead.rejectReasonDetail || "—"}
              </p>
              <p className="text-[11px] text-muted-foreground pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
                本记录已同步写入被拒退回池，永久不可物理删除。
              </p>
            </div>
          </DetailSection>
        )}

        {/* 板块 7：流转时间轴 */}
        <PrototypeAnnotationTarget annotationIds={["lead-detail-timeline"]}>
          <DetailSection title="全流程流转时间轴与操作日志">
            <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-muted-foreground/20">
              {lead.logs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  <span className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-card">
                    <ClockIcon className="size-3 text-primary" />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">
                      {log.action}
                    </span>
                    <span className="text-muted-foreground">{log.time}</span>
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    执行人：{log.operator}
                  </div>
                  {log.detail && (
                    <div className="mt-1 rounded bg-muted/40 p-2 text-foreground/90">
                      {log.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 交互弹窗挂载 */}
        <AssignLeadModal
          open={assignModalOpen}
          lead={lead}
          onClose={() => setAssignModalOpen(false)}
          onConfirm={handleConfirmAssign}
        />

        <RejectLeadModal
          open={rejectModalOpen}
          lead={lead}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleConfirmReject}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
