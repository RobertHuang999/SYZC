import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { TableRowActionPanel, type TableRowActionItem } from "@/shared/components/TableRowActionPanel"
import type { DeliveryOrderItem } from "../domain/types"
import { DELIVERY_STATUS_CONFIG } from "../domain/constants"

interface DeliveryOrderTableProps {
  rows: DeliveryOrderItem[]
  page: number
  pageSize: number
  onViewDetail: (item: DeliveryOrderItem) => void
  onViewLogs: (item: DeliveryOrderItem) => void
  onWriteOff: (item: DeliveryOrderItem) => void
  onCancel: (item: DeliveryOrderItem) => void
  onConfirm: (item: DeliveryOrderItem) => void
}

export function DeliveryOrderTable({
  rows,
  page,
  pageSize,
  onViewDetail,
  onViewLogs,
  onWriteOff,
  onCancel,
  onConfirm,
}: DeliveryOrderTableProps) {
  return (
    <div className="rounded-md border bg-card shadow-2xs overflow-x-auto font-sans">
      <Table className="w-full table-fixed min-w-[1428px] text-xs">
        <TableHeader>
          <TableRow className="bg-slate-100/90 dark:bg-slate-800/90 h-10 border-b">
            <TableHead className="sticky left-0 z-10 w-16 bg-slate-100 text-center font-semibold text-foreground">序号</TableHead>
            <TableHead className="w-56 font-semibold text-foreground">货主</TableHead>
            <TableHead className="w-[200px] font-semibold text-foreground">货物</TableHead>
            <TableHead className="w-48 font-semibold text-foreground">提货人</TableHead>
            <TableHead className="w-[100px] font-semibold text-foreground">出库类型</TableHead>
            <TableHead className="w-[110px] text-center font-semibold text-foreground">状态</TableHead>
            <TableHead className="w-44 font-semibold text-foreground">
              <PrototypeAnnotationTarget annotationIds={["delivery-order-table-r02"]}>
                <span>操作人</span>
              </PrototypeAnnotationTarget>
            </TableHead>
            <TableHead className="w-36 font-semibold text-foreground">时间</TableHead>
            <TableHead className="w-[218px] text-center font-semibold text-foreground sticky right-0 bg-slate-100 dark:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
              <PrototypeAnnotationTarget annotationIds={["delivery-order-actions-matrix"]}>
                <span>操作</span>
              </PrototypeAnnotationTarget>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-40 text-center text-xs text-muted-foreground">
                暂无符合条件的提货单，可调整筛选条件后重试
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item, idx) => {
              const isPending = item.status === "未提货"
              const statusCfg = DELIVERY_STATUS_CONFIG[item.status] || DELIVERY_STATUS_CONFIG.未提货
              const actionItems: TableRowActionItem[] = [
                {
                  key: "detail",
                  label: "详情",
                  onClick: () => onViewDetail(item),
                },
                {
                  key: "logs",
                  label: "操作记录",
                  onClick: () => onViewLogs(item),
                },
                {
                  key: "writeoff",
                  label: "核销码",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可核销提货码",
                  onClick: () => onWriteOff(item),
                },
                {
                  key: "confirm",
                  label: "确认提货",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可确认提货",
                  onClick: () => onConfirm(item),
                },
                {
                  key: "cancel",
                  label: "取消提货",
                  tone: "danger",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可取消",
                  onClick: () => onCancel(item),
                },
              ]

              return (
                <TableRow
                  key={item.id}
                  className="h-[72px] hover:bg-muted/30 transition-colors border-b group"
                >
                  {/* 序号 */}
                  <TableCell className="sticky left-0 z-10 bg-white text-center text-muted-foreground font-normal group-hover:bg-slate-50">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>

                  {/* 货主 */}
                  <TableCell>
                    <div className="font-medium text-foreground line-clamp-1">{item.ownerName}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">{item.ownerIdentity}</div>
                  </TableCell>

                  {/* 货物 */}
                  <TableCell>
                    <div className="space-y-0.5 max-h-[58px] overflow-y-auto pr-1">
                      {item.goodsSummaryList.map((g, i) => (
                        <div key={i} className="text-foreground leading-tight">
                          <span>{g.categoryName}-{g.subCategoryName}-{g.specName}</span>
                          <span className="text-muted-foreground ml-1">
                            - <strong className="text-primary font-medium">{g.amount} {g.unit}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* 提货人（含企业悬停 Popover 浮层 R03） */}
                  <TableCell>
                    <PrototypeAnnotationTarget annotationIds={["delivery-order-pickup-r03"]}>
                      {item.pickupPersonType === "企业" ? (
                        <div className="space-y-0.5">
                          <div className="text-foreground line-clamp-1">
                            {item.pickupOperator || item.pickupName}({item.pickupPhone})经办人
                          </div>
                          <Popover>
                            <PopoverTrigger className="text-amber-600 hover:text-amber-700 hover:underline text-[11px] font-medium cursor-pointer">
                              [更多]
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              align="start"
                              className="w-64 text-xs space-y-1.5 p-3 shadow-md bg-card border font-sans"
                            >
                              <div className="text-muted-foreground">
                                <span className="font-medium text-foreground">企业名称：</span>
                                {item.pickupName}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="font-medium text-foreground">企业标识：</span>
                                {item.pickupIdentity || "—"}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div>
                          <div className="text-foreground font-medium">{item.pickupName}</div>
                          <div className="text-[11px] text-muted-foreground">({item.pickupPhone})</div>
                        </div>
                      )}
                    </PrototypeAnnotationTarget>
                  </TableCell>

                  {/* 出库类型 */}
                  <TableCell className="text-left font-medium text-foreground">
                    {item.outboundType}
                  </TableCell>

                  {/* 状态徽标 */}
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusCfg.badgeClass}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* 操作人（固化出库制单人 R02） */}
                  <TableCell>
                    <div className="text-foreground font-medium line-clamp-1">{item.operatorName}</div>
                    {item.operatorOrg && (
                      <div className="text-[11px] text-muted-foreground line-clamp-1">
                        ({item.operatorOrg})
                      </div>
                    )}
                  </TableCell>

                  {/* 时间（固化单据生成时刻 R02） */}
                  <TableCell className="text-left text-muted-foreground">
                    <div className="flex flex-col gap-0.5 leading-snug whitespace-nowrap">
                      <span>{item.createTime.split(" ")[0]}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {item.createTime.split(" ")[1] ?? ""}
                      </span>
                    </div>
                  </TableCell>

                  {/* 操作列（Sticky 右侧防滚动穿透，统一操作面板） */}
                  <TableCell className="text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] transition-colors">
                    <TableRowActionPanel actions={actionItems} />
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
