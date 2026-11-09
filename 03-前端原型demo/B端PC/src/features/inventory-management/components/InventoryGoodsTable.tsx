import React from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { TableRowActionItem } from "@/shared/components/TableRowActionPanel"
import type { GoodsRowData } from "../mock/inventory-management.mock"
import { InventorySummaryTable, displayValue } from "./InventorySummaryTable"

interface InventoryGoodsTableProps {
  data: GoodsRowData[]
  page?: number
  pageSize?: number
}

const NUMERIC = "text-right tabular-nums"

export const InventoryGoodsTable: React.FC<InventoryGoodsTableProps> = ({
  data,
  page = 1,
  pageSize = 10,
}) => {
  const navigate = useNavigate()

  const columns = [
    { key: "goods", label: "货物名称", className: "w-[260px] min-w-[260px]" },
    { key: "unitPrice", label: "单价", className: `${NUMERIC} w-[110px] min-w-[110px]` },
    { key: "unit", label: "单位", className: "text-center w-[70px] min-w-[70px]" },
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
    { key: "totalVal", label: "库存总价", className: `${NUMERIC} w-[140px] min-w-[140px]` },
    { key: "availQty", label: "可用数量", className: `${NUMERIC} w-[110px] min-w-[110px]` },
    { key: "availVal", label: "可用总价", className: `${NUMERIC} w-[140px] min-w-[140px]` },
    { key: "frozenQty", label: "冻结数量", className: `${NUMERIC} w-[110px] min-w-[110px]` },
    { key: "frozenVal", label: "冻结总价", className: `${NUMERIC} w-[140px] min-w-[140px]` },
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
        title: "查看该货品的库存明细",
        onClick: () => navigate(`/仓储/库存查询/库存明细?goods=${encodeURIComponent(row.goodsName)}`),
      },
      {
        key: "transaction",
        label: "库存流水",
        title: "查看该货品的库存流水",
        onClick: () => navigate(`/仓储/库存查询/库存流水?goods=${encodeURIComponent(row.goodsName)}`),
      },
    ]

    return {
      id: row.id,
      actions,
      cells: [
        <span key="goods" className="text-foreground">
          {row.goodsName}
        </span>,
        displayValue(row.unitPrice),
        row.unit,
        displayValue(row.totalQty),
        displayValue(row.totalVal),
        displayValue(row.availQty),
        displayValue(row.availVal),
        displayValue(row.frozenQty),
        displayValue(row.frozenVal),
        displayValue(row.periodInQty),
        displayValue(row.periodOutQty),
      ],
    }
  })

  return (
    <InventorySummaryTable
      columns={columns}
      rows={rows}
      emptyText="暂无匹配货品存货数据"
      page={page}
      pageSize={pageSize}
      minWidthClass="min-w-[1400px]"
    />
  )
}
