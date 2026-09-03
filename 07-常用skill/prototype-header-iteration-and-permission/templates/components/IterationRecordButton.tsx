import { useMemo, useState } from "react"
import { History, X } from "lucide-react"
import type {
  IterationChangeType,
  IterationPlatform,
  IterationRecordEntry,
  IterationVersionMeta,
} from "../types"
import { ModalOverlay } from "./ModalOverlay"

const platformStyles: Record<IterationPlatform, string> = {
  PC: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300",
  移动: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
  双端: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300",
}

const typeStyles: Record<IterationChangeType, string> = {
  新增: "bg-green-100 text-green-900 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800",
  更名: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  迁移: "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  取消: "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  结构: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
}

function ChangeCard({ entry }: { entry: IterationRecordEntry }) {
  return (
    <article className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${
            platformStyles[entry.platform] ?? platformStyles.PC
          }`}
        >
          {entry.platform}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
            typeStyles[entry.type] ?? typeStyles.新增
          }`}
        >
          {entry.type}
        </span>
        {entry.date && <span className="text-[10px] text-slate-400">{entry.date}</span>}
      </div>

      <h3 className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">{entry.title}</h3>

      {(entry.before || entry.after) && (
        <dl className="mt-2 space-y-1 text-[11px]">
          {entry.before && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-medium text-slate-400">调整前</dt>
              <dd className="text-slate-700 dark:text-slate-300">{entry.before}</dd>
            </div>
          )}
          {entry.after && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-medium text-slate-400">调整后</dt>
              <dd className="text-slate-700 dark:text-slate-300">{entry.after}</dd>
            </div>
          )}
        </dl>
      )}

      {entry.note && (
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{entry.note}</p>
      )}

      {entry.sourceDoc && (
        <p className="mt-2 text-[10px] text-slate-400/80">来源：{entry.sourceDoc}</p>
      )}
    </article>
  )
}

export type IterationRecordButtonProps = {
  records: IterationRecordEntry[]
  versions: IterationVersionMeta[]
  label?: string
  className?: string
}

export function IterationRecordButton({
  records,
  versions,
  label = "迭代记录",
  className = "",
}: IterationRecordButtonProps) {
  const [open, setOpen] = useState(false)
  const defaultVersion = versions[0]?.version ?? ""
  const [activeVersion, setActiveVersion] = useState(defaultVersion)

  const activeVersionMeta = useMemo(
    () => versions.find((item) => item.version === activeVersion),
    [activeVersion, versions],
  )

  const recordsInVersion = useMemo(
    () => records.filter((record) => record.version === activeVersion),
    [activeVersion, records],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!activeVersion && versions[0]) {
            setActiveVersion(versions[0].version)
          }
          setOpen(true)
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${
          open ? "ring-2 ring-primary/40" : ""
        } ${className}`}
        title="查看各版本迭代与导航调整记录"
      >
        <History size={14} className="text-primary" strokeWidth={1.8} />
        <span>{label}</span>
      </button>

      <ModalOverlay open={open} onClose={() => setOpen(false)}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{label}</h2>
              <p className="text-[11px] text-slate-500">
                菜单与功能版本调整历史 · 覆盖多端架构流转
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Versions Tab */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 px-4 py-2 dark:border-slate-800">
          {versions.map((versionMeta) => {
            const count = records.filter((r) => r.version === versionMeta.version).length
            const isSelected = activeVersion === versionMeta.version
            return (
              <button
                key={versionMeta.version}
                type="button"
                onClick={() => setActiveVersion(versionMeta.version)}
                className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {versionMeta.version}
                {count > 0 && <span className="ml-1 opacity-80">· {count}</span>}
              </button>
            )
          })}
        </div>

        {/* Version Summary Info */}
        {activeVersionMeta && (
          <div className="border-b border-slate-100 bg-slate-50/30 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/20">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {activeVersionMeta.name}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">{activeVersionMeta.summary}</p>
            {activeVersionMeta.docPath && (
              <p className="mt-1 text-[10px] text-slate-400">
                迭代 PRD：{activeVersionMeta.docPath}
              </p>
            )}
          </div>
        )}

        {/* Records Grid */}
        <div className="overflow-y-auto p-4 max-h-[60vh]">
          {recordsInVersion.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recordsInVersion.map((entry) => (
                <ChangeCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-xs text-slate-400">
              {activeVersionMeta?.name ?? activeVersion} 暂无功能或菜单级调整明细。
            </p>
          )}
        </div>
      </ModalOverlay>
    </>
  )
}
