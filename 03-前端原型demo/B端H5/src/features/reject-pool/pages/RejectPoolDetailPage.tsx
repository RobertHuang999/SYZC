import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ExternalLink,
  History,
  Lock,
  Unlock,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  H5_DETAIL_BTN_PRIMARY,
  H5_DETAIL_BTN_SECONDARY,
} from "@/shared/h5-ui-theme"
import { REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE } from "@prototype/shared/reject-pool/reject-pool-ui-labels"
import {
  RejectPoolH5ActionSheet,
  type H5ActionKind,
} from "../components/RejectPoolH5ActionSheet"
import {
  H5_REJECT_POOL_LIST_PATH,
  OVERDUE_HOURS_THRESHOLD,
  formatYuan,
  isCircuitBroken,
  nextBatchNo,
  type RejectPoolRecord,
} from "../domain/types"
import {
  loadH5RejectPoolRecords,
  saveH5RejectPoolRecords,
} from "./RejectPoolListPage"

function KVRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 text-xs border-b border-gray-100/80 last:border-0">
      <span className="shrink-0 text-[#232D39]/55">{label}</span>
      <span
        className={`text-right ${
          highlight ? "font-semibold text-rose-600" : "font-medium text-[#232D39]"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function RejectPoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [record, setRecord] = useState<RejectPoolRecord | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [actionOpen, setActionOpen] = useState(false)
  const [actionKind, setActionKind] = useState<H5ActionKind | null>(null)

  useEffect(() => {
    const list = loadH5RejectPoolRecords()
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

  const openAction = (kind: H5ActionKind) => {
    if (!record) return
    if (kind !== "unlock" && isCircuitBroken(record)) {
      showToast("已触发风控熔断，需线下特批解除")
      return
    }
    setActionKind(kind)
    setActionOpen(true)
  }

  const handleActionDone = ({
    kind,
    record: target,
    assigneeName,
    ticketNo,
  }: {
    kind: H5ActionKind
    record: RejectPoolRecord
    assigneeName?: string
    ticketNo?: string
  }) => {
    const list = loadH5RejectPoolRecords()
    if (kind === "unlock") {
      const updated: RejectPoolRecord = { ...target, demoUnlocked: true }
      saveH5RejectPoolRecords(
        list.map((item) => (item.id === target.id ? updated : item)),
      )
      setRecord(updated)
      showToast(`特批工单 ${ticketNo} 已解锁`)
      return
    }

    saveH5RejectPoolRecords(list.filter((item) => item.id !== target.id))
    const nextBatch = nextBatchNo(target.batchNo)
    if (kind === "revive") {
      showToast(`${target.applyNo} 已救活并恢复待受理`)
    } else if (kind === "routeAssign") {
      showToast(`已指派给 ${assigneeName}`)
    } else if (kind === "reinitDiligence") {
      showToast(`已生成新尽调批次 ${nextBatch}`)
    } else if (kind === "skipDiligence") {
      showToast(`特批免尽调已直推 ${assigneeName}`)
    } else if (kind === "reassignFunder") {
      showToast(`已分配给 ${assigneeName}`)
    }
    window.setTimeout(() => navigate(H5_REJECT_POOL_LIST_PATH), 900)
  }

  if (!record) {
    return (
      <MobileShell>
        <NavBar title="被拒退回详情" backTo={H5_REJECT_POOL_LIST_PATH} />
        <div className="flex flex-1 items-center justify-center p-6 text-xs text-gray-500">
          未找到对应的被拒退回单据或已完成重调度。
        </div>
      </MobileShell>
    )
  }

  const overdue = record.stagnationHours > OVERDUE_HOURS_THRESHOLD
  const locked = isCircuitBroken(record)

  return (
    <MobileShell>
      <NavBar title="被拒退回详情" backTo={H5_REJECT_POOL_LIST_PATH} />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        {/* 顶部摘要卡 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-detail-header"]}>
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] text-gray-400">申请单号</div>
                <div className="text-base font-bold text-gray-900">{record.applyNo}</div>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                  {record.businessStatus === "ACCEPT_FAILED" ? "受理失败" : "申请失败"}
                </span>
                {overdue && (
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">
                    <AlertCircle className="size-3" />
                    超期 {record.stagnationHours.toFixed(1)}h
                  </span>
                )}
              </div>
            </div>

            {locked && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  <Lock className="size-3.5 shrink-0" />
                  <span>累计被拒满 5 次已触发熔断保护，需线下特批解除。</span>
                </div>
                <PrototypeSpecCallout>
                  {REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE}
                </PrototypeSpecCallout>
              </div>
            )}

            <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-xs text-rose-900">
              <div className="font-semibold text-rose-800">末次被拒原因</div>
              <p className="mt-1 leading-relaxed">{record.lastRejectReason}</p>
            </div>
          </section>
        </PrototypeAnnotationTarget>

        {/* 1. 异常归集与重调度状态概览 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-detail-overview"]}>
          <SectionCard title="异常归集与重调度概览" indicatorColor="#ef4444">
            <KVRow label="重调度批次号" value={record.batchNo} />
            <KVRow label="退回节点名称" value={record.rejectNodeName} />
            <KVRow
              label="停滞时长"
              value={`${record.stagnationHours.toFixed(1)} 小时${overdue ? "（超期）" : ""}`}
              highlight={overdue}
            />
            <KVRow
              label="历史被拒次数"
              value={`${record.rejectCount} 次`}
              highlight={record.rejectCount >= 3}
            />
            <KVRow
              label="退回处理人"
              value={`${record.rejectHandler}（${record.rejectHandlerOrg}）`}
            />
            <KVRow label="退回时间" value={record.rejectedAt} />
            {record.historicalRejectedFunders.length > 0 && (
              <KVRow
                label="历史曾拒资方"
                value={record.historicalRejectedFunders.join("、")}
                highlight
              />
            )}
          </SectionCard>
        </PrototypeAnnotationTarget>

        {/* 2. 融资产品与额度要素 */}
        <SectionCard title="融资产品与额度要素" indicatorColor="#165dff">
          <KVRow label="产品名称" value={record.productName} />
          <KVRow label="需要尽调" value={record.needDiligence ? "是" : "否"} />
          <KVRow
            label="意向融资金额"
            value={`${formatYuan(record.intendedAmountYuan)} 元`}
          />
          <KVRow label="意向融资期数" value={`${record.intendedPeriods} 期`} />
          <KVRow
            label="原核准授信额度"
            value={
              record.approvedCreditAmountYuan
                ? `${formatYuan(record.approvedCreditAmountYuan)} 元`
                : "—"
            }
          />
          <KVRow label="申请时间" value={record.appliedAt} />
        </SectionCard>

        {/* 3. 申请人主体资质 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-detail-applicant"]}>
          <SectionCard title="申请人主体资质信息" indicatorColor="#00a870">
            <KVRow
              label="申请人类型"
              value={record.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
            />
            <KVRow label="申请人名称" value={record.applicantName} />
            <KVRow label="申请人标识" value={record.applicantIdentifier} />
            {record.applicantType === "ENTERPRISE" ? (
              <>
                <KVRow
                  label="营业执照"
                  value={record.businessLicenseFileName ?? "已核验归档"}
                />
                <KVRow label="经办人名称" value={record.agentName ?? "—"} />
                <KVRow label="经办人手机号" value={record.agentPhone ?? "—"} />
                <KVRow label="经办人证件号" value={record.agentIdCard ?? "—"} />
              </>
            ) : (
              <>
                <KVRow label="申请人电话" value={record.applicantPhone ?? "—"} />
                <KVRow label="申请人身份证" value={record.applicantIdCard ?? "—"} />
              </>
            )}
          </SectionCard>
        </PrototypeAnnotationTarget>

        {/* 4. 抵/质押物与仓单明细 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-detail-collateral"]}>
          <SectionCard title="抵/质押物与仓单明细" indicatorColor="#f57c00">
            <KVRow
              label="抵/质押物类型"
              value={
                record.collateralType === "WAREHOUSE_RECEIPT"
                  ? "数字仓单"
                  : "现货存货"
              }
            />
            {record.warehouseReceiptCodes?.length ? (
              <KVRow
                label="数字仓单编号"
                value={
                  <Link
                    to={`/m/workspace/warehouse-receipts/${encodeURIComponent(record.warehouseReceiptCodes[0])}`}
                    className="inline-flex items-center gap-1 text-blue-600 underline"
                  >
                    <span>{record.warehouseReceiptCodes[0]}</span>
                    <ExternalLink className="size-3" />
                  </Link>
                }
              />
            ) : null}

            <div className="mt-2 space-y-2">
              {record.inventoryItems.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-gray-900">
                    <span>
                      {inv.varietyName} · {inv.specModel}
                    </span>
                    <span className="text-blue-600">
                      {inv.pledgeQuantity} {inv.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {inv.warehouseName} · {inv.zoneLocation}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    评估价值：{formatYuan(inv.assessedValueYuan)} 元
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </PrototypeAnnotationTarget>

        {/* 5. 多轮重调度与历次被拒履历时间轴 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-detail-timeline"]}>
          <SectionCard title="多轮重调度与被拒履历时间轴" indicatorColor="#7c3aed">
            <div className="ml-2 space-y-3 border-l-2 border-blue-200 pl-3.5">
              {record.batchHistory.map((h, idx) => (
                <div key={`${h.batchNo}-${idx}`} className="relative space-y-1 text-xs">
                  <span className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-blue-600 bg-white" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                      <History className="size-3 text-blue-600" />
                      {h.batchNo}
                    </span>
                    <span className="text-[11px] text-gray-400">{h.operatedAt}</span>
                  </div>
                  <div className="text-[11px] font-medium text-rose-700">
                    {h.nodeName} · {h.actionResult}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {h.operatorName}（{h.operatorOrg}）
                  </div>
                  <p className="rounded-lg bg-gray-50 p-2 text-[11px] text-gray-700">
                    {h.reasonOrNote}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </PrototypeAnnotationTarget>
      </div>

      {/* 吸底操作栏 */}
      <div className="shrink-0 border-t border-gray-200/80 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {locked ? (
          <button
            type="button"
            onClick={() => openAction("unlock")}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 text-sm font-medium text-amber-800"
          >
            <Unlock className="size-4" />
            模拟线下特批解除熔断
          </button>
        ) : (
          <div className="flex gap-2.5">
            {record.tabKey === "CLUE_REJECTED" && (
              <>
                <button
                  type="button"
                  onClick={() => openAction("revive")}
                  className={H5_DETAIL_BTN_SECONDARY}
                >
                  重新救活
                </button>
                <button
                  type="button"
                  onClick={() => openAction("routeAssign")}
                  className={H5_DETAIL_BTN_PRIMARY}
                >
                  按路由指派
                </button>
              </>
            )}
            {record.tabKey === "DILIGENCE_FAILED" && (
              <>
                <button
                  type="button"
                  onClick={() => openAction("skipDiligence")}
                  className={H5_DETAIL_BTN_SECONDARY}
                >
                  直分资方
                </button>
                <button
                  type="button"
                  onClick={() => openAction("reinitDiligence")}
                  className={H5_DETAIL_BTN_PRIMARY}
                >
                  重新发起尽调
                </button>
              </>
            )}
            {record.tabKey === "CREDIT_FAILED" && (
              <button
                type="button"
                onClick={() => openAction("reassignFunder")}
                className={H5_DETAIL_BTN_PRIMARY}
              >
                重新分配资方
              </button>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}

      <RejectPoolH5ActionSheet
        open={actionOpen}
        kind={actionKind}
        record={record}
        onClose={() => setActionOpen(false)}
        onDone={handleActionDone}
      />
    </MobileShell>
  )
}

