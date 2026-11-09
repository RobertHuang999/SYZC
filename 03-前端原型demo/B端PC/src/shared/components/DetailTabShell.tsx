import type { ReactNode } from "react"

export type DetailTabItem = {
  key: string
  label: string
  badge?: ReactNode
}

/**
 * PC 详情页统一标签区：基础信息之外的内容（明细、凭证、审核、修改、资料）统一放页签，
 * 不再平铺成一长串板块。所有详情页共用同一套外观。
 */
export function DetailTabShell({
  tabs,
  active,
  onChange,
  children,
}: {
  tabs: DetailTabItem[]
  active: string
  onChange: (key: string) => void
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-xs">
      <div data-detail-tabs className="flex flex-wrap border-b border-border px-4">
        {tabs.map((tab) => {
          const isActive = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`-mb-px mr-6 border-b-2 px-1 py-3 text-sm transition-colors ${
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent font-medium text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {tab.label}
                {tab.badge}
              </span>
            </button>
          )
        })}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
