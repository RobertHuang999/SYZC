import { useMemo, useState } from "react"
import { KeyRound, Search, Sparkles, Filter, X, ShieldAlert, Clock } from "lucide-react"
import type { PermissionRecord, PrototypeRouteResolver } from "../types"
import { ActionButtonLegend, ActionButtonList } from "../components/ActionButtonList"
import { ChangeLogCell, ChangeLogLegend } from "../components/ChangeLogCell"
import { DataScopeLegend, DataScopeList } from "../components/DataScopeList"
import { PagePathCell, PagePathLegend } from "../components/PagePathCell"
import { ModalOverlay } from "../components/ModalOverlay"
import {
  countCancelledFeatures,
  countPlannedFeatures,
  countRecentChanges,
  isArchivedFeature,
  isCancelledFeature,
  isPlannedFeature,
  isRecentChange,
} from "../lib/record-status"

export type PermissionReferencePageProps = {
  records: PermissionRecord[]
  systemName?: string
  routeResolver?: PrototypeRouteResolver
  onNavigate?: (route: string) => void
}

type PlatformFilter = "PC" | "移动" | "全部"
type ChangeFilter = "全部" | "最近变更"

function getSubMenuKey(record: PermissionRecord) {
  return record.pagePathSegments[0] ?? "其他"
}

