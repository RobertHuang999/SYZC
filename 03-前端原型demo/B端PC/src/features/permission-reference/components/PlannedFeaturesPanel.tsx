import { useState } from "react"
import { ConstructionIcon, XIcon } from "lucide-react"
import type { PermissionRecord } from "../data/permission-records"
import { ActionButtonList } from "./ActionButtonList"
import { DataScopeList } from "./DataScopeList"
import { ModalOverlay } from "./ModalOverlay"
import { cn } from "@/lib/utils"

function PlannedFeatureCard({ record }: { record: PermissionRecord }) {
  const moduleLabel = record.module.replace(/^\d+\./, "")

  return (
    <div className="rounded-lg border border-dashed border-orange-300/70 bg-orange-50/40 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-300 bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-900">
          <ConstructionIcon className="size-3" />
          尚未开发 · 产品规划中
        </span>
        <span className="rounded border border-orange-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-orange-900/70">
          {record.platform}
        </span>
        <span className="rounded border border-orange-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-orange-900/70">
          {moduleLabel}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-foreground">{record.pagePath}</p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-medium text-orange-900/60">规划功能按钮（仅供参考）</p>
          <ActionButtonList raw={record.actionPermissions} />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-medium text-orange-900/60">规划数据可见范围（仅供参考）</p>
          <DataScopeList raw={record.dataPermission} />
        </div>
      </div>
    </div>
  )
}

export function PlannedFeaturesButton({ records }: { records: PermissionRecord[] }) {
  const [open, setOpen] = useState(false)

  if (records.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-orange-300/80 bg-orange-50 px-2.5 text-[11px] font-medium text-orange-900 transition cursor-pointer",
          "hover:bg-orange-100 hover:border-orange-400",
          open && "bg-orange-200/80",
        )}
        title="查看尚未进入研发交付的产品规划功能"
      >
        <ConstructionIcon className="size-3.5" />
        待开发规划
        <span className="rounded-full bg-orange-200/90 px-1.5 py-0.5 text-[10px] leading-none">{records.length}</span>
      </button>

      <ModalOverlay
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="max-h-[min(80vh,720px)] w-[min(56rem,calc(100vw-2rem))] border-orange-200/80"
      >
            <div className="flex items-center justify-between gap-3 border-b border-orange-200/60 bg-orange-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <ConstructionIcon className="size-4 text-orange-700" />
                <div>
                  <h2 className="text-sm font-semibold text-orange-950">待开发规划</h2>
                  <p className="text-[11px] text-orange-900/70">
                    共 {records.length} 项 · 尚未进入研发交付，主列表已隐藏
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-orange-900/70 transition hover:bg-orange-100 hover:text-orange-950 cursor-pointer"
                aria-label="关闭"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {records.map((record) => (
                  <PlannedFeatureCard key={record.id} record={record} />
                ))}
              </div>
            </div>
      </ModalOverlay>
    </>
  )
}
