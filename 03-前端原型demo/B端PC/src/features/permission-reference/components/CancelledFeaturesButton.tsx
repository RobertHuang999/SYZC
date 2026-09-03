import { useState } from "react"
import { BanIcon, XIcon } from "lucide-react"
import type { PermissionRecord } from "../data/permission-records"
import { ModalOverlay } from "./ModalOverlay"
import { cn } from "@/lib/utils"

function CancelledFeatureCard({ record }: { record: PermissionRecord }) {
  const moduleLabel = record.module.replace(/^\d+\./, "")

  return (
    <div className="rounded-lg border border-dashed border-red-300/70 bg-red-50/30 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-900">
          <BanIcon className="size-3" />
          已取消 · 系统不再展示
        </span>
        <span className="rounded border border-red-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-red-900/70">
          {record.platform}
        </span>
        <span className="rounded border border-red-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-red-900/70">
          {moduleLabel}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-foreground">{record.pagePath}</p>

      {record.changeNote && (
        <p className="mt-2 rounded-md border border-red-200/60 bg-white/50 px-2 py-1.5 text-[11px] leading-snug text-red-900/80">
          {record.changeNote}
        </p>
      )}
    </div>
  )
}

export function CancelledFeaturesButton({ records }: { records: PermissionRecord[] }) {
  const [open, setOpen] = useState(false)

  if (records.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-red-300/80 bg-red-50 px-2.5 text-[11px] font-medium text-red-900 transition cursor-pointer",
          "hover:bg-red-100 hover:border-red-400",
          open && "bg-red-200/70",
        )}
        title="查看已从系统中取消的菜单功能"
      >
        <BanIcon className="size-3.5" />
        已取消菜单
        <span className="rounded-full bg-red-200/90 px-1.5 py-0.5 text-[10px] leading-none">{records.length}</span>
      </button>

      <ModalOverlay
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="max-h-[min(80vh,720px)] w-[min(56rem,calc(100vw-2rem))] border-red-200/80"
      >
            <div className="flex items-center justify-between gap-3 border-b border-red-200/60 bg-red-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <BanIcon className="size-4 text-red-700" />
                <div>
                  <h2 className="text-sm font-semibold text-red-950">已取消菜单</h2>
                  <p className="text-[11px] text-red-900/70">
                    共 {records.length} 项 · 系统已不再展示，主列表已隐藏
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-red-900/70 transition hover:bg-red-100 hover:text-red-950 cursor-pointer"
                aria-label="关闭"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {records.map((record) => (
                  <CancelledFeatureCard key={record.id} record={record} />
                ))}
              </div>
            </div>
      </ModalOverlay>
    </>
  )
}
