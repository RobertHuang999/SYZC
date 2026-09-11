import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getReadonlyRiskModuleMeta } from "../config"
import { getReadonlyRiskRecord } from "../mock/readonly-risk.mock"
import type { ReadonlyRiskModule, ReadonlyStatusTone } from "../types"

const TONE_CLASS: Record<ReadonlyStatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-gray-200 bg-gray-100 text-gray-600",
}

function FieldValue({ tone, value }: { tone?: ReadonlyStatusTone; value: string }) {
  return tone ? (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TONE_CLASS[tone]}`}>
      {value}
    </span>
  ) : (
    <span className="flex-1 text-right font-medium leading-relaxed text-gray-800">{value}</span>
  )
}

export function ReadOnlyDetailPage({ module }: { module: ReadonlyRiskModule }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const meta = getReadonlyRiskModuleMeta(module)
  const record = useMemo(() => getReadonlyRiskRecord(module, id), [id, module])
  const [allExpanded, setAllExpanded] = useState(true)

  if (!record) {
    return (
      <MobileShell>
        <NavBar title={`${meta.title}详情`} backTo={meta.listPath} />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <p>{meta.emptyText}</p>
          <button
            type="button"
            onClick={() => navigate(meta.listPath)}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white active:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={[`h5-${module}-detail`]}>
        <NavBar
          title={`${meta.title}详情`}
          backTo={meta.listPath}
          right={
            <button
              type="button"
              onClick={() => setAllExpanded((current) => !current)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 active:opacity-70"
            >
              {allExpanded ? "全部收起" : "全部展开"}
              {allExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          }
        />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-[#f4f6f8]">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-gray-900">{record.title}</h1>
                <p className="mt-1 text-xs text-gray-600">{record.subtitle}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">
                <ShieldCheck className="size-3 text-blue-600" />
                只读
              </div>
            </div>
          </div>

          {record.sections.map((section, index) => (
            <PrototypeAnnotationTarget key={section.title} annotationIds={[`h5-${module}-detail`]}>
              <SectionCard
                title={section.title}
                indicatorColor={index === 0 ? "#1875f0" : index === 1 ? "#f57c00" : "#00a870"}
                collapsed={!allExpanded}
              >
                <div className="space-y-2 text-xs">
                  {section.fields.map((field) => (
                    <div key={field.label} className="flex items-start justify-between gap-3 border-b border-gray-50 py-1.5 last:border-0">
                      <span className="w-24 shrink-0 text-gray-500">{field.label}</span>
                      <FieldValue tone={field.tone} value={field.value} />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </PrototypeAnnotationTarget>
          ))}
        </div>
      </div>
    </MobileShell>
  )
}
