import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { warehousesMock } from "../mock/warehouses.mock"
import type { WarehouseRecord } from "../domain/types"
import { WAREHOUSE_QUOTA, WORKSPACE_ROUTE } from "../domain/constants"
import { WarehouseCard } from "../components/WarehouseCard"
import {
  VersionChangeProvider,
  VersionChangeToggleBar,
} from "../components/VersionChangeHighlight"

const ZHONGDENG_OPTIONS: DropdownOption[] = [
  { label: "全部", value: "全部" },
  { label: "是", value: "是" },
  { label: "否", value: "否" },
]

export function WarehouseListPage() {
  const [zhongdengFilter, setZhongdengFilter] = useState("全部")
  const [keyword, setKeyword] = useState("")
  const [rows, setRows] = useState<WarehouseRecord[]>(() => [...warehousesMock])
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (keyword.trim() && !row.name.includes(keyword.trim())) return false
      if (zhongdengFilter === "是" && row.zhongdengAccess !== "YES") return false
      if (zhongdengFilter === "否" && row.zhongdengAccess !== "NO") return false
      return true
    })
  }, [rows, keyword, zhongdengFilter])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  return (
    <VersionChangeProvider>
      <MobileShell>
        <PrototypeAnnotationTarget annotationIds={["wh-h5-list"]}>
          <NavBar title="仓库管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        <VersionChangeToggleBar />

        <div className="shrink-0 space-y-2 border-b border-gray-100 bg-white px-3 py-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <DropdownFilterPill
              label="中仓登准入仓标记"
              value={zhongdengFilter}
              options={ZHONGDENG_OPTIONS}
              onChange={setZhongdengFilter}
            />
            <span className="text-right leading-tight">
              当前可使用 {WAREHOUSE_QUOTA.used.toLocaleString()} 个
              <br />
              最多 {WAREHOUSE_QUOTA.max.toLocaleString()} 个同时使用
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm"
              placeholder="请输入仓库名称"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-6">
          {filtered.map((item) => (
            <WarehouseCard
              key={item.id}
              item={item}
              onDelete={() => {
                if (item.status === "ENABLED") {
                  showToast("该仓库处于启用状态，仅停用状态支持删除操作！")
                  return
                }
                if (item.storerooms.length > 0) {
                  showToast("请先删除所有库房再进行仓库删除！")
                  return
                }
                setRows((prev) => prev.filter((r) => r.id !== item.id))
                showToast("删除成功")
              }}
              onToggleStatus={() => {
                if (item.status === "ENABLED" && item.hasInventory) {
                  showToast("该仓库下还有货物存放，请处理后再进行停用操作！")
                  return
                }
                setRows((prev) =>
                  prev.map((r) =>
                    r.id === item.id
                      ? {
                          ...r,
                          status:
                            r.status === "ENABLED" ? "DISABLED" : "ENABLED",
                        }
                      : r
                  )
                )
                showToast(item.status === "ENABLED" ? "停用成功" : "启用成功")
              }}
            />
          ))}
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">没有更多数据了</p>
          ) : (
            <p className="py-4 text-center text-xs text-gray-400">
              没有更多数据了
            </p>
          )}
        </div>

        {toast ? (
          <div className="fixed bottom-20 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
            {toast}
          </div>
        ) : null}
      </MobileShell>
    </VersionChangeProvider>
  )
}
