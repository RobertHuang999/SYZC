import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CheckCircle2, ExternalLink, History, Lock } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  H5_DETAIL_BTN_PRIMARY,
  H5_DETAIL_BTN_SECONDARY,
} from "@/shared/h5-ui-theme"
import {
  ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE,
  ONLINE_PLEDGE_SETTLED_SPEC_NOTE,
  ONLINE_PLEDGE_SETTLED_USER_HINT,
} from "@prototype/shared/online-pledge/online-pledge-ui-labels"
import {
  FINANCING_STATUS_META,
  H5_ONLINE_PLEDGE_LIST_PATH,
  PROCESSING_STAGE_LABEL,
  formatYuan,
  h5OnlinePledgeActionPath,
  nowFormatted,
  type OnlinePledgeRecord,
} from "../domain/types"
import {
  loadH5OnlinePledgeRecords,
  saveH5OnlinePledgeRecords,
} from "./OnlinePledgeListPage"

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100/80 py-1.5 text-xs last:border-0">
      <span className="shrink-0 text-[#232D39]/55">{label}</span>
      <span className="text-right font-medium text-[#232D39] break-all">
        {value}
      </span>
    </div>
  )
}

export function OnlinePledgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<OnlinePledgeRecord | null>(null)
  const [settleConfirmOpen, setSettleConfirmOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const list = loadH5OnlinePledgeRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
  }, [id])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  if (!record) {
    return (
      <MobileShell>
        <NavBar title="线上监管业务详情" showBack onBack={() => navigate(H5_ONLINE_PLEDGE_LIST_PATH)} />
        <div className="p-6 text-center text-xs text-gray-500">未找到对应单据</div>
      </MobileShell>
    )
  }

  const statusMeta = FINANCING_STATUS_META[record.financingStatus]
  const isSettled = record.financingStatus === "SETTLED"

  const handleSimulateSettle = () => {
    const now = nowFormatted()
    const updated: OnlinePledgeRecord = {
      ...record,
      financingStatus: "SETTLED",
      processingStage: undefined,
      handlerName: "系统事件总线",
      handledAt: now,
      version: record.version + 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          time: now,
          action: "解质押结清同步",
          operator: "系统事件总线",
          operatorOrg: "仓储监管中心",
          result: "已结清（终态只读）",
          remark: `关联抵质押订单 ${record.pledgeOrderNo ?? "PO-已核销"} 已完成解质押。`,
        },
        ...record.timeline,
      ],
    }
    const all = loadH5OnlinePledgeRecords().map((item) =>
      item.id === updated.id ? updated : item,
    )
    saveH5OnlinePledgeRecords(all)
    setRecord(updated)
    setSettleConfirmOpen(false)
    showToast("单据已同步为「已结清」终态")
  }

  return (
    <MobileShell>
      <NavBar
        title="线上监管业务详情"
        showBack
        onBack={() => navigate(H5_ONLINE_PLEDGE_LIST_PATH)}
      />

      <div className="space-y-3 bg-[#F6F8FA] p-3 pb-24 min-h-[calc(100%-44px)]">
        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-detail-header"]}>
          <SectionCard title="单据概览">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-[#232D39] break-all">
                  {record.applyNo}
                </div>
                <div className="mt-0.5 text-[11px] text-[#232D39]/60">
                  {record.productName} · v{record.version}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusMeta.pillClass}`}
              >
                {statusMeta.label}
              </span>
            </div>

            {record.financingStatus === "IN_PROCESSING" &&
              record.processingStage && (
                <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700">
                  当前阶段：{PROCESSING_STAGE_LABEL[record.processingStage]}
                </div>
              )}

            <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px]">
              {["授信确认", "抵质押办理", "贷款发放", "还款结清"].map(
                (label, idx) => {
                  const stepIdx =
                    record.financingStatus === "CREDIT_SUCCESS"
                      ? 0
                      : record.financingStatus === "IN_PROCESSING"
                        ? 1
                        : record.financingStatus === "LOAN_DISBURSED"
                          ? 2
                          : 3
                  const done = idx < stepIdx || isSettled
                  const active = idx === stepIdx && !isSettled
                  return (
                    <div
                      key={label}
                      className={`rounded-md py-1.5 ${
                        done
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : active
                            ? "bg-[#2E54C6]/10 text-[#2E54C6] font-semibold"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        {done && <CheckCircle2 className="size-3" />}
                        <span>{label}</span>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </SectionCard>
        </PrototypeAnnotationTarget>

        {isSettled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600">
              <Lock className="size-4 shrink-0" />
              <span>{ONLINE_PLEDGE_SETTLED_USER_HINT}</span>
            </div>
            <PrototypeSpecCallout>{ONLINE_PLEDGE_SETTLED_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        )}

        {record.lastRollbackReason && (
          <div className="space-y-2">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <div className="font-semibold">最近一次异常本地回退原因</div>
              <div className="mt-1">{record.lastRollbackReason}</div>
            </div>
            <PrototypeSpecCallout>{ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-detail-credit"]}>
          <SectionCard title="基本授信与申请人信息">
            <KVRow label="资金方机构" value={record.funderName} />
            <KVRow
              label="需要尽调"
              value={record.needDiligence ? "是（需尽调）" : "否（免尽调）"}
            />
            <KVRow
              label="申请人类型"
              value={record.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
            />
            <KVRow label="申请人名称" value={record.applicantName} />
            <KVRow label="申请人标识" value={record.applicantIdentifier} />
            {record.applicantType === "ENTERPRISE" && (
              <>
                <KVRow label="经办人" value={record.agentName ?? "--"} />
                <KVRow label="经办人电话" value={record.agentPhone ?? "--"} />
              </>
            )}
            <KVRow
              label="意向融资金额"
              value={`${formatYuan(record.intendedAmountYuan)}（${record.intendedPeriods} 期）`}
            />
            <KVRow
              label="核准授信额度"
              value={`${formatYuan(record.creditAmountYuan)}（${record.creditPeriods} 期）`}
            />
          </SectionCard>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-detail-collateral"]}>
          <SectionCard title="质押标的与电子存证">
            <KVRow
              label="抵/质押物类型"
              value={record.collateralType === "INVENTORY" ? "现货存货" : "数字仓单"}
            />
            <KVRow
              label="标的评估价值"
              value={formatYuan(record.assessedValueYuan)}
            />
            <KVRow
              label="关联抵质押订单"
              value={record.pledgeOrderNo ?? "--"}
            />
            {record.evidenceHash && (
              <KVRow label="电子存证哈希" value={record.evidenceHash} />
            )}

            <div className="mt-2 space-y-2">
              {record.collateralType === "INVENTORY"
                ? record.inventoryItems.map((inv) => (
                    <div
                      key={inv.id}
                      className="rounded-lg bg-[#F6F8FA] p-2.5 text-[11px]"
                    >
                      <div className="font-medium text-[#232D39]">
                        {inv.varietyName} · {inv.specModel}
                      </div>
                      <div className="mt-0.5 text-[#232D39]/60">
                        {inv.warehouseName} / {inv.zoneLocation} ·{" "}
                        {inv.pledgeQuantity} {inv.unit}
                      </div>
                    </div>
                  ))
                : record.receiptItems.map((wr) => (
                    <div
                      key={wr.id}
                      className="flex items-center justify-between rounded-lg bg-[#F6F8FA] p-2.5 text-[11px]"
                    >
                      <div>
                        <Link
                          to={`/m/workspace/warehouse-receipts/${encodeURIComponent(wr.receiptNo)}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#2E54C6]"
                        >
                          {wr.receiptNo}
                          <ExternalLink className="size-3" />
                        </Link>
                        <div className="mt-0.5 text-[#232D39]/60">
                          {wr.goodsSummary} · {wr.quantityText}
                        </div>
                      </div>
                      <div className="font-semibold text-[#232D39]">
                        {formatYuan(wr.assessedValueYuan)}
                      </div>
                    </div>
                  ))}
            </div>
          </SectionCard>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-detail-disbursement"]}>
          <SectionCard title="放款明细">
            <KVRow label="贷款金额" value={formatYuan(record.loanAmountYuan)} />
            <KVRow
              label="贷款期数"
              value={record.loanPeriods ? `${record.loanPeriods} 期` : "--"}
            />
            <KVRow label="放款日期" value={record.disburseDate ?? "--"} />
            <KVRow
              label="核定质押率"
              value={
                record.approvedPledgeRatio !== undefined
                  ? `${record.approvedPledgeRatio.toFixed(2)}%`
                  : "--"
              }
            />
            <KVRow
              label="放款凭证"
              value={record.disburseReceiptFileName ?? "--"}
            />
          </SectionCard>

          <SectionCard
            title="流转与回退日志"
            extra={
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <History className="size-3" />
                {record.timeline.length} 条
              </span>
            }
          >
            <div className="space-y-2.5">
              {record.timeline.map((ev) => (
                <div
                  key={ev.id}
                  className="border-l-2 border-[#2E54C6]/30 pl-2.5 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#232D39]">
                      {ev.action}
                    </span>
                    <span className="text-[#232D39]/50">{ev.time}</span>
                  </div>
                  <div className="text-[#232D39]/65">
                    {ev.operator} · {ev.result}
                  </div>
                  {ev.remark && (
                    <div className="mt-0.5 text-[#232D39]/80">{ev.remark}</div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </PrototypeAnnotationTarget>
      </div>

      {/* 吸底操作栏 */}
      {!isSettled && (
        <div className="sticky bottom-0 z-20 flex gap-2 border-t border-gray-200 bg-white px-3 py-2.5">
          {record.financingStatus === "CREDIT_SUCCESS" && (
            <button
              type="button"
              onClick={() =>
                navigate(h5OnlinePledgeActionPath(record.id, "initiate"))
              }
              className={H5_DETAIL_BTN_PRIMARY}
            >
              发起抵质押确认
            </button>
          )}
          {record.financingStatus === "IN_PROCESSING" &&
            record.processingStage !== "ORDER_GENERATED" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate(h5OnlinePledgeActionPath(record.id, "cancel"))
                  }
                  className={H5_DETAIL_BTN_SECONDARY}
                >
                  主动撤销
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(h5OnlinePledgeActionPath(record.id, "audit"))
                  }
                  className={H5_DETAIL_BTN_PRIMARY}
                >
                  审核任务
                </button>
              </>
            )}
          {record.financingStatus === "IN_PROCESSING" &&
            record.processingStage === "ORDER_GENERATED" && (
              <button
                type="button"
                onClick={() =>
                  navigate(h5OnlinePledgeActionPath(record.id, "disburse"))
                }
                className={H5_DETAIL_BTN_PRIMARY}
              >
                录入放款结果
              </button>
            )}
          {record.financingStatus === "LOAN_DISBURSED" && (
            <button
              type="button"
              onClick={() => setSettleConfirmOpen(true)}
              className={H5_DETAIL_BTN_SECONDARY}
            >
              模拟解质押结清同步
            </button>
          )}
        </div>
      )}

      {settleConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 space-y-3">
            <div className="text-sm font-semibold text-[#232D39]">
              确认模拟解质押结清同步？
            </div>
            <div className="text-xs text-gray-600">
              确认后单据将同步为「已结清」终态并锁定只读归档。
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSettleConfirmOpen(false)}
                className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSimulateSettle}
                className="flex-1 rounded-full bg-[#2E54C6] py-2 text-xs font-medium text-white"
              >
                确认同步
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
    </MobileShell>
  )
}
