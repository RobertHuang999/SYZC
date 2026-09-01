import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { WAREHOUSE_OPTIONS } from "../domain/constants"
import type { AccessDeviceFilters } from "../domain/types"

type AccessControlDeviceFiltersProps = {
  value: AccessDeviceFilters
  onChange: (value: AccessDeviceFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function AccessControlDeviceFilters({
  value,
  onChange,
  onSearch,
  onReset,
}: AccessControlDeviceFiltersProps) {
  return (
    <Card>
      <div className="px-4 pt-4">
        <h1 className="text-lg font-semibold">门禁设备</h1>
      </div>
      <WarningFilterHeader onSearch={onSearch} onReset={onReset} />
      <CardContent className="grid gap-4 pb-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-2">
          <Label>设备名称</Label>
          <Input
            placeholder="系统内名称"
            value={value.displayName}
            onChange={(e) => onChange({ ...value, displayName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        <div className="space-y-2">
          <Label>设备类型</Label>
          <Select
            value={value.deviceType}
            onValueChange={(v) =>
              onChange({ ...value, deviceType: (v ?? "全部") as AccessDeviceFilters["deviceType"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="挂锁门禁">挂锁门禁</SelectItem>
              <SelectItem value="人脸门禁">人脸门禁</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>设备状态</Label>
          <Select
            value={value.status}
            onValueChange={(v) =>
              onChange({ ...value, status: (v ?? "全部") as AccessDeviceFilters["status"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="在线">在线</SelectItem>
              <SelectItem value="离线">离线</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>仓库</Label>
          <Select
            value={value.warehouseName}
            onValueChange={(v) => onChange({ ...value, warehouseName: v ?? "全部" })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WAREHOUSE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>绑定状态</Label>
          <Select
            value={value.bindStatus}
            onValueChange={(v) =>
              onChange({ ...value, bindStatus: (v ?? "全部") as AccessDeviceFilters["bindStatus"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="已绑定">已绑定</SelectItem>
              <SelectItem value="未绑定">未绑定</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>更新时间（起）</Label>
          <Input
            type="date"
            value={value.updatedFrom}
            onChange={(e) => onChange({ ...value, updatedFrom: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
