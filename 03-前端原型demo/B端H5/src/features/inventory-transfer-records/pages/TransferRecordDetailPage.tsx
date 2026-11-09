import { useState } from "react"
import { useParams } from "react-router-dom"
import { ArrowRight, Check, CheckCircle2, Clock, Copy, Package } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { H5_TRANSFER_RECORD_LIST_PATH } from "../domain/constants"
import { mobileTransferRecordsMock } from "../mock/transfer-records.mock"

type TabKey = "goods" | "audit"

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="text-right text-[#232D39]">{value}</span>
    </div>
  )
}

/** 转让详情：字段与页签严格对齐 PC 12-货物转让三件套（制单人/制单时间/接收人/转让人/转让时间/所属仓库/转让原因）。 */
export function TransferRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<TabKey>("goods")

  const record =
    mobileTransferRecordsMock.find((item) => item.id === id) || mobileTransferRecordsMock[0]

  const copyId = () => {
    if (!record) return
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (!record) {
    return (
      <MobileShell>
        <NavBar title="转让详情" backTo={H5_TRANSFER_RECORD_LIST_PATH} />
        <div className="flex h-64 flex-col items-center justify-center text-xs text-[#232D39]/50">
          <p>未找到转让单据</p>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["transfer-h5-detail"]}>
        <NavBar title="转让详情" backTo={H5_TRANSFER_RECORD_LIST_PATH} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-8">
        {/* 摘要卡：PC 基础信息字段 */}
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">转让单号</span>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                已通过
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="break-all text-base font-bold leading-tight text-[#232D39]">
                {record.id}
              </p>
              <button
                type="button"
                onClick={copyId}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow
              label="制单人"
              value={`${record.createByName}（${record.createOrgName}）`}
            />
            <FieldRow label="制单时间" value={record.createTime} />
            <FieldRow
              label="接收人"
              value={
                <>
                  <span className="font-medium text-[#232D39]">
                    {record.targetOwner.ownerName}
                  </span>
                  <span className="ml-1 text-[#232D39]/60">
                    （{record.targetOwner.ownerIdentity}）
                  </span>
                </>
              }
            />
            <FieldRow
              label="转让人"
              value={
                <>
                  <span className="font-medium text-[#232D39]">
                    {record.sourceOwner.ownerName}
                  </span>
                  <span className="ml-1 text-[#232D39]/60">
                    （{record.sourceOwner.ownerIdentity}）
                  </span>
                </>
              }
            />
            <FieldRow label="转让时间" value={record.assignTime} />
            <FieldRow label="所属仓库" value={record.warehouseName} />
          </div>

          <div className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px] leading-relaxed text-[#232D39]/75">
            <span className="mb-1 block text-[#232D39]/45">转让原因</span>
            {record.assignReason || "—"}
          </div>
        </section>

        {/* 货权流向（样式规范第 6 节要求的 A→B 箭头链路） */}
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <h3 className="mb-2 text-xs font-bold text-[#232D39]">货权流向</h3>
          <div className="flex items-center gap-2 rounded-lg bg-[#232D39]/[0.03] p-3">
            <div className="min-w-0 flex-1 text-center">
              <span className="block text-[10px] text-[#232D39]/45">转让人</span>
              <span className="mt-0.5 block text-xs font-semibold text-[#232D39]">
                {record.sourceOwner.ownerName}
              </span>
            </div>
            <ArrowRight className="size-4 shrink-0 text-blue-600" />
            <div className="min-w-0 flex-1 text-center">
              <span className="block text-[10px] text-[#232D39]/45">接收人</span>
              <span className="mt-0.5 block text-xs font-semibold text-blue-600">
                {record.targetOwner.ownerName}
              </span>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[#232D39]/45">
            在仓货权过户，货物不产生物理位移
          </p>
        </section>

        {/* 分页签：与 PC 一致，仅「转让明细 / 审核记录」 */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", `转让明细 (${record.goodsList.length})`],
              ["audit", "审核记录"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
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

        {/* 转让明细：一级货品主行 + 二级储位明细 */}
        {tab === "goods" && (
          <div className="space-y-2.5">
            {record.goodsList.map((goods, index) => (
              <section
                key={goods.id || index}
                className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1.5 font-bold text-[#232D39]">
                      <Package className="size-4 shrink-0 text-blue-600" />
                      <span className="break-all">
                        {index + 1}. {goods.goodsName}
                      </span>
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      [{goods.warehouseName}]
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-[10px] text-[#232D39]/45">转让数量</span>
                    <span className="font-bold text-[#232D39]">
                      {goods.amount.toLocaleString("zh-CN", { maximumFractionDigits: 3 })}{" "}
                      {goods.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-dashed border-[#232D39]/10 pt-2">
                  <span className="text-[10px] text-[#232D39]/45">
                    在仓储位明细（{goods.locations.length} 处）
                  </span>
                  {goods.locations.map((loc, locIndex) => (
                    <div
                      key={loc.id}
                      className="rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 font-medium text-[#232D39]">
                          {locIndex + 1}. {loc.locationName}
                        </span>
                        <span className="shrink-0 font-semibold text-[#232D39]">
                          {loc.amount.toLocaleString("zh-CN", {
                            maximumFractionDigits: 3,
                          })}{" "}
                          {loc.unit}
                        </span>
                      </div>
                      <div className="mt-1 space-y-0.5 text-[#232D39]/65">
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">具体位置</span>
                          <span className="text-right">{loc.specificLocation || "——"}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">入库时间</span>
                          <span className="text-right">{loc.inboundTime}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">其他信息</span>
                          <span className="text-right">{loc.otherInfo || "—"}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">存货条码</span>
                          <span className="break-all text-right">{loc.barcode}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="shrink-0 text-[#232D39]/45">状态</span>
                          <span className="text-right">{loc.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 审核记录：节点 / 处理人（含机构） / 动作 / 时间 / 意见 */}
        {tab === "audit" && (
          <PrototypeAnnotationTarget annotationIds={["transfer-h5-detail-audit"]}>
            <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
              <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
                <Clock className="size-4 text-blue-600" />
                审核记录
              </h3>

              <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
                {record.auditLogs.map((node, index) => {
                  const isLast = index === record.auditLogs.length - 1
                  return (
                    <div key={node.id} className="relative">
                      <div
                        className={`absolute -left-5 top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white text-[10px] text-white ${
                          isLast ? "bg-emerald-500" : "bg-blue-500"
                        }`}
                      >
                        {isLast ? <CheckCircle2 className="size-3" /> : "✓"}
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-[#232D39]">
                          {node.nodeName}
                        </span>
                        <span className="shrink-0 text-[10px] text-[#232D39]/45">
                          {node.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#232D39]/70">
                        处理人：{node.operatorName}（{node.operatorOrg}） ·{" "}
                        <span className="font-medium text-blue-600">
                          {node.actionName}
                        </span>
                      </p>
                      {node.comment && (
                        <p className="mt-1 rounded-lg bg-[#232D39]/[0.03] p-2 text-[11px] text-[#232D39]/70">
                          意见：{node.comment}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </PrototypeAnnotationTarget>
        )}
      </div>
    </MobileShell>
  )
}
