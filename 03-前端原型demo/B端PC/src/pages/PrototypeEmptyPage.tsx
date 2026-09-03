import {
  ArrowLeft,
  BellRing,
  Boxes,
  CircleGauge,
  Compass,
  Home,
  KeyRound,
  Settings2,
  ShieldAlert,
  Warehouse,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getActiveTopModule, getBreadcrumbs, getPageTitle, PERMISSION_REFERENCE_PATH } from "@/config/navigation"
import { cn } from "@/lib/utils"

const moduleVisuals: Record<
  string,
  { icon: LucideIcon; accent: string; ring: string; iconColor: string }
> = {
  home: {
    icon: Home,
    accent: "from-sky-50 via-blue-50 to-indigo-50",
    ring: "ring-blue-100/80",
    iconColor: "text-blue-600",
  },
  storage: {
    icon: Warehouse,
    accent: "from-emerald-50 via-teal-50 to-cyan-50",
    ring: "ring-emerald-100/80",
    iconColor: "text-emerald-600",
  },
  finance: {
    icon: CircleGauge,
    accent: "from-violet-50 via-purple-50 to-fuchsia-50",
    ring: "ring-violet-100/80",
    iconColor: "text-violet-600",
  },
  trade: {
    icon: Boxes,
    accent: "from-amber-50 via-orange-50 to-yellow-50",
    ring: "ring-amber-100/80",
    iconColor: "text-amber-600",
  },
  risk: {
    icon: ShieldAlert,
    accent: "from-rose-50 via-red-50 to-orange-50",
    ring: "ring-rose-100/80",
    iconColor: "text-rose-600",
  },
  "device-warning": {
    icon: BellRing,
    accent: "from-blue-50 via-indigo-50 to-violet-50",
    ring: "ring-indigo-100/80",
    iconColor: "text-indigo-600",
  },
  statistics: {
    icon: CircleGauge,
    accent: "from-cyan-50 via-sky-50 to-blue-50",
    ring: "ring-cyan-100/80",
    iconColor: "text-cyan-600",
  },
  settlement: {
    icon: Boxes,
    accent: "from-lime-50 via-green-50 to-emerald-50",
    ring: "ring-lime-100/80",
    iconColor: "text-lime-700",
  },
  config: {
    icon: Settings2,
    accent: "from-slate-50 via-gray-50 to-zinc-50",
    ring: "ring-slate-200/80",
    iconColor: "text-slate-600",
  },
}

export function PrototypeEmptyPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const pageTitle = getPageTitle(pathname)
  const breadcrumbs = getBreadcrumbs(pathname)
  const activeModule = getActiveTopModule(pathname)
  const visual = moduleVisuals[activeModule.id] ?? moduleVisuals.home
  const Icon = visual.icon

  return (
    <div className="flex h-full min-h-[420px] items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div
          className={cn(
            "mx-auto flex size-24 items-center justify-center rounded-[28px] bg-gradient-to-br shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1",
            visual.accent,
            visual.ring,
          )}
        >
          <Icon className={cn("size-11", visual.iconColor)} strokeWidth={1.6} />
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/80 px-3 py-1 text-[11px] text-muted-foreground shadow-sm">
          <Compass className="size-3.5" />
          <span>原型占位页</span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{pageTitle}</h1>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <span className="text-muted-foreground/50">/</span>}
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs",
                  index === breadcrumbs.length - 1
                    ? "bg-primary/10 font-medium text-primary"
                    : "bg-muted/60 text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </span>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          该菜单已纳入 PC 原型导航，高保真交互页面将在后续版本迭代中补充。
        </p>
        <p className="mt-2 text-xs text-muted-foreground/75">
          可先查看同模块已交付页面，或通过「功能与数据权限」对照研发清单。
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/40"
          >
            <ArrowLeft className="size-4" />
            返回上一页
          </button>
          <Link
            to={PERMISSION_REFERENCE_PATH}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <KeyRound className="size-4" />
            功能与数据权限
          </Link>
        </div>
      </div>
    </div>
  )
}

/** @deprecated Use PrototypeEmptyPage */
export const PlaceholderPage = PrototypeEmptyPage
