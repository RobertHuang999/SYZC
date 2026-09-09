import { useState, useMemo } from "react"
import {
  CopyIcon,
  CheckIcon,
  RadioTowerIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  getDevicesForUnlockConfig,
} from "../mock/reference-data.mock"

interface UnlockDeviceScopeDialogProps {
  open: boolean
  configName: string
  configNo: string
  deviceCodes: string[]
  onOpenChange: (open: boolean) => void
}

export function UnlockDeviceScopeDialog({
  open,
  configName,
  configNo,
  deviceCodes,
  onOpenChange,
}: UnlockDeviceScopeDialogProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // 获取该配置下的已关联门禁设备详情列表
  const rawDevices = useMemo(() => {
    return getDevicesForUnlockConfig(deviceCodes)
  }, [deviceCodes])

  const copyDeviceCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    window.setTimeout(() => setCopiedCode(null), 2000)
  }

  const onlineCount = rawDevices.filter((d) => d.status === "在线").length
  const offlineCount = rawDevices.filter((d) => d.status === "离线").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RadioTowerIcon className="size-4.5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  已关联设备清单
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  配置：{configName} · 编号：{configNo}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Badge variant="outline" className="bg-muted/40 font-normal">
                总计 {rawDevices.length} 台设备
              </Badge>
              {onlineCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-50 text-emerald-700 font-normal dark:bg-emerald-950/40 dark:text-emerald-400"
                >
                  在线 {onlineCount}
                </Badge>
              )}
              {offlineCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-rose-500/30 bg-rose-50 text-rose-700 font-normal dark:bg-rose-950/40 dark:text-rose-400"
                >
                  离线 {offlineCount}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* 主体内容：纯粹展示设备清单表格 */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/50 text-muted-foreground border-b font-medium">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3">设备编号</th>
                  <th className="py-2.5 px-3">设备名称</th>
                  <th className="py-2.5 px-3">设备类型</th>
                  <th className="py-2.5 px-3">所属仓库</th>
                  <th className="py-2.5 px-3">安装货位 / 位置</th>
                  <th className="py-2.5 px-3 w-20 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rawDevices.length > 0 ? (
                  rawDevices.map((device, idx) => (
                    <tr
                      key={device.deviceCode}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 font-mono text-foreground">
                          <span>{device.deviceCode}</span>
                          <button
                            type="button"
                            onClick={() => copyDeviceCode(device.deviceCode)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            title="复制设备编号"
                          >
                            {copiedCode === device.deviceCode ? (
                              <CheckIcon className="size-3 text-emerald-600" />
                            ) : (
                              <CopyIcon className="size-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground">
                        {device.deviceName}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className={
                            device.deviceType === "人脸门禁"
                              ? "border-sky-500/30 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 font-normal"
                              : "border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-normal"
                          }
                        >
                          {device.deviceType}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {device.warehouseName}
                      </td>
                      <td className="py-2.5 px-3 text-foreground">
                        {device.location}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {device.status === "在线" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            在线
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-muted-foreground" />
                            离线
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-muted-foreground"
                    >
                      暂无设备记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部 */}
        <DialogFooter className="border-t pt-3 flex items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground">
            共 {rawDevices.length} 台设备
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
