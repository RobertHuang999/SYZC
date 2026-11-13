import { cn } from "@/lib/utils"
import {
  CANNED_INBOUND_RECEIPT_PREVIEW,
  CANNED_OUTBOUND_RECEIPT_PREVIEW,
  RECEIPT_PREVIEW_PAGE_COUNT,
  RECEIPT_PREVIEW_WATERMARK,
  sliceReceiptPreviewRows,
} from "@prototype/shared/receipt-print/receipt-print-preview-template"
import type { ReceiptPaperSize } from "./receipt-print-ui-labels"
import type {
  InboundReceiptGoodsRow,
  InboundReceiptPrintData,
  OutboundReceiptGoodsRow,
  OutboundReceiptPrintData,
} from "./receipt-print-types"

const TABLE_CELL_STYLE =
  "border border-black px-2 py-1.5 text-[11.5px] leading-snug text-black align-middle"
const TABLE_HEAD_STYLE =
  "border border-black px-2 py-1.5 text-[11.5px] font-bold leading-snug text-black align-middle bg-white"

type SheetPage = {
  pageIndex: number
  pageCount: number
  isLast: boolean
}

function TractorFeedHoles({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "no-print pointer-events-none absolute top-0 bottom-0 flex w-[26px] flex-col items-center justify-between border-black/20 py-3",
        side === "left" ? "left-0 border-r border-dashed" : "right-0 border-l border-dashed"
      )}
      aria-hidden="true"
    >
      {Array.from({ length: 11 }).map((_, idx) => (
        <span
          key={idx}
          className="size-2.5 rounded-full border border-neutral-400 bg-neutral-100 shadow-inner"
        />
      ))}
    </div>
  )
}

function formatReceiptTotalQuantity(data: {
  totalQuantityFormatted: string
  totalUnit: string
}) {
  if (!data.totalUnit || data.totalUnit === "--") return data.totalQuantityFormatted
  return `${data.totalQuantityFormatted} ${data.totalUnit}`
}

function isMixedUnitTotal(data: { totalUnit: string }) {
  return !data.totalUnit || data.totalUnit === "--"
}

function MixedAwareQtyUnitCells({
  data,
  qtyClass,
  unitClass,
  unitColSpan = 1,
}: {
  data: { totalQuantityFormatted: string; totalUnit: string }
  qtyClass: string
  unitClass: string
  unitColSpan?: number
}) {
  if (isMixedUnitTotal(data)) {
    return (
      <td colSpan={1 + unitColSpan} className={qtyClass}>
        {data.totalQuantityFormatted}
      </td>
    )
  }
  return (
    <>
      <td className={qtyClass}>{data.totalQuantityFormatted}</td>
      <td colSpan={unitColSpan} className={unitClass}>
        {data.totalUnit}
      </td>
    </>
  )
}

function BlankPricePlaceholder() {
  return (
    <span className="no-print text-[11px] text-neutral-500 select-none">
      [ 空白 ]
    </span>
  )
}

function SchematicWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 -rotate-[22deg] select-none text-[72px] font-black tracking-[0.4em] text-red-600/15">
        {RECEIPT_PREVIEW_WATERMARK}
      </div>
    </div>
  )
}

function BlankSignDate() {
  return <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
}

function SignOrStampBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border border-dashed border-black text-[11px]",
        className ?? "h-14"
      )}
    >
      【签字或盖章】
    </div>
  )
}

function PageFooter({
  page,
  continued,
}: {
  page: SheetPage
  continued?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-t border-black pt-2 text-[11px]">
      <span>
        第 {page.pageIndex} 页 / 共 {page.pageCount} 页
      </span>
      <span>{continued ? "接下页" : ""}</span>
    </div>
  )
}

function ContinuationBanner({ title }: { title: string }) {
  return (
    <div className="border-b border-black pb-2 text-center text-[13px] font-bold tracking-wide">
      {title}（续页）
    </div>
  )
}

