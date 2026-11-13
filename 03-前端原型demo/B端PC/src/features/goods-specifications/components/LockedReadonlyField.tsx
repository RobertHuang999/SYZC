import { Lock } from "lucide-react"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"

type LockedReadonlyFieldProps = {
  value: string
  hint: string
}

/** 编辑页锁定字段：灰阶底、不可点、右侧「已锁定」徽标 */
export function LockedReadonlyField({ value, hint }: LockedReadonlyFieldProps) {
  return (
    <div className="space-y-1">
      <div
        className="flex h-8 cursor-not-allowed select-none items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-100 px-2.5 text-sm text-slate-500"
        aria-disabled="true"
      >
        <span className="min-w-0 truncate">{value.trim() || "—"}</span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] leading-none text-slate-500">
          <Lock className="h-3 w-3" />
          已锁定
        </span>
      </div>
      <ProductFieldHint>{hint}</ProductFieldHint>
    </div>
  )
}
