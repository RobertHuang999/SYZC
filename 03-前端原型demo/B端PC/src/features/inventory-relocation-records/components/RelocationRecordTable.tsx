import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableRowActionPanel } from "@/shared/components/TableRowActionPanel"
import { relocationDetailPath } from "../domain/constants"
import type { RelocationRecord } from "../domain/types"

type Props = {
  records: RelocationRecord[]
}

const COL = {
  index: 64,
  id: 150,
  owner: 210,
  time: 130,
  type: 110,
  warehouse: 150,
  goods: 180,
  qty: 110,
  creator: 160,
  actions: 142,
}

const TOTAL = Object.values(COL).reduce((sum, width) => sum + width, 0)

export function RelocationRecordTable({ records }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="w-full table-fixed text-sm" style={{ minWidth: TOTAL }}>
        <colgroup>
          <col style={{ width: COL.index }} />
          <col style={{ width: COL.id }} />
          <col style={{ width: COL.owner }} />
          <col style={{ width: COL.time }} />
          <col style={{ width: COL.type }} />
          <col style={{ width: COL.warehouse }} />
          <col style={{ width: COL.goods }} />
          <col style={{ width: COL.qty }} />
          <col style={{ width: COL.creator }} />
          <col style={{ width: COL.actions }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="sticky left-0 z-10 bg-slate-50 text-center">序号</TableHead>
            <TableHead>移库单号</TableHead>
            <TableHead>货主名称/标识</TableHead>
            <TableHead>移库时间</TableHead>
            <TableHead>移库类型</TableHead>
            <TableHead>仓库名称</TableHead>
            <TableHead>货物名称</TableHead>
            <TableHead className="text-right">移库数量</TableHead>
            <TableHead>制单人</TableHead>
            <TableHead className="sticky right-0 z-20 bg-slate-50 text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-40 text-center text-sm text-muted-foreground">
                暂无符合条件的移库记录，可调整筛选条件后重试
              </TableCell>
            </TableRow>
          ) : (
            records.map((record, index) => {
              const [datePart, timePart] = record.moveTime.split(" ")
              return (
                <TableRow key={record.id} className="group h-[72px] transition-colors hover:bg-slate-50/80">
                  <TableCell className="sticky left-0 z-10 bg-white text-center text-muted-foreground group-hover:bg-slate-50">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <span
                      className="whitespace-normal break-all font-medium text-primary line-clamp-2"
                      title={record.id}
                    >
                      {record.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="truncate font-medium text-foreground" title={record.ownerName}>
                        {record.ownerName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {record.ownerIdentifier}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span>{datePart}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{timePart}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span>{record.moveType}</span>
                      {record.relatedNo && (
                        <span className="truncate text-xs text-muted-foreground">{record.relatedNo}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2" title={record.warehouseName}>
                      {record.warehouseName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2" title={record.goodsNameSummary}>
                      {record.goodsNameSummary}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="tabular-nums font-medium text-foreground">
                      {record.totalQty.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">{record.unit}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="truncate">{record.creatorName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {record.createTime}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] group-hover:bg-slate-50">
                    <TableRowActionPanel
                      actions={[
                        {
                          key: "detail",
                          label: "详情",
                          to: relocationDetailPath(record.id),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