export function PermissionReferencePage({
  records,
  systemName = "系统",
  routeResolver,
  onNavigate,
}: PermissionReferencePageProps) {
  const [platform, setPlatform] = useState<PlatformFilter>("PC")
  const [changeFilter, setChangeFilter] = useState<ChangeFilter>("全部")
  const [search, setSearch] = useState("")
  const [activeModule, setActiveModule] = useState<string>("全部")
  const [activeSubMenu, setActiveSubMenu] = useState<string>("全部")

  // 特殊状态弹窗
  const [showPlannedModal, setShowPlannedModal] = useState(false)
  const [showCancelledModal, setShowCancelledModal] = useState(false)

  // 1. 基础过滤：端 + 变更 + 排除归档/待做项
  const scopeRecords = useMemo(() => {
    return records.filter((record) => {
      const matchPlatform = platform === "全部" || record.platform === platform
      const matchChange = changeFilter === "全部" || isRecentChange(record)
      return matchPlatform && matchChange && !isArchivedFeature(record)
    })
  }, [records, platform, changeFilter])

  // 统计数据
  const plannedCount = useMemo(
    () => countPlannedFeatures(records.filter((r) => platform === "全部" || r.platform === platform)),
    [records, platform],
  )
  const cancelledCount = useMemo(
    () => countCancelledFeatures(records.filter((r) => platform === "全部" || r.platform === platform)),
    [records, platform],
  )
  const recentCount = useMemo(
    () => countRecentChanges(scopeRecords),
    [scopeRecords],
  )

  // 规划中与已取消条目列表
  const plannedRecords = useMemo(
    () => records.filter((r) => (platform === "全部" || r.platform === platform) && isPlannedFeature(r)),
    [records, platform],
  )
  const cancelledRecords = useMemo(
    () => records.filter((r) => (platform === "全部" || r.platform === platform) && isCancelledFeature(r)),
    [records, platform],
  )

  // 顶层模块列表
  const modules = useMemo(() => {
    const list = Array.from(new Set(scopeRecords.map((r) => r.module)))
    return list.sort((a, b) => a.localeCompare(b, "zh-CN"))
  }, [scopeRecords])

  // 当前模块下的二级子菜单统计
  const subMenuOptions = useMemo(() => {
    if (activeModule === "全部") return []
    const moduleRecords = scopeRecords.filter((r) => r.module === activeModule)
    const map = new Map<string, number>()
    for (const r of moduleRecords) {
      const key = getSubMenuKey(r)
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "zh-CN"))
  }, [scopeRecords, activeModule])

  // 最终根据搜索与级联筛选得到的结果
  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return scopeRecords.filter((record) => {
      if (activeModule !== "全部" && record.module !== activeModule) return false
      if (activeSubMenu !== "全部" && getSubMenuKey(record) !== activeSubMenu) return false
      if (!keyword) return true

      const haystack = [
        record.module,
        record.pagePath,
        ...record.pagePathSegments,
        record.actionPermissions,
        record.dataPermission,
        record.changeNote,
        record.legacyPath ?? "",
      ].join(" ").toLowerCase()

      return haystack.includes(keyword)
    })
  }, [scopeRecords, activeModule, activeSubMenu, search])

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 dark:bg-slate-950 dark:text-slate-100">
      {/* 头部标题与定位 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {systemName} · 功能与数据权限参考大屏
            </h1>
            <p className="text-xs text-slate-500">
              全域菜单导航、页面操作按钮、数据行级隔离范围与迭代履历全景一览
            </p>
          </div>
        </div>

        {/* 状态快捷统计胶囊 */}
        <div className="flex flex-wrap items-center gap-2">
          {plannedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowPlannedModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800 transition hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300 cursor-pointer"
            >
              <Clock className="size-3.5" />
              <span>规划中特性</span>
              <span className="rounded-full bg-orange-200/80 px-1.5 py-0.2 text-[10px] font-bold">
                {plannedCount}
              </span>
            </button>
          )}

          {cancelledCount > 0 && (
            <button
              type="button"
              onClick={() => setShowCancelledModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 cursor-pointer"
            >
              <ShieldAlert className="size-3.5" />
              <span>已取消条目</span>
              <span className="rounded-full bg-rose-200/80 px-1.5 py-0.2 text-[10px] font-bold">
                {cancelledCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 综合过滤面板 */}
      <div className="mb-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 左侧：端切换 + 变更切换 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 dark:border-slate-800">
              {(["PC", "移动", "全部"] as PlatformFilter[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setPlatform(tab)
                    setActiveSubMenu("全部")
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition cursor-pointer ${
                    platform === tab
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 dark:border-slate-800">
              {(["全部", "最近变更"] as ChangeFilter[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChangeFilter(tab)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition cursor-pointer ${
                    changeFilter === tab
                      ? "bg-slate-800 text-white dark:bg-slate-700"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {tab === "最近变更" ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-400" />
                      <span>最近变更 ({recentCount})</span>
                    </span>
                  ) : (
                    "全量生效"
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：全局搜索框 */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模块/路径/按钮/数据权限/说明..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 模块一级切换 */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Filter className="size-3" />
            模块分类：
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveModule("全部")
              setActiveSubMenu("全部")
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
              activeModule === "全部"
                ? "bg-primary/10 text-primary font-bold"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            全部 ({scopeRecords.length})
          </button>
          {modules.map((mod) => {
            const count = scopeRecords.filter((r) => r.module === mod).length
            return (
              <button
                key={mod}
                type="button"
                onClick={() => {
                  setActiveModule(mod)
                  setActiveSubMenu("全部")
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  activeModule === mod
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {mod.replace(/^\d+[\.、\s]*/, "")} ({count})
              </button>
            )
          })}
        </div>

        {/* 二级联动子菜单 */}
        {activeModule !== "全部" && subMenuOptions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 bg-slate-50/70 p-2 rounded-lg dark:bg-slate-800/40">
            <span className="text-[11px] font-medium text-slate-500">子菜单筛选：</span>
            <button
              type="button"
              onClick={() => setActiveSubMenu("全部")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                activeSubMenu === "全部"
                  ? "bg-white text-slate-900 shadow-xs font-semibold dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              全部
            </button>
            {subMenuOptions.map(([subMenu, count]) => (
              <button
                key={subMenu}
                type="button"
                onClick={() => setActiveSubMenu(subMenu)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                  activeSubMenu === subMenu
                    ? "bg-white text-slate-900 shadow-xs font-semibold dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                {subMenu} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 四维图例说明栏 */}
      <div className="mb-3 grid grid-cols-1 gap-2 rounded-lg border border-slate-200/60 bg-white/70 p-3 text-xs sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">① 页面与原型路径</span>
          <PagePathLegend className="mt-0.5" />
        </div>
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">② 功能操作按钮</span>
          <ActionButtonLegend className="mt-0.5" />
        </div>
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">③ 数据行级隔离范围</span>
          <DataScopeLegend className="mt-0.5" />
        </div>
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">④ 变更修订日志</span>
          <ChangeLogLegend className="mt-0.5" />
        </div>
      </div>

      {/* 主权限列表表格 */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                <th className="p-3 w-1/4">页面与路径 (含原型深链)</th>
                <th className="p-3 w-1/4">功能按钮 / 操作权限</th>
                <th className="p-3 w-1/4">数据可见范围</th>
                <th className="p-3 w-1/4">变更说明 / 修订日志</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="align-top transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                  >
                    <td className="p-3 text-xs">
                      <PagePathCell
                        record={record}
                        routeResolver={routeResolver}
                        onNavigate={onNavigate}
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <ActionButtonList raw={record.actionPermissions} />
                    </td>
                    <td className="p-3 text-xs">
                      <DataScopeList raw={record.dataPermission} />
                    </td>
                    <td className="p-3 text-xs">
                      <ChangeLogCell
                        createdAt={record.createdAt}
                        updatedAt={record.updatedAt}
                        changeNote={record.changeNote}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-xs text-slate-400">
                    没有匹配的功能与数据权限记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 规划中特性弹窗 */}
      <ModalOverlay open={showPlannedModal} onClose={() => setShowPlannedModal(false)}>
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-orange-600" />
            <h3 className="text-sm font-semibold">规划中特性清单 ({plannedRecords.length})</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowPlannedModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 max-h-[60vh] space-y-3">
          {plannedRecords.map((rec) => (
            <div key={rec.id} className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 dark:border-orange-900/50 dark:bg-orange-950/20">
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {rec.module} · {rec.pagePath}
              </div>
              <p className="mt-1 text-xs text-orange-800 dark:text-orange-300">{rec.changeNote}</p>
            </div>
          ))}
        </div>
      </ModalOverlay>

      {/* 已取消特性弹窗 */}
      <ModalOverlay open={showCancelledModal} onClose={() => setShowCancelledModal(false)}>
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-rose-600" />
            <h3 className="text-sm font-semibold">已取消条目清单 ({cancelledRecords.length})</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowCancelledModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 max-h-[60vh] space-y-3">
          {cancelledRecords.map((rec) => (
            <div key={rec.id} className="rounded-lg border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-900/50 dark:bg-rose-950/20">
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {rec.module} · {rec.pagePath}
              </div>
              <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">{rec.changeNote}</p>
            </div>
          ))}
        </div>
      </ModalOverlay>
    </div>
  )
}
