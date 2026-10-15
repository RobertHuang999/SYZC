import type { InboundCollectFieldDef } from "../../../../../shared/goods/goods-sku-catalog"

type Props = {
  fields: readonly InboundCollectFieldDef[]
  values: Record<string, string>
  onChange: (next: Record<string, string>) => void
  allOptional?: boolean
}

export function InboundCollectFieldsMobile({ fields, values, onChange, allOptional }: Props) {
  if (fields.length === 0) return null

  const patch = (fieldKey: string, value: string) => {
    onChange({ ...values, [fieldKey]: value })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#232D39]/10 bg-[#F8F9FB]">
      {fields.map((field, idx) => (
        <div
          key={field.fieldKey}
          className={`px-3 py-2.5 ${idx > 0 ? "border-t border-[#232D39]/8" : ""}`}
        >
          <p className="mb-1.5 text-xs text-[#232D39]/70">
            {!allOptional && field.required ? (
              <span className="text-[#EF3E3E]">* </span>
            ) : null}
            {field.label}
            {allOptional ? <span className="text-[#232D39]/45">（选填）</span> : null}
          </p>
          {field.control === "select" ? (
            <select
              className="w-full rounded-lg border border-[#232D39]/15 bg-white px-2 py-2 text-sm text-[#232D39]"
              value={values[field.fieldKey] ?? ""}
              onChange={(e) => patch(field.fieldKey, e.target.value)}
            >
              <option value="">请选择{field.label}</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.control === "date" ? "date" : "text"}
              className="w-full rounded-lg border border-[#232D39]/15 bg-white px-2 py-2 text-sm text-[#232D39]"
              placeholder={`请输入${field.label}`}
              value={values[field.fieldKey] ?? ""}
              onChange={(e) => patch(field.fieldKey, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
