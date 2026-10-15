import { Fragment, useState } from "react"
import { ChevronDown, ChevronRight, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InboundAttachmentDialog,
  type AttachmentDialogData,
} from "@/features/inbound-records/components/InboundAttachmentDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DetailSection } from "@/shared/components/DetailSection"
import {
  stagingLineHasAttachments,
  type StagingDetailGoodsRow,
} from "../lib/staging-detail-display"
type Props = {
  rows: StagingDetailGoodsRow[]
  /** 嵌入详情 Tab 区时不重复包 DetailSection 标题 */
  embedded?: boolean
}

function formatQty(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

function goodsDisplayName(row: StagingDetailGoodsRow) {
  return [row.category, row.variety, row.spec].filter(Boolean).join("-") || "货品"
}

export function StagingDetailGoodsSection({ rows, embedded = false }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rows.map((row, index) => [row.id, index === 0 || row.stackings.length > 0])),
  )
  const [attachmentData, setAttachmentData] = useState<AttachmentDialogData | null>(null)

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const openAttachments = (row: StagingDetailGoodsRow) => {
    setAttachmentData({
      goodsName: goodsDisplayName(row),
      scenePhotos: row.attachments.scenePhotos,
      supplementaryImages: row.attachments.supplementaryImages,
      supplementaryDocuments: row.attachments.supplementaryDocuments,
      capturePhotos: [],
    })
  }

  const tableBlock =
    rows.length === 0 ? (
      <p className="py-8 text-center text-sm text-muted-foreground">暂无货品明细</p>
    ) : (
      <div className="overflow-hidden rounded-md border bg-card">
        <Table className="table-fixed w-full min-w-[960px]">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
              <TableHead className="w-9 text-center" />
              <TableHead className="w-10 text-center">序号</TableHead>
              <TableHead className="w-[10%]">货品大类</TableHead>
              <TableHead className="w-[10%]">货品品类</TableHead>
              <TableHead className="w-[14%]">货品规格</TableHead>
              <TableHead className="w-[11%] text-right">申报数量</TableHead>
              <TableHead className="w-[6%] text-center">单位</TableHead>
              <TableHead className="w-[11%] text-right">堆放总数</TableHead>
              <TableHead className="w-[12%] text-right">未堆放数</TableHead>
              <TableHead className="min-w-[120px]">货品备注</TableHead>
              <TableHead className="w-[88px] text-center">附件信息</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {rows.map((row, index) => {
              const open = expanded[row.id] ?? false
              const weakHint = row.unstackedQty > 0

              return (
                <Fragment key={row.id}>
                  <TableRow className="align-middle hover:bg-muted/20">
                    <TableCell className="align-middle p-2 text-center">
                      <button
                        type="button"
                        className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                        title={open ? "收起堆放位置" : "展开堆放位置"}
                        onClick={() => toggle(row.id)}
                      >
                        {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="align-middle text-center text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5 font-medium text-foreground">
                      {row.category || "—"}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5">
                      {row.variety || "—"}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5">
                      {row.spec || "—"}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5 text-right font-semibold text-primary tabular-nums">
                      {formatQty(row.declaredQty)}
                    </TableCell>
                    <TableCell className="align-middle text-center text-muted-foreground">
                      {row.unit}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5 text-right tabular-nums">
                      {formatQty(row.stackedQty)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-normal align-middle py-2.5 text-right tabular-nums",
                        weakHint ? "font-medium text-amber-700" : "text-foreground",
                      )}
                    >
                      {formatQty(row.unstackedQty)}
                      {weakHint ? (
                        <span className="mt-0.5 block text-[10px] font-normal text-amber-600/90">
                          暂存弱提示
                        </span>
                      ) : (
                        <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                          已全部分配
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-normal align-middle py-2.5 text-muted-foreground">
                      <span className="line-clamp-2 break-words leading-snug">{row.remark || "—"}</span>
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      {stagingLineHasAttachments(row) ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary hover:bg-primary/5 hover:underline"
                          onClick={() => openAttachments(row)}
                        >
                          <Paperclip className="mr-1 size-3.5" />
                          查看附件
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {open ? (
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableCell colSpan={11} className="p-3 pl-12 pr-6">
                        {row.stackings.length > 0 ? (
                          <div className="rounded-md border bg-card p-3 shadow-2xs">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-foreground">
                                二级库位分配明细 ({row.stackings.length} 处)
                              </span>
                              <span className="text-muted-foreground">
                                合计堆放：{formatQty(row.stackedQty)} {row.unit}
                              </span>
                            </div>
                            <Table className="table-fixed w-full bg-background text-xs">
                              <TableHeader>
                                <TableRow className="bg-muted/40 text-[11px]">
                                  <TableHead className="w-10 text-center">序号</TableHead>
                                  <TableHead className="w-[22%]">堆放库房</TableHead>
                                  <TableHead className="w-[22%]">堆放分区</TableHead>
                                  <TableHead className="w-[24%]">具体位置</TableHead>
                                  <TableHead className="w-[14%] text-right">堆放数量</TableHead>
                                  <TableHead className="w-[14%]">堆放状态</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {row.stackings.map((stack, sIdx) => (
                                  <TableRow key={`${row.id}-s${sIdx}`} className="align-middle hover:bg-muted/20">
                                    <TableCell className="text-center text-muted-foreground">
                                      {sIdx + 1}
                                    </TableCell>
                                    <TableCell className="whitespace-normal py-2">
                                      <span className="line-clamp-2 leading-snug">{stack.storeroom}</span>
                                    </TableCell>
                                    <TableCell className="whitespace-normal py-2">
                                      <span className="line-clamp-2 leading-snug">{stack.partition}</span>
                                    </TableCell>
                                    <TableCell className="whitespace-normal py-2 font-medium text-foreground">
                                      <span className="line-clamp-2 break-words leading-snug">
                                        {stack.location || "—"}
                                      </span>
                                    </TableCell>
                                    <TableCell className="whitespace-normal py-2 text-right font-semibold text-primary tabular-nums">
                                      {formatQty(stack.quantity)} {row.unit}
                                    </TableCell>
                                    <TableCell className="whitespace-normal py-2 text-muted-foreground">
                                      {stack.status}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="rounded-md border border-dashed border-amber-200 bg-amber-50/60 px-3 py-3 text-xs leading-relaxed text-amber-900">
                            待理货定垛 · 暂未分配具体库位（暂存允许保存 P04；转正提交前须清零未堆放数 R13）
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )

  return (
    <>
      {embedded ? (
        <div className="space-y-4">{tableBlock}</div>
      ) : (
        <DetailSection title="货品与堆放明细">
          <div className="col-span-full">{tableBlock}</div>
        </DetailSection>
      )}

      <InboundAttachmentDialog
        open={attachmentData !== null}
        data={attachmentData}
        onClose={() => setAttachmentData(null)}
      />
    </>
  )
}
