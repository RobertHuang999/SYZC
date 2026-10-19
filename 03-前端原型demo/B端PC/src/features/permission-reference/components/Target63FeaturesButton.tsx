import { useState } from "react"
import { SparklesIcon, XIcon } from "lucide-react"
import type { PermissionRecord } from "../data/permission-records"
import { ActionButtonList } from "./ActionButtonList"
import { DataScopeList } from "./DataScopeList"
import { ModalOverlay } from "./ModalOverlay"
import { cn } from "@/lib/utils"

function Target63FeatureCard({ record }: { record: PermissionRecord }) {
  const isDelivered = record.recordStatus === "6.3-delivered"
  return (
    <div className="rounded-lg border border-dashed border-teal-300/70 bg-teal-50/40 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-950">
          <SparklesIcon className="size-3" />
          {isDelivered ? "6.3 已交付原型" : "6.3 目标态"}
        </span>
        <span className="rounded border border-teal-200/80 bg-white/60 px-1.5 py-0.5 text-[10px] text-teal-900/70">
          {record.platform}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-foreground">{record.pagePath}</p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-medium text-teal-900/60">功能按钮</p>
          <ActionButtonList raw={record.actionPermissions} />
        </div>
        <div>
          <p className="mb-1 text-[10px] font-medium text-teal-900/60">数据可见范围</p>
          <DataScopeList raw={record.dataPermission} />
        </div>
      </div>

      {record.changeNote && (
        <p className="mt-2 text-[11px] leading-relaxed text-teal-900/75">{record.changeNote}</p>
      )}
    </div>
  )
}

export function Target63FeaturesButton({ records }: { records: PermissionRecord[] }) {
  const [open, setOpen] = useState(false)

  if (records.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-teal-300/80 bg-teal-50 px-2.5 text-[11px] font-medium text-teal-950 transition cursor-pointer",
          "hover:bg-teal-100 hover:border-teal-400",
          open && "bg-teal-200/80",
        )}
        title="聚合查看 6.3 迭代菜单权限（主列表已纳入）"
      >
        <SparklesIcon className="size-3.5" />
        6.3迭代
        <span className="rounded-full bg-teal-200/90 px-1.5 py-0.5 text-[10px] leading-none">{records.length}</span>
      </button>

      <ModalOverlay
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="max-h-[min(80vh,720px)] w-[min(56rem,calc(100vw-2rem))] border-teal-200/80"
      >
        <div className="flex items-center justify-between gap-3 border-b border-teal-200/60 bg-teal-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-teal-700" />
            <div>
              <h2 className="text-sm font-semibold text-teal-950">6.3 迭代 · 权限预演</h2>
              <p className="text-[11px] text-teal-900/70">
                合作方主数据 + 存量改造 · 共 {records.length} 项 · 主列表已纳入
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
        <div className="overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {records.map((record) => (
              <Target63FeatureCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      </ModalOverlay>
    </>
  )
}
