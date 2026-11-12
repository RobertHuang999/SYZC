import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  FileTextIcon,
  UploadCloudIcon,
  ShieldAlertIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  PaperclipIcon,
  Building2Icon,
  UserCheck2Icon,
  DownloadIcon,
} from "lucide-react"
import {
  PARTNER_FUNDERS,
  REJECT_CATEGORIES,
  SAME_ORG_SURVEYORS,
  dueDiligenceDetailPath,
} from "../domain/constants"
import type { CustomerFinancingDueDiligence } from "../domain/types"

// -------------------------------------------------------------
// 1. 发起尽调模态弹窗 (R01/R06/S02)
// -------------------------------------------------------------
interface TriggerModalProps {
  open: boolean
  item: CustomerFinancingDueDiligence | null
  onClose: () => void
  onConfirm: (item: CustomerFinancingDueDiligence) => void
}

export function TriggerDueDiligenceModal({
  open,
  item,
  onClose,
  onConfirm,
}: TriggerModalProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2Icon className="h-5 w-5 text-primary" />
            核对主体资质并调用智风控 OpenAPI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-foreground">
            <p className="font-medium text-primary">
              【尽调责任人独占与主体资质核验规则】(R01)
            </p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              系统将核验申请主体工商营业执照、统一社会信用代码及法定代表人资质一致性，确认无误后异步请求第三方智风控引擎开展大数据信用核查。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-md border border-border/70 bg-card p-3.5">
            <div>
              <span className="text-muted-foreground">尽调单号：</span>
              <span className="font-medium text-foreground">{item.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">当前专员：</span>
              <span className="font-medium text-foreground">{item.surveyor}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">申请主体：</span>
              <span className="font-semibold text-foreground">
                {item.applicantName}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">统一社会信用代码：</span>
              <span className="font-medium text-foreground">
                {item.applicantIdentifier}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">法定代表人：</span>
              <span className="font-medium text-foreground">
                {item.applicantLegalPerson || "周建国"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">经办人联系方式：</span>
              <span className="font-medium text-foreground">{item.agentPhone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">意向融资金额：</span>
              <span className="font-semibold text-foreground">
                ¥{item.intendedAmount.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">抵/质押形态：</span>
              <span className="font-medium text-foreground">
                {item.collateralType}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            * 点击【确认发起尽调】后，单据状态将置为【受理中】，系统后台将异步接收智风控网关回调结论（PASS / REJECT / REVIEW）。
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            取消
          </Button>
          <Button
            size="sm"
            onClick={() => onConfirm(item)}
            className="h-8"
          >
            确认发起尽调
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// 2. 同组织任务转交模态表单 (R02/C01/S01)
// -------------------------------------------------------------
interface ReassignModalProps {
  open: boolean
  item: CustomerFinancingDueDiligence | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingDueDiligence,
    targetSurveyor: string,
    reason: string
  ) => void
}

export function ReassignTaskModal({
  open,
  item,
  onClose,
  onConfirm,
}: ReassignModalProps) {
  const [targetSurveyor, setTargetSurveyor] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (item) {
      // 默认选择第一个非自己的同组织专员
      const candidate = SAME_ORG_SURVEYORS.find((s) => s.name !== item.surveyor)
      setTargetSurveyor(candidate ? candidate.name : "")
      setReason("")
      setError(null)
    }
  }, [item, open])

  if (!item) return null

  const handleSubmit = () => {
    if (!targetSurveyor) {
      setError("请选择目标尽调专员")
      return
    }
    if (targetSurveyor === item.surveyor) {
      setError("目标专员不可为当前专员本人")
      return
    }
    onConfirm(item, targetSurveyor, reason)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <UserCheck2Icon className="h-5 w-5 text-blue-600" />
            同组织尽调任务转交
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-md border border-blue-200 bg-blue-50/70 p-3 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
            <p className="font-medium">
              【同机构任务转交与流转审计规则】(R02/C01)
            </p>
            <p className="mt-1 leading-relaxed">
              仅支持将任务转交至同一组织机构下的在职尽调同事；转交后单据责任人即时变更，单据保持【待尽调】状态并全程留痕存证。
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-border/70 bg-card p-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">尽调单号：</span>
              <span className="font-medium text-foreground">{item.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">申请主体：</span>
              <span className="font-medium text-foreground">
                {item.applicantName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前专员：</span>
              <span className="font-medium text-foreground">
                {item.surveyor}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              目标专员 <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetSurveyor}
              onChange={(e) => {
                setTargetSurveyor(e.target.value)
                setError(null)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {SAME_ORG_SURVEYORS.map((s) => (
                <option
                  key={s.id}
                  value={s.name}
                  disabled={s.name === item.surveyor}
                >
                  {s.name} - {s.department} {s.name === item.surveyor ? "（当前负责人）" : ""}
                </option>
              ))}
            </select>
            {error && <p className="text-[11px] text-rose-500">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">转交原因说明</label>
            <Input
              placeholder="请输入转交工作说明（如：因外出巡库交接）"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="h-8 bg-blue-600 text-white hover:bg-blue-700"
          >
            确认转交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// 3. 手动拒绝模态弹窗 (R03/C02/S04)
// -------------------------------------------------------------
interface ManualRejectModalProps {
  open: boolean
  item: CustomerFinancingDueDiligence | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingDueDiligence,
    category: string,
    detail: string
  ) => void
}

export function ManualRejectModal({
  open,
  item,
  onClose,
  onConfirm,
}: ManualRejectModalProps) {
  const [category, setCategory] = useState(REJECT_CATEGORIES[0])
  const [detail, setDetail] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCategory(REJECT_CATEGORIES[0])
      setDetail("")
      setError(null)
    }
  }, [open])

  if (!item) return null

  const handleSubmit = () => {
    const trimmed = detail.trim()
    if (!trimmed) {
      setError("详细拒绝说明为必填项，不可为空 (C02)")
      return
    }
    if (trimmed.length > 300) {
      setError("详细拒绝说明长度不可超过 300 字 (C02)")
      return
    }
    onConfirm(item, category, trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-rose-600">
            <AlertTriangleIcon className="h-5 w-5" />
            确认拒绝该尽调任务？
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-md border border-rose-200 bg-rose-50/80 p-3 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <p className="font-medium">
              【手动拒绝不可逆与原因入池规则】(R03/C02)
            </p>
            <p className="mt-1 leading-relaxed">
              拒绝操作为终态不可逆操作。提交后任务将直接移出【待尽调标签页】，进入【尽调完成标签页】（状态标记为申请失败），并通过系统事务可靠投递至【被拒退回池 → 尽调失败标签页】。
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-border/70 bg-card p-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">申请主体：</span>
              <span className="font-semibold text-foreground">
                {item.applicantName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">融资产品：</span>
              <span className="font-medium text-foreground">
                {item.productName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">申报融资金额：</span>
              <span className="font-semibold text-foreground">
                ¥{item.intendedAmount.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              拒绝原因分类 <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {REJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-foreground">
                详细拒绝说明 <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] ${
                  detail.length > 300 ? "text-rose-600 font-semibold" : "text-muted-foreground"
                }`}
              >
                {detail.length} / 300 字
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="请详细描述实地勘验异常或排查结论（如：现场查封停产、库房无实物押品等）"
              value={detail}
              onChange={(e) => {
                setDetail(e.target.value)
                setError(null)
              }}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
            {error && <p className="text-[11px] text-rose-500">{error}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="h-8 bg-rose-600 text-white hover:bg-rose-700"
          >
            确认拒绝并入池
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// 4. 分配给合作资方模态表单 (R04/C03/S03)
// -------------------------------------------------------------
interface AssignFunderModalProps {
  open: boolean
  item: CustomerFinancingDueDiligence | null
  onClose: () => void
  onConfirm: (
    item: CustomerFinancingDueDiligence,
    funderName: string,
    remark: string
  ) => void
  onUploadMockReport: (item: CustomerFinancingDueDiligence) => void
}

export function AssignFunderModal({
  open,
  item,
  onClose,
  onConfirm,
  onUploadMockReport,
}: AssignFunderModalProps) {
  const [funderName, setFunderName] = useState(PARTNER_FUNDERS[0].name)
  const [remark, setRemark] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setFunderName(PARTNER_FUNDERS[0].name)
      setRemark("")
      setError(null)
    }
  }, [open])

  if (!item) return null

  // 门禁检查：是否包含尽调报告 (R04/C03)
  const hasReport =
    item.attachments?.some((a) => a.isReport || a.name.includes("尽职调查") || a.name.includes("尽调报告")) ?? false

  const handleSubmit = () => {
    if (!hasReport) {
      setError("分配失败：缺少正式盖章尽调报告附件，请先上传尽调报告 (C03)")
      return
    }
    if (!funderName) {
      setError("请选择合作资方金融机构")
      return
    }
    onConfirm(item, funderName, remark)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
            <Building2Icon className="h-5 w-5" />
            尽调通过：分配给合作资方机构
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 门禁状态卡片 */}
          {!hasReport ? (
            <div className="rounded-md border border-rose-200 bg-rose-50/70 p-3 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldAlertIcon className="h-4 w-4 text-rose-600" />
                  缺少盖章尽调报告附件 (C03 门禁阻断)
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUploadMockReport(item)}
                  className="h-7 border-rose-300 bg-background text-xs text-rose-700 hover:bg-rose-100"
                >
                  <UploadCloudIcon className="mr-1 h-3.5 w-3.5" />
                  立即归档尽调报告
                </Button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                依据【缺少尽调报告分配资方阻断】(C03)，受理成功件必须包含至少 1 份正式线下尽调报告盖章件（PDF/Word），方可分配资方推向下游。
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 p-3 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-semibold">尽调报告附件门禁已核验通过</span>
                <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                  已归档报告附件，符合【尽调报告附件齐备与资方分配规则】(R04)。
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 rounded-md border border-border/70 bg-card p-3">
            <div>
              <span className="text-muted-foreground">申请企业：</span>
              <span className="font-medium text-foreground">
                {item.applicantName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">产品名称：</span>
              <span className="font-medium text-foreground">
                {item.productName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">意向融资金额：</span>
              <span className="font-semibold text-foreground">
                ¥{item.intendedAmount.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">智风控评分：</span>
              <span className="font-semibold text-emerald-600">
                {item.riskScore || 88} 分 (PASS)
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              合作资方金融机构 <span className="text-rose-500">*</span>
            </label>
            <select
              value={funderName}
              onChange={(e) => {
                setFunderName(e.target.value)
                setError(null)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {PARTNER_FUNDERS.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">
              推介与业务备注说明（选填）
            </label>
            <Input
              placeholder="请输入推介理由或资方授信前置配合要求"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="text-xs"
            />
          </div>

          {error && <p className="text-[11px] text-rose-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="h-8 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            确认分配并流转
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// 5. 查看/下载尽调报告弹窗 (R04/R05)
// -------------------------------------------------------------
interface ViewReportModalProps {
  open: boolean
  item: CustomerFinancingDueDiligence | null
  onClose: () => void
  onDownload: (fileName: string) => void
}

export function ViewReportModal({
  open,
  item,
  onClose,
  onDownload,
}: ViewReportModalProps) {
  if (!item) return null

  const reports =
    item.attachments?.filter(
      (a) => a.isReport || a.name.includes("报告") || a.name.includes("截图")
    ) ?? []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            客户融资尽职调查与风控报告归档预览
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-2 rounded-md border border-border/70 bg-card p-3">
            <div>
              <span className="text-muted-foreground">申请主体：</span>
              <span className="font-semibold text-foreground">
                {item.applicantName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">所属产品：</span>
              <span className="font-medium text-foreground">
                {item.productName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">尽调专员：</span>
              <span className="font-medium text-foreground">{item.surveyor}</span>
            </div>
            <div>
              <span className="text-muted-foreground">智风控结论：</span>
              <span className="font-semibold text-foreground">
                {item.riskConclusion || "PASS"} ({item.riskScore || 85}分)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-foreground">
              归档附件列表（共 {item.attachments.length} 份）
            </div>
            <div className="divide-y divide-border/60 rounded-md border border-border/70 bg-card">
              {item.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        {att.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {att.size} · 上传时间：{att.uploadedAt}
                        {att.isReport && (
                          <Badge
                            variant="outline"
                            className="ml-2 border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700"
                          >
                            正式尽调报告盖章件
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(att.name)}
                    className="h-7 gap-1 text-xs"
                  >
                    <DownloadIcon className="h-3 w-3" />
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// 6. 客户尽调记录模态框 (对齐现网顶部【客户尽调记录】操作)
// -------------------------------------------------------------
interface CustomerDiligenceRecordsModalProps {
  open: boolean
  records: CustomerFinancingDueDiligence[]
  onClose: () => void
  onViewRecordDetail: (record: CustomerFinancingDueDiligence) => void
}

export function CustomerDiligenceRecordsModal({
  open,
  records,
  onClose,
  onViewRecordDetail,
}: CustomerDiligenceRecordsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = records.filter(
    (r) =>
      r.applicantName.includes(searchTerm) ||
      r.productName.includes(searchTerm) ||
      r.id.includes(searchTerm)
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2Icon className="h-5 w-5 text-primary" />
            客户融资尽职调查办理历史台账记录
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="快速检索申请企业、产品名称或尽调单号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 max-w-sm text-xs"
            />
            <div className="text-muted-foreground">
              共归档 <span className="font-semibold text-foreground">{filtered.length}</span> 笔尽调记录
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto rounded-md border border-border/70">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-3 py-2.5">尽调单号</th>
                  <th className="px-3 py-2.5">申请主体</th>
                  <th className="px-3 py-2.5">融资产品</th>
                  <th className="px-3 py-2.5 text-right">意向金额</th>
                  <th className="px-3 py-2.5 text-center">状态</th>
                  <th className="px-3 py-2.5">尽调专员</th>
                  <th className="px-3 py-2.5">处理时间</th>
                  <th className="px-3 py-2.5 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-3 py-2 font-medium text-foreground">
                      {item.id}
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {item.applicantName}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {item.productName}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-foreground">
                      ¥{item.intendedAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                        {item.status === "PENDING_DILIGENCE"
                          ? "待尽调"
                          : item.status === "IN_PROCESSING"
                          ? "受理中"
                          : item.status === "DILIGENCE_SUCCESS"
                          ? "受理成功"
                          : item.status === "DILIGENCE_FAILED"
                          ? "受理失败"
                          : "申请失败"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-foreground">
                      {item.surveyor}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {item.processedAt}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          onClose()
                          onViewRecordDetail(item)
                        }}
                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        详情
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
