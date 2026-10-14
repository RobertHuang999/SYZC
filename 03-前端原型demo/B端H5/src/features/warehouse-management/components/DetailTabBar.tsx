import { DETAIL_TABS, type WarehouseDetailTab } from "../domain/constants"

type DetailTabBarProps = {
  active: WarehouseDetailTab
  onChange: (tab: WarehouseDetailTab) => void
}

export function DetailTabBar({ active, onChange }: DetailTabBarProps) {
  return (
    <div className="shrink-0 border-b border-gray-100 bg-white">
      <div className="flex gap-1 overflow-x-auto px-2 py-2 no-scrollbar">
        {DETAIL_TABS.map((tab) => {
          const isActive = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
