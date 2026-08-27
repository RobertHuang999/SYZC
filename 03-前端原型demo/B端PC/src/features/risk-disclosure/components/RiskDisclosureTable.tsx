import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime } from "@/shared/lib/date-utils"
import { DISCLOSURE_STATUS_BADGE_CLASS } from "../domain/constants"
import type { RiskDisclosureRecord } from "../domain/types"

type RiskDisclosureTableProps = {
  records: RiskDisclosureRecord[]
  page: number
  pageSize: number
}

export function RiskDisclosureTable({
  records,
  page,
  pageSize,
}: RiskDisclosureTableProps) {
  return (
    <div className="overflow-visible rounded-md border bg-card">
      <Table className="min-w-[1420px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[120px]">预警订单</TableHead>
            <TableHead className="w-[120px]">货主</TableHead>
            <TableHead className="w-[120px]">预警类型</TableHead>
            <TableHead className="w-[200px]">预警内容</TableHead>
            <TableHead className="w-16 text-center">抓拍</TableHead>
            <TableHead className="w-[110px]">预警时间</TableHead>
            <TableHead className="w-[110px]">处理时间</TableHead>
            <TableHead className="w-[120px]">处理人</TableHead>
            <TableHead className="w-[90px]">公示状态</TableHead>
            <TableHead className="w-[120px]">公示时间</TableHead>
            <TableHead className="w-[120px]">操作人</TableHead>
            <TableHead className="w-[80px] min-w-[80px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={13}
                className="h-32 text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            records.map((record, index) => (
              <TableRow key={record.recordId}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>
                  <Link
                    to={`/预警信息/风险公示/详情/${record.recordId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {record.orderNo}
                  </Link>
                </TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    ariaLabel={`货主：${record.ownerName}`}
                  >
                    {record.ownerName}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>{record.warningType}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[200px]"
                    ariaLabel={`预警内容：${record.warningContent}`}
                  >
                    {record.warningContent}
                  </HoverOverflowText>
                </TableCell>
                <TableCell className="text-center">
                  {record.snapshotImageStatus === "available" ? (
                    <ImageIcon
                      className="mx-auto size-4 text-primary"
                      aria-label="查看大图"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDateTime(record.warningTime)}</TableCell>
                <TableCell>{formatDateTime(record.processedTime)}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    ariaLabel={`处理人：${record.processedBy}`}
                  >
                    {record.processedBy}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      DISCLOSURE_STATUS_BADGE_CLASS[record.disclosureStatus]
                    }
                  >
                    {record.disclosureStatus}
                  </Badge>
                </TableCell>
                <TableCell>{formatDateTime(record.lastDisclosureTime)}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    ariaLabel={`操作人：${record.lastOperator}`}
                  >
                    {record.lastOperator}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/预警信息/风险公示/详情/${record.recordId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    详情
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
