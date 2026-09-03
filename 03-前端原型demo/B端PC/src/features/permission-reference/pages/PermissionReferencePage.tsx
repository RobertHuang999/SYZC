import { Fragment, useEffect, useMemo, useState } from "react"
import { KeyRoundIcon, SearchIcon } from "lucide-react"
import { permissionModuleTree, permissionRecords, type PermissionRecord } from "../data/permission-records"
import { ActionButtonLegend, ActionButtonList } from "../components/ActionButtonList"
import { ChangeLogCell, ChangeLogLegend } from "../components/ChangeLogCell"
import { DataScopeLegend, DataScopeList } from "../components/DataScopeList"
import { PagePathCell, PagePathLegend } from "../components/PagePathCell"
import { PlannedFeaturesButton } from "../components/PlannedFeaturesPanel"
import { CancelledFeaturesButton } from "../components/CancelledFeaturesButton"
import { Target62FeaturesButton } from "../components/Target62FeaturesButton"
import { isRecentChange } from "../lib/is-recent-change"
import { isArchivedFeature, is62TargetFeature, isCancelledFeature, isPlannedFeature } from "../lib/record-status"
import { cn } from "@/lib/utils"

type PlatformFilter = "PC" | "移动" | "全部"
type ChangeFilter = "全部" | "最近变更"

function matchesPlatform(record: PermissionRecord, platform: PlatformFilter) {
  return platform === "全部" || record.platform === platform
}

function matchesChangeFilter(record: PermissionRecord, changeFilter: ChangeFilter) {
  return changeFilter === "全部" || isRecentChange(record)
}

function getSubMenuKey(record: PermissionRecord) {
  return record.pagePathSegments[0] ?? "其他"
}

function getGroupKey(record: PermissionRecord, activeModule: string) {
  if (activeModule !== "全部") {
    return getSubMenuKey(record)
  }
  return record.module.replace(/^\d+\./, "")
}

function RecordRow({ record }: { record: PermissionRecord }) {
  return (
    <tr className="border-b border-border/60 align-top hover:bg-muted/30">
      <td className="p-2.5 text-xs">
        <PagePathCell record={record} />
      </td>
      <td className="p-2.5 text-xs">
        <ActionButtonList raw={record.actionPermissions} />
      </td>
      <td className="p-2.5 text-xs">
        <DataScopeList raw={record.dataPermission} />
      </td>
      <td className="p-2.5 text-xs">
        <ChangeLogCell
          createdAt={record.createdAt}
          updatedAt={record.updatedAt}
          changeNote={record.changeNote}
        />
      </td>
    </tr>
  )
}

