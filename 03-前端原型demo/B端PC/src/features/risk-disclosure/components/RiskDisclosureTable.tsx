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
      <Table className="min-w-[1180px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[120px]">预警订单号</TableHead>
            <TableHead className="w-[120px]">预警类型</TableHead>
            <TableHead className="w-[240px]">公示标题与内容摘要</TableHead>
            <TableHead className="w-16 text-center">现场抓拍图</TableHead>
            <TableHead className="w-[130px]">最近一次公示时间</TableHead>
            <TableHead className="w-[120px]">最新操作人</TableHead>
            <TableHead className="w-[90px]">公示状态</TableHead>
            <TableHead className="w-[80px] min-w-[80px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
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
                    to={`/物联网IOT与预警/预警信息/风险公示/详情/${record.recordId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {record.orderNo}
                  </Link>
                </TableCell>
                <TableCell>{record.warningType}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[240px]"
                    ariaLabel={`公示标题与内容摘要：${record.warningContent}`}
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
                    <span className="text-muted-foreground">无抓拍图</span>
                  )}
                </TableCell>
                <TableCell>{formatDateTime(record.lastDisclosureTime)}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    ariaLabel={`最新操作人：${record.lastOperator}`}
                  >
                    {record.lastOperator}
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
                <TableCell>
                  <Link
                    to={`/物联网IOT与预警/预警信息/风险公示/详情/${record.recordId}`}
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
