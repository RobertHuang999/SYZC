import { useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Camera, Clock, ShieldCheck } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { DocumentManagementTab } from "@/shared/document-management"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MOCK_MOVING_RECORDS, MOVING_MODIFY_LOGS } from "../mock/moving-records.mock"
import { MOVING_CHECK_STATUS_MAP, H5_MOVING_RECORD_LIST_PATH, h5MovingRecordDetailPath } from "../domain/constants"
import type { MovingRecordItem } from "../domain/types"

type TabKey = "goods" | "audit" | "modify" | "documents"

const VALID_TABS: TabKey[] = ["goods", "audit", "modify", "documents"]

const STATUS_BADGE: Record<number, string> = {
  1: "border-amber-200 bg-amber-50 text-amber-700",
  2: "border-emerald-200 bg-emerald-50 text-emerald-700",
  3: "border-rose-200 bg-rose-50 text-rose-700",
  4: "border-[#232D39]/15 bg-[#232D39]/[0.03] text-[#232D39]/70",
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="text-right text-[#232D39]">{value}</span>
    </div>
  )
}

export function MovingRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const record: MovingRecordItem = useMemo(
    () => MOCK_MOVING_RECORDS.find((item) => item.id === id) || MOCK_MOVING_RECORDS[0],
    [id]
  )

  const [tab, setTab] = useState<TabKey>(() => {
    const fromQuery = searchParams.get("tab")
    return VALID_TABS.includes(fromQuery as TabKey) ? (fromQuery as TabKey) : "goods"
  })
  const [toast, setToast] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const statusConfig = record.checkStatus
    ? MOVING_CHECK_STATUS_MAP[record.checkStatus]
    : null
  const modifyLogs = MOVING_MODIFY_LOGS[record.id] ?? []

  const totalAmount = record.respOutStockInfoVoList.reduce(
    (sum, goods) => sum + goods.amount,
    0
  )
  const unit = record.respOutStockInfoVoList[0]?.unit || "件"

  const handleTabChange = (next: TabKey) => {
    setTab(next)
    navigate(
      next === "goods"
        ? h5MovingRecordDetailPath(record.id)
        : `${h5MovingRecordDetailPath(record.id)}?tab=${next}`,
      { replace: true }
    )
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["moving-h5-detail"]}>
        <NavBar title="移库详情" backTo={H5_MOVING_RECORD_LIST_PATH} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        {/* 摘要卡 */}
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">移库单号</span>
              {statusConfig ? (
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${
                    STATUS_BADGE[record.checkStatus ?? 2]
                  }`}
                >
                  {statusConfig.text}
                </span>
              ) : null}
            </div>
            <p className="break-all text-base font-bold leading-tight text-[#232D39]">
              {record.id}
            </p>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              制单人：{record.createByName}（{record.createOrgName}） {record.createTime}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow label="货主名称" value={record.ownerName} />
            <FieldRow label="货主标识" value={record.ownerIdentity} />
            <FieldRow label="移库日期" value={record.transferTime || record.createTime} />
            <FieldRow label="移库类型" value={statusTypeLabel(record)} />
            <FieldRow label="仓库名称" value={record.repoNames} />
            <FieldRow
              label="移库总量"
              value={`${totalAmount.toLocaleString()} ${unit}`}
            />
            <FieldRow label="备注信息" value={record.remark || "—"} />
          </div>
        </section>

        {/* 分页签 */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", `货物明细 (${record.respOutStockInfoVoList.length})`],
              ["audit", "审核记录"],
              ["modify", "修改记录"],
              ["documents", "资料管理"],
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

        {/* 货物明细 */}
        {tab === "goods" && (
          <div className="space-y-2.5">
            {record.respOutStockInfoVoList.map((goods, index) => (
              <section
                key={goods.id || index}
                className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#232D39]">
                      {goods.cateName}-{goods.typeName}-{goods.concatAttrValue}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      规格：{goods.specification}
                      {goods.batchNo ? ` · 批次：${goods.batchNo}` : ""}
                    </p>
                  </div>
                  {goods.pledgeStatus ? (
                    <span className="shrink-0 rounded border border-[#232D39]/10 bg-[#232D39]/[0.03] px-1.5 py-0.5 text-[10px] text-[#232D39]/70">
                      {goods.pledgeStatus}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                  <div className="min-w-0">
                    <span className="block text-[#232D39]/45">原货位</span>
                    <span className="text-[#232D39]">
                      {goods.sourceHouseName}-{goods.sourceZoneName}
                    </span>
                  </div>
                  <span className="shrink-0 text-blue-600">➔</span>
                  <div className="min-w-0 text-right">
                    <span className="block text-[#232D39]/45">目标货位</span>
                    <span className="text-blue-600">
                      {goods.targetHouseName}-{goods.targetZoneName}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-t border-dashed border-[#232D39]/10 pt-2">
                  <span className="text-[#232D39]/45">移库数量</span>
                  <span className="font-bold text-[#232D39]">
                    {goods.amount} {goods.unit}
                    {goods.weight ? `（${goods.weight} ${goods.weightUnit || "吨"}）` : ""}
                  </span>
                </div>
              </section>
            ))}

            {/* 现场照片与设备抓拍 */}
            {(record.pictureScene?.length || record.pictureCapture?.length) ? (
              <section className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
                <h3 className="flex items-center gap-1.5 font-bold text-[#232D39]">
                  <Camera className="size-4 text-blue-600" />
                  现场照片与设备抓拍
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(record.pictureScene ?? []).map((url, index) => (
                    <button
                      key={`scene-${index}`}
                      type="button"
                      onClick={() =>
                        setPreview({ images: record.pictureScene ?? [], index })
                      }
                      className="size-20 overflow-hidden rounded-lg border border-[#232D39]/10"
                    >
                      <img src={url} alt="现场照片" className="size-full object-cover" />
                    </button>
                  ))}
                  {(record.pictureCapture ?? []).map((capture, index) => (
                    <button
                      key={`capture-${index}`}
                      type="button"
                      onClick={() =>
                        setPreview({
                          images: (record.pictureCapture ?? []).map((item) => item.url),
                          index,
                        })
                      }
                      className="size-20 overflow-hidden rounded-lg border border-[#232D39]/10"
                      title={`${capture.cameraName} ${capture.time}`}
                    >
                      <img src={capture.url} alt={capture.cameraName} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        {/* 审核记录 */}
        {tab === "audit" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
              <ShieldCheck className="size-4 text-blue-600" />
              流程审批时间线
            </h3>

            <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
              <div className="relative">
                <div className="absolute -left-5 top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] text-white">
                  ✓
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-[#232D39]">移库申请提交</span>
                  <span className="shrink-0 text-[10px] text-[#232D39]/45">
                    {record.createTime}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#232D39]/70">
                  经办人：{record.createByName}（{record.createOrgName}）
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-5 top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-[10px] text-white">
                  ✓
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-[#232D39]">库管审核通过</span>
                  <span className="shrink-0 text-[10px] text-[#232D39]/45">
                    {record.transferTime || record.createTime}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#232D39]/70">
                  审批人：{record.repoNames} 库区主管 · 审核意见：同意移库
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 修改记录 */}
        {tab === "modify" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
              <Clock className="size-4 text-blue-600" />
              单据修改记录
            </h3>
            {modifyLogs.length > 0 ? (
              <ul className="space-y-2">
                {modifyLogs.map((log, index) => (
                  <li key={index} className="space-y-1 border-b border-[#232D39]/5 pb-2 last:border-0">
                    <p className="font-medium text-[#232D39]">{log.fieldLabel}</p>
                    <p className="text-[#232D39]/70">
                      <span className="line-through">{log.beforeValue}</span>
                      <span className="mx-1 text-[#232D39]/40">→</span>
                      <span className="font-medium text-blue-600">{log.afterValue}</span>
                    </p>
                    <p className="text-[11px] text-[#232D39]/50">
                      {log.operator} · {log.operatedAt}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-[#232D39]/40">暂无单据修改记录</p>
            )}
          </section>
        )}

        {/* 资料管理 */}
        {tab === "documents" && (
          <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
            <DocumentManagementTab
              orderNo={record.id}
              orderType="transfer"
              ownerName={record.ownerName}
              warehouseName={record.repoNames}
              onToast={showToast}
            />
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

function statusTypeLabel(record: MovingRecordItem): string {
  if (record.refType === 1) {
    if (record.pledgeType === 2) return "仓单移库"
    return record.applyType === 1 ? "抵押移库" : "质押移库"
  }
  return record.flowType === "NORMAL" ? "普通移库" : "存货移库"
}
