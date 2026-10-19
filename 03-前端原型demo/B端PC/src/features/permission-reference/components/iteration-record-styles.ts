import type { IterationChangeType, IterationPlatform } from "../data/menu-iteration-records"

export const iterationPlatformStyles: Record<IterationPlatform, string> = {
  PC: "border-blue-200 bg-blue-50 text-blue-900",
  移动: "border-emerald-200 bg-emerald-50 text-emerald-900",
  双端: "border-violet-200 bg-violet-50 text-violet-900",
}

export const iterationTypeStyles: Partial<Record<IterationChangeType, string>> = {
  新增: "bg-green-100 text-green-900 border-green-200",
  更名: "bg-amber-100 text-amber-900 border-amber-200",
  迁移: "bg-sky-100 text-sky-900 border-sky-200",
  取消: "bg-rose-100 text-rose-900 border-rose-200",
  结构: "bg-slate-100 text-slate-800 border-slate-200",
  修改: "bg-indigo-100 text-indigo-900 border-indigo-200",
  合并调整: "bg-violet-100 text-violet-900 border-violet-200",
  模块重构: "bg-cyan-100 text-cyan-900 border-cyan-200",
  "保留/澄清": "bg-zinc-100 text-zinc-800 border-zinc-200",
  保留: "bg-zinc-100 text-zinc-700 border-zinc-200",
  下线: "bg-rose-100 text-rose-900 border-rose-200",
}

export const iterationDefaultTypeStyle = "bg-slate-100 text-slate-800 border-slate-200"
