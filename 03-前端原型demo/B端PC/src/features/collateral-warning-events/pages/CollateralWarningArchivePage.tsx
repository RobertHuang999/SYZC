import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Archive, ArrowLeft, Eye, ShieldAlert } from "lucide-react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { archivedCollateralWarningEventsMock } from "../mock/collateral-warning-events.mock"
import type { WarningStatusFilter } from "../domain/status"
import { mapStatusFilterToValue } from "../domain/status"

export function CollateralWarningArchivePage() {
  const navigate = useNavigate()
  const [orderNo, setOrderNo] = useState("")
  const [warningType, setWarningType] = useState("全部")
  const [severityLevelId, setSeverityLevelId] = useState("全部")
  const [statusFilter, setStatusFilter] = useState<WarningStatusFilter>("全部")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredEvents = useMemo(() => {
    return archivedCollateralWarningEventsMock.filter((event) => {
      if (orderNo.trim() && !event.orderNo.toLowerCase().includes(orderNo.trim().toLowerCase())) {
        return false
      }
      if (warningType !== "全部" && event.warningType !== warningType) {
        return false
      }
      if (severityLevelId !== "全部" && event.severityLevelId !== severityLevelId) {
        return false
      }
      if (statusFilter !== "全部") {
        if (event.warningStatus !== mapStatusFilterToValue(statusFilter)) return false
      }
      return true
    })
  }, [orderNo, warningType, severityLevelId, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEvents.slice(start, start + pageSize)
  }, [filteredEvents, currentPage, pageSize])

  const handleReset = () => {
    setOrderNo("")
    setWarningType("全部")
    setSeverityLevelId("全部")
    setStatusFilter("全部")
    setPage(1)
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">历史押品预警（归档）</h1>
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
              <Archive className="mr-1 size-3" />
              历史归档库
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            展示 6.1 及历史割接存量预警流水，固化历史快照与处置事实，仅供追溯与司法审计查验（只读不可写）
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/物联网IOT与预警/预警信息/押品预警信息")}
          className="gap-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="size-4" />
          返回全新的「押品预警信息」
        </Button>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-900">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div>
            <strong>归档隔离说明：</strong>
            根据业务与风控合规要求，当前页面的所有预警流水均为历史系统或历史旧规则产生的割接存量数据。
            该部分流水已全部冻结，<strong>不参与</strong>新版综合规则判决、<strong>不触发</strong>新版超时升级，亦不可在前端发起解除或二次公示。
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between border-b pb-2 text-sm font-medium">
            <span>筛选条件</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                重置
              </Button>
              <Button size="sm" onClick={() => setPage(1)}>
                查询
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">预警订单</label>
              <Input
                placeholder="请输入订单号模糊匹配"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">预警类型</label>
              <Select value={warningType} onValueChange={(val) => setWarningType(val || "全部")}>
                <SelectTrigger>
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部类型</SelectItem>
                  <SelectItem value="价格下跌">价格下跌</SelectItem>
                  <SelectItem value="物联穿透告警">物联穿透告警</SelectItem>
                  <SelectItem value="抵/质押率异常">抵/质押率异常</SelectItem>
                  <SelectItem value="盘点异常">盘点异常</SelectItem>
                  <SelectItem value="巡检异常">巡检异常</SelectItem>
                  <SelectItem value="解抵/质押/监管超时">解抵/质押/监管超时</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">预警等级</label>
              <Select value={severityLevelId} onValueChange={(val) => setSeverityLevelId(val || "全部")}>
                <SelectTrigger>
                  <SelectValue placeholder="全部等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部等级</SelectItem>
                  {ENABLED_SEVERITY_LEVELS.map((level) => (
                    <SelectItem key={level.severityLevelId} value={level.severityLevelId}>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: level.severityColor }}
                        />
                        <span>
                          {level.severityCode} {level.severityName}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">预警状态</label>
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter((val || "全部") as WarningStatusFilter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部状态</SelectItem>
                  <SelectItem value="待处置 · 有效">待处置 · 有效</SelectItem>
                  <SelectItem value="已结案 · 有效">已结案 · 有效</SelectItem>
                  <SelectItem value="已作废">已作废</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">序号</TableHead>
              <TableHead className="w-32">预警订单</TableHead>
              <TableHead className="w-32">预警类型</TableHead>
              <TableHead className="w-28">预警等级</TableHead>
              <TableHead className="w-28">预警来源</TableHead>
              <TableHead>预警内容摘要</TableHead>
              <TableHead className="w-36">预警发生时间</TableHead>
              <TableHead className="w-28">处理人</TableHead>
              <TableHead className="w-28">归档状态</TableHead>
              <TableHead className="w-20 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                  暂无匹配的历史归档预警记录
                </TableCell>
              </TableRow>
            ) : (
              pageEvents.map((event, index) => (
                <TableRow key={event.eventId}>
                  <TableCell className="text-xs text-muted-foreground">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium text-blue-600">
                    {event.orderNo}
                  </TableCell>
                  <TableCell className="text-xs font-medium">{event.warningType}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: event.severityColor }}
                      />
                      <span>{event.severityName}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-100/70 text-amber-800 text-[11px]">
                      历史归档
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground" title={event.warningContent}>
                    {event.warningContent}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <TableDateTimeCell value={event.warningTime} plain />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{event.processedBy || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-300 text-slate-700 text-[11px]">
                      只读归档
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => navigate(`/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`)}
                    >
                      <Eye className="mr-1 size-3.5" />
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <WarningListPagination
        total={filteredEvents.length}
        page={currentPage}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}
