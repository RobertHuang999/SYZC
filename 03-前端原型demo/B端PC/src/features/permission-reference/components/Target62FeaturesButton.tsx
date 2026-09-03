import { useState } from "react"
import { LayersIcon, XIcon } from "lucide-react"
import type { PermissionRecord } from "../data/permission-records"
import { ActionButtonList } from "./ActionButtonList"
import { DataScopeList } from "./DataScopeList"
import { ModalOverlay } from "./ModalOverlay"
import { cn } from "@/lib/utils"

function Target62FeatureCard({ record }: { record: PermissionRecord }) {
  return (
    <div className="rounded-lg border border-dashed border-indigo-300/70 bg-indigo-50/40 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-950">
          <LayersIcon className="size-3" />
          6.2 目标菜单 · 未上线
        </span>
        <span className="rounded border border-indigo-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-indigo-900/70">
          {record.platform}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-foreground">{record.pagePath}</p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-medium text-indigo-900/60">功能按钮</p>
          <ActionButtonList raw={record.actionPermissions} />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-medium text-indigo-900/60">数据可见范围</p>
          <DataScopeList raw={record.dataPermission} />
        </div>
      </div>

      {record.changeNote && (
        <p className="mt-2 text-[11px] leading-relaxed text-indigo-900/75">{record.changeNote}</p>
      )}
    </div>
  )
}

export function Target62FeaturesButton({ records }: { records: PermissionRecord[] }) {
  const [open, setOpen] = useState(false)

  if (records.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-indigo-300/80 bg-indigo-50 px-2.5 text-[11px] font-medium text-indigo-950 transition cursor-pointer",
          "hover:bg-indigo-100 hover:border-indigo-400",
          open && "bg-indigo-200/80",
        )}
        title="查看 6.2 目标态菜单权限（上线前不在主列表展示）"
      >
        <LayersIcon className="size-3.5" />
        6.2目标菜单
        <span className="rounded-full bg-indigo-200/90 px-1.5 py-0.5 text-[10px] leading-none">{records.length}</span>
      </button>

      <ModalOverlay
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="max-h-[min(80vh,720px)] w-[min(56rem,calc(100vw-2rem))] border-indigo-200/80"
      >
            <div className="flex items-center justify-between gap-3 border-b border-indigo-200/60 bg-indigo-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <LayersIcon className="size-4 text-indigo-700" />
                <div>
                  <h2 className="text-sm font-semibold text-indigo-950">6.2 目标菜单 · 权限预演</h2>
                  <p className="text-[11px] text-indigo-900/70">
                    顶栏「物联网IOT与预警」路径 · 共 {records.length} 项 · 上线前主列表仍显示线上口径
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-indigo-900/70 transition hover:bg-indigo-100 hover:text-indigo-950 cursor-pointer"
                aria-label="关闭"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {records.map((record) => (
                  <Target62FeatureCard key={record.id} record={record} />
                ))}
              </div>
            </div>
      </ModalOverlay>
    </>
  )
}
