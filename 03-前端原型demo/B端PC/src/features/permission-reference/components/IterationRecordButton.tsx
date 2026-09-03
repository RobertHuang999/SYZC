import { useMemo, useState } from "react"
import { HistoryIcon, XIcon } from "lucide-react"
import {
  ITERATION_RECORD_LABEL,
  iterationRecords,
  iterationVersions,
  type IterationChangeType,
  type IterationPlatform,
  type IterationRecordEntry,
} from "../data/menu-iteration-records"
import { ModalOverlay } from "./ModalOverlay"
import { cn } from "@/lib/utils"

const platformStyles: Record<IterationPlatform, string> = {
  PC: "border-blue-200 bg-blue-50 text-blue-900",
  移动: "border-emerald-200 bg-emerald-50 text-emerald-900",
  双端: "border-violet-200 bg-violet-50 text-violet-900",
}

const typeStyles: Record<IterationChangeType, string> = {
  新增: "bg-green-100 text-green-900 border-green-200",
  更名: "bg-amber-100 text-amber-900 border-amber-200",
  迁移: "bg-sky-100 text-sky-900 border-sky-200",
  取消: "bg-rose-100 text-rose-900 border-rose-200",
  结构: "bg-slate-100 text-slate-800 border-slate-200",
}

function ChangeCard({ entry }: { entry: IterationRecordEntry }) {
  return (
    <article className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 text-[10px] font-semibold",
            platformStyles[entry.platform],
          )}
        >
          {entry.platform}
        </span>
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 text-[10px] font-medium",
            typeStyles[entry.type],
          )}
        >
          {entry.type}
        </span>
        {entry.date && <span className="text-[10px] text-muted-foreground">{entry.date}</span>}
      </div>

      <h3 className="mt-2 text-xs font-semibold text-foreground">{entry.title}</h3>

      {(entry.before || entry.after) && (
        <dl className="mt-2 space-y-1 text-[11px]">
          {entry.before && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-medium text-muted-foreground">调整前</dt>
              <dd className="text-foreground/90">{entry.before}</dd>
            </div>
          )}
          {entry.after && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-medium text-muted-foreground">调整后</dt>
              <dd className="text-foreground/90">{entry.after}</dd>
            </div>
          )}
        </dl>
      )}

      {entry.note && <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{entry.note}</p>}

      {entry.sourceDoc && (
        <p className="mt-2 text-[10px] text-muted-foreground/80">来源：{entry.sourceDoc}</p>
      )}
    </article>
  )
}

export function IterationRecordButton() {
  const [open, setOpen] = useState(false)
  const defaultVersion = iterationVersions[0]?.version ?? ""
  const [activeVersion, setActiveVersion] = useState(defaultVersion)

  const activeVersionMeta = useMemo(
    () => iterationVersions.find((item) => item.version === activeVersion),
    [activeVersion],
  )

  const recordsInVersion = useMemo(
    () => iterationRecords.filter((record) => record.version === activeVersion),
    [activeVersion],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!activeVersion && iterationVersions[0]) {
            setActiveVersion(iterationVersions[0].version)
          }
          setOpen(true)
        }}
        className={cn("iteration-changelog-button", open && "is-active")}
        title="查看各版本菜单与导航调整记录"
      >
        <HistoryIcon size={14} strokeWidth={1.8} />
        <span>{ITERATION_RECORD_LABEL}</span>
      </button>

      <ModalOverlay open={open} onClose={() => setOpen(false)}>
            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <HistoryIcon className="size-4 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{ITERATION_RECORD_LABEL}</h2>
                  <p className="text-[11px] text-muted-foreground">
                    菜单与导航版本调整 · 数据源：B-迭代需求/各版本/00-菜单迭代记录.md
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="关闭"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto border-b px-4 py-2 no-scrollbar">
              {iterationVersions.map((versionMeta) => {
                const count = iterationRecords.filter((r) => r.version === versionMeta.version).length
                return (
                  <button
                    key={versionMeta.version}
                    type="button"
                    onClick={() => setActiveVersion(versionMeta.version)}
                    className={cn(
                      "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer",
                      activeVersion === versionMeta.version
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {versionMeta.version}
                    {count > 0 && ` · ${count}`}
                  </button>
                )
              })}
            </div>

            {activeVersionMeta && (
              <div className="border-b bg-muted/10 px-4 py-2.5">
                <p className="text-xs font-medium text-foreground">{activeVersionMeta.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{activeVersionMeta.summary}</p>
                {activeVersionMeta.docPath && (
                  <p className="mt-1 text-[10px] text-muted-foreground/80">
                    迭代 PRD：{activeVersionMeta.docPath}
                  </p>
                )}
              </div>
            )}

            <div className="overflow-y-auto p-4">
              {recordsInVersion.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {recordsInVersion.map((entry) => (
                    <ChangeCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  {activeVersionMeta?.name ?? activeVersion} 暂无菜单级调整明细，详见对应迭代 PRD 目录。
                </p>
              )}
            </div>
      </ModalOverlay>
    </>
  )
}
