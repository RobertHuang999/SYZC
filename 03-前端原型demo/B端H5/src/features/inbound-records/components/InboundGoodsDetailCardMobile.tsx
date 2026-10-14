import { ChevronDown, ChevronUp, Eye, FileText, QrCode } from "lucide-react"
import type { InboundGoodsDetailLine } from "../../../../../shared/inbound/build-inbound-detail"

type Props = {
  index: number
  line: InboundGoodsDetailLine
  expanded: boolean
  onToggle: () => void
  onOpenQr: (payload: {
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
  }) => void
  onOpenPhotos: (urls: string[], initialIndex: number) => void
  onOpenPdf: (payload: { name: string; size?: string }) => void
}

export function InboundGoodsDetailCardMobile({
  index,
  line,
  expanded,
  onToggle,
  onOpenQr,
  onOpenPhotos,
  onOpenPdf,
}: Props) {
  const goodsSummary = [line.category, line.variety, line.spec].filter(Boolean).join(" · ")

  return (
    <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-3">
      <div className="flex items-center justify-between text-xs text-[#232D39]/60">
        <span className="text-[11px] truncate max-w-[240px]">
          货品{index + 1}
          {line.skuId ? ` · ${line.skuId}` : ""}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              onOpenQr({
                goodsName: line.name,
                position: line.stacks[0]
                  ? `${line.stacks[0].storeroom} / ${line.stacks[0].zone} / ${line.stacks[0].position}`
                  : "—",
                quantityLabel: line.totalQuantityLabel,
                qrCodeNo: line.stacks[0]?.qrCodeNo ?? line.id,
              })
            }
            className="text-[#232D39]/60 hover:text-blue-600 cursor-pointer"
          >
            <QrCode className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="text-[#232D39]/60 cursor-pointer"
          >
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex size-4 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
          {index + 1}
        </div>
        <h4 className="font-semibold text-sm text-[#232D39] leading-snug">{goodsSummary || line.name}</h4>
      </div>

      {expanded && (
        <div className="space-y-3 pt-1">
          <div className="overflow-hidden rounded-lg border border-[#232D39]/10 divide-y divide-[#232D39]/10 text-xs">
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">入库货品</span>
              <span className="text-right text-[#232D39]">{goodsSummary || "—"}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">{line.measureLabel || "计量数量"}</span>
              <span className="font-medium text-[#232D39]">{line.totalQuantityLabel}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">其他收集信息</span>
              <span className="text-right text-[#232D39] leading-relaxed">{line.otherInfo || "无：--"}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2.5">
              <span className="text-[#232D39]/60 shrink-0">备注信息</span>
              <span className="text-right text-[#232D39]">{line.remark || "——"}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">堆放位置</p>
            <div className="space-y-2">
              {line.stacks.map((stack, sIdx) => (
                <div
                  key={stack.id ?? `${line.id}-stack-${sIdx}`}
                  className="rounded-lg bg-[#232D39]/[0.03] border border-[#232D39]/5 p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#232D39]/60">位置{sIdx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-blue-600">{stack.quantityLabel}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenQr({
                            goodsName: line.name,
                            position: `${stack.storeroom} / ${stack.zone} / ${stack.position}`,
                            quantityLabel: stack.quantityLabel,
                            qrCodeNo: stack.qrCodeNo,
                          })
                        }
                        className="text-[#232D39]/60 hover:text-blue-600 cursor-pointer"
                      >
                        <QrCode className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#232D39]">
                    {[stack.storeroom, stack.zone, stack.position].filter(Boolean).join("-")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">现场照片</p>
            {line.scenePhotos.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {line.scenePhotos.map((url, pIdx) => (
                  <button
                    key={url + pIdx}
                    type="button"
                    className="size-16 rounded-lg overflow-hidden border border-[#232D39]/10"
                    onClick={() => onOpenPhotos(line.scenePhotos, pIdx)}
                  >
                    <img src={url} alt="现场照片" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-[#232D39]/[0.03] py-2 text-center text-xs text-[#232D39]/40">
                暂无现场照片
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">补充资料</p>
            {line.supplementaryImages.length > 0 || line.supplementaryDocuments.length > 0 ? (
              <div className="space-y-3">
                {line.supplementaryImages.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {line.supplementaryImages.map((file, idx) => (
                      <button
                        key={file.url}
                        type="button"
                        className="size-16 overflow-hidden rounded-lg border border-[#232D39]/10"
                        onClick={() =>
                          onOpenPhotos(
                            line.supplementaryImages.map((i) => i.url),
                            idx
                          )
                        }
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
                {line.supplementaryDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {line.supplementaryDocuments.map((file) => (
                      <li key={file.url}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2.5 rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-2.5 text-left active:bg-[#232D39]/5"
                          onClick={() =>
                            onOpenPdf({ name: file.name, size: file.size })
                          }
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-500">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[#232D39]">
                              {file.name}
                            </p>
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

          <div>
            <p className="text-xs text-[#232D39]/60 mb-1.5">设备抓拍图</p>
            {line.iotCaptures.length > 0 ? (
              <div className="space-y-2">
                {line.iotCaptures.map((cap) => (
                  <div
                    key={cap.id}
                    className="flex items-center gap-2 rounded-lg border border-[#232D39]/10 p-2"
                  >
                    {cap.imageUrl ? (
                      <button
                        type="button"
                        className="size-14 shrink-0 overflow-hidden rounded-md border border-[#232D39]/10"
                        onClick={() => onOpenPhotos([cap.imageUrl!], 0)}
                      >
                        <img
                          src={cap.imageUrl}
                          alt={cap.thumbnailLabel}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="size-14 shrink-0 rounded-md bg-[#232D39]/5" />
                    )}
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-medium text-[#232D39]">{cap.deviceName}</p>
                      <p className="text-[#232D39]/60">{cap.capturedAt}</p>
                      <p
                        className={
                          cap.status === "成功" ? "text-emerald-600" : "text-[#232D39]/50"
                        }
                      >
                        {cap.thumbnailLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-[#232D39]/[0.03] py-2 text-center text-xs text-[#232D39]/40">
                抓图失败或无监控设备接入
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
