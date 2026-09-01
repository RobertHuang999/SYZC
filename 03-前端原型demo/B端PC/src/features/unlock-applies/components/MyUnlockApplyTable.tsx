import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MY_APPLY_LIST_PATH } from "../domain/constants"
import type { UnlockApply } from "../domain/types"
import { CredentialStatusBadge } from "./CredentialStatusBadge"
import { UnlockApplyStatusBadge } from "./UnlockApplyStatusBadge"

type MyUnlockApplyTableProps = {
  items: UnlockApply[]
  startIndex?: number
  onWithdraw?: (apply: UnlockApply) => void
}

function getDetailPath(applyNo: string) {
  return `${MY_APPLY_LIST_PATH}/unlock-applies/${applyNo}`
}

export function MyUnlockApplyTable({
  items,
  startIndex = 0,
  onWithdraw,
}: MyUnlockApplyTableProps) {
  return (
    <div className="overflow-visible rounded-md border bg-card">
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[88px]">是否需要审核</TableHead>
            <TableHead className="sticky left-0 z-10 bg-card w-[110px]">
              申请状态
            </TableHead>
            <TableHead className="w-[100px]">凭证状态</TableHead>
            <TableHead>设备名称</TableHead>
            <TableHead>设备编码</TableHead>
            <TableHead>绑定仓库</TableHead>
            <TableHead className="w-20">事由</TableHead>
            <TableHead className="w-40">提交时间</TableHead>
            <TableHead className="sticky right-0 z-10 bg-card w-[120px]">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                <div>暂无开锁申请</div>
                <div className="mt-1 text-xs">可从门禁设备发起临时开锁申请</div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.applyNo}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  {item.needsApproval ? (
                    <span className="text-sm">是</span>
                  ) : (
                    <Badge variant="secondary" className="font-normal">
                      否
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="sticky left-0 z-10 bg-card">
                  <UnlockApplyStatusBadge apply={item} />
                </TableCell>
                <TableCell>
                  <CredentialStatusBadge status={item.credential.status} />
                </TableCell>
                <TableCell className="font-medium">{item.deviceName}</TableCell>
                <TableCell>{item.deviceCode}</TableCell>
                <TableCell>{item.warehouseName}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.submitTime.slice(0, 16).replace("T", " ")}</TableCell>
                <TableCell className="sticky right-0 z-10 bg-card">
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-sm text-primary hover:underline"
                      to={getDetailPath(item.applyNo)}
                    >
                      详情
                    </Link>
                    {item.status === "PENDING" && item.needsApproval && (
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => onWithdraw?.(item)}
                      >
                        撤回
                      </button>
                    )}
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
