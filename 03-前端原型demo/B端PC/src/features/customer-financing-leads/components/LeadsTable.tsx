import { Badge } from "@/components/ui/badge"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { LEAD_STATUS_CONFIG, formatAmountWan } from "../domain/constants"
import type { CustomerFinancingLead } from "../domain/types"

interface LeadsTableProps {
  data: CustomerFinancingLead[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onViewDetail: (lead: CustomerFinancingLead) => void
  onAssign: (lead: CustomerFinancingLead) => void
  onReject: (lead: CustomerFinancingLead) => void
}

export function LeadsTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onAssign,
  onReject,
}: LeadsTableProps) {
  return (
    <div className="space-y-3 font-sans">
      <div className="relative overflow-x-auto rounded-lg border border-border">
        <Table className="w-full border-collapse text-left text-xs">
          <TableHeader>
            <TableRow className="bg-slate-100 dark:bg-slate-800">
              {/* 1. 序号 */}
              <TableHead className="w-14 whitespace-nowrap text-center font-semibold text-foreground">
                序号
              </TableHead>

              {/* 2. 产品名称 */}
              <TableHead className="min-w-[150px] max-w-[200px] whitespace-nowrap font-semibold text-foreground">
                产品名称
              </TableHead>

              {/* 3. 申请人 */}
              <TableHead className="min-w-[180px] max-w-[220px] whitespace-nowrap font-semibold text-foreground">
                申请人
              </TableHead>

              {/* 4. 意向融资金额 */}
              <TableHead className="min-w-[130px] whitespace-nowrap text-right font-semibold text-foreground">
                意向融资金额
              </TableHead>

              {/* 5. 意向融资期数 */}
              <TableHead className="w-24 whitespace-nowrap text-center font-semibold text-foreground">
                意向融资期数
              </TableHead>

              {/* 6. 货物 */}
              <TableHead className="min-w-[120px] whitespace-nowrap font-semibold text-foreground">
                货物
              </TableHead>

              {/* 7. 申请时间 */}
              <TableHead className="min-w-[140px] whitespace-nowrap text-center font-semibold text-foreground">
                申请时间
              </TableHead>

              {/* 8. 授信金额 */}
              <TableHead className="min-w-[120px] whitespace-nowrap text-right font-semibold text-foreground">
                授信金额
              </TableHead>

              {/* 9. 授信期数 */}
              <TableHead className="w-20 whitespace-nowrap text-center font-semibold text-foreground">
                授信期数
              </TableHead>

              {/* 10. 贷款金额 */}
              <TableHead className="min-w-[120px] whitespace-nowrap text-right font-semibold text-foreground">
                贷款金额
              </TableHead>

              {/* 11. 贷款期数 */}
              <TableHead className="w-20 whitespace-nowrap text-center font-semibold text-foreground">
                贷款期数
              </TableHead>

              {/* 12. 状态 */}
              <TableHead className="w-24 whitespace-nowrap text-center font-semibold text-foreground">
                状态
              </TableHead>

              {/* 13. 需要尽调 (倒数第二列) */}
              <TableHead className="w-20 whitespace-nowrap text-center font-semibold text-foreground">
                需要尽调
              </TableHead>

              {/* 14. 操作 (Sticky 右侧固定) */}
              <TableHead className="sticky right-0 z-20 w-[170px] min-w-[170px] whitespace-nowrap border-l border-border/80 bg-slate-100 text-center font-semibold text-foreground shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] dark:bg-slate-800">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={14}
                  className="h-32 text-center text-sm text-muted-foreground whitespace-nowrap"
                >
                  暂无匹配的客户融资需求线索数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((lead, idx) => {
                const statusMeta =
                  LEAD_STATUS_CONFIG[lead.status] ||
                  LEAD_STATUS_CONFIG.PENDING_ACCEPT
                const rowIndex = (page - 1) * pageSize + idx + 1
                const actions: TableRowActionItem[] = [
                  {
                    key: "detail",
                    label: "详情",
                    onClick: () => onViewDetail(lead),
                  },
                ]
                if (lead.status === "PENDING_ACCEPT") {
                  actions.push(
                    {
                      key: "assign",
                      label: "分配跟进",
                      onClick: () => onAssign(lead),
                    },
                    {
                      key: "reject",
                      label: "驳回",
                      tone: "danger",
                      onClick: () => onReject(lead),
                    },
                  )
                }

                return (
                  <TableRow
                    key={lead.id}
                    className="group h-[72px] border-b border-border/60 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                  >
                    {/* 1. 序号 */}
                    <TableCell className="w-14 whitespace-nowrap text-center font-normal text-muted-foreground">
                      {rowIndex}
                    </TableCell>

                    {/* 2. 产品名称 */}
                    <TableCell className="min-w-[150px] max-w-[200px] whitespace-nowrap font-medium text-foreground">
                      <div
                        className="truncate"
                        title={lead.productName}
                      >
                        {lead.productName}
                      </div>
                    </TableCell>

                    {/* 3. 申请人 */}
                    <TableCell className="min-w-[180px] max-w-[220px] whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div
                          className="truncate font-medium text-foreground"
                          title={lead.applicantName}
                        >
                          {lead.applicantName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {lead.applicantType === "ENTERPRISE"
                            ? lead.applicantIdentifier
                            : `个人货主 · ${lead.applicantPhone}`}
                        </div>
                      </div>
                    </TableCell>

                    {/* 4. 意向融资金额 */}
                    <TableCell className="min-w-[130px] whitespace-nowrap text-right font-medium text-primary">
                      {formatAmountWan(lead.intendedAmount)}
                    </TableCell>

                    {/* 5. 意向融资期数 */}
                    <TableCell className="w-24 whitespace-nowrap text-center text-foreground">
                      {lead.intendedPeriods}期
                    </TableCell>

                    {/* 6. 货物 */}
                    <TableCell className="min-w-[120px] whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={
                              lead.collateralType === "仓单"
                                ? "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                                : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            }
                          >
                            {lead.collateralType}
                          </Badge>
                          <span
                            className="truncate text-[11px] text-foreground"
                            title={
                              lead.collateralType === "仓单"
                                ? lead.warehouseReceiptNo
                                : lead.warehouseName
                            }
                          >
                            {lead.collateralType === "仓单"
                              ? lead.warehouseReceiptNo
                              : lead.warehouseName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 7. 申请时间 */}
                    <TableCell className="min-w-[140px] whitespace-nowrap text-center text-muted-foreground">
                      <TableDateTimeCell value={lead.appliedAt} plain />
                    </TableCell>

                    {/* 8. 授信金额 */}
                    <TableCell className="min-w-[120px] whitespace-nowrap text-right font-medium text-foreground">
                      {formatAmountWan(lead.creditAmount)}
                    </TableCell>

                    {/* 9. 授信期数 */}
                    <TableCell className="w-20 whitespace-nowrap text-center text-muted-foreground">
                      {lead.creditPeriods ? `${lead.creditPeriods}期` : "—"}
                    </TableCell>

                    {/* 10. 贷款金额 */}
                    <TableCell className="min-w-[120px] whitespace-nowrap text-right font-medium text-foreground">
                      {formatAmountWan(lead.loanAmount)}
                    </TableCell>

                    {/* 11. 贷款期数 */}
                    <TableCell className="w-20 whitespace-nowrap text-center text-muted-foreground">
                      {lead.loanPeriods ? `${lead.loanPeriods}期` : "—"}
                    </TableCell>

                    {/* 12. 状态 */}
                    <TableCell className="w-24 whitespace-nowrap text-center">
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 font-medium ${statusMeta.badgeClass}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${statusMeta.dotClass}`}
                        />
                        <span>{statusMeta.label}</span>
                      </Badge>
                    </TableCell>

                    {/* 13. 需要尽调 (倒数第二列) */}
                    <TableCell className="w-20 whitespace-nowrap text-center">
                      <Badge
                        variant="outline"
                        className={
                          lead.requiresSurvey
                            ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300"
                            : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                        }
                      >
                        {lead.requiresSurvey ? "是" : "否"}
                      </Badge>
                    </TableCell>

                    {/* 14. 操作 (Sticky 右侧固定) */}
                    <TableCell className="sticky right-0 z-20 w-[196px] min-w-[196px] whitespace-nowrap border-l border-border/80 bg-white px-2 py-2 text-center shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800">
                      <TableRowActionPanel
                        actions={actions}
                        fixedCols={3}
                        maxInline={3}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页控制区 */}
      <WarningListPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
