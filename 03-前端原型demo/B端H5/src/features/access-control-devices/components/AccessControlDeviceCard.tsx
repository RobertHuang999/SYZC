import { Lock, UserRound } from "lucide-react"
import type { AccessDevice } from "../domain/types"

type AccessControlDeviceCardProps = {
  device: AccessDevice
  onGetPassword: (device: AccessDevice) => void
  onAction: (action: string, device: AccessDevice) => void
}

export function AccessControlDeviceCard({
  device,
  onGetPassword,
  onAction,
}: AccessControlDeviceCardProps) {
  const isLock = device.deviceType === "挂锁门禁"

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xs border border-gray-100">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-white ${
            isLock ? "bg-amber-500" : "bg-blue-600"
          }`}
        >
          {isLock ? <Lock className="size-5" /> : <UserRound className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {device.displayName}
            </h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] ${
                device.status === "在线" ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  device.status === "在线" ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
              {device.status}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-gray-500">
            {device.deviceCode} · {device.deviceType}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {device.warehouseName ?? "未绑定"} · {device.locationDetail}
          </p>
          <p className="mt-1 text-[10px] text-gray-400">更新 {device.updatedAt}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-nowrap items-center gap-1 border-t border-gray-50 pt-3">
        {["重命名", "绑定", "数据"].map((action) => (
          <button
            key={action}
            type="button"
            className="shrink-0 whitespace-nowrap rounded-lg border border-gray-200 px-1.5 py-1 text-[10px] text-gray-600"
            onClick={() => onAction(action, device)}
          >
            {action}
          </button>
        ))}
        <button
          type="button"
          className="min-w-0 flex-1 whitespace-nowrap rounded-lg bg-blue-600 px-1.5 py-1 text-[10px] font-medium text-white"
          onClick={() => onGetPassword(device)}
        >
          {isLock ? "获取门锁密码" : "获取门禁密码"}
        </button>
        <button
          type="button"
          className="shrink-0 whitespace-nowrap rounded-lg border border-rose-200 px-1.5 py-1 text-[10px] text-rose-600"
          onClick={() => onAction("移除", device)}
        >
          移除
        </button>
      </div>
    </div>
  )
}
