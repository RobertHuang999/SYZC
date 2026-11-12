import { cn } from "@/lib/utils"
import type { ReceiptPaperSize } from "./receipt-print-ui-labels"
import type {
  InboundReceiptPrintData,
  OutboundReceiptPrintData,
} from "./receipt-print-types"

const TABLE_CELL_STYLE =
  "border border-black px-2 py-1.5 text-[11.5px] leading-snug text-black align-middle"
const TABLE_HEAD_STYLE =
  "border border-black px-2 py-1.5 text-[11.5px] font-bold leading-snug text-black align-middle bg-white"

/** 针式连续纸两侧走纸孔带示意（仅屏幕预览可见，打印时 .no-print 隐藏） */
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

function BlankPricePlaceholder() {
  return (
    <span className="no-print text-[11px] text-neutral-500 select-none">
      [ 空白 ]
    </span>
  )
}

/** 3.1 入库单 - A4 纵向完整版 (210mm × 297mm) */
function InboundSheetA4({ data }: { data: InboundReceiptPrintData }) {
  return (
    <div className="flex min-h-[960px] flex-col justify-between border border-black p-7 text-[12px] leading-relaxed text-black">
      <div className="space-y-3">
        {/* 标题区 */}
        <div className="pb-2 text-center">
          <div className="text-[16px] font-bold tracking-wider text-black">
            {data.systemName}
          </div>
          <div className="mt-1 text-[22px] font-black tracking-[0.35em] text-black">
            入 库 单 据
          </div>
        </div>

        {/* 单据头属性 */}
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

        {/* 货主主体信息 */}
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

        {/* 入库货品明细 (一级货品汇总) */}
        <div className="space-y-2 border-b border-black pb-3">
          <div className="text-[12px] font-bold">[ 入库货品明细 (一级货品汇总) ]</div>
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
              {data.goodsRows.map((row) => (
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
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  货品种类数：{data.totalSpeciesCount} 种
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-right")}>
                  {data.totalQuantityFormatted}
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{data.totalUnit}</td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                <td className={TABLE_CELL_STYLE}></td>
              </tr>
            </tbody>
          </table>
          <div className="pt-0.5 text-[12px] font-semibold">
            入库数量大写合计：{data.totalQuantityChineseUpper}
          </div>
        </div>
      </div>

      {/* 现场验收交接签章 */}
      <div className="space-y-4 pt-3">
        <div className="text-[12px] font-bold">[ 现场验收交接签章 ]</div>
        <div className="grid grid-cols-3 gap-6 text-[12px]">
          <div className="space-y-1.5">
            <div className="font-semibold">制单人员：{data.creatorName}</div>
            <div>日期：{data.inboundDateChinese}</div>
            <div className="h-14" />
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">仓库保管员(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 保管员手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">送货承运人(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 送货人手签 ]
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold">货主确认代表(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 货主手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">监管员/复核员(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 监管员手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">货主单位(公章/业务章)：</div>
            <div className="h-[18px]" />
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 盖章区域 ]
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black pt-2 text-[11px]">
          <span>第 1 页 / 共 1 页</span>
          <span>打印时间：{data.printTime}</span>
        </div>
      </div>
    </div>
  )
}

/** 3.2 入库单 - A5 横向便携版 (210mm × 148mm) */
function InboundSheetA5({ data }: { data: InboundReceiptPrintData }) {
  return (
    <div className="flex min-h-[480px] flex-col justify-between border border-black p-5 text-[11.5px] leading-snug text-black">
      <div className="space-y-2.5">
        {/* 紧凑单行抬头 */}
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="text-[15px] font-bold tracking-wide">
            {data.systemName} · 入库单据
          </span>
          <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
        </div>

        {/* 紧凑表头属性 */}
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

        {/* 明细表 */}
        <div>
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
              {data.goodsRows.map((row) => (
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
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td className={TABLE_CELL_STYLE}>
                  货品种类：{data.totalSpeciesCount} 种
                </td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  数量大写：{data.totalQuantityChineseUpper}
                </td>
                <td colSpan={3} className={TABLE_CELL_STYLE}>
                  合计数量：{formatReceiptTotalQuantity(data)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部 4 列横向一排签章 */}
      <div className="space-y-2 border-t border-black pt-2.5">
        <div className="grid grid-cols-4 gap-3 text-[11px]">
          <div className="space-y-1">
            <div className="font-semibold">仓管员(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">送货人(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">货主代表(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">货主盖章/捺印：</div>
            <div className="h-[15px]" />
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 盖章区 ]
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-black pt-1.5 text-[11px]">
          <span>第 1 页 / 共 1 页</span>
          <span>打印时间：{data.printTime}</span>
        </div>
      </div>
    </div>
  )
}

/** 3.3 入库单 - 针式连续纸二等分版 (241mm × 139.5mm · 横向连续走纸) */
function InboundSheetContinuous({ data }: { data: InboundReceiptPrintData }) {
  return (
    <div className="relative px-[34px] py-3">
      <TractorFeedHoles side="left" />
      <TractorFeedHoles side="right" />
      <div className="flex min-h-[430px] flex-col justify-between border border-black text-[11.5px] leading-snug text-black">
        <div>
          {/* 顶部三行紧凑属性头 */}
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

          {/* 实线通栏表格 */}
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
              {data.goodsRows.map((row) => (
                <tr key={row.index}>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    {row.index}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1">
                    {row.goodsName}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1">
                    {row.specModel}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-right font-medium">
                    {row.quantityFormatted}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    {row.unit}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1">
                    {row.batchOrExtraCompact}
                  </td>
                  <td className="border-b border-black px-2 py-1">
                    {row.remarkContinuous}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="border-r border-black px-2 py-1.5">
                  合计：种类 {data.totalSpeciesCount} 种 &nbsp;&nbsp;大写：
                  {data.totalQuantityChineseUpper}
                </td>
                <td className="border-r border-black px-2 py-1.5 text-right">
                  {data.totalQuantityFormatted}
                </td>
                <td colSpan={3} className="px-2 py-1.5">
                  {data.totalUnit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 底部签字与打单时间 */}
        <div className="space-y-2 px-3 py-2">
          <div className="grid grid-cols-4 gap-3 items-end text-[11px]">
            <div className="space-y-2">
              <div className="font-semibold">仓管验收(手签)：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">送货交接(手签)：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">货主签章：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="flex h-11 items-center justify-center border border-dashed border-black text-[11px]">
              [ 盖章/捺印框 ]
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-black pt-1.5 text-[11px]">
            <span>第 1 页 / 共 1 页</span>
            <span>打单：{data.printTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 4.1 出库单 - A4 纵向完整版 (210mm × 297mm) */
function OutboundSheetA4({ data }: { data: OutboundReceiptPrintData }) {
  return (
    <div className="flex min-h-[960px] flex-col justify-between border border-black p-7 text-[12px] leading-relaxed text-black">
      <div className="space-y-3">
        {/* 标题区 */}
        <div className="pb-2 text-center">
          <div className="text-[16px] font-bold tracking-wider text-black">
            {data.systemName}
          </div>
          <div className="mt-1 text-[22px] font-black tracking-[0.35em] text-black">
            出 库 单 据
          </div>
        </div>

        {/* 单据头属性 */}
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
            <span className="font-semibold">出库类型：</span>
            <span>{data.outboundType}</span>
          </div>
          <div>
            <span className="font-semibold">出库仓库：</span>
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

        {/* 货权方主体信息 */}
        <div className="space-y-1.5 border-b border-black pb-3">
          <div className="text-[12px] font-bold">[ 货权方主体信息 ]</div>
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

        {/* 现场提货与承运信息 */}
        <div className="space-y-1.5 border-b border-black pb-3">
          <div className="text-[12px] font-bold">[ 现场提货与承运信息 ]</div>
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
            <div>
              <span className="font-semibold">提货单号：</span>
              <span>{data.deliveryOrderNo}</span>
            </div>
            <div>
              <span className="font-semibold">发货方式：</span>
              <span>{data.deliveryMethodA4}</span>
            </div>
          </div>
        </div>

        {/* 出库货品明细 (单价与货值按风控脱敏留空) */}
        <div className="space-y-2 border-b border-black pb-3">
          <div className="text-[12px] font-bold">
            [ 出库货品明细 (单价与货值按风控脱敏留空) ]
          </div>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className={cn(TABLE_HEAD_STYLE, "w-11 text-center")}>序号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[21%] text-left")}>货品名称</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[21%] text-left")}>规格型号</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[13%] text-right")}>出库数量</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-11 text-center")}>单位</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[10%] text-center")}>单价</th>
                <th className={cn(TABLE_HEAD_STYLE, "w-[10%] text-center")}>货物价值</th>
                <th className={cn(TABLE_HEAD_STYLE, "text-left")}>备注</th>
              </tr>
            </thead>
            <tbody>
              {data.goodsRows.map((row) => (
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
                  <td className={TABLE_CELL_STYLE}>{row.remarkA4}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  货品种类数：{data.totalSpeciesCount} 种
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-right")}>
                  {data.totalQuantityFormatted}
                </td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>{data.totalUnit}</td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>--</td>
                <td className={TABLE_CELL_STYLE}></td>
              </tr>
            </tbody>
          </table>
          <div className="pt-0.5 text-[12px] font-semibold">
            出库数量大写合计：{data.totalQuantityChineseUpper}
          </div>
        </div>
      </div>

      {/* 现场出库交接签章 */}
      <div className="space-y-4 pt-3">
        <div className="text-[12px] font-bold">[ 现场出库交接签章 ]</div>
        <div className="grid grid-cols-3 gap-6 text-[12px]">
          <div className="space-y-1.5">
            <div className="font-semibold">制单人员：{data.creatorName}</div>
            <div>日期：{data.outboundDateChinese}</div>
            <div className="h-14" />
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">仓管发货人(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 仓管员手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">提货承运人(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 提货人手签 ]
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold">现场复核员(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 复核员手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">门卫放行确认(签字)：</div>
            <div>日期：2026年 &nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;日</div>
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 门卫岗手签 ]
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold">货权方授权确认(盖章)：</div>
            <div className="h-[18px]" />
            <div className="flex h-14 items-center justify-center border border-dashed border-black text-[11px]">
              [ 盖章区域 ]
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black pt-2 text-[11px]">
          <span>第 1 页 / 共 1 页</span>
          <span>打印时间：{data.printTime}</span>
        </div>
      </div>
    </div>
  )
}

/** 4.2 出库单 - A5 横向便携版 (210mm × 148mm) */
function OutboundSheetA5({ data }: { data: OutboundReceiptPrintData }) {
  return (
    <div className="flex min-h-[480px] flex-col justify-between border border-black p-5 text-[11.5px] leading-snug text-black">
      <div className="space-y-2">
        {/* 紧凑单行抬头 */}
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="text-[15px] font-bold tracking-wide">
            {data.systemName} · 出库单据
          </span>
          <span className="text-[12px] font-semibold">单号：{data.orderNo}</span>
        </div>

        {/* 货主与单据头属性 */}
        <div className="space-y-1 border-b border-black pb-2 text-[11.5px]">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="font-semibold">出库日期：</span>
              <span>{data.outboundDateShort}</span>
            </div>
            <div>
              <span className="font-semibold">出库类型：</span>
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

        {/* 提货人单行紧凑区 */}
        <div className="grid grid-cols-4 gap-2 border-b border-black pb-2 text-[11.5px]">
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
          <div>
            <span className="font-semibold">提货单号：</span>
            <span>{data.deliveryOrderNo}</span>
          </div>
        </div>

        {/* 明细表 */}
        <div>
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
              {data.goodsRows.map((row) => (
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
                  <td className={TABLE_CELL_STYLE}>{row.remarkA5}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className={cn(TABLE_CELL_STYLE, "text-center")}>合计</td>
                <td className={TABLE_CELL_STYLE}>
                  货品种类：{data.totalSpeciesCount} 种
                </td>
                <td colSpan={2} className={TABLE_CELL_STYLE}>
                  数量大写：{data.totalQuantityChineseUpper}
                </td>
                <td colSpan={4} className={TABLE_CELL_STYLE}>
                  合计数量：{formatReceiptTotalQuantity(data)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部 4 列横向签章 */}
      <div className="space-y-2 border-t border-black pt-2">
        <div className="grid grid-cols-4 gap-3 text-[11px]">
          <div className="space-y-1">
            <div className="font-semibold">仓管发货(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">提货司机(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">复核员(签字)：</div>
            <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 签名/捺印 ]
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">提货人/货主盖章捺印：</div>
            <div className="h-[15px]" />
            <div className="flex h-10 items-center justify-center border border-dashed border-black">
              [ 盖章区 ]
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-black pt-1.5 text-[11px]">
          <span>第 1 页 / 共 1 页</span>
          <span>打印时间：{data.printTime}</span>
        </div>
      </div>
    </div>
  )
}

/** 4.3 出库单 - 针式连续纸二等分版 (241mm × 139.5mm · 横向连续走纸) */
function OutboundSheetContinuous({ data }: { data: OutboundReceiptPrintData }) {
  return (
    <div className="relative px-[34px] py-3">
      <TractorFeedHoles side="left" />
      <TractorFeedHoles side="right" />
      <div className="flex min-h-[430px] flex-col justify-between border border-black text-[11.5px] leading-snug text-black">
        <div>
          {/* 顶部四行紧凑属性头 */}
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
            <div className="grid grid-cols-4 gap-2">
              <div>仓库：{data.warehouseName}</div>
              <div>类型：{data.outboundType}</div>
              <div>提单号:{data.deliveryOrderNo}</div>
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

          {/* 实线通栏表格 */}
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
              {data.goodsRows.map((row) => (
                <tr key={row.index}>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    {row.index}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1">
                    {row.goodsName}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1">
                    {row.specModel}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-right font-medium">
                    {row.quantityFormatted}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    {row.unit}
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    <BlankPricePlaceholder />
                  </td>
                  <td className="border-r border-b border-black px-2 py-1 text-center">
                    <BlankPricePlaceholder />
                  </td>
                  <td className="border-b border-black px-2 py-1">
                    {row.remarkContinuous}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="border-r border-black px-2 py-1.5">
                  合计：种类 {data.totalSpeciesCount} 种 &nbsp;&nbsp;大写：
                  {data.totalQuantityChineseUpper}
                </td>
                <td className="border-r border-black px-2 py-1.5 text-right">
                  {data.totalQuantityFormatted}
                </td>
                <td colSpan={4} className="px-2 py-1.5">
                  {data.totalUnit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 底部签字与打单时间 */}
        <div className="space-y-2 px-3 py-2">
          <div className="grid grid-cols-4 gap-3 items-end text-[11px]">
            <div className="space-y-2">
              <div className="font-semibold">仓管发货(手签)：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">提货司机(手签)：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">门卫核放(手签)：</div>
              <div>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold">提货方捺印/盖章：</div>
              <div className="flex h-9 items-center justify-center border border-dashed border-black text-[11px]">
                [ 盖章/捺印框 ]
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-black pt-1.5 text-[11px]">
            <span>第 1 页 / 共 1 页</span>
            <span>打单：{data.printTime}</span>
          </div>
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

type ReceiptPaperSheetProps =
  | { kind: "inbound"; paperSize: ReceiptPaperSize; data: InboundReceiptPrintData }
  | { kind: "outbound"; paperSize: ReceiptPaperSize; data: OutboundReceiptPrintData }

export function ReceiptPaperSheet(props: ReceiptPaperSheetProps) {
  const { kind, paperSize, data } = props
  if (kind === "inbound") {
    if (paperSize === "a4") return <InboundSheetA4 data={data} />
    if (paperSize === "a5") return <InboundSheetA5 data={data} />
    return <InboundSheetContinuous data={data} />
  }
  if (paperSize === "a4") return <OutboundSheetA4 data={data} />
  if (paperSize === "a5") return <OutboundSheetA5 data={data} />
  return <OutboundSheetContinuous data={data} />
}
