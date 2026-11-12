import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  REJECT_CATEGORY_OPTIONS,
  STATUS_META,
  formatCurrency,
} from "../domain/constants"
import type {
  CustomerFinancingCredit,
  RejectCategory,
} from "../domain/types"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  FileTextIcon,
  PackageIcon,
  HistoryIcon,
  ExternalLinkIcon,
  LockIcon,
} from "lucide-react"

// ----------------------------------------------------------------------
// 1. 标记申请成功模态表单 (核准授信额度 R04 / C02 / R06)
// ----------------------------------------------------------------------
interface ApproveCreditModalProps {
  open: boolean
  item: CustomerFinancingCredit | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    remark?: string
  ) => void
}

export function ApproveCreditModal({
  open,
  item,
  onClose,
  onConfirm,
}: ApproveCreditModalProps) {
  const [creditAmountStr, setCreditAmountStr] = useState("")
  const [creditPeriodsStr, setCreditPeriodsStr] = useState("")
  const [remark, setRemark] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open && item) {
      // 默认建议填入意向金额与期数或清空
      setCreditAmountStr(item.creditAmount ? String(item.creditAmount) : String(item.intendedAmount))
      setCreditPeriodsStr(item.creditPeriods ? String(item.creditPeriods) : String(item.intendedPeriods))
      setRemark(item.creditRemark || "")
      setErrorMsg(null)
    }
  }, [open, item])

  if (!item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const amount = parseFloat(creditAmountStr)
    const periods = parseInt(creditPeriodsStr, 10)

    // 校验规则 C02: 授信金额未填、<=0 或非数字
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("请填写合规的授信金额（必须大于 0 元，保留4位小数）(C02)")
      return
    }

    // 校验规则 C02: 授信期数必须为 >= 1 正整数
    if (isNaN(periods) || periods < 1 || !Number.isInteger(periods)) {
      setErrorMsg("请填写合规的授信期数（必须为不少于 1 的正整数）(C02)")
      return
    }

    onConfirm(item, amount, periods, remark)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2Icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                核准授信额度（标记申请成功）
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                核准资方正式批复额度与期数，提交后将激活下游【线上监管业务办理】(R04/R06)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* 单据背景概要只读卡片 */}
          <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">申请人：</span>
              <span className="font-medium text-foreground">{item.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">融资产品：</span>
              <span className="text-foreground">{item.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">意向融资金额 / 期数：</span>
              <span className="font-medium text-foreground">
                {formatCurrency(item.intendedAmount)} 元 / {item.intendedPeriods} 期
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">所属资方机构：</span>
              <span className="text-foreground">{item.funderOrgName}</span>
            </div>
          </div>

          {/* 授信金额录入 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>
                授信金额（元）<span className="text-destructive">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                大于 0，支持最多 4 位小数
              </span>
            </label>
            <Input
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="请输入资方核准授信金额"
              value={creditAmountStr}
              onChange={(e) => setCreditAmountStr(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* 授信期数录入 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>
                授信期数（期）<span className="text-destructive">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                不少于 1 正整数（按月）
              </span>
            </label>
            <Input
              type="number"
              step="1"
              min="1"
              placeholder="请输入资方核准授信期数"
              value={creditPeriodsStr}
              onChange={(e) => setCreditPeriodsStr(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* 授信说明（选填） */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              授信说明 / 批复备注（选填）：
            </label>
            <textarea
              rows={3}
              maxLength={200}
              placeholder="请输入资方贷审会批复意见或授信管控要求（最多 200 字）"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* 错误提示 */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2Icon className="mr-1 h-3.5 w-3.5" />
              确认授信（激活下游）
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------------------------
// 2. 标记申请失败模态弹窗 (R05 / C03)
// ----------------------------------------------------------------------
interface RejectCreditModalProps {
  open: boolean
  item: CustomerFinancingCredit | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingCredit,
    rejectCategory: RejectCategory,
    rejectDetail: string
  ) => void
}

export function RejectCreditModal({
  open,
  item,
  onClose,
  onConfirm,
}: RejectCreditModalProps) {
  const [category, setCategory] = useState<RejectCategory>("综合负债率过高")
  const [detail, setDetail] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCategory("综合负债率过高")
      setDetail("")
      setErrorMsg(null)
    }
  }, [open])

  if (!item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!category) {
      setErrorMsg("请选择拒绝原因分类 (C03)")
      return
    }

    if (!detail.trim()) {
      setErrorMsg("请填写详细拒绝原因说明（缺失阻断 C03）")
      return
    }

    if (detail.trim().length > 300) {
      setErrorMsg("详细拒绝说明字数不得超过 300 字")
      return
    }

    onConfirm(item, category, detail.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                标记授信申请失败
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                确认拒绝该笔授信申请？拒绝后将写入被拒记录池 (R05)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* 警示提示框 */}
          <div className="flex items-start gap-2 rounded-md bg-rose-50/80 p-3 text-xs text-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">审批拒绝与入池风险告知：</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                标记失败后，该单据将被移出本机构共享待办池，并通过事务消息可靠投递至【被拒退回池 -&gt; 授信失败标签页】供后续重新调度。
              </p>
            </div>
          </div>

          {/* 拒绝原因分类 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              拒绝原因分类<span className="text-destructive">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RejectCategory)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {REJECT_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 详细说明 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                详细失败说明<span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {detail.length}/300 字
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={300}
              placeholder="请输入资方信贷审批拒绝的合规风控理由（最多 300 字）"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* 错误提示 */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <XCircleIcon className="mr-1 h-3.5 w-3.5" />
              确认拒绝（移入被拒池）
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------------------------
// 3. 改标为申请失败模态弹窗 (R03 / C01)
// ----------------------------------------------------------------------
interface ChangeToFailedModalProps {
  open: boolean
  item: CustomerFinancingCredit | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingCredit,
    rejectCategory: RejectCategory,
    reason: string
  ) => void
}

