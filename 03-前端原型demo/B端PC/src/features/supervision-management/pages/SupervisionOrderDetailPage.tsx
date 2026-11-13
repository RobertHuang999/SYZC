import { Fragment, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  HistoryIcon,
  SearchIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PageHeader } from "@/shared/components/PageHeader"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { cn } from "@/lib/utils"
import { supervisionManagementDetailAnnotations } from "../annotations/supervision-management-detail.annotations"
import { supervisionManagementDocuments } from "../documents/supervision-management-documents"
import {
  calcSupervisionRate,
  formatSupervisionRate,
  formatWan,
  getSupervisionTabConfig,
} from "../domain/constants"
import { supervisionOrdersMock } from "../mock/supervision-orders.mock"

type HistoryKind = "rate" | "industry" | "appraised"

const HISTORY_TITLES: Record<HistoryKind, string> = {
  rate: "抵押率变动记录",
  industry: "行业参考价历史",
  appraised: "货物评估价值历史",
}

function isActiveStatus(status: string) {
  return status.endsWith("中")
}

function formatMoney(value?: number | null) {
  const text = formatWan(value)
  return text ? `${text}万元` : "--"
}

export function SupervisionOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showOwnerIdentity, setShowOwnerIdentity] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [historyKind, setHistoryKind] = useState<HistoryKind | null>(null)

  const record = useMemo(
    () =>
      supervisionOrdersMock.find(
        (item) => item.id === decodeURIComponent(id ?? "") || item.orderNo === id,
      ),
    [id],
  )

  const tabConfig = record ? getSupervisionTabConfig(record.tab) : null

  const rate = record ? calcSupervisionRate(record) : null
  const rateText = rate === null ? "--" : (formatSupervisionRate(rate) ?? "--")

  const rateLabel =
    record?.tab === "PLEDGE"
      ? "质押率"
      : record?.tab === "SERVICE"
        ? "监管业务率"
        : "抵押率"
  const timeLabel =
    record?.tab === "PLEDGE"
      ? "质押时间"
      : record?.tab === "SERVICE"
        ? "监管时间"
        : "抵押时间"
  const modeLabel =
    record?.tab === "PLEDGE"
      ? "质押方式"
      : record?.tab === "SERVICE"
        ? "监管方式"
        : "抵押方式"
  const holderLabel =
    record?.tab === "PLEDGE"
      ? "质押权人"
      : record?.tab === "SERVICE"
        ? "质权人（服务方）"
        : "抵押权人"
  const goodsSectionTitle =
    record?.tab === "PLEDGE"
      ? "质押物明细"
      : record?.tab === "SERVICE"
        ? "监管物明细"
        : "抵押物明细"

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!record) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <PageHeader title="订单详情" />
          <Button variant="outline" size="sm" onClick={() => navigate("/融资/监管/监管业务/监管管理")}>
            <ArrowLeftIcon className="mr-1.5 size-4" />
            返回
          </Button>
        </div>
        <Card>
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-2 py-10 text-center">
            <SearchIcon className="size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">未找到该订单</p>
            <p className="text-xs text-muted-foreground">
              请返回监管管理列表，重新选择需要查看的单据。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const copyOrderNo = async () => {
    try {
      await navigator.clipboard.writeText(record.orderNo)
      showToast("复制成功")
    } catch {
      showToast("当前浏览器不支持自动复制，请手动选择单号复制")
    }
  }

  const historyRows =
    historyKind === "rate"
      ? [
          { time: record.pledgeTime, value: rateText, operator: "系统自动" },
          { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-09"), value: rateText, operator: "风控引擎" },
          { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-08"), value: "--", operator: "风控引擎" },
        ]
      : historyKind === "industry"
        ? [
            { time: record.pledgeTime, value: formatMoney(record.industryPrice), operator: "行情接口" },
            { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-09"), value: formatMoney(record.industryPrice), operator: "行情接口" },
            { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-08"), value: "--", operator: "行情接口" },
          ]
        : [
            { time: record.pledgeTime, value: formatMoney(record.appraisedValue), operator: "估值服务" },
            { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-09"), value: formatMoney(record.appraisedValue), operator: "估值服务" },
            { time: record.pledgeTime.replace(/^\d{4}-\d{2}/, "2026-08"), value: "--", operator: "估值服务" },
          ]

  const goodsDetails = record.goodsDetails ?? []

  return (
    <PrototypeAnnotationProvider
      title={`监管管理详情 · ${record.orderNo}`}
      documents={supervisionManagementDocuments}
      annotations={supervisionManagementDetailAnnotations}
    >
    <div className="space-y-4 pb-10 font-sans">
      {toast ? (
        <div className="fixed right-6 top-20 z-50 rounded-md bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-lg">
          {toast}
        </div>
      ) : null}

      {/* 顶部：单号 + 状态印章 */}
      <PrototypeAnnotationTarget annotationIds={["supervision-management-detail-page"]}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{tabConfig?.label ?? "监管管理"}</span>
            <span>/</span>
            <span>订单详情</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {record.orderNo}
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="复制单号"
              aria-label="复制单号"
              onClick={copyOrderNo}
            >
              <CopyIcon className="size-4" />
            </Button>
            {record.hasRisk ? (
              <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                存在风险
              </Badge>
            ) : null}
            {record.lockedTask ? (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                在途：{record.lockedTask}
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            发起人：{record.initiator ?? "--"} · {timeLabel}：{record.pledgeTime}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-24 shrink-0 flex-col items-center justify-center rounded-full text-center text-sm font-semibold leading-tight text-white shadow-sm",
              isActiveStatus(record.status) ? "bg-emerald-600" : "bg-slate-500",
            )}
            title={`${record.status}-${record.businessMode}`}
          >
            <span>{record.status}</span>
            <span className="mt-0.5 text-[11px] font-normal opacity-90">
              {record.businessMode}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/融资/监管/监管业务/监管管理")}>
            <ArrowLeftIcon className="mr-1.5 size-4" />
            返回
          </Button>
        </div>
      </div>
      </PrototypeAnnotationTarget>

      {/* 一、基础信息 */}
      <PrototypeAnnotationTarget annotationIds={["supervision-management-detail-fields"]}>
      <DetailSection title="基础信息">
        <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="发起人" value={record.initiator ?? "--"} />
          <DetailField label={timeLabel} value={record.pledgeTime} />
          <DetailField label="货主类型" value={record.ownerType} />
          <DetailField label="货主名称" value={record.ownerName} />
          <DetailField
            label="货主标识"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="tabular-nums">
                  {record.ownerType === "个人" && showOwnerIdentity
                    ? (record.ownerIdentityFull ?? record.ownerIdentity)
                    : record.ownerIdentity}
                </span>
                {record.ownerType === "个人" ? (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    title={showOwnerIdentity ? "隐藏明文" : "查看明文"}
                    aria-label={showOwnerIdentity ? "隐藏明文" : "查看明文"}
                    onClick={() => setShowOwnerIdentity((prev) => !prev)}
                  >
                    {showOwnerIdentity ? (
                      <EyeOffIcon className="size-3.5" />
                    ) : (
                      <EyeIcon className="size-3.5" />
                    )}
                  </button>
                ) : null}
              </span>
            }
          />
          <DetailField label={modeLabel} value={record.businessMode} />
          <DetailField label="合同编号" value={record.contractNo ?? "--"} />
          <DetailField label={`${holderLabel}类型`} value={record.holderType ?? "企业"} />
          <DetailField label={holderLabel} value={record.holderName ?? "--"} />
          <DetailField
            label={`${holderLabel}证件号`}
            value={record.holderCertNo ?? "--"}
          />
          <DetailField label="备注" value={record.remark ?? "--"} />
        </div>
      </DetailSection>

      {/* 二、授信与贷款信息 */}
      <DetailSection title="授信与贷款信息">
        <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="授信金额" value={formatMoney(record.creditAmount)} />
          <DetailField
            label="授信期数"
            value={record.creditPeriods ? `${record.creditPeriods}期` : "--"}
          />
          <DetailField
            label={rateLabel}
            value={
              <span className="inline-flex items-center gap-2">
                <span className="font-semibold text-foreground">{rateText}</span>
                <button
                  type="button"
                  className="text-[11px] font-medium text-primary hover:underline"
                  onClick={() => setHistoryKind("rate")}
                >
                  变动记录
                </button>
              </span>
            }
          />
          <DetailField label="贷款金额" value={formatMoney(record.loanAmount)} />
          <DetailField
            label="贷款期数"
            value={record.loanPeriods ? `${record.loanPeriods}期` : "--"}
          />
          <DetailField label="贷款余额" value={formatMoney(record.loanBalance)} />
        </div>
      </DetailSection>
      </PrototypeAnnotationTarget>

      {/* 三、四大风控指标卡片 */}
      <PrototypeAnnotationTarget annotationIds={["supervision-management-detail-actions"]}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="py-3">
          <CardContent className="space-y-1 px-4 py-0">
            <div className="text-[13px] text-muted-foreground">货值安全线 / 控货线</div>
            <div className="text-xl font-semibold tabular-nums text-foreground">
              {formatMoney(record.safetyLine)}
            </div>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="space-y-1 px-4 py-0">
            <div className="text-[13px] text-muted-foreground">行业参考价</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {formatMoney(record.industryPrice)}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                onClick={() => setHistoryKind("industry")}
              >
                <HistoryIcon className="size-3" />
                查看历史
              </button>
            </div>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="space-y-1 px-4 py-0">
            <div className="text-[13px] text-muted-foreground">货物评估价值</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {formatMoney(record.appraisedValue)}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                onClick={() => setHistoryKind("appraised")}
              >
                <HistoryIcon className="size-3" />
                查看历史
              </button>
            </div>
            {record.unpriced ? (
              <div className="text-[11px] text-amber-600">存在未定价货品，未定价部分不计入货值</div>
            ) : null}
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="space-y-1 px-4 py-0">
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <span>{rateLabel}</span>
              <Tooltip>
                <TooltipTrigger
                  render={<span />}
                  className="inline-flex cursor-help items-center text-amber-500"
                  aria-label="抵押率计算公式说明"
                >
                  ?
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
                  计算公式：贷款余额 ÷ 货物评估价值 × 100%
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {rateText}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                onClick={() => setHistoryKind("rate")}
              >
                <HistoryIcon className="size-3" />
                查看历史
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      </PrototypeAnnotationTarget>

      {/* 四、抵质押物明细 */}
      <DetailSection title={goodsSectionTitle}>
        {goodsDetails.length === 0 ? (
          <div className="rounded-md border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
            该订单暂无在押货品明细
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/70">
            <table className="w-full min-w-[680px] border-collapse text-left text-xs">
              <thead className="bg-muted/60 font-semibold text-muted-foreground">
                <tr>
                  <th className="w-10 whitespace-nowrap px-3 py-2.5 text-center">展开</th>
                  <th className="w-14 whitespace-nowrap px-3 py-2.5 text-center">序号</th>
                  <th className="min-w-[220px] whitespace-nowrap px-3 py-2.5">货物名称</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right">数量</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right">总价（万元）</th>
                </tr>
              </thead>
              <tbody>
                {goodsDetails.map((goods, index) => {
                  const key = goods.id
                  const open = expanded.has(key)
                  return (
                    <Fragment key={key}>
                      <tr
                        className="cursor-pointer border-t border-border/60 hover:bg-muted/20"
                        onClick={() => toggle(key)}
                      >
                        <td className="px-3 py-2.5 text-center text-muted-foreground">
                          {open ? (
                            <ChevronDownIcon className="mx-auto size-4" />
                          ) : (
                            <ChevronRightIcon className="mx-auto size-4" />
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-foreground">
                          {goods.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-foreground">
                          {goods.qty} {goods.unit}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-foreground">
                          {goods.totalValueWan}
                        </td>
                      </tr>
                      {open ? (
                        <tr key={`${key}-detail`} className="bg-muted/10">
                          <td colSpan={5} className="px-3 py-3">
                            <div className="overflow-x-auto rounded-md border border-border/60 bg-card">
                              <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
                                <thead className="bg-muted/50 font-semibold text-muted-foreground">
                                  <tr>
                                    <th className="w-10 whitespace-nowrap px-2.5 py-2">序号</th>
                                    <th className="whitespace-nowrap px-2.5 py-2">位置</th>
                                    <th className="whitespace-nowrap px-2.5 py-2">具体位置</th>
                                    <th className="whitespace-nowrap px-2.5 py-2">入库时间</th>
                                    <th className="whitespace-nowrap px-2.5 py-2">其他信息</th>
                                    <th className="whitespace-nowrap px-2.5 py-2">存货条码</th>
                                    <th className="whitespace-nowrap px-2.5 py-2 text-right">数量</th>
                                    <th className="whitespace-nowrap px-2.5 py-2 text-right">单价（元）</th>
                                    <th className="whitespace-nowrap px-2.5 py-2 text-right">总价（万元）</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-t border-border/50">
                                    <td className="px-2.5 py-2 text-center text-muted-foreground">
                                      1
                                    </td>
                                    <td className="px-2.5 py-2 text-foreground">
                                      {goods.location}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-foreground">
                                      {goods.spot}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-muted-foreground">
                                      {goods.inboundAt}
                                    </td>
                                    <td className="px-2.5 py-2 text-muted-foreground">
                                      {goods.batchInfo}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-muted-foreground">
                                      {goods.barcode}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">
                                      {goods.qty} {goods.unit}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">
                                      {goods.unitPriceYuan.toLocaleString("zh-CN")}
                                    </td>
                                    <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">
                                      {goods.totalValueWan}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </DetailSection>

      {/* 指标历史弹窗 */}
      <Dialog open={historyKind !== null} onOpenChange={(open) => !open && setHistoryKind(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base">
              {historyKind ? HISTORY_TITLES[historyKind] : ""}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              展示该订单历次重算与取数流水，数据仅供原型评审查看。
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto rounded-md border border-border/70">
            <table className="w-full min-w-[460px] text-left text-xs">
              <thead className="bg-muted/60 font-semibold text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-3 py-2.5">更新时间</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right">数值</th>
                  <th className="whitespace-nowrap px-3 py-2.5">记录来源</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row, index) => (
                  <tr key={index} className="border-t border-border/50">
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                      {row.time}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums text-foreground">
                      {row.value}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-foreground">
                      {row.operator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </PrototypeAnnotationProvider>
  )
}
