import {
  Building2Icon,
  ClipboardListIcon,
  GlobeIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  WarehouseIcon,
} from "lucide-react"
import { parseDataPermission, type DataScopeKind, type DataScopeTag } from "../lib/parse-data-permission"
import { cn } from "@/lib/utils"

const scopeStyles: Record<DataScopeKind, string> = {
  warehouse: "border-sky-200 bg-sky-50 text-sky-800",
  order: "border-violet-200 bg-violet-50 text-violet-800",
  org: "border-emerald-200 bg-emerald-50 text-emerald-800",
  task: "border-amber-200 bg-amber-50 text-amber-800",
  function: "border-slate-200 bg-slate-50 text-slate-700",
  all: "border-indigo-200 bg-indigo-50 text-indigo-800",
  custom: "border-border bg-muted/40 text-foreground",
}

function ScopeIcon({ kind }: { kind: DataScopeKind }) {
  const className = "size-3 shrink-0"

  switch (kind) {
    case "warehouse":
      return <WarehouseIcon className={className} />
    case "order":
      return <ClipboardListIcon className={className} />
    case "org":
      return <Building2Icon className={className} />
    case "task":
      return <SlidersHorizontalIcon className={className} />
    case "function":
      return <ShieldIcon className={className} />
    case "all":
      return <GlobeIcon className={className} />
    default:
      return <ShieldIcon className={className} />
  }
}

function DataScopeTagChip({ scope }: { scope: DataScopeTag }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        scopeStyles[scope.kind],
      )}
      title={`数据按${scope.label}范围过滤`}
    >
      <ScopeIcon kind={scope.kind} />
      {scope.label}
    </span>
  )
}

export function DataScopeList({ raw }: { raw: string }) {
  const { scopes, rules } = parseDataPermission(raw)

  if (scopes.length === 0 && rules.length === 0) {
    return <span className="text-[11px] text-muted-foreground/60">未单独配置</span>
  }

  return (
    <div className="max-w-sm space-y-1.5">
      {scopes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {scopes.map((scope) => (
            <DataScopeTagChip key={`${scope.kind}-${scope.label}`} scope={scope} />
          ))}
        </div>
      )}

      {rules.length > 0 && (
        <ol className="space-y-1">
          {rules.map((rule, index) => (
            <li key={`${rule}-${index}`} className="flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function DataScopeLegend({ className }: { className?: string }) {
  return (
    <div className={cn("text-[10px] text-muted-foreground", className)}>
      控制列表/详情能看到哪些数据；色标为过滤维度，序号条目为补充规则
    </div>
  )
}
