import { useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import {
  ABNORMAL_TYPE_BADGE_CLASS,
  H5_ABNORMAL_RECORD_LIST_PATH,
  ORDER_TYPE_BADGE_CLASS,
} from "../domain/constants"
import { abnormalRecordsMock } from "../mock/inventory-abnormal.mock"
import type { AbnormalGoodsLine } from "../domain/types"

type TabKey = "goods" | "audit"

const VALID_TABS: TabKey[] = ["goods", "audit"]

function formatQty(value: number): string {
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 3 })
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="min-w-0 text-right text-[#232D39]">{value}</span>
    </div>
  )
}

function DiffBadge({ line }: { line: AbnormalGoodsLine }) {
  if (line.diffQty === 0) {
    return <span className="text-[#232D39]/50">无差额</span>
  }
  const isIncrease = line.diffQty > 0
  return (
    <span
      className={
        isIncrease
          ? "rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600"
          : "rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600"
      }
    >
      {isIncrease ? "↑ +" : "↓ "}
      {formatQty(line.diffQty)}
      {line.unit}
    </span>
  )
}

export function InventoryAbnormalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const record = useMemo(
    () => abnormalRecordsMock.find((item) => item.id === id) || abnormalRecordsMock[0],
    [id],
  )

  const [tab, setTab] = useState<TabKey>(() => {
    const fromQuery = searchParams.get("tab")
    return VALID_TABS.includes(fromQuery as TabKey) ? (fromQuery as TabKey) : "goods"
  })
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(
    null,
  )

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleTabChange = (next: TabKey) => {
    setTab(next)
    navigate(
      next === "goods"
        ? `${H5_ABNORMAL_RECORD_LIST_PATH}/${record.id}`
        : `${H5_ABNORMAL_RECORD_LIST_PATH}/${record.id}?tab=${next}`,
      { replace: true },
    )
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["abnormal-h5-detail"]}>
        <NavBar title="异动详情" backTo={H5_ABNORMAL_RECORD_LIST_PATH} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-8">
        {/* 摘要卡 */}
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">异动单号</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                已生效归档
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="break-all text-base font-bold leading-tight text-[#232D39]">
                {record.id}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制异动单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              申请时间：{record.applyTime}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow label="关联单据" value={record.relateId} />
            <FieldRow
              label="单据类型"
              value={
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${ORDER_TYPE_BADGE_CLASS[record.relateOrderType]}`}
                >
                  {record.relateOrderType}
                </span>
              }
            />
            <FieldRow label="货主" value={record.owner.ownerName} />
            <FieldRow label="货主标识" value={record.owner.ownerIdentity} />
            <FieldRow label="申请人" value={record.applicantName} />
            <FieldRow label="申请时间" value={record.applyTime} />
            <FieldRow label="审批流程" value={record.processTitle} />
          </div>
        </section>

        {/* 分页签 */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", `调账货品明细 (${record.goodsLines.length})`],
              ["audit", "审核记录"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`min-w-0 flex-1 whitespace-nowrap py-2 text-center text-xs font-medium transition-colors ${
                tab === key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "goods" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-blue-200/60 bg-blue-50/80 px-3.5 py-2.5 text-xs text-[#232D39]/80">
              <span>本次调账货品</span>
              <span className="font-semibold text-blue-600">
                {record.goodsLines.length} 项
              </span>
            </div>

            {record.goodsLines.map((line, index) => (
              <section
                key={line.id || index}
                className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold leading-snug text-[#232D39]">
                        {line.goodsName}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                        计量单位：{line.unit}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${ABNORMAL_TYPE_BADGE_CLASS[line.abnormalType]}`}
                  >
                    {line.abnormalType}
                  </span>
                </div>

                {/* 变动前 → 变动后（业务链路必须画箭头） */}
                <PrototypeAnnotationTarget annotationIds={["abnormal-h5-diff-chain"]}>
                  <div className="rounded-lg bg-[#232D39]/[0.03] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 text-left">
                        <span className="block text-[10px] text-[#232D39]/45">
                          变动前
                        </span>
                        <span className="mt-0.5 block font-semibold text-[#232D39]/80">
                          {formatQty(line.beforeQty)} {line.unit}
                        </span>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-blue-600" />
                      <div className="min-w-0 text-right">
                        <span className="block text-[10px] text-[#232D39]/45">
                          变动后
                        </span>
                        <span className="mt-0.5 block text-base font-bold text-[#232D39]">
                          {formatQty(line.afterQty)} {line.unit}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 border-t border-dashed border-[#232D39]/10 pt-2">
                      <span className="text-[10px] text-[#232D39]/45">变动数量</span>
                      <DiffBadge line={line} />
                    </div>
                  </div>
                </PrototypeAnnotationTarget>

                <div className="space-y-1.5 text-[11px]">
                  <FieldRow label="存放位置" value={line.location} />
                  {line.specificLocation ? (
                    <FieldRow label="具体位置" value={line.specificLocation} />
                  ) : null}
                  {line.barcode ? (
                    <FieldRow label="存货条码" value={line.barcode} />
                  ) : null}
                  {line.barcodeCreatedAt ? (
                    <FieldRow label="二维码生成时间" value={line.barcodeCreatedAt} />
                  ) : null}
                </div>

                {line.reason ? (
                  <div className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px] leading-relaxed text-[#232D39]/70">
                    <span className="text-[#232D39]/45">变动原因：</span>
                    {line.reason}
                  </div>
                ) : null}

                {line.photos && line.photos.length > 0 ? (
                  <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2">
                    <span className="flex items-center gap-1 text-[11px] text-[#232D39]/50">
                      <Camera className="size-3 text-[#232D39]/35" />
                      现场凭据（点击放大）
                    </span>
                    <div className="flex gap-2 overflow-x-auto">
                      {line.photos.map((url, photoIndex) => (
                        <button
                          key={`${line.id}-photo-${photoIndex}`}
                          type="button"
                          onClick={() =>
                            setPreview({ images: line.photos ?? [], index: photoIndex })
                          }
                          className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#232D39]/10"
                        >
                          <img
                            src={url}
                            alt="现场凭据"
                            className="size-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-[#232D39]/5 pb-2">
              <h3 className="flex items-center gap-1.5 font-bold text-[#232D39]">
                <ShieldCheck className="size-4 text-blue-600" />
                审批流转记录
              </h3>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                {record.processTitle}
              </span>
            </div>

            <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
              {record.approvalNodes.map((node) => (
                <div key={node.id} className="relative">
                  <div className="absolute -left-5 top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-[9px] text-white">
                    ✓
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-[#232D39]">{node.title}</span>
                    <span className="shrink-0 text-[10px] text-[#232D39]/45">
                      {node.handleTime}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="min-w-0 text-[11px] text-[#232D39]/70">
                      {node.roleDesc ?? "处理人"}：{node.handlerName}
                    </p>
                    {node.hasTaskDetail ? (
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`正在跳转审批中心任务详情（${node.taskId ?? "—"}）...`)
                        }
                        className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-blue-600"
                      >
                        任务详情
                        <ExternalLink className="size-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {toast ? (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <MobileImageModal
        open={preview !== null}
        images={preview?.images ?? []}
        initialIndex={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />
    </MobileShell>
  )
}
