import { useState } from "react"
import { ChevronDown, ChevronUp, Eye, FileText, Package } from "lucide-react"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MobilePdfModal } from "@/features/inbound-records/components/MobilePdfModal"
import {
  buildStagingDetailGoodsRows,
  stagingLineHasAttachments,
  type StagingDetailGoodsRow,
} from "@prototype/shared/inbound/staging-detail-goods"
import type { InboundStagingReg } from "@prototype/shared/inbound/inbound-staging.mock"

function formatQty(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

function StagingGoodsLineCard({
  index,
  row,
  expanded,
  onToggle,
  onOpenPhotos,
  onOpenPdf,
}: {
  index: number
  row: StagingDetailGoodsRow
  expanded: boolean
  onToggle: () => void
  onOpenPhotos: (urls: string[], initialIndex: number) => void
  onOpenPdf: (payload: { name: string; size?: string }) => void
}) {
  const { attachments } = row
  const goodsSummary = [row.category, row.variety, row.spec].filter(Boolean).join(" · ")
  const weakHint = row.unstackedQty > 0

  return (
    <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-3">
      <div className="flex items-center justify-between text-xs text-[#232D39]/60">
        <span className="text-[11px]">货品{index + 1}</span>
        <button type="button" onClick={onToggle} className="text-[#232D39]/60 cursor-pointer">
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex size-4 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h4 className="font-semibold text-sm text-[#232D39] leading-snug">{goodsSummary || "—"}</h4>
      </div>

      {expanded ? (
        <div className="space-y-3 pt-1">
          <div className="overflow-hidden rounded-lg border border-[#232D39]/10 divide-y divide-[#232D39]/10 text-xs">
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">货品大类</span>
              <span className="text-right text-[#232D39]">{row.category || "—"}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">货品品类</span>
              <span className="text-right text-[#232D39]">{row.variety || "—"}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">货品规格</span>
              <span className="text-right text-[#232D39]">{row.spec || "—"}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">申报数量</span>
              <span className="font-medium text-[#232D39]">
                {formatQty(row.declaredQty)} {row.unit}
              </span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">堆放总数</span>
              <span className="font-medium text-[#232D39]">{formatQty(row.stackedQty)}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">未堆放数</span>
              <span
                className={
                  weakHint ? "text-right font-medium text-amber-700" : "text-right text-[#232D39]"
                }
              >
                {formatQty(row.unstackedQty)} {row.unit}
                <span className="block text-[10px] font-normal text-[#232D39]/55">
                  {weakHint ? "暂存弱提示" : "已全部分配"}
                </span>
              </span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">货品备注</span>
              <span className="text-right text-[#232D39] leading-relaxed">{row.remark || "——"}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">堆放位置</p>
            {row.stackings.length > 0 ? (
              <div className="space-y-2">
                {row.stackings.map((stack, sIdx) => (
                  <div
                    key={`${row.id}-stack-${sIdx}`}
                    className="rounded-lg bg-[#232D39]/[0.03] border border-[#232D39]/5 p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#232D39]/60">位置{sIdx + 1}</span>
                      <span className="font-bold text-blue-600">
                        {formatQty(stack.quantity)} {row.unit}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#232D39]">
                      {[stack.storeroom, stack.partition, stack.location].filter(Boolean).join("-")}
                    </p>
                    <p className="text-[11px] text-[#232D39]/55">{stack.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-amber-200 bg-amber-50/80 px-2.5 py-2.5 text-center text-xs text-amber-900">
                待理货定垛 · 暂未分配具体库位
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">现场照片</p>
            {attachments.scenePhotos.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {attachments.scenePhotos.map((url, pIdx) => (
                  <button
                    key={`${row.id}-scene-${pIdx}`}
                    type="button"
                    className="size-16 overflow-hidden rounded-lg border border-[#232D39]/10"
                    onClick={() => onOpenPhotos(attachments.scenePhotos, pIdx)}
                  >
                    <img src={url} alt="现场照片" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-[#232D39]/[0.03] py-2 text-center text-xs text-[#232D39]/40">
                暂无现场照片（暂存选填）
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">补充资料</p>
            {attachments.supplementaryImages.length > 0 || attachments.supplementaryDocuments.length > 0 ? (
              <div className="space-y-3">
                {attachments.supplementaryImages.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {attachments.supplementaryImages.map((file, idx) => (
                      <button
                        key={file.url}
                        type="button"
                        className="size-16 overflow-hidden rounded-lg border border-[#232D39]/10"
                        onClick={() =>
                          onOpenPhotos(
                            attachments.supplementaryImages.map((i) => i.url),
                            idx,
                          )
                        }
                      >
                        <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
                {attachments.supplementaryDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {attachments.supplementaryDocuments.map((file) => (
                      <li key={file.url}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2.5 rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-2.5 text-left active:bg-[#232D39]/5"
                          onClick={() => onOpenPdf({ name: file.name, size: file.size })}
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-500">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[#232D39]">{file.name}</p>
                            <p className="text-[10px] text-[#232D39]/50">
                              {file.size || "—"} · PDF 文档
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-blue-600">
                            <Eye className="size-3.5" />
                            预览
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <div className="rounded-md bg-[#232D39]/[0.03] py-2 text-center text-xs text-[#232D39]/40">
                暂无补充资料
              </div>
            )}
          </div>
        </div>
      ) : null}
      {!expanded && stagingLineHasAttachments(row) ? (
        <p className="text-[11px] text-[#232D39]/50">含现场照片或补充资料，展开查看</p>
      ) : null}
    </section>
  )
}

type Props = {
  reg: InboundStagingReg
  /** Tab 内嵌：对齐入库详情「入库明细」列表，不重复 NativeInfoCard 标题 */
  embedded?: boolean
}

export function StagingDetailGoodsMobile({ reg, embedded = false }: Props) {
  const rows = buildStagingDetailGoodsRows(reg)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rows.map((row, index) => [row.id, index === 0 || row.stackings.length > 0])),
  )
  const [imageModalData, setImageModalData] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  }>({ open: false, images: [], initialIndex: 0 })
  const [pdfModalData, setPdfModalData] = useState<{
    open: boolean
    fileName: string
    fileSize?: string
  }>({ open: false, fileName: "" })

  const goodsList =
    rows.length === 0 ? (
      <p className="py-6 text-center text-xs text-[#232D39]/40">暂无货品明细</p>
    ) : (
      <div className="space-y-2.5">
        {rows.map((row, index) => (
          <StagingGoodsLineCard
            key={row.id}
            index={index}
            row={row}
            expanded={expanded[row.id] ?? false}
            onToggle={() => setExpanded((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
            onOpenPhotos={(images, initialIndex) =>
              setImageModalData({ open: true, images, initialIndex })
            }
            onOpenPdf={(payload) =>
              setPdfModalData({ open: true, fileName: payload.name, fileSize: payload.size })
            }
          />
        ))}
      </div>
    )

  return (
    <>
      {embedded ? (
        goodsList
      ) : (
        <NativeInfoCard title="货品与堆放明细" icon={<Package className="size-5" />}>
          {rows.length === 0 ? (
            <p className="py-3 text-xs text-[#232D39]/55">暂无货品明细</p>
          ) : (
            <div className="space-y-2.5 pb-3">{goodsList}</div>
          )}
        </NativeInfoCard>
      )}

      <MobileImageModal
        open={imageModalData.open}
        images={imageModalData.images}
        initialIndex={imageModalData.initialIndex}
        onClose={() => setImageModalData((prev) => ({ ...prev, open: false }))}
      />
      <MobilePdfModal
        open={pdfModalData.open}
        fileName={pdfModalData.fileName}
        fileSize={pdfModalData.fileSize}
        onClose={() => setPdfModalData((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}