export function PermissionReferencePage() {
  const [platform, setPlatform] = useState<PlatformFilter>("PC")
  const [changeFilter, setChangeFilter] = useState<ChangeFilter>("全部")
  const [search, setSearch] = useState("")
  const [activeModule, setActiveModule] = useState<string>("全部")
  const [activeSubMenu, setActiveSubMenu] = useState<string>("全部")

  const scopeRecords = useMemo(() => {
    return permissionRecords.filter(
      (record) =>
        matchesPlatform(record, platform) &&
        matchesChangeFilter(record, changeFilter) &&
        !isArchivedFeature(record),
    )
  }, [changeFilter, platform])

  const plannedRecords = useMemo(() => {
    return permissionRecords.filter((record) => matchesPlatform(record, platform) && isPlannedFeature(record))
  }, [platform])

  const cancelledRecords = useMemo(() => {
    return permissionRecords.filter((record) => matchesPlatform(record, platform) && isCancelledFeature(record))
  }, [platform])

  const target62Records = useMemo(() => {
    return permissionRecords.filter((record) => matchesPlatform(record, platform) && is62TargetFeature(record))
  }, [platform])

  const recentChangeTotal = useMemo(() => {
    return permissionRecords.filter(
      (record) =>
        matchesPlatform(record, platform) && isRecentChange(record) && !isArchivedFeature(record),
    ).length
  }, [platform])

  const recordsInModule = useMemo(() => {
    if (activeModule === "全部") return []
    return scopeRecords.filter((record) => record.module === activeModule)
  }, [activeModule, scopeRecords])

  const subMenuOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const record of recordsInModule) {
      const key = getSubMenuKey(record)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-CN"))
  }, [recordsInModule])

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
        record.legacyPath,
        record.createdAt,
        record.updatedAt,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(keyword)
    })
  }, [activeModule, activeSubMenu, scopeRecords, search])

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, PermissionRecord[]>()
    for (const record of filteredRecords) {
      const key = getGroupKey(record, activeModule)
      const list = groups.get(key) ?? []
      list.push(record)
      groups.set(key, list)
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-CN"))
  }, [activeModule, filteredRecords])

  const showGroupHeaders = activeSubMenu === "全部" && groupedRecords.length > 1

  const moduleCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const record of scopeRecords) {
      counts.set(record.module, (counts.get(record.module) ?? 0) + 1)
    }
    return counts
  }, [scopeRecords])

  const visibleModules = useMemo(() => {
    return permissionModuleTree.filter((moduleName) => (moduleCounts.get(moduleName) ?? 0) > 0)
  }, [moduleCounts])

  useEffect(() => {
    if (activeModule !== "全部" && (moduleCounts.get(activeModule) ?? 0) === 0) {
      setActiveModule("全部")
    }
  }, [activeModule, moduleCounts])

  useEffect(() => {
    setActiveSubMenu("全部")
  }, [activeModule])

  useEffect(() => {
    if (activeSubMenu !== "全部" && !subMenuOptions.some(([label]) => label === activeSubMenu)) {
      setActiveSubMenu("全部")
    }
  }, [activeSubMenu, subMenuOptions])

  const moduleTotal = scopeRecords.length
  const listTotal =
    activeModule === "全部" ? moduleTotal : subMenuOptions.reduce((sum, [, count]) => sum + count, 0)

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-4">
      <div className="shrink-0 rounded-lg border bg-card px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
            <KeyRoundIcon className="size-4 text-primary" />
            功能与数据权限
          </h1>

          <span className="hidden h-4 w-px bg-border sm:block" />

          <div className="relative min-w-[180px] flex-1 max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索页面路径、功能按钮、可见范围、变更..."
              className="h-7 w-full rounded-md border bg-background pl-7 pr-2 text-[11px] outline-none ring-primary/30 transition focus:ring-1"
            />
          </div>

          <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border bg-muted/20 p-0.5">
            {(["PC", "移动", "全部"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPlatform(item)}
                className={cn(
                  "rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  platform === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-amber-200/80 bg-amber-50/50 p-0.5">
            {(["全部", "最近变更"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChangeFilter(item)}
                className={cn(
                  "rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  changeFilter === item
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-amber-900/70 hover:bg-amber-100 hover:text-amber-900",
                )}
              >
                {item}
                {item === "最近变更" && ` ${recentChangeTotal}`}
              </button>
            ))}
          </div>

          <PlannedFeaturesButton records={plannedRecords} />
          <Target62FeaturesButton records={target62Records} />
          <CancelledFeaturesButton records={cancelledRecords} />

          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {filteredRecords.length} / {listTotal} 条
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 overflow-x-auto border-t border-border/60 pt-2 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveModule("全部")
              setActiveSubMenu("全部")
            }}
            className={cn(
              "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
              activeModule === "全部"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            全部 {moduleTotal}
          </button>
          {visibleModules.map((moduleName) => {
            const label = moduleName.replace(/^\d+\./, "")
            const count = moduleCounts.get(moduleName) ?? 0

            return (
              <button
                key={moduleName}
                type="button"
                onClick={() => setActiveModule(moduleName)}
                className={cn(
                  "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  activeModule === moduleName
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label} {count}
              </button>
            )
          })}
        </div>

        {activeModule !== "全部" && subMenuOptions.length > 0 && (
          <div className="mt-2 flex items-center gap-1 overflow-x-auto border-t border-border/40 pt-2 no-scrollbar">
            <span className="mr-1 shrink-0 text-[10px] font-medium text-muted-foreground">子菜单</span>
            <button
              type="button"
              onClick={() => setActiveSubMenu("全部")}
              className={cn(
                "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                activeSubMenu === "全部"
                  ? "bg-slate-700 text-white"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              全部 {recordsInModule.length}
            </button>
            {subMenuOptions.map(([label, count]) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveSubMenu(label)}
                className={cn(
                  "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  activeSubMenu === label
                    ? "bg-slate-700 text-white"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label} {count}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card shadow-sm">
        <div
          className={cn(
            "h-full overflow-auto",
            activeModule !== "全部" && subMenuOptions.length > 0
              ? "max-h-[calc(100vh-200px)]"
              : "max-h-[calc(100vh-168px)]",
          )}
        >
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="sticky top-0 z-[2] bg-muted/90 backdrop-blur-sm">
              <tr className="border-b text-[11px] font-semibold text-muted-foreground">
                <th className="p-2.5">
                  <div className="space-y-1">
                    <span>页面路径</span>
                    <PagePathLegend />
                  </div>
                </th>
                <th className="p-2.5">
                  <div className="space-y-1">
                    <span>页面功能按钮</span>
                    <ActionButtonLegend />
                  </div>
                </th>
                <th className="p-2.5">
                  <div className="space-y-1">
                    <span>数据可见范围</span>
                    <DataScopeLegend />
                  </div>
                </th>
                <th className="p-2.5">
                  <div className="space-y-1">
                    <span>变更记录</span>
                    <ChangeLogLegend />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                groupedRecords.map(([groupLabel, records]) => (
                  <Fragment key={groupLabel}>
                    {showGroupHeaders && (
                      <tr className="sticky top-[52px] z-[1] border-b border-border/70 bg-slate-100/95 backdrop-blur-sm">
                        <td colSpan={4} className="px-2.5 py-1.5">
                          <span className="text-[11px] font-semibold text-foreground">{groupLabel}</span>
                          <span className="ml-2 text-[10px] font-normal text-muted-foreground">{records.length} 项</span>
                        </td>
                      </tr>
                    )}
                    {records.map((record) => (
                      <RecordRow key={record.id} record={record} />
                    ))}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">
                    {changeFilter === "最近变更"
                      ? "当前筛选下没有变更记录，可切换到「全部」查看完整清单。"
                      : "没有匹配的权限记录，请调整筛选条件或搜索关键词。"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
