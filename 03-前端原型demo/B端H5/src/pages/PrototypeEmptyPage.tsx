import { ArrowLeft, Compass, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { IconRenderer } from "@/components/common/IconRenderer"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import type { MenuItemData } from "@/data/mobileMenuData"

type PrototypeEmptyPageProps = {
  title: string
  menuItem?: MenuItemData
  backTo?: string
  description?: string
}

export function PrototypeEmptyPage({
  title,
  menuItem,
  backTo = "/m/workspace",
  description,
}: PrototypeEmptyPageProps) {
  const navigate = useNavigate()
  const pathLabel = menuItem
    ? [menuItem.primaryModule, menuItem.secondaryCategory, menuItem.subTab ?? menuItem.name]
        .filter(Boolean)
        .join(" / ")
    : title

  return (
    <MobileShell>
      <NavBar title={title} backTo={backTo} />

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
        <div className="relative flex size-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 shadow-[0_16px_40px_rgba(37,99,235,0.12)] ring-1 ring-blue-100/80">
          {menuItem?.iconType ? (
            <IconRenderer icon={menuItem.iconType} className="size-11 text-blue-600" />
          ) : (
            <Compass className="size-11 text-blue-600" strokeWidth={1.6} />
          )}
          <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-blue-100">
            <Sparkles className="size-4 text-amber-500" />
          </span>
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1 text-[11px] font-medium text-blue-700 shadow-sm">
          原型占位页
        </div>

        <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900">{title}</h1>

        <p className="mt-2 text-xs leading-relaxed text-gray-500">{pathLabel}</p>

        <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-600">
          {description ??
            menuItem?.description ??
            "该功能已纳入移动端菜单导航，高保真交互页面将在后续版本迭代中补充。"}
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm active:bg-blue-700"
          >
            <ArrowLeft className="size-4" />
            返回上一级
          </button>
          <button
            type="button"
            onClick={() => navigate("/m/workspace")}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 active:bg-gray-50"
          >
            回到工作台
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
