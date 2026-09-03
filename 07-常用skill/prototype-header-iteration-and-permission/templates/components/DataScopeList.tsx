import {
  Building2,
  ClipboardList,
  Globe,
  Shield,
  SlidersHorizontal,
  Warehouse,
} from "lucide-react"
import { parseDataPermission, type DataScopeKind, type DataScopeTag } from "../lib/parse-data-permission"

const scopeStyles: Record<DataScopeKind, string> = {
  warehouse: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300",
  order: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300",
  org: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
  task: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  function: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300",
  all: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300",
  custom: "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
}

function ScopeIcon({ kind }: { kind: DataScopeKind }) {
  const className = "size-3 shrink-0"

  switch (kind) {
    case "warehouse":
      return <Warehouse className={className} />
    case "order":
      return <ClipboardList className={className} />
    case "org":
      return <Building2 className={className} />
    case "task":
      return <SlidersHorizontal className={className} />
    case "function":
      return <Shield className={className} />
    case "all":
      return <Globe className={className} />
    default:
      return <Shield className={className} />
  }
}

function DataScopeTagChip({ scope }: { scope: DataScopeTag }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${
        scopeStyles[scope.kind] ?? scopeStyles.custom
      }`}
      title={`数据按${scope.label}范围隔离过滤`}
    >
      <ScopeIcon kind={scope.kind} />
      {scope.label}
    </span>
  )
}

export function DataScopeList({ raw }: { raw: string }) {
  const { scopes, rules } = parseDataPermission(raw)

  if (scopes.length === 0 && rules.length === 0) {
    return <span className="text-[11px] text-slate-400">未单独限制（随菜单默认）</span>
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
            <li key={`${rule}-${index}`} className="flex gap-1.5 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
              <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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

export function DataScopeLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`text-[11px] text-slate-500 ${className}`}>
      控制页面能查阅/操作的数据行级范围；徽标为过滤维度，数字列表为附加隔离规则
    </div>
  )
}
