import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LIST_BASE_PATH } from "../domain/constants"
import type { UnlockApply } from "../domain/types"
import { formatApplicant } from "../lib/detail-utils"
import { UnlockApplyStatusBadge } from "./UnlockApplyStatusBadge"

type UnlockApplyTableProps = {
  items: UnlockApply[]
  startIndex?: number
  compact?: boolean
  /** 审批中心预览区用「查看详情」，完整列表用「详情」 */
  detailLabel?: string
  onProcess?: (apply: UnlockApply) => void
}

function getDetailPath(applyNo: string) {
  return `${LIST_BASE_PATH}/详情/${applyNo}`
}

export function UnlockApplyTable({
  items,
  startIndex = 0,
  compact = false,
  detailLabel = compact ? "查看详情" : "详情",
  onProcess,
}: UnlockApplyTableProps) {
  const table = (
    <Table className={compact ? undefined : "min-w-[1100px]"}>
      <TableHeader>
        <TableRow>
          {!compact && <TableHead className="w-16">序号</TableHead>}
          <TableHead>设备名称</TableHead>
          <TableHead>绑定仓库</TableHead>
          <TableHead>申请人</TableHead>
          <TableHead>事由</TableHead>
          <TableHead>申请状态</TableHead>
          <TableHead>提交时间</TableHead>
          <TableHead className="w-36">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={compact ? 7 : 8}
              className="py-10 text-center text-muted-foreground"
            >
              暂无符合条件的开锁申请
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => (
            <TableRow key={item.applyNo}>
              {!compact && <TableCell>{startIndex + index + 1}</TableCell>}
              <TableCell className="font-medium">{item.deviceName}</TableCell>
              <TableCell>{item.warehouseName}</TableCell>
              <TableCell>{formatApplicant(item)}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>
                <UnlockApplyStatusBadge apply={item} />
              </TableCell>
              <TableCell>{item.submitTime.slice(0, 16)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    className="text-sm text-primary hover:underline"
                    to={getDetailPath(item.applyNo)}
                  >
                    {detailLabel}
                  </Link>
                  {item.status === "PENDING" && item.eligible && (
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => onProcess?.(item)}
                    >
                      去处理
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  if (compact) {
    return table
  }

  return <div className="overflow-visible rounded-md border bg-card">{table}</div>
}
