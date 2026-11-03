import React from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { TableRowActionItem } from "@/shared/components/TableRowActionPanel"
import type { RepoRowData } from "../mock/inventory-management.mock"
import { InventorySummaryTable, displayValue } from "./InventorySummaryTable"

interface InventoryRepoTableProps {
  data: RepoRowData[]
  page?: number
  pageSize?: number
}

const NUMERIC = "text-right tabular-nums"

export const InventoryRepoTable: React.FC<InventoryRepoTableProps> = ({
  data,
  page = 1,
  pageSize = 10,
}) => {
  const navigate = useNavigate()

  const columns = [
    { key: "warehouse", label: "仓库名称", className: "w-[240px] min-w-[240px]" },
    {
      key: "totalQty",
      label: (
        <span className="inline-flex items-center gap-1">
          库存总数
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              库内所有库存，包含可用库存 + 业务冻结库存，不包含已出库待提货的
            </TooltipContent>
          </Tooltip>
        </span>
      ),
      className: `${NUMERIC} w-[110px] min-w-[110px]`,
    },
    { key: "totalVal", label: "总价(万)", className: `${NUMERIC} w-[140px] min-w-[140px]` },
    { key: "availQty", label: "可用数量", className: `${NUMERIC} w-[110px] min-w-[110px]` },
    { key: "availVal", label: "总价(万)", className: `${NUMERIC} w-[140px] min-w-[140px]` },
    { key: "frozenQty", label: "冻结数量", className: `${NUMERIC} w-[110px] min-w-[110px]` },
    { key: "frozenVal", label: "总价(万)", className: `${NUMERIC} w-[140px] min-w-[140px]` },
    {
      key: "periodInQty",
      label: "本期入库总量",
      className: `${NUMERIC} hidden xl:table-cell w-[110px] min-w-[110px]`,
    },
    {
      key: "periodOutQty",
      label: "本期出库总量",
      className: `${NUMERIC} hidden xl:table-cell w-[110px] min-w-[110px]`,
    },
  ]

  const rows = data.map((row) => {
    const actions: TableRowActionItem[] = [
      {
        key: "distribution",
        label: "库存分布",
        title: "查看该仓库的库存明细",
        onClick: () => navigate(`/仓储/库存查询/库存明细?warehouse=${encodeURIComponent(row.warehouseName)}`),
      },
      {
        key: "transaction",
        label: "库存流水",
        title: "查看该仓库的库存流水",
        onClick: () => navigate(`/仓储/库存查询/库存流水?warehouse=${encodeURIComponent(row.warehouseName)}`),
      },
    ]

    return {
      id: row.id,
      actions,
      cells: [
        <span key="warehouse" className="text-foreground">
          {row.warehouseName}
        </span>,
        displayValue(row.totalQty),
        displayValue(row.totalVal),
        displayValue(row.availQty),
        displayValue(row.availVal),
        displayValue(row.frozenQty),
        <span key="frozenVal" className="text-muted-foreground">
          {displayValue(row.frozenVal)}
        </span>,
        displayValue(row.periodInQty),
        displayValue(row.periodOutQty),
      ],
    }
  })

  return (
    <InventorySummaryTable
      columns={columns}
      rows={rows}
      emptyText="暂无匹配存货数据"
      page={page}
      pageSize={pageSize}
      minWidthClass="min-w-[1250px]"
    />
  )
}
