import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UnlockApplyTable } from "./UnlockApplyTable"
import type { UnlockApply } from "../domain/types"
import type { ApprovalCenterCard } from "../mock/approval-center-hub.mock"
import {
  PREVIEW_ROW_LIMIT,
  businessPendingPreviewMock,
  policyPreviewMock,
} from "../mock/approval-center-hub.mock"

type ApprovalCenterPreviewPanelProps = {
  card: ApprovalCenterCard
  unlockItems: UnlockApply[]
  onProcessUnlock?: (apply: UnlockApply) => void
}

export function ApprovalCenterPreviewPanel({
  card,
  unlockItems,
  onProcessUnlock,
}: ApprovalCenterPreviewPanelProps) {
  const previewRows = businessPendingPreviewMock.slice(0, PREVIEW_ROW_LIMIT)
  const policyRows = policyPreviewMock.slice(0, PREVIEW_ROW_LIMIT)
  const unlockPreviewItems = unlockItems.slice(0, PREVIEW_ROW_LIMIT)

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{card.groupLabel}</p>
          <h2 className="truncate text-base font-semibold">{card.label}</h2>
        </div>
        <Link
          to={card.path}
          className="shrink-0 text-sm text-primary transition hover:text-primary/80 hover:underline"
        >
          查看更多 &gt;
        </Link>
      </div>

      <div className="p-1">
        {card.previewType === "business" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead>流程类型名称</TableHead>
                <TableHead>货主信息</TableHead>
                <TableHead>流程状态</TableHead>
                <TableHead>货物信息</TableHead>
                <TableHead>发起人</TableHead>
                <TableHead>到达时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.processType}</TableCell>
                  <TableCell>
                    <div className="max-w-[160px] truncate">{item.ownerName}</div>
                    <div className="max-w-[160px] truncate text-xs text-muted-foreground">{item.ownerCode}</div>
                  </TableCell>
                  <TableCell>{item.processStatus}</TableCell>
                  <TableCell className="max-w-[140px] truncate">{item.goodsInfo}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{item.initiator}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs">{item.arrivedAt}</TableCell>
                  <TableCell className="text-right">
                    <button type="button" className="text-xs text-primary hover:underline">
                      详情
                    </button>
                    <span className="mx-1 text-muted-foreground">|</span>
                    <button type="button" className="text-xs text-primary hover:underline">
                      去处理
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {card.previewType === "unlock" && (
          <UnlockApplyTable items={unlockPreviewItems} compact onProcess={onProcessUnlock} />
        )}

        {card.previewType === "policy" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead>资讯标题</TableHead>
                <TableHead>发布方</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policyRows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{item.title}</TableCell>
                  <TableCell>{item.publisher}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs">{item.submittedAt}</TableCell>
                  <TableCell className="text-right">
                    <button type="button" className="text-xs text-primary hover:underline">
                      详情
                    </button>
                    <span className="mx-1 text-muted-foreground">|</span>
                    <button type="button" className="text-xs text-primary hover:underline">
                      去审核
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {card.previewType === "empty" && (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">该模块高保真页面尚未接入原型</p>
            <p className="text-xs text-muted-foreground/75">点击右上角「查看更多」进入占位页或后续完整列表</p>
          </div>
        )}
      </div>
    </section>
  )
}
