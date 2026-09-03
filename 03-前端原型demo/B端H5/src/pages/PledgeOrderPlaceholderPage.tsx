import { Link } from "react-router-dom"
import { FileWarning } from "lucide-react"
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
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
        <div className="flex size-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 ring-1 ring-amber-100/80 shadow-[0_16px_40px_rgba(245,158,11,0.12)]">
          <FileWarning className="size-11 text-amber-600" strokeWidth={1.6} />
        </div>
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/90 px-3 py-1 text-[11px] font-medium text-amber-700 shadow-sm">
          业务跳转占位页
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">解除预警 · 情况说明</h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
          R31 专用跳转页：用户在此填写情况说明并解除预警（R32），非押品模块内弹窗。
        </p>
        <div className="mt-6 w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-700 shadow-sm">
          <div>订单号：{orderNo}</div>
          <div className="mt-2">预警 ID：{warnId}</div>
        </div>
        <Link
          to="/m/supervision/order-warnings"
          className="mt-8 inline-flex h-11 w-full max-w-xs items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm active:bg-blue-700"
        >
          返回押品预警列表
        </Link>
      </div>
    </MobileShell>
  )
}