/** 3.1 入库单 - A4 纵向完整版 */
function InboundSheetA4({
  data,
  rows,
  page,
}: {
  data: InboundReceiptPrintData
  rows: InboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative flex min-h-[960px] flex-col justify-between overflow-hidden border border-black p-7 text-[12px] leading-relaxed text-black">
      <SchematicWatermark />
      <div className="relative z-0 space-y-3">
        {page.pageIndex === 1 ? (
          <>
            <div className="pb-2 text-center">
              <div className="text-[16px] font-bold tracking-wider text-black">{data.systemName}</div>
              <div className="mt-1 text-[22px] font-black tracking-[0.35em] text-black">
                入 库 单 据
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 border-b border-black pb-3 text-[12px]">
              <div>
                <span className="font-semibold">入库单号：</span>
                <span>{data.orderNo}</span>
              </div>
              <div>
                <span className="font-semibold">入库日期：</span>
                <span>{data.inboundDate}</span>
              </div>
              <div>
                <span className="font-semibold">入库类型：</span>
                <span>{data.inboundType}</span>
              </div>
              <div>
                <span className="font-semibold">入库仓库：</span>
                <span>{data.warehouseName}</span>
              </div>
              <div>
                <span className="font-semibold">关联单号：</span>
                <span>{data.relatedOrderNo}</span>
              </div>
              <div>
                <span className="font-semibold">制 单 人：</span>
                <span>{data.creatorName}</span>
              </div>
            </div>
            <div className="space-y-1.5 border-b border-black pb-3">
              <div className="text-[12px] font-bold">[ 货主主体信息 ]</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
                <div>
                  <span className="font-semibold">货主主体：</span>
                  <span>{data.ownerName}</span>
                </div>
                <div>
                  <span className="font-semibold">货主类型：</span>
                  <span>{data.ownerTypeLabel}</span>
                </div>
                <div>
                  <span className="font-semibold">统一社会信用代码/证号：</span>
                  <span>{data.ownerCredentialPlain}</span>
                </div>
                <div>
                  <span className="font-semibold">联系电话：</span>
                  <span>{data.ownerPhonePlain}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-[16px] font-bold">{data.systemName}</div>
            <ContinuationBanner title="入库单据" />
            <div className="grid grid-cols-2 gap-x-6 text-[12px]">
              <div>入库单号：{data.orderNo}</div>
              <div>入库仓库：{data.warehouseName}</div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <div className="text-[12px] font-bold">
            [ 入库货品明细 (一级货品汇总){page.pageIndex === 1 ? "" : " · 续"} ]
          </div>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className={cn(TABLE_HEAD_STYLE, "w-12 text-center")}>序号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[22%] text-left")}>货品名称</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[22%] text-left")}>规格型号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[14%] text-right")}>入库数量</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-12 text-center")}>单位</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[18%] text-left")}>入库收集信息</th>
                <th className={cn(TABLE_HEAD_STYLE, " text-left")}>备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.index}>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.index}</td>
                  <td className={TABLE_CELL_STYLE}>{row.goodsName}</td>
                  <td className={TABLE_CELL_STYLE}>{row.specModel}</td>
                  <td className={cn(TABLE_CELL_STYLE, "text-right font-medium")}>
                    {row.quantityFormatted}
                  </td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.unit}</td>
                  <td className={TABLE_CELL_STYLE}>{row.batchOrExtra}</td>
                  <td className={TABLE_CELL_STYLE}>{row.remark}</td>
                </tr>
              ))}
              {page.isLast ? (
                <tr className="font-bold">
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                  <td colSpan={2} className={TABLE_CELL_STYLE}>
                    货品种类数：{data.totalSpeciesCount} 种
                  </td>
                  <MixedAwareQtyUnitCells
                    data={data}
                    qtyClass={cn(TABLE_CELL_STYLE, "text-right")}
                    unitClass={cn(TABLE_CELL_STYLE, "text-center")}
                  />
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                  <td className={TABLE_CELL_STYLE}></td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className={cn(TABLE_CELL_STYLE, "text-center text-neutral-700")}>
                    货品较多，其余见续页
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {page.isLast ? (
            <div className="pt-0.5 text-[12px] font-semibold">
              入库数量大写合计：{data.totalQuantityChineseUpper}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-0 space-y-4 pt-3">
        {page.isLast ? (
          <>
            <div className="text-[12px] font-bold">[ 现场验收交接签章 ]</div>
            <div className="grid grid-cols-3 gap-6 text-[12px]">
              <div className="space-y-1.5">
                <div className="font-semibold">制单人员：{data.creatorName}</div>
                <div>日期：{data.inboundDateChinese}</div>
                <div className="h-14" />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">仓库保管员(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">送货承运人(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">货主确认代表(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">监管员/复核员(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">货主单位(公章/业务章)：</div>
                <div className="h-[18px]" />
                <SignOrStampBox />
              </div>
            </div>
          </>
        ) : null}
        <PageFooter page={page} continued={!page.isLast} />
      </div>
    </div>
  )
}

/** 3.2 入库单 - A5 横向便携版 */
function InboundSheetA5({
  data,
  rows,
  page,
}: {
  data: InboundReceiptPrintData
  rows: InboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden border border-black p-5 text-[11.5px] leading-snug text-black">
      <SchematicWatermark />
      <div className="relative z-0 space-y-2.5">
        {page.pageIndex === 1 ? (
          <>
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[15px] font-bold tracking-wide">
                {data.systemName} · 入库单据
              </span>
              <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
            </div>
            <div className="space-y-1 border-b border-black pb-2 text-[11.5px]">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="font-semibold">入库日期：</span>
                  <span>{data.inboundDateShort}</span>
                </div>
                <div>
                  <span className="font-semibold">入库类型：</span>
                  <span>{data.inboundType}</span>
                </div>
                <div>
                  <span className="font-semibold">监管仓库：</span>
                  <span>{data.warehouseName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold">货主名称：</span>
                  <span>{data.ownerName}</span>
                </div>
                <div>
                  <span className="font-semibold">货主证号：</span>
                  <span>{data.ownerCredentialPlain}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold">货主电话：</span>
                  <span>{data.ownerPhonePlain}</span>
                </div>
                <div>
                  <span className="font-semibold">制 单 人：</span>
                  <span>{data.creatorName}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[15px] font-bold">{data.systemName} · 入库单据（续页）</span>
              <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
            </div>
          </>
        )}

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className={cn(TABLE_HEAD_STYLE, "w-10 text-center")}>序号</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[22%] text-left")}>货品名称</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[22%] text-left")}>规格型号</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[13%] text-right")}>入库数量</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-11 text-center")}>单位</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[18%] text-left")}>入库收集信息</th>
              <th className={cn(TABLE_HEAD_STYLE, "text-left")}>备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.index}>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.index}</td>
                <td className={TABLE_CELL_STYLE}>{row.goodsName}</td>
                <td className={TABLE_CELL_STYLE}>{row.specModel}</td>
                <td className={cn(TABLE_CELL_STYLE, "text-right font-medium")}>
                  {row.quantityFormatted}
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.unit}</td>
                <td className={TABLE_CELL_STYLE}>{row.batchOrExtra}</td>
                <td className={TABLE_CELL_STYLE}>{row.remark}</td>
              </tr>
            ))}
            {page.isLast ? (
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td className={TABLE_CELL_STYLE}>货品种类：{data.totalSpeciesCount} 种</td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  数量大写：{data.totalQuantityChineseUpper}
                </td>
                <td colSpan={3} className={TABLE_CELL_STYLE}>
                  合计数量：{formatReceiptTotalQuantity(data)}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={7} className={cn(TABLE_CELL_STYLE, "text-center")}>
                  货品较多，其余见续页
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="relative z-0 space-y-2 border-t border-black pt-2.5">
        {page.isLast ? (
          <div className="grid grid-cols-4 gap-3 text-[11px]">
            <div className="space-y-1">
              <div className="font-semibold">仓管员(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">送货人(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">货主代表(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">货主盖章/捺印：</div>
              <div className="h-[15px]" />
              <SignOrStampBox className="h-10" />
            </div>
          </div>
        ) : null}
        <PageFooter page={page} continued={!page.isLast} />
      </div>
    </div>
  )
}

/** 3.3 入库单 - 针式连续纸二等分版 */
function InboundSheetContinuous({
  data,
  rows,
  page,
}: {
  data: InboundReceiptPrintData
  rows: InboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative px-[34px] py-3">
      <TractorFeedHoles side="left" />
      <TractorFeedHoles side="right" />
      <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden border border-black text-[11.5px] leading-snug text-black">
        <SchematicWatermark />
        <div className="relative z-0">
          {page.pageIndex === 1 ? (
            <div className="space-y-1 border-b border-black px-3 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-[13.5px] font-bold">{data.systemNameCompact} · 入库单</div>
                <div className="font-semibold">单号：{data.orderNo}</div>
                <div className="text-right">业务日期：{data.inboundDateShort}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>货主：{data.ownerName}</div>
                <div>证号：{data.ownerCredentialPlain}</div>
                <div className="text-right">电话：{data.ownerPhonePlain}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>仓库：{data.warehouseName}</div>
                <div>类型：{data.inboundType}</div>
                <div className="text-right">制单：{data.creatorName}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-black px-3 py-2">
              <div className="font-bold">{data.systemNameCompact} · 入库单（续页）</div>
              <div>单号：{data.orderNo}</div>
            </div>
          )}

          <table className="w-full border-collapse border-b border-black">
            <thead>
              <tr>
                <th className="border-r border-b border-black px-2 py-1 w-11 text-center font-bold">
                  序号
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[22%] text-left font-bold">
                  货品名称
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[22%] text-left font-bold">
                  规格型号
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[14%] text-right font-bold">
                  入库数量
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-11 text-center font-bold">
                  单位
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[18%] text-left font-bold">
                  入库收集信息
                </th>
                <th className="border-b border-black px-2 py-1 text-left font-bold">备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.index}>
                  <td className="border-r border-b border-black px-2 py-1 text-center">{row.index}</td>
                  <td className="border-r border-b border-black px-2 py-1">{row.goodsName}</td>
                  <td className="border-r border-b border-black px-2 py-1">{row.specModel}</td>
                  <td className="border-r border-b border-black px-2 py-1 text-right font-medium">
                    {row.quantityFormatted}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">{row.unit}</td>
                  <td className="border-r border-b border-black px-2 py-1">{row.batchOrExtraCompact}</td>
                  <td className="border-b border-black px-2 py-1">{row.remarkContinuous}</td>
                </tr>
              ))}
              {page.isLast ? (
                <tr className="font-bold">
                  <td colSpan={3} className="border-r border-black px-2 py-1.5">
                    合计：种类 {data.totalSpeciesCount} 种 &nbsp;&nbsp;大写：
                    {data.totalQuantityChineseUpper}
                  </td>
                  <MixedAwareQtyUnitCells
                    data={data}
                    qtyClass="border-r border-black px-2 py-1.5 text-right"
                    unitClass="px-2 py-1.5"
                    unitColSpan={3}
                  />
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="px-2 py-1.5 text-center">
                    货品较多，其余见续页
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="relative z-0 space-y-2 px-3 py-2">
          {page.isLast ? (
            <div className="grid grid-cols-4 items-end gap-3 text-[11px]">
              <div className="space-y-2">
                <div className="font-semibold">仓管验收(手签)：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold">送货交接(手签)：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold">货主签章：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <SignOrStampBox className="h-11" />
            </div>
          ) : null}
          <PageFooter page={page} continued={!page.isLast} />
        </div>
      </div>
    </div>
  )
}

