import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { formatDateTime } from "@/shared/lib/date-utils"
import { EXECUTION_STATUS_BADGE_CLASS } from "../domain/constants"
import { canExecute } from "../lib/record-utils"
import type { MidLoanRiskRecord } from "../domain/types"

type MidLoanRiskTableProps = {
  records: MidLoanRiskRecord[]
  page: number
  pageSize: number
  onExecute: (record: MidLoanRiskRecord) => void
}

export function MidLoanRiskTable({
  records,
  page,
  pageSize,
  onExecute,
}: MidLoanRiskTableProps) {
  return (
    <div className="overflow-visible rounded-md border bg-card">
      <Table className="min-w-[1240px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[120px]">订单号</TableHead>
            <TableHead className="w-[120px]">货主名称</TableHead>
            <TableHead className="w-[180px]">押品信息</TableHead>
            <TableHead className="w-[100px]">订单类型</TableHead>
            <TableHead className="w-[160px]">风控模型</TableHead>
            <TableHead className="w-[80px]">执行次数</TableHead>
            <TableHead className="w-[80px]">预警次数</TableHead>
            <TableHead className="w-[130px]">执行状态</TableHead>
            <TableHead className="w-[120px]">最近执行时间</TableHead>
            <TableHead className="w-[120px] min-w-[120px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={11}
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
                    to={`/预警信息/贷中风控管理/详情/${record.recordId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {record.orderNo}
                  </Link>
                </TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    ariaLabel={`货主名称：${record.ownerName}`}
                  >
                    {record.ownerName}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[180px]"
                    ariaLabel={`押品信息：${record.collateralInfo}`}
                  >
                    {record.collateralInfo}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>{record.orderType}</TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[160px]"
                    ariaLabel={`风控模型：${record.riskModel}`}
                  >
                    {record.riskModel}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>{record.executionCount}</TableCell>
                <TableCell>{record.warningCount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={
                        EXECUTION_STATUS_BADGE_CLASS[record.lastExecutionStatus]
                      }
                    >
                      {record.lastExecutionStatus}
                    </Badge>
                    {record.executability === "不可执行" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="inline-flex">
                            <InfoIcon className="size-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            订单状态或配置不满足执行条件
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDateTime(record.lastExecutionTime)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      disabled={!canExecute(record)}
                      onClick={() => onExecute(record)}
                    >
                      执行
                    </Button>
                    <Link
                      to={`/预警信息/贷中风控管理/详情/${record.recordId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      详情
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
