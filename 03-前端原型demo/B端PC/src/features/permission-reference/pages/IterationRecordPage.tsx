import { Fragment, useMemo, useState } from "react"
import { HistoryIcon, SearchIcon } from "lucide-react"
import {
  ITERATION_RECORD_LABEL,
  iterationRecords,
  iterationVersions,
  type IterationPlatform,
  type IterationRecordEntry,
} from "../data/menu-iteration-records"
import { SystemReferenceSubNav } from "../components/SystemReferenceSubNav"
import {
  iterationDefaultTypeStyle,
  iterationPlatformStyles,
  iterationTypeStyles,
} from "../components/iteration-record-styles"
import { cn } from "@/lib/utils"

type PlatformFilter = IterationPlatform | "全部"

function IterationTableRow({ entry }: { entry: IterationRecordEntry }) {
  return (
    <tr className="border-b border-border/60 align-top hover:bg-muted/30">
      <td className="p-2.5 text-xs whitespace-nowrap">
        <span className="font-semibold text-primary">{entry.version}</span>
      </td>
      <td className="p-2.5 text-xs">
        <span
          className={cn(
            "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold",
            iterationPlatformStyles[entry.platform],
          )}
        >
          {entry.platform}
        </span>
      </td>
      <td className="p-2.5 text-xs">
        <span
          className={cn(
            "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium",
            iterationTypeStyles[entry.type] ?? iterationDefaultTypeStyle,
          )}
        >
          {entry.type}
        </span>
      </td>
      <td className="p-2.5 text-xs font-medium text-foreground">{entry.title}</td>
      <td className="p-2.5 text-[11px] text-muted-foreground">{entry.before || "—"}</td>
      <td className="p-2.5 text-[11px] text-foreground/90">{entry.after || "—"}</td>
      <td className="p-2.5 text-[11px] leading-snug text-muted-foreground">{entry.note || "—"}</td>
      <td className="p-2.5 text-[11px] text-muted-foreground whitespace-nowrap">{entry.date || "—"}</td>
      <td className="p-2.5 text-[10px] text-muted-foreground/80">{entry.sourceDoc || "—"}</td>
    </tr>
  )
}

export function IterationRecordPage() {
  const defaultVersion = iterationVersions[0]?.version ?? "全部"
  const [activeVersion, setActiveVersion] = useState<string>(defaultVersion)
  const [platform, setPlatform] = useState<PlatformFilter>("全部")
  const [search, setSearch] = useState("")

  const activeVersionMeta = useMemo(
    () => iterationVersions.find((item) => item.version === activeVersion),
    [activeVersion],
  )

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return iterationRecords.filter((entry) => {
      if (activeVersion !== "全部" && entry.version !== activeVersion) return false
      if (platform !== "全部") {
        if (entry.platform !== "双端" && entry.platform !== platform) return false
      }
      if (!keyword) return true
      const hay = `${entry.title} ${entry.before} ${entry.after} ${entry.note} ${entry.sourceDoc} ${entry.type}`.toLowerCase()
      return hay.includes(keyword)
    })
  }, [activeVersion, platform, search])

  const groupedByVersion = useMemo(() => {
    if (activeVersion !== "全部") {
      return [["", filteredRecords] as const]
    }
    const map = new Map<string, IterationRecordEntry[]>()
    for (const entry of filteredRecords) {
      const list = map.get(entry.version) ?? []
      list.push(entry)
      map.set(entry.version, list)
    }
    return iterationVersions
      .map((v) => [v.version, map.get(v.version) ?? []] as const)
      .filter(([, rows]) => rows.length > 0)
  }, [activeVersion, filteredRecords])

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-4">
      <div className="shrink-0 rounded-lg border bg-card px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
            <HistoryIcon className="size-4 text-primary" />
            {ITERATION_RECORD_LABEL}
          </h1>

          <SystemReferenceSubNav active="iteration" />

          <span className="hidden h-4 w-px bg-border sm:block" />

          <div className="relative min-w-[180px] flex-1 max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索标题、路径、说明、来源文档..."
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

          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {filteredRecords.length} 条 · 数据源：B-迭代需求/各版本/00-菜单迭代记录.md
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 overflow-x-auto border-t border-border/60 pt-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveVersion("全部")}
            className={cn(
              "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
              activeVersion === "全部"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            全部 {iterationRecords.length}
          </button>
          {iterationVersions.map((versionMeta) => {
            const count = iterationRecords.filter((r) => r.version === versionMeta.version).length
            return (
              <button
                key={versionMeta.version}
                type="button"
                onClick={() => setActiveVersion(versionMeta.version)}
                className={cn(
                  "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  activeVersion === versionMeta.version
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {versionMeta.version} · {versionMeta.period} ({count})
              </button>
            )
          })}
        </div>

        {activeVersionMeta && activeVersion !== "全部" && (
          <div className="mt-2 rounded-md border border-border/50 bg-muted/10 px-3 py-2">
            <p className="text-xs font-medium text-foreground">{activeVersionMeta.name}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{activeVersionMeta.summary}</p>
            {activeVersionMeta.docPath && (
              <p className="mt-1 text-[10px] text-muted-foreground/80">
                迭代 PRD：{activeVersionMeta.docPath}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="h-full max-h-[calc(100vh-168px)] overflow-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead className="sticky top-0 z-[2] bg-muted/90 backdrop-blur-sm">
              <tr className="border-b text-[11px] font-semibold text-muted-foreground">
                <th className="p-2.5">版本</th>
                <th className="p-2.5">端</th>
                <th className="p-2.5">变更类型</th>
                <th className="p-2.5">标题</th>
                <th className="p-2.5">调整前</th>
                <th className="p-2.5">调整后</th>
                <th className="p-2.5">说明</th>
                <th className="p-2.5">日期</th>
                <th className="p-2.5">来源文档</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                groupedByVersion.map(([versionLabel, rows]) => (
                  <Fragment key={versionLabel || "single"}>
                    {activeVersion === "全部" && versionLabel && (
                      <tr className="sticky top-[41px] z-[1] border-b border-border/70 bg-slate-100/95 backdrop-blur-sm">
                        <td colSpan={9} className="px-2.5 py-1.5">
                          <span className="text-[11px] font-semibold text-foreground">
                            {versionLabel} 版本
                          </span>
                          <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                            {rows.length} 项
                          </span>
                        </td>
                      </tr>
                    )}
                    {rows.map((entry) => (
                      <IterationTableRow key={entry.id} entry={entry} />
                    ))}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-muted-foreground">
                    没有匹配的迭代记录，请调整版本、端或搜索关键词。
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