/** 4.1 出库单 - A4 纵向完整版 */
function OutboundSheetA4({
  data,
  rows,
  page,
}: {
  data: OutboundReceiptPrintData
  rows: OutboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative flex min-h-[960px] flex-col justify-between overflow-hidden border border-black p-7 text-[12px] leading-relaxed text-black">
      <SchematicWatermark />
      <div className="relative z-0 space-y-3">
        {page.pageIndex === 1 ? (
          <>
            <div className="pb-2 text-center">
              <div className="text-[16px] font-bold tracking-wider text-black">{data.systemName}</div>
              <div className="mt-1 text-[22px] font-black tracking-[0.35em] text-black">
                出 库 单 据
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 border-b border-black pb-3 text-[12px]">
              <div>
                <span className="font-semibold">出库单号：</span>
                <span>{data.orderNo}</span>
              </div>
              <div>
                <span className="font-semibold">出库日期：</span>
                <span>{data.outboundDate}</span>
              </div>
              <div>
                <span className="font-semibold">业务类型：</span>
                <span>{data.outboundType}</span>
              </div>
              <div>
                <span className="font-semibold">监管仓库：</span>
                <span>{data.warehouseName}</span>
              </div>
              <div>
                <span className="font-semibold">关联单号：</span>
                <span>{data.relatedOrderNo}</span>
              </div>
              <div>
                <span className="font-semibold">制 单 人：</span>
                <span>{data.creatorName}</span>
              </div>
            </div>
            <div className="space-y-1.5 border-b border-black pb-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
                <div>
                  <span className="font-semibold">货主主体：</span>
                  <span>{data.ownerName}</span>
                </div>
                <div>
                  <span className="font-semibold">证件号码：</span>
                  <span>{data.ownerCredentialPlain}</span>
                </div>
                <div>
                  <span className="font-semibold">货主类型：</span>
                  <span>{data.ownerTypeLabel}</span>
                </div>
                <div>
                  <span className="font-semibold">联系电话：</span>
                  <span>{data.ownerPhonePlain}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 border-b border-black pb-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
                <div>
                  <span className="font-semibold">提 货 人：</span>
                  <span>{data.pickupPersonName}</span>
                </div>
                <div>
                  <span className="font-semibold">联系电话：</span>
                  <span>{data.pickupPhonePlain}</span>
                </div>
                <div>
                  <span className="font-semibold">身份证号：</span>
                  <span>{data.pickupIdCardPlain}</span>
                </div>
                <div>
                  <span className="font-semibold">提货车牌：</span>
                  <span>{data.pickupPlateNo}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-[16px] font-bold">{data.systemName}</div>
            <ContinuationBanner title="出库单据" />
            <div className="grid grid-cols-2 gap-x-6 text-[12px]">
              <div>出库单号：{data.orderNo}</div>
              <div>监管仓库：{data.warehouseName}</div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className={cn(TABLE_HEAD_STYLE, "w-12 text-center")}>序号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[18%] text-left")}>货品名称</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[18%] text-left")}>规格型号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[12%] text-right")}>出库数量</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-12 text-center")}>单位</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[10%] text-center")}>单价</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[12%] text-center")}>货物价值</th>
                <th className={cn(TABLE_HEAD_STYLE, "text-left")}>备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.index}>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.index}</td>
                  <td className={TABLE_CELL_STYLE}>{row.goodsName}</td>
                  <td className={TABLE_CELL_STYLE}>{row.specModel}</td>
                  <td className={cn(TABLE_CELL_STYLE, "text-right font-medium")}>
                    {row.quantityFormatted}
                  </td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.unit}</td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                    <BlankPricePlaceholder />
                  </td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                    <BlankPricePlaceholder />
                  </td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                    <BlankPricePlaceholder />
                  </td>
                </tr>
              ))}
              {page.isLast ? (
                <tr className="font-bold">
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                  <td colSpan={2} className={TABLE_CELL_STYLE}>
                    货品种类数：{data.totalSpeciesCount} 种
                  </td>
                  <MixedAwareQtyUnitCells
                    data={data}
                    qtyClass={cn(TABLE_CELL_STYLE, "text-right")}
                    unitClass={cn(TABLE_CELL_STYLE, "text-center")}
                  />
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                  <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                  <td className={TABLE_CELL_STYLE}></td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={8} className={cn(TABLE_CELL_STYLE, "text-center")}>
                    货品较多，其余见续页
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {page.isLast ? (
            <div className="pt-0.5 text-[12px] font-semibold">
              出库数量大写合计：{data.totalQuantityChineseUpper}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-0 space-y-4 pt-3">
        {page.isLast ? (
          <>
            <div className="text-[12px] font-bold">[ 现场出库交接签章 ]</div>
            <div className="grid grid-cols-3 gap-6 text-[12px]">
              <div className="space-y-1.5">
                <div className="font-semibold">制单人员：{data.creatorName}</div>
                <div>日期：{data.outboundDateChinese}</div>
                <div className="h-14" />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">仓管发货人(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">提货承运人(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">现场复核员(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">门卫放行确认(签字)：</div>
                <BlankSignDate />
                <SignOrStampBox />
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold">货权方授权确认(盖章)：</div>
                <div className="h-[18px]" />
                <SignOrStampBox />
              </div>
            </div>
          </>
        ) : null}
        <PageFooter page={page} continued={!page.isLast} />
      </div>
    </div>
  )
}

/** 4.2 出库单 - A5 横向便携版 */
function OutboundSheetA5({
  data,
  rows,
  page,
}: {
  data: OutboundReceiptPrintData
  rows: OutboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden border border-black p-5 text-[11.5px] leading-snug text-black">
      <SchematicWatermark />
      <div className="relative z-0 space-y-2">
        {page.pageIndex === 1 ? (
          <>
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[15px] font-bold tracking-wide">
                {data.systemName} · 出库单据
              </span>
              <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
            </div>
            <div className="space-y-1 border-b border-black pb-2 text-[11.5px]">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="font-semibold">出库日期：</span>
                  <span>{data.outboundDateShort}</span>
                </div>
                <div>
                  <span className="font-semibold">业务类型：</span>
                  <span>{data.outboundType}</span>
                </div>
                <div>
                  <span className="font-semibold">监管仓库：</span>
                  <span>{data.warehouseName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold">货主名称：</span>
                  <span>{data.ownerName}</span>
                </div>
                <div>
                  <span className="font-semibold">货主证号：</span>
                  <span>{data.ownerCredentialPlain}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="font-semibold">货主电话：</span>
                  <span>{data.ownerPhonePlain}</span>
                </div>
                <div>
                  <span className="font-semibold">关联单号：</span>
                  <span>{data.relatedOrderNo}</span>
                </div>
                <div>
                  <span className="font-semibold">制 单 人：</span>
                  <span>{data.creatorName}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-black pb-2 text-[11.5px]">
              <div>
                <span className="font-semibold">提货人：</span>
                <span>
                  {data.pickupPersonName} ({data.pickupPhonePlain})
                </span>
              </div>
              <div>
                <span className="font-semibold">身份证号：</span>
                <span>{data.pickupIdCardPlain}</span>
              </div>
              <div>
                <span className="font-semibold">车牌号：</span>
                <span>{data.pickupPlateNo}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="text-[15px] font-bold">{data.systemName} · 出库单据（续页）</span>
            <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
          </div>
        )}

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className={cn(TABLE_HEAD_STYLE, "w-10 text-center")}>序号</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[21%] text-left")}>货品名称</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[21%] text-left")}>规格型号</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[13%] text-right")}>出库数量</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-10 text-center")}>单位</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[10%] text-center")}>单价</th>
              <th className={cn(TABLE_HEAD_STYLE, "w-[10%] text-center")}>货物价值</th>
              <th className={cn(TABLE_HEAD_STYLE, "text-left")}>备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.index}>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.index}</td>
                <td className={TABLE_CELL_STYLE}>{row.goodsName}</td>
                <td className={TABLE_CELL_STYLE}>{row.specModel}</td>
                <td className={cn(TABLE_CELL_STYLE, "text-right font-medium")}>
                  {row.quantityFormatted}
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{row.unit}</td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                  <BlankPricePlaceholder />
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                  <BlankPricePlaceholder />
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>
                  <BlankPricePlaceholder />
                </td>
              </tr>
            ))}
            {page.isLast ? (
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td className={TABLE_CELL_STYLE}>货品种类：{data.totalSpeciesCount} 种</td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  数量大写：{data.totalQuantityChineseUpper}
                </td>
                <td colSpan={4} className={TABLE_CELL_STYLE}>
                  合计数量：{formatReceiptTotalQuantity(data)}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={8} className={cn(TABLE_CELL_STYLE, "text-center")}>
                  货品较多，其余见续页
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="relative z-0 space-y-2 border-t border-black pt-2">
        {page.isLast ? (
          <div className="grid grid-cols-4 gap-3 text-[11px]">
            <div className="space-y-1">
              <div className="font-semibold">仓管发货(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">提货司机(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">复核员(签字)：</div>
              <BlankSignDate />
              <SignOrStampBox className="h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">提货人/货主盖章捺印：</div>
              <div className="h-[15px]" />
              <SignOrStampBox className="h-10" />
            </div>
          </div>
        ) : null}
        <PageFooter page={page} continued={!page.isLast} />
      </div>
    </div>
  )
}

/** 4.3 出库单 - 针式连续纸二等分版 */
function OutboundSheetContinuous({
  data,
  rows,
  page,
}: {
  data: OutboundReceiptPrintData
  rows: OutboundReceiptGoodsRow[]
  page: SheetPage
}) {
  return (
    <div className="relative px-[34px] py-3">
      <TractorFeedHoles side="left" />
      <TractorFeedHoles side="right" />
      <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden border border-black text-[11.5px] leading-snug text-black">
        <SchematicWatermark />
        <div className="relative z-0">
          {page.pageIndex === 1 ? (
            <div className="space-y-1 border-b border-black px-3 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-[13.5px] font-bold">{data.systemNameCompact} · 出库单</div>
                <div className="font-semibold">单号：{data.orderNo}</div>
                <div className="text-right">业务日期：{data.outboundDateShort}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>货主：{data.ownerName}</div>
                <div>证号：{data.ownerCredentialPlain}</div>
                <div className="text-right">电话：{data.ownerPhonePlain}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>仓库：{data.warehouseName}</div>
                <div>类型：{data.outboundType}</div>
                <div className="text-right">制单：{data.creatorName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  提货人：{data.pickupPersonName} ({data.pickupPhonePlain})
                </div>
                <div>身份证：{data.pickupIdCardPlain}</div>
                <div className="text-right">车牌：{data.pickupPlateNo}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-black px-3 py-2">
              <div className="font-bold">{data.systemNameCompact} · 出库单（续页）</div>
              <div>单号：{data.orderNo}</div>
            </div>
          )}

          <table className="w-full border-collapse border-b border-black">
            <thead>
              <tr>
                <th className="border-r border-b border-black px-2 py-1 w-10 text-center font-bold">
                  序号
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[21%] text-left font-bold">
                  货品名称
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[21%] text-left font-bold">
                  规格型号
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[13%] text-right font-bold">
                  出库数量
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-10 text-center font-bold">
                  单位
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[10%] text-center font-bold">
                  单价
                </th>
                <th className="border-r border-b border-black px-2 py-1 w-[10%] text-center font-bold">
                  货物价值
                </th>
                <th className="border-b border-black px-2 py-1 text-left font-bold">备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.index}>
                  <td className="border-r border-b border-black px-2 py-1 text-center">{row.index}</td>
                  <td className="border-r border-b border-black px-2 py-1">{row.goodsName}</td>
                  <td className="border-r border-b border-black px-2 py-1">{row.specModel}</td>
                  <td className="border-r border-b border-black px-2 py-1 text-right font-medium">
                    {row.quantityFormatted}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">{row.unit}</td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    <BlankPricePlaceholder />
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    <BlankPricePlaceholder />
                  </td>
                  <td className="border-b border-black px-2 py-1 text-center">
                    <BlankPricePlaceholder />
                  </td>
                </tr>
              ))}
              {page.isLast ? (
                <tr className="font-bold">
                  <td colSpan={3} className="border-r border-black px-2 py-1.5">
                    合计：种类 {data.totalSpeciesCount} 种 &nbsp;&nbsp;大写：
                    {data.totalQuantityChineseUpper}
                  </td>
                  <MixedAwareQtyUnitCells
                    data={data}
                    qtyClass="border-r border-black px-2 py-1.5 text-right"
                    unitClass="px-2 py-1.5"
                    unitColSpan={4}
                  />
                </tr>
              ) : (
                <tr>
                  <td colSpan={8} className="px-2 py-1.5 text-center">
                    货品较多，其余见续页
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="relative z-0 space-y-2 px-3 py-2">
          {page.isLast ? (
            <div className="grid grid-cols-4 items-end gap-3 text-[11px]">
              <div className="space-y-2">
                <div className="font-semibold">仓管发货(手签)：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold">提货司机(手签)：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold">门卫核放(手签)：</div>
                <BlankSignDate />
                <SignOrStampBox className="h-9" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold">提货方捺印/盖章：</div>
                <SignOrStampBox className="h-9" />
              </div>
            </div>
          ) : null}
          <PageFooter page={page} continued={!page.isLast} />
        </div>
      </div>
    </div>
  )
}

