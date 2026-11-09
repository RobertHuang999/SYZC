import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { InboundDocNoCell } from "@/features/inbound-records/components/InboundDocNoCell"
import {
  SHARED_OWNERS,
  type InventoryTransactionRecord,
} from "@/features/shared/mock/inventory-shared-seed"

interface InventoryTransactionsTableProps {
  data: InventoryTransactionRecord[]
  onViewPdf: (record: InventoryTransactionRecord) => void
  onExportRecord: (record: InventoryTransactionRecord) => void
  page?: number
  pageSize?: number
}

const NUMERIC = "text-right tabular-nums"
const STICKY_ACTION_CLASS =
  "sticky right-0 z-10 border-l border-border/60 bg-card px-2 py-2 text-center group-hover:bg-[#f7faff]"

function formatQuantity(value: number) {
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 4 })
}

export const InventoryTransactionsTable: React.FC<InventoryTransactionsTableProps> = ({
  data,
  onViewPdf,
  onExportRecord,
  page = 1,
  pageSize = 10,
}) => {
  const navigate = useNavigate()

  const actionColStyle = {
    width: TABLE_ROW_ACTION_COL_TOTAL_PX,
    minWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
    maxWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
  }

  // 单据穿透跳转
  const goOrder = (record: InventoryTransactionRecord) => {
    if (record.direction === "IN") {
      navigate(`/仓储/入库管理/入库记录/详情/${record.orderNo}`)
    } else {
      navigate(`/仓储/出库管理/出库记录/详情/${record.orderNo}`)
    }
  }

  return (
    <Table className="min-w-[1780px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="sticky left-0 z-10 w-16 min-w-16 bg-slate-50 text-center">序号</TableHead>
          <TableHead className="w-[190px] min-w-[190px]">业务单号</TableHead>
          <TableHead className="w-[160px] min-w-[160px]">业务时间</TableHead>
          <TableHead className="w-[120px] min-w-[120px]">业务类型</TableHead>
          <TableHead className="w-[160px] min-w-[160px]">关联单据</TableHead>
          <TableHead className="w-[190px] min-w-[190px]">货主</TableHead>
          <TableHead className="w-[180px] min-w-[180px]">货物名称</TableHead>
          <TableHead className={`${NUMERIC} w-[110px] min-w-[110px]`}>数量</TableHead>
          <TableHead className="w-[130px] min-w-[130px]">仓库</TableHead>
          <TableHead className="w-[100px] min-w-[100px]">制单人</TableHead>
          <TableHead className="w-[160px] min-w-[160px]">制单时间</TableHead>
          <TableHead className={STICKY_ACTION_CLASS} style={actionColStyle}>
            操作
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={12} className="h-32 text-center text-muted-foreground">
              暂无符合条件的库存流水，可调整筛选条件后重试
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => {
            const owner = SHARED_OWNERS.find((entry) => entry.id === row.ownerId)
            const actions: TableRowActionItem[] = [
              {
                key: "detail",
                label: "详情",
                title: "查看关联业务单据详情",
                onClick: () => goOrder(row),
              },
              {
                key: "doc",
                label: "单据下载",
                title: "下载带章标准 PDF 单据凭证",
                onClick: () => onViewPdf(row),
              },
              {
                key: "record",
                label: "下载记录",
                title: "导出该单据的底层堆放 / 扣减明细",
                onClick: () => onExportRecord(row),
              },
            ]

            return (
              <TableRow key={row.id} className="group h-[72px]">
                <TableCell className="sticky left-0 z-10 bg-white text-center text-muted-foreground group-hover:bg-slate-50">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>

                <TableCell>
                  <InboundDocNoCell
                    docNo={row.businessNo}
                    linkTo={
                      row.direction === "IN"
                        ? `/仓储/入库管理/入库记录/详情/${row.orderNo}`
                        : `/仓储/出库管理/出库记录/详情/${row.orderNo}`
                    }
                    wrap
                  />
                </TableCell>

                <TableCell>
                  <TableDateTimeCell value={row.businessDate} stackedPlain />
                </TableCell>

                <TableCell className="text-foreground">{row.businessType}</TableCell>

                <TableCell className="whitespace-normal break-all text-muted-foreground">
                  {row.relatedId || "—"}
                </TableCell>

                <TableCell>
                  <div className="text-foreground">{row.ownerName}</div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {owner?.identifierMasked ?? "—"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="whitespace-normal break-words text-foreground">
                    {row.specification}
                  </div>
                </TableCell>

                <TableCell className={`${NUMERIC} text-foreground`}>
                  {formatQuantity(row.changeQuantity)}
                  {row.unit}
                </TableCell>

                <TableCell className="text-foreground">{row.warehouseName}</TableCell>
                <TableCell className="text-foreground">{row.createByName}</TableCell>

                <TableCell>
                  <TableDateTimeCell value={row.createTime} stackedPlain />
                </TableCell>

                <TableCell className={STICKY_ACTION_CLASS} style={actionColStyle}>
                  <TableRowActionPanel actions={actions} fixedCols={3} />
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
