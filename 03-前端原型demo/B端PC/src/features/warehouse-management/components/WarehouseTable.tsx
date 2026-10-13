import { Link } from "react-router-dom"
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
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import { WAREHOUSE_LIST_PATH } from "../domain/constants"
import type { WarehouseRecord } from "../domain/types"
import { cn } from "@/lib/utils"

export type WarehouseRowAction = "edit" | "toggleStatus" | "delete"

type WarehouseTableProps = {
  data: WarehouseRecord[]
  page: number
  pageSize: number
  onAction: (action: WarehouseRowAction, item: WarehouseRecord) => void
}

const cellWrap = "whitespace-normal"

function zhongdengLabel(access: WarehouseRecord["zhongdengAccess"]) {
  return access === "YES" ? "已准入" : "未准入"
}

function statusLabel(status: WarehouseRecord["status"]) {
  return status === "ENABLED" ? "启用" : "停用"
}

export function WarehouseTable({
  data,
  page,
  pageSize,
  onAction,
}: WarehouseTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table className="table-fixed w-full">
        <colgroup>
          <col className="w-12" />
          <col className="w-[16%]" />
          <col className="w-[14%]" />
          <col className="w-[9rem]" />
          <col className="w-[4.5rem]" />
          <col className="w-[7.25rem]" />
          <col className="w-[7.25rem]" />
          <col className="w-14" />
          <col className="w-[11rem]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>仓库名称</TableHead>
            <TableHead>管理方名称</TableHead>
            <TableHead className={cellWrap}>中仓登准入仓标记</TableHead>
            <TableHead>创建人</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-32 text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell className={cellWrap}>
                  <Link
                    to={`${WAREHOUSE_LIST_PATH}/详情/${item.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell className={cellWrap}>
                  <HoverOverflowText
                    className="max-w-full"
                    ariaLabel={`管理方名称：${item.managerName}`}
                  >
                    {item.managerName}
                  </HoverOverflowText>
                </TableCell>
                <TableCell className={cellWrap}>
                  <Badge
                    variant="outline"
                    className={cn(
                      item.zhongdengAccess === "YES"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    {zhongdengLabel(item.zhongdengAccess)}
                  </Badge>
                </TableCell>
                <TableCell className={cn(cellWrap, "truncate")}>
                  {item.createdBy}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TableDateTimeCell value={item.createdAt} stackedPlain />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TableDateTimeCell value={item.updatedAt} stackedPlain />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      item.status === "ENABLED"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    {statusLabel(item.status)}
                  </Badge>
                </TableCell>
                <TableCell className={cellWrap}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`${WAREHOUSE_LIST_PATH}/详情/${item.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      查看
                    </Link>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => onAction("edit", item)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => onAction("toggleStatus", item)}
                    >
                      {item.status === "ENABLED" ? "停用" : "启用"}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-destructive"
                      onClick={() => onAction("delete", item)}
                    >
                      删除
                    </Button>
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