export function ChangeToFailedModal({
  open,
  item,
  onClose,
  onConfirm,
}: ChangeToFailedModalProps) {
  const [category, setCategory] = useState<RejectCategory>("综合负债率过高")
  const [reason, setReason] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCategory("综合负债率过高")
      setReason("")
      setErrorMsg(null)
    }
  }, [open])

  if (!item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    // 校验阻断 C01: 下游已发起抵质押
    if (item.isDownstreamTriggered) {
      setErrorMsg("改标失败：下游已发起线上抵质押，状态已锁定 (C01)")
      return
    }

    if (!reason.trim()) {
      setErrorMsg("请填写改标为失败的具体原因说明")
      return
    }

    onConfirm(item, category, reason.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <RefreshCwIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                改标为申请失败（授信自纠偏）
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                未发起线上抵质押前允许改标修正，提交后撤销下游发起权并入被拒池 (R03)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {item.isDownstreamTriggered ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
              <LockIcon className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">改标通道已锁定：</p>
                <p className="mt-0.5 text-[11px]">
                  该借款人已在下游提交了线上抵质押信息确认，根据合规风控规则 (C01)，授信批复已生效且不可单方面撤销。
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
              <p className="font-medium">确认改标为失败？</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                原核准授信金额 {formatCurrency(item.creditAmount)} 元将予以作废，单据将被转入【被拒退回池 -&gt; 授信失败标签页】。
              </p>
            </div>
          )}

          {!item.isDownstreamTriggered && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  拒绝原因分类<span className="text-destructive">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RejectCategory)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {REJECT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  改标原因与拒绝说明<span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  placeholder="请输入改标原因及拒绝审批的说明（最多 300 字）"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            {!item.isDownstreamTriggered && (
              <Button
                type="submit"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                确认改标为失败
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------------------------
// 4. 改标为申请成功模态表单 (重申授信 R03)
// ----------------------------------------------------------------------
interface ChangeToSuccessModalProps {
  open: boolean
  item: CustomerFinancingCredit | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    reason: string
  ) => void
}

export function ChangeToSuccessModal({
  open,
  item,
  onClose,
  onConfirm,
}: ChangeToSuccessModalProps) {
  const [creditAmountStr, setCreditAmountStr] = useState("")
  const [creditPeriodsStr, setCreditPeriodsStr] = useState("")
  const [reason, setReason] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open && item) {
      setCreditAmountStr(String(item.intendedAmount))
      setCreditPeriodsStr(String(item.intendedPeriods))
      setReason("")
      setErrorMsg(null)
    }
  }, [open, item])

  if (!item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (item.isRescheduledInPool) {
      setErrorMsg("改标失败：单据已被被拒池重新调度流转，不可改标")
      return
    }

    const amount = parseFloat(creditAmountStr)
    const periods = parseInt(creditPeriodsStr, 10)

    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("请填写合规的授信金额（必须大于 0 元）(C02)")
      return
    }

    if (isNaN(periods) || periods < 1 || !Number.isInteger(periods)) {
      setErrorMsg("请填写合规的授信期数（必须为不少于 1 的正整数）(C02)")
      return
    }

    if (!reason.trim()) {
      setErrorMsg("请填写资方重申改标原因说明")
      return
    }

    onConfirm(item, amount, periods, reason.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <RefreshCwIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                改标为申请成功（资方重申）
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                重新核准授信额度与期数，从被拒池移除并重新激活下游抵质押 (R03)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {item.isRescheduledInPool ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircleIcon className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">无法改标：</p>
                <p className="mt-0.5 text-[11px]">
                  该单据已在被拒退回池中被重新调度流转至其他通道，当前资方不可再执行改标。
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 原拒绝原因回显 */}
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs space-y-1">
                <span className="text-muted-foreground">历史拒绝原因：</span>
                <p className="font-medium text-rose-600 dark:text-rose-400">
                  【{item.rejectCategory}】{item.rejectDetail}
                </p>
              </div>

              {/* 重新核准授信金额 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  重新核准授信金额（元）<span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={creditAmountStr}
                  onChange={(e) => setCreditAmountStr(e.target.value)}
                  placeholder="请输入核准授信金额"
                  className="text-sm"
                />
              </div>

              {/* 重新核准授信期数 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  重新核准授信期数（期）<span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  value={creditPeriodsStr}
                  onChange={(e) => setCreditPeriodsStr(e.target.value)}
                  placeholder="请输入核准授信期数"
                  className="text-sm"
                />
              </div>

              {/* 改标说明 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  重申改标原因说明<span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  placeholder="请输入重申通过的背景说明（如借款人已补交增信材料等）"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            {!item.isRescheduledInPool && (
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                确认改标并激活
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

