import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  MoreHorizontal,
  Package,
  QrCode,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ActionSheet, type ActionSheetItem } from "@/components/ui/ActionSheet"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type {
  ReceiptGoodsGroup,
  ReceiptGoodsLot,
  ReceiptRowAction,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_ACTION_LABEL,
  RECEIPT_STATUS_SEAL_COLOR,
  formatReceiptQuantity,
  receiptActionsForStatus,
  receiptFlowConflictMessage,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { ReceiptQrBox } from "../components/ReceiptQrBox"
import { ReceiptSheet } from "../components/ReceiptSheet"
import {
  RECEIPT_H5_LIST_ROUTE,
  receiptH5OpsPath,
} from "../domain/constants"
import { getMobileReceiptById } from "../mock/warehouse-receipts.mock"

type TabKey = "goods" | "changes"

const OPS_ROUTE_MAP: Partial<
  Record<ReceiptRowAction, "outbound" | "relocate" | "replenish" | "remove" | "cancel" | "inbound">
> = {
  outbound: "outbound",
  relocate: "relocate",
  replenish: "replenish",
  remove: "remove",
  cancel: "cancel",
  inbound: "inbound",
}

export function WarehouseReceiptDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])
  const flash = (location.state as { flash?: string } | null)?.flash

  const [tab, setTab] = useState<TabKey>("goods")
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const first = receipt?.goodsGroups[0]
    return first ? { [first.id]: true } : {}
  })
  const [barcode, setBarcode] = useState<{ lot: ReceiptGoodsLot; group: ReceiptGoodsGroup } | null>(
    null,
  )
  const [moreOpen, setMoreOpen] = useState(false)
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(
    null,
  )
  const [toast, setToast] = useState<string | null>(flash ?? null)

  useEffect(() => {
    if (!flash) return
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [flash])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单详情" backTo={RECEIPT_H5_LIST_ROUTE} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单，或不在当前账号权限范围内
        </div>
      </MobileShell>
    )
  }

  const seal = RECEIPT_STATUS_SEAL_COLOR[receipt.status]
  const lotCount = receipt.goodsGroups.reduce(
    (sum, group) => sum + group.lots.length,
    0,
  )
  const units = new Set(receipt.goodsGroups.map((group) => group.unit))
  const totalQuantity =
    units.size === 1
      ? receipt.goodsGroups.reduce((sum, group) => sum + group.quantity, 0)
      : null

  const runAction = (action: ReceiptRowAction) => {
    if (action === "detail") return
    if (action === "download") {
      showToast(`电子仓单正本 ${receipt.code}.pdf 生成中`)
      return
    }
    if (
      receipt.currentFlow &&
      ["replenish", "outbound", "relocate", "cancel"].includes(action)
    ) {
      setNotice({
        title: "暂无法发起新的流程",
        description: receiptFlowConflictMessage(receipt.currentFlow),
      })
      return
    }
    const op = OPS_ROUTE_MAP[action]
    if (op) navigate(receiptH5OpsPath(receipt.id, op))
  }

  const actions = receiptActionsForStatus(receipt.status).filter(
    (action) => action !== "detail",
  )
  const moreItems: ActionSheetItem[] = actions.map((action) => ({
    key: action,
    label: RECEIPT_ACTION_LABEL[action],
    danger: action === "cancel",
    primary: action === "download",
    onClick: () => runAction(action),
  }))

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["receipt-h5-detail-page"]}>
        <NavBar
          title="仓单详情"
          backTo={RECEIPT_H5_LIST_ROUTE}
          right={
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  .writeText(receipt.code)
                  .then(() => showToast("仓单编号已复制"))
                  .catch(() => showToast("复制失败"))
              }}
              className="rounded-full p-1.5 text-[#232D39]/60 active:bg-[#232D39]/5"
              aria-label="复制仓单编号"
            >
              <Copy className="size-4" />
            </button>
          }
        />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        <PrototypeAnnotationTarget annotationIds={["receipt-h5-detail-basic"]}>
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#232D39]/55">仓单编号</p>
                <p className="mt-0.5 text-base font-bold leading-tight text-[#232D39]">
                  {receipt.code}
                </p>
                <p className="mt-1 text-[11px] text-[#232D39]/45">
                  制单人：{receipt.creatorDisplay} · {receipt.createdAt}
                </p>
              </div>
              <PrototypeAnnotationTarget annotationIds={["receipt-h5-detail-seal"]}>
                <div
                  className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-sm"
                  style={{ backgroundColor: seal.background }}
                >
                  <span className="text-[10px] opacity-80">仓单状态</span>
                  <span className="text-sm font-semibold tracking-widest">
                    {seal.label}
                  </span>
                </div>
              </PrototypeAnnotationTarget>
            </div>

            <div className="mt-3 space-y-2 border-t border-[#232D39]/5 pt-2.5 text-xs">
              <DetailRow label="开立时间" value={receipt.establishedAt} />
              <DetailRow
                label="存货人（货主）"
                value={
                  <span className="flex flex-col items-end">
                    <span className="font-medium">{receipt.owner.name}</span>
                    <span className="text-[11px] text-[#232D39]/45">
                      {receipt.owner.identifier}
                    </span>
                  </span>
                }
              />
              <DetailRow
                label="持有人"
                value={
                  <span className="flex flex-col items-end">
                    <span className="font-medium">{receipt.holder.name}</span>
                    <span className="text-[11px] text-[#232D39]/45">
                      {receipt.holder.identifier}
                    </span>
                  </span>
                }
              />
              <DetailRow
                label="仓库名称"
                value={
                  <span className="flex items-center justify-end gap-1.5">
                    {receipt.warehouseName}
                    {receipt.thirdPartyRegistered ? (
                      <span className="rounded bg-emerald-50 px-1 py-0.5 text-[10px] font-medium text-emerald-600">
                        中仓登准入
                      </span>
                    ) : null}
                  </span>
                }
              />
              <DetailRow label="三方登记" value={receipt.thirdPartyRegistered ? "是" : "否"} />
              {receipt.cancelledAt ? (
                <DetailRow label="注销时间" value={receipt.cancelledAt} />
              ) : null}
              {receipt.currentFlow ? (
                <DetailRow
                  label="在途流程"
                  value={
                    <span className="text-amber-600">{receipt.currentFlow}（审批中）</span>
                  }
                />
              ) : null}
            </div>
          </section>
        </PrototypeAnnotationTarget>

        <section className="rounded-xl border border-[#232D39]/10 bg-white px-3 py-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#232D39]/55">
              <Package className="size-4 text-blue-600" />
              货品总数
            </div>
            <span className="text-sm font-semibold text-[#232D39]">
              {receipt.goodsGroups.length} 种
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-[#232D39]/5 pt-2">
            <span className="text-xs text-[#232D39]/55">在单批次 / 数量</span>
            <span className="text-sm font-semibold text-[#232D39]">
              {lotCount} 批 ·{" "}
              {totalQuantity === null
                ? "多单位"
                : `${formatReceiptQuantity(totalQuantity)}${units.values().next().value}`}
            </span>
          </div>
        </section>

        <div className="flex overflow-hidden rounded-xl border border-[#232D39]/10 bg-white shadow-xs">
          {(
            [
              ["goods", "货物明细"],
              ["changes", "变更记录"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-center text-xs font-medium ${
                tab === key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-[#232D39]/55"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "goods" ? (
          <PrototypeAnnotationTarget
            annotationIds={["receipt-h5-detail-goods", "receipt-h5-detail-barcode"]}
          >
            <div className="space-y-2.5">
              {receipt.goodsGroups.map((group, index) => {
                const stored = expanded[group.id]
                const open = stored === undefined ? index === 0 : stored
                return (
                  <section
                    key={group.id}
                    className="overflow-hidden rounded-xl border border-[#232D39]/10 bg-white shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [group.id]: !open }))
                      }
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-50 text-[11px] font-medium text-blue-600">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#232D39]">
                            {group.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#232D39]/45">
                            {group.lots.length} 个批次
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-semibold text-[#232D39]">
                          {formatReceiptQuantity(group.quantity)} {group.unit}
                        </span>
                        {open ? (
                          <ChevronDown className="size-4 text-[#232D39]/40" />
                        ) : (
                          <ChevronRight className="size-4 text-[#232D39]/40" />
                        )}
                      </div>
                    </button>

                    {open ? (
                      <div className="space-y-2 border-t border-[#232D39]/5 bg-[#232D39]/2 px-3.5 py-2.5">
                        {group.lots.map((lot, lotIndex) => (
                          <div
                            key={lot.id}
                            className="rounded-lg bg-white px-3 py-2.5 text-xs shadow-[0_1px_2px_rgba(35,45,57,0.04)]"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="min-w-0 text-[#232D39]/55">
                                批次 {lotIndex + 1}
                              </span>
                              <span className="shrink-0 font-medium text-[#232D39]">
                                {formatReceiptQuantity(lot.quantity)} {lot.unit}
                              </span>
                            </div>
                            <p className="mt-1 text-[#232D39]">
                              {lot.warehouseName}-{lot.houseName}({lot.houseAudit})-
                              {lot.zoneName}
                            </p>
                            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#232D39]/55">
                              <span>具体位置：{lot.position || "--"}</span>
                              <span className="text-right">
                                状态：{lot.statusLabel}
                              </span>
                              <span className="col-span-2">入库时间：{lot.inboundAt}</span>
                              <span className="col-span-2 truncate">
                                其他信息：
                                {lot.otherInfo.length ? lot.otherInfo.join(" / ") : "无: --"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setBarcode({ lot, group })}
                              className="mt-2 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600 active:bg-blue-100"
                            >
                              <QrCode className="size-3.5" />
                              存货条码
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>
                )
              })}
            </div>
          </PrototypeAnnotationTarget>
        ) : (
          <PrototypeAnnotationTarget annotationIds={["receipt-h5-detail-changes"]}>
            <div className="space-y-2.5">
              {receipt.changes.length === 0 ? (
                <p className="rounded-xl bg-white py-10 text-center text-xs text-[#232D39]/40">
                  暂无变更记录
                </p>
              ) : (
                receipt.changes
                  .slice()
                  .reverse()
                  .map((record) => (
                    <section
                      key={record.id}
                      className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-[#232D39]/6 px-2 py-0.5 text-[11px] font-medium text-[#232D39]/70">
                          {record.changeType}
                        </span>
                        <span className="text-[11px] text-[#232D39]/45">
                          {record.changedAt}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#232D39]">
                        {record.summary}
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-2 border-t border-[#232D39]/5 pt-2 text-[11px] text-[#232D39]/50">
                        <div className="min-w-0">
                          <p className="truncate">操作人：{record.operator}</p>
                          <p className="truncate">
                            关联单号：{record.relatedNo ?? "--"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            showToast(`${receipt.code}-${record.changeType} 变更确认单生成中`)
                          }
                          className="shrink-0 font-medium text-blue-600"
                        >
                          下载
                        </button>
                      </div>
                    </section>
                  ))
              )}
            </div>
          </PrototypeAnnotationTarget>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-[#232D39]/10 bg-white px-3.5 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => runAction("download")}
          className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"
        >
          <Download className="size-4" />
          下载存证
        </button>
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          disabled={actions.filter((action) => action !== "download").length === 0}
          className={`flex h-10 flex-[1.4] items-center justify-center gap-1 rounded-lg text-sm font-medium ${
            actions.filter((action) => action !== "download").length === 0
              ? "bg-[#BBC2D0] text-white"
              : "bg-blue-600 text-white active:bg-blue-700"
          }`}
        >
          <MoreHorizontal className="size-4" />
          {receipt.status === "NORMAL" ? "更多操作" : "仅可查看"}
        </button>
      </div>

      {barcode ? (
        <ReceiptSheet
          open
          title="存货条码与货位标识"
          description="条码由入库时固化生成，仓单生命周期内只读引用"
          onClose={() => setBarcode(null)}
        >
          <div className="flex flex-col items-center">
            <ReceiptQrBox value={barcode.lot.barcode} size={160} />
            <p className="mt-2 text-sm font-semibold text-[#232D39]">
              {barcode.lot.barcode}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  .writeText(barcode.lot.barcode)
                  .then(() => showToast("条码编号已复制"))
                  .catch(() => showToast("复制失败"))
              }}
              className="mt-1 text-xs font-medium text-blue-600"
            >
              复制条码编号
            </button>
            <div className="mt-3 w-full space-y-1.5 rounded-lg bg-[#232D39]/5 px-3 py-2.5 text-xs text-[#232D39]/70">
              <p>货品规格：{barcode.group.name}</p>
              <p>
                存放位置：{barcode.lot.warehouseName}-{barcode.lot.houseName}(
                {barcode.lot.houseAudit})-{barcode.lot.zoneName}-
                {barcode.lot.position || "--"}
              </p>
              <p>入库时间：{barcode.lot.inboundAt}</p>
              <p>批次状态：{barcode.lot.statusLabel}</p>
            </div>
          </div>
        </ReceiptSheet>
      ) : null}

      <ActionSheet
        open={moreOpen}
        title="仓单操作"
        description={`${receipt.code} · ${receipt.warehouseName}`}
        items={moreItems}
        onClose={() => setMoreOpen(false)}
      />

      {notice ? (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4">
            <h3 className="text-center text-sm font-bold text-[#232D39]">
              {notice.title}
            </h3>
            <p className="mt-2 text-center text-xs leading-relaxed text-[#232D39]/65">
              {notice.description}
            </p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
            >
              我知道了
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-20 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/55">{label}</span>
      <span className="min-w-0 text-right text-[#232D39]">{value}</span>
    </div>
  )
}
