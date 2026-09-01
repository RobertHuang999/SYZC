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
import type { AccessDevice } from "../domain/types"

type AccessControlDeviceTableProps = {
  devices: AccessDevice[]
  page: number
  pageSize: number
  onGetPassword: (device: AccessDevice) => void
  onOtherAction: (action: string, device: AccessDevice) => void
}

export function AccessControlDeviceTable({
  devices,
  page,
  pageSize,
  onGetPassword,
  onOtherAction,
}: AccessControlDeviceTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">序号</TableHead>
            <TableHead>设备原名称</TableHead>
            <TableHead>系统内名称</TableHead>
            <TableHead>设备编码</TableHead>
            <TableHead>设备类型</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>绑定仓库</TableHead>
            <TableHead>具体位置</TableHead>
            <TableHead>修改人员</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead className="min-w-[280px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                暂无门禁设备
              </TableCell>
            </TableRow>
          ) : (
            devices.map((device, index) => (
              <TableRow key={device.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{device.originalName}</TableCell>
                <TableCell className="font-medium">{device.displayName}</TableCell>
                <TableCell className="font-mono text-sm">{device.deviceCode}</TableCell>
                <TableCell>
                  <Badge variant="outline">{device.deviceType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={device.status === "在线" ? "default" : "secondary"}>
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell>{device.warehouseName ?? "未绑定"}</TableCell>
                <TableCell>{device.locationDetail}</TableCell>
                <TableCell>{device.updatedBy}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{device.updatedAt}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-1"
                      onClick={() => onOtherAction("重命名", device)}
                    >
                      重命名
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-1"
                      onClick={() => onOtherAction("仓库绑定", device)}
                    >
                      仓库绑定
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-1"
                      onClick={() => onOtherAction("设备数据", device)}
                    >
                      设备数据
                    </Button>
                    {device.deviceType === "人脸门禁" && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto px-1"
                        onClick={() => onOtherAction("人脸配置", device)}
                      >
                        人脸配置
                      </Button>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-1 font-medium text-primary"
                      onClick={() => onGetPassword(device)}
                    >
                      {device.deviceType === "挂锁门禁" ? "获取门锁密码" : "获取门禁密码"}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-1 text-destructive"
                      onClick={() => onOtherAction("移除设备", device)}
                    >
                      移除设备
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