export const RECEIPT_PAPER_PREVIEW_WIDTH: Record<ReceiptPaperSize, number> = {
  a4: 760,
  a5: 780,
  continuous: 830,
}

function makePage(pageIndex: number): SheetPage {
  return {
    pageIndex,
    pageCount: RECEIPT_PREVIEW_PAGE_COUNT,
    isLast: pageIndex === RECEIPT_PREVIEW_PAGE_COUNT,
  }
}

export function ReceiptPaperSheet(props: {
  kind: "inbound" | "outbound"
  paperSize: ReceiptPaperSize
}) {
  const page1 = makePage(1)
  const page2 = makePage(2)

  if (props.kind === "inbound") {
    const data = CANNED_INBOUND_RECEIPT_PREVIEW as InboundReceiptPrintData
    const sliced = sliceReceiptPreviewRows(data.goodsRows, props.paperSize)
    const Sheet =
      props.paperSize === "a4"
        ? InboundSheetA4
        : props.paperSize === "a5"
          ? InboundSheetA5
          : InboundSheetContinuous
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-2 text-center text-[11px] text-neutral-500">示意第 1 页（续表）</div>
          <Sheet data={data} rows={sliced.first} page={page1} />
        </div>
        <div>
          <div className="mb-2 text-center text-[11px] text-neutral-500">
            示意第 2 页（合计与签章）
          </div>
          <Sheet data={data} rows={sliced.rest} page={page2} />
        </div>
      </div>
    )
  }

  const data = CANNED_OUTBOUND_RECEIPT_PREVIEW as OutboundReceiptPrintData
  const sliced = sliceReceiptPreviewRows(data.goodsRows, props.paperSize)
  const Sheet =
    props.paperSize === "a4"
      ? OutboundSheetA4
      : props.paperSize === "a5"
        ? OutboundSheetA5
        : OutboundSheetContinuous
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 text-center text-[11px] text-neutral-500">示意第 1 页（续表）</div>
        <Sheet data={data} rows={sliced.first} page={page1} />
      </div>
      <div>
        <div className="mb-2 text-center text-[11px] text-neutral-500">示意第 2 页（合计与签章）</div>
        <Sheet data={data} rows={sliced.rest} page={page2} />
      </div>
    </div>
  )
}
