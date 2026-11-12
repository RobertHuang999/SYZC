import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangleIcon,
  SendIcon,
  ExternalLinkIcon,
  FileTextIcon,
  UserCheckIcon,
  Building2Icon,
  ClockIcon,
} from "lucide-react"
import {
  AVAILABLE_FUNDERS,
  AVAILABLE_SURVEYORS,
  LEAD_STATUS_CONFIG,
  REJECT_REASONS,
  formatAmountWan,
  customerFinancingLeadDetailPath,
} from "../domain/constants"
import type { CustomerFinancingLead } from "../domain/types"
import { TableDateTimeCell } from "@/shared/components/TableCells"

// ==================== 1. 路由分配派工弹窗 (方案 A: 快照锁定强行分流) ====================
interface AssignLeadModalProps {
  open: boolean
  lead: CustomerFinancingLead | null
  onClose: () => void
  onConfirm: (
    leadId: string,
    targetType: "SURVEYOR" | "FUNDER",
    targetName: string,
  ) => void
}

export function AssignLeadModal({
  open,
  lead,
  onClose,
  onConfirm,
}: AssignLeadModalProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string>("")

  useEffect(() => {
    if (lead) {
      setSelectedTarget("")
      setErrorMsg("")
    }
  }, [lead])

  if (!lead) return null

  const isSurvey = lead.requiresSurvey

  const handleConfirm = () => {
    if (!selectedTarget) {
      setErrorMsg(
        isSurvey ? "请选择指派的尽调专员" : "请选择指派的目标资方机构",
      )
      return
    }

    let targetName = ""
    if (isSurvey) {
      const found = AVAILABLE_SURVEYORS.find((s) => s.id === selectedTarget)
      targetName = found ? found.name : selectedTarget
    } else {
      const found = AVAILABLE_FUNDERS.find((f) => f.id === selectedTarget)
      targetName = found ? found.name : selectedTarget
    }

    onConfirm(lead.id, isSurvey ? "SURVEYOR" : "FUNDER", targetName)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-foreground">
            <SendIcon className="size-5 text-primary" />
            <span>融资线索跟进分配</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            基于建单固化的【需要尽调】快照，执行自动化路由分流派发（遵循R03/R07）。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border border-border/80 bg-slate-50/50 p-3 text-xs dark:bg-slate-900/40">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">线索流水号：</span>
              <span className="font-medium text-foreground">{lead.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">产品名称：</span>
              <span className="text-foreground">{lead.productName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">申请人：</span>
              <span className="font-medium text-foreground">
                {lead.applicantName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">意向金额：</span>
              <span className="font-medium text-primary">
                {formatAmountWan(lead.intendedAmount)} ({lead.intendedPeriods}期)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border/50 pt-2">
            <span className="text-muted-foreground">路由判定模式：</span>
            <Badge
              variant="outline"
              className={
                isSurvey
                  ? "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                  : "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }
            >
              {isSurvey ? "快照锁定：需要尽调（指派专员）" : "快照锁定：无需尽调（指派资方）"}
            </Badge>
          </div>
        </div>

        {/* 动态分流表单：严格依赖需要尽调快照强行分流锁定（方案 A） */}
        <div className="space-y-3 py-1">
          {isSurvey ? (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <UserCheckIcon className="size-4 text-sky-600" />
                <span>指派尽调专员（同机构）*</span>
              </Label>
              <Select
                value={selectedTarget}
                onValueChange={(val) => {
                  setSelectedTarget(val || "")
                  setErrorMsg("")
                }}
              >
                <SelectTrigger className="h-[36px] text-xs">
                  <SelectValue placeholder="请选择负责现场勘验的尽调人员" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SURVEYORS.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.name} ({s.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                该产品在准入配置中标记为必须现场尽调，派单后工单将流转至【客户融资尽调办理】。
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Building2Icon className="size-4 text-emerald-600" />
                <span>指派合作资方机构 *</span>
              </Label>
              <Select
                value={selectedTarget}
                onValueChange={(val) => {
                  setSelectedTarget(val || "")
                  setErrorMsg("")
                }}
              >
                <SelectTrigger className="h-[36px] text-xs">
                  <SelectValue placeholder="请选择承接信贷审批的合作资方银行/金融机构" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FUNDERS.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="text-xs">
                      {f.name} ({f.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                该产品为免尽调白名单产品，派单后任务直接流转至【客户融资授信办理】。
              </p>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            取 消
          </Button>
          <Button size="sm" onClick={handleConfirm} className="bg-primary">
            确认派发
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 2. 运营驳回弹窗 (R04/C03) ====================
interface RejectLeadModalProps {
  open: boolean
  lead: CustomerFinancingLead | null
  onClose: () => void
  onConfirm: (leadId: string, reasonCategory: string, reasonDetail: string) => void
}

export function RejectLeadModal({
  open,
  lead,
  onClose,
  onConfirm,
}: RejectLeadModalProps) {
  const [reasonCategory, setReasonCategory] = useState<string>("")
  const [reasonDetail, setReasonDetail] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string>("")

  useEffect(() => {
    if (lead) {
      setReasonCategory(REJECT_REASONS[0])
      setReasonDetail("")
      setErrorMsg("")
    }
  }, [lead])

  if (!lead) return null

  const handleConfirm = () => {
    if (!reasonCategory) {
      setErrorMsg("请选择驳回原因分类")
      return
    }
    const trimmed = reasonDetail.trim()
    if (!trimmed) {
      setErrorMsg("请录入驳回详细说明（最多 200 字）")
      return
    }
    if (trimmed.length > 200) {
      setErrorMsg("驳回详细说明最多不超过 200 字（C03阻断）")
      return
    }

    onConfirm(lead.id, reasonCategory, trimmed)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangleIcon className="size-5 text-destructive" />
            <span>驳回融资需求</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            确认驳回该融资需求？驳回后单据状态将更新为「申请失败」，并自动流转归集至【被拒退回池】。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1 text-xs">
          <div className="rounded-md border border-rose-100 bg-rose-50/50 p-2.5 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
            您正在操作货主 <strong>{lead.applicantName}</strong> 发起的{" "}
            <strong>{lead.productName}</strong> 申请，驳回将做无效处理，请谨慎操作！
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              驳回原因分类 *
            </Label>
            <Select
              value={reasonCategory}
              onValueChange={(val) => {
                setReasonCategory(val || "")
                setErrorMsg("")
              }}
            >
              <SelectTrigger className="h-[36px] text-xs">
                <SelectValue placeholder="请选择驳回原因类型" />
              </SelectTrigger>
              <SelectContent>
                {REJECT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason} className="text-xs">
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-foreground">
                驳回详细情况说明 *
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {reasonDetail.length}/200 字
              </span>
            </div>
            <Textarea
              rows={3}
              placeholder="请输入具体的驳回情况说明（最多 200 字）..."
              value={reasonDetail}
              maxLength={200}
              onChange={(e) => {
                setReasonDetail(e.target.value)
                setErrorMsg("")
              }}
              className="resize-none text-xs"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            取 消
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
          >
            确认驳回并入池
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== 3. 详情抽屉/模态弹窗 ====================
interface LeadDetailModalProps {
  open: boolean
  lead: CustomerFinancingLead | null
  onClose: () => void
  onAssignClick?: (lead: CustomerFinancingLead) => void
  onRejectClick?: (lead: CustomerFinancingLead) => void
}

export function LeadDetailModal({
  open,
  lead,
  onClose,
  onAssignClick,
  onRejectClick,
}: LeadDetailModalProps) {
  const navigate = useNavigate()

  if (!lead) return null

  const statusCfg =
    LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.PENDING_ACCEPT

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto font-sans">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-5 text-primary" />
              <DialogTitle className="text-base text-foreground">
                融资申请详情
              </DialogTitle>
              <Badge
                variant="outline"
                className={`ml-2 text-xs ${statusCfg.badgeClass}`}
              >
                {statusCfg.label}
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose()
                navigate(customerFinancingLeadDetailPath(lead.id))
              }}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              <span>查看完整详情页</span>
              <ExternalLinkIcon className="size-3.5" />
            </Button>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            单号：{lead.id} · 申请时间：{lead.appliedAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/80 bg-slate-50/60 p-3 dark:bg-slate-900/40">
            <div>
              <span className="text-muted-foreground">产品名称：</span>
              <span className="font-medium text-foreground">{lead.productName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">货物类型：</span>
              <span className="font-medium text-foreground">{lead.collateralType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">意向融资金额：</span>
              <span className="font-semibold text-primary">
                {formatAmountWan(lead.intendedAmount)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">意向融资期数：</span>
              <span>{lead.intendedPeriods} 期</span>
            </div>
            <div>
              <span className="text-muted-foreground">授信金额：</span>
              <span>{formatAmountWan(lead.creditAmount)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">授信期数：</span>
              <span>
                {lead.creditPeriods !== null ? `${lead.creditPeriods} 期` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">贷款金额：</span>
              <span>{formatAmountWan(lead.loanAmount)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">贷款期数：</span>
              <span>
                {lead.loanPeriods !== null ? `${lead.loanPeriods} 期` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">需要现场尽调：</span>
              <span>{lead.requiresSurvey ? "是" : "否"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">开单/存放仓库：</span>
              <span>{lead.warehouseName || "—"}</span>
            </div>
          </div>

          {/* 申请人资质 */}
          <div className="space-y-2 rounded-lg border border-border/80 p-3">
            <h4 className="font-semibold text-foreground">申请主体资质信息</h4>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                申请人类型：
                <span className="text-foreground">
                  {lead.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
                </span>
              </div>
              <div>
                申请人名称：
                <span className="font-medium text-foreground">
                  {lead.applicantName}
                </span>
              </div>
              <div>
                联系电话：
                <span className="text-foreground">{lead.applicantPhone}</span>
              </div>
              <div>
                {lead.applicantType === "ENTERPRISE"
                  ? "统一社会信用代码："
                  : "身份证号："}
                <span className="text-foreground">
                  {lead.applicantIdentifier || lead.applicantIdCard || "—"}
                </span>
              </div>
              {lead.applicantType === "ENTERPRISE" && (
                <>
                  <div>
                    经办人姓名：
                    <span className="text-foreground">{lead.agentName || "—"}</span>
                  </div>
                  <div>
                    经办人手机：
                    <span className="text-foreground">{lead.agentPhone || "—"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 驳回原因 (若状态为申请失败) */}
          {lead.status === "APPLY_FAILED" && (
            <div className="space-y-1.5 rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangleIcon className="size-4 text-rose-600" />
                <span>运营驳回原因及说明</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">驳回分类：</span>
                  <span>{lead.rejectReasonCategory || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">详细说明：</span>
                  <span>{lead.rejectReasonDetail || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* 审计日志 */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-1 font-semibold text-foreground">
              <ClockIcon className="size-3.5 text-muted-foreground" />
              <span>全流程履约流转记录</span>
            </h4>
            <div className="space-y-2 border-l-2 border-border pl-3 text-xs">
              {lead.logs.map((log) => (
                <div key={log.id} className="relative space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{log.action}</span>
                    <span className="text-[11px] text-muted-foreground">
                      <TableDateTimeCell value={log.time} plain />
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    操作人：{log.operator}
                  </div>
                  {log.detail && (
                    <div className="text-[11px] text-foreground/80">
                      {log.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            关 闭
          </Button>

          {lead.status === "PENDING_ACCEPT" && (
            <>
              {onRejectClick && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onClose()
                    onRejectClick(lead)
                  }}
                >
                  驳回
                </Button>
              )}
              {onAssignClick && (
                <Button
                  size="sm"
                  className="bg-primary"
                  onClick={() => {
                    onClose()
                    onAssignClick(lead)
                  }}
                >
                  分配跟进
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
