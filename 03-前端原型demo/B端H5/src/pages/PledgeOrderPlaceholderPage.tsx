import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { useSearchParams } from "react-router-dom"

export function PledgeOrderPlaceholderPage() {
  const [params] = useSearchParams()
  const orderNo = params.get("order") ?? "—"
  const warnId = params.get("warn_id") ?? "—"

  return (
    <MobileShell>
      <NavBar title="抵质押订单" backTo="/m/supervision/order-warnings" />
      <div className="space-y-3 px-4 py-6 text-sm text-gray-700">
        <p className="rounded-xl bg-blue-50 p-4 text-blue-900">
          R31 跳转占位页：用户在此填写情况说明并解除预警（R32），非押品模块内弹窗。
        </p>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div>订单号：{orderNo}</div>
          <div className="mt-2">预警 ID：{warnId}</div>
        </div>
      </div>
    </MobileShell>
  )
}
