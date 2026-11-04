import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
} from "@/shared/components/TableRowActionPanel"
import { transferRecordDetailPath } from "../domain/constants"
import type { TransferRecord } from "../domain/types"

interface Props {
  records: TransferRecord[]
  page: number
  pageSize: number
  onViewDetail: (record: TransferRecord) => void
  onDownloadLog: (record: TransferRecord) => void
  onDownloadDoc: (record: TransferRecord) => void
}

export function TransferRecordTable({
  records,
  page,
  pageSize,
  onViewDetail,
  onDownloadLog,
  onDownloadDoc,
}: Props) {
  const navigate = useNavigate()

  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="bg-slate-100 dark:bg-slate-800 border-b border-border">
              <TableRow className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <TableHead className="w-[60px] text-center font-semibold text-foreground">
                  序号
                </TableHead>
                <TableHead className="w-[200px] font-semibold text-foreground">
                  移库单号
                </TableHead>
                <TableHead className="w-[200px] font-semibold text-foreground">
                  货主名称/标识
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-foreground">
                  移库时间
                </TableHead>
                <TableHead className="w-[160px] font-semibold text-foreground">
                  移库类型
                </TableHead>
                <TableHead className="w-[180px] font-semibold text-foreground">
                  仓库名称
                </TableHead>
                <TableHead className="min-w-[260px] font-semibold text-foreground">
                  货物名称
                </TableHead>
                <TableHead className="w-[110px] text-right font-semibold text-foreground">
                  移库数量
                </TableHead>
                <TableHead className="w-[180px] font-semibold text-foreground">
                  制单人
                </TableHead>
                <TableHead
                  style={{
                    width: TABLE_ROW_ACTION_COL_TOTAL_PX,
                    minWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
                  }}
                  className="text-center font-semibold text-foreground sticky right-0 bg-slate-100 dark:bg-slate-800 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] z-20"
                >
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-32 text-center text-muted-foreground"
                  >
                    暂无符合条件的移库记录
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row, index) => {
                  const seq = (page - 1) * pageSize + index + 1
                  const [datePart, timePart] = row.transferTime.split(" ")
                  const [createDate, createTime] = row.createTime.split(" ")

                  return (
                    <TableRow
                      key={row.id}
                      className="group h-[72px] border-b border-border/80 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      {/* 1. 序号 */}
                      <TableCell className="text-center font-normal text-muted-foreground">
                        {seq}
                      </TableCell>

                      {/* 2. 移库单号 (不截断，可跳转详情) */}
                      <TableCell className="font-medium text-foreground">
                        <button
                          type="button"
                          onClick={() => onViewDetail(row)}
                          className="text-primary hover:underline font-normal break-all text-left"
                        >
                          {row.id}
                        </button>
                      </TableCell>

                      {/* 3. 货主名称/标识 (双行) */}
                      <TableCell>
                        <div className="font-normal text-foreground line-clamp-1">
                          {row.ownerName}
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {row.ownerIdentity}
                        </div>
                      </TableCell>

                      {/* 4. 移库时间 (双行) */}
                      <TableCell>
                        <div className="text-sm font-normal text-foreground">
                          {datePart}
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {timePart}
                        </div>
                      </TableCell>

                      {/* 5. 移库类型 (双行: 类型文本 + 关联单号) */}
                      <TableCell>
                        <div className="font-normal text-foreground">
                          {row.transferTypeName}
                        </div>
                        {row.relatedId ? (
                          <div className="text-xs text-muted-foreground font-normal">
                            {row.relatedId}
                          </div>
                        ) : null}
                      </TableCell>

                      {/* 6. 仓库名称 */}
                      <TableCell className="font-normal text-foreground">
                        {row.warehouseName}
                      </TableCell>

                      {/* 7. 货物名称 (超出2条展示更多 Popover) */}
                      <TableCell>
                        {row.goodsList.length <= 2 ? (
                          <div className="space-y-0.5">
                            {row.goodsList.map((g, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-foreground font-normal leading-relaxed"
                              >
                                {g.goodsName} ({g.amount}
                                {g.unit})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            {row.goodsList.slice(0, 2).map((g, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-foreground font-normal leading-relaxed"
                              >
                                {g.goodsName} ({g.amount}
                                {g.unit})
                              </div>
                            ))}
                            <Popover>
                              <PopoverTrigger
                                render={
                                  <button
                                    type="button"
                                    className="text-xs text-primary hover:underline cursor-pointer font-normal"
                                  />
                                }
                              >
                                更多 ({row.goodsList.length})...
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3 text-xs space-y-1.5 max-h-60 overflow-y-auto">
                                <div className="font-semibold text-foreground pb-1 border-b">
                                  全部移库货物明细
                                </div>
                                {row.goodsList.map((g, idx) => (
                                  <div
                                    key={idx}
                                    className="text-muted-foreground flex justify-between py-0.5"
                                  >
                                    <span>{g.goodsName}</span>
                                    <span className="font-medium text-foreground ml-2">
                                      {g.amount}
                                      {g.unit}
                                    </span>
                                  </div>
                                ))}
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </TableCell>

                      {/* 8. 移库数量 */}
                      <TableCell className="text-right font-normal text-foreground">
                        {row.totalAmount}
                        <span className="text-xs text-muted-foreground ml-0.5">
                          {row.unit}
                        </span>
                      </TableCell>

                      {/* 9. 制单人 (双行: 姓名+机构, 时间) */}
                      <TableCell>
                        <div className="text-xs font-normal text-foreground">
                          {row.createByName}
                          {row.createOrgName ? `(${row.createOrgName})` : ""}
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {createDate} {createTime}
                        </div>
                      </TableCell>

                      {/* 10. 操作 (固定右侧，防文字穿透，严格对齐规范 TableRowActionPanel) */}
                      <TableCell
                        style={{
                          width: TABLE_ROW_ACTION_COL_TOTAL_PX,
                          minWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
                        }}
                        className="text-center align-middle sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] z-10 px-3 py-2"
                      >
                        <TableRowActionPanel
                          actions={[
                            {
                              key: "detail",
                              label: "查看详情",
                              title: "查看移库详情",
                              onClick: () => onViewDetail(row),
                            },
                            {
                              key: "downloadLog",
                              label: "下载记录",
                              title: "查看下载记录",
                              onClick: () => onDownloadLog(row),
                            },
                            {
                              key: "downloadDoc",
                              label: "单据下载",
                              title: "下载标准移库凭证",
                              onClick: () => onDownloadDoc(row),
                            },
                          ]}
                          fixedCols={3}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

