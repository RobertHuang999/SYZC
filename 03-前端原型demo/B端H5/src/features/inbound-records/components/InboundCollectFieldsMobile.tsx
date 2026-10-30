import type { InboundCollectFieldDef } from "../../../../../shared/goods/goods-sku-catalog"
import {
  citiesOf,
  districtsOf,
  formatRegion,
  parseRegion,
  REGION_CATALOG,
} from "../../../../../shared/goods/region-catalog"

type Props = {
  fields: readonly InboundCollectFieldDef[]
  values: Record<string, string>
  onChange: (next: Record<string, string>) => void
  allOptional?: boolean
}

const PERIOD_UNIT_FALLBACK = ["天", "个月", "年"] as const

function splitRange(value: string): [string, string] {
  const [min = "", max = ""] = value.split("|")
  return [min, max]
}

const fieldClass =
  "w-full rounded-lg border border-[#232D39]/15 bg-white px-2 py-2 text-sm text-[#232D39]"

export function InboundCollectFieldsMobile({ fields, values, onChange, allOptional }: Props) {
  if (fields.length === 0) return null

  const patch = (fieldKey: string, value: string) => {
    onChange({ ...values, [fieldKey]: value })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#232D39]/10 bg-[#F8F9FB]">
      {fields.map((field, idx) => {
        const value = values[field.fieldKey] ?? ""
        return (
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
                className={fieldClass}
                value={value}
                onChange={(e) => patch(field.fieldKey, e.target.value)}
              >
                <option value="">{field.placeholder || `请选择${field.label}`}</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.control === "range" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={fieldClass}
                    placeholder="最小值"
                    value={splitRange(value)[0]}
                    onChange={(e) =>
                      patch(field.fieldKey, `${e.target.value}|${splitRange(value)[1]}`)
                    }
                  />
                  <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
                  <input
                    type="number"
                    className={fieldClass}
                    placeholder="最大值"
                    value={splitRange(value)[1]}
                    onChange={(e) =>
                      patch(field.fieldKey, `${splitRange(value)[0]}|${e.target.value}`)
                    }
                  />
                  <span className="shrink-0 text-sm text-[#232D39]">{field.unit ?? ""}</span>
                </div>
                {field.placeholder && (
                  <p className="text-[11px] text-[#232D39]/55">{field.placeholder}</p>
                )}
              </div>
            ) : field.control === "percent" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  className={fieldClass}
                  placeholder={field.placeholder || `请输入${field.label}`}
                  value={value}
                  onChange={(e) => patch(field.fieldKey, e.target.value)}
                />
                <span className="shrink-0 text-sm text-[#232D39]">{field.unit ?? "%"}</span>
              </div>
            ) : field.control === "period" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    className={fieldClass}
                    placeholder={field.placeholder || `请输入${field.label}数值`}
                    value={value}
                    onChange={(e) => patch(field.fieldKey, e.target.value)}
                  />
                  {field.unitLocked && field.unit ? (
                    <span className="shrink-0 whitespace-nowrap rounded bg-[#232D39]/8 px-2 py-1 text-xs font-medium text-[#232D39]">
                      {field.unit}（固定）
                    </span>
                  ) : (
                    <select
                      className="w-24 shrink-0 rounded-lg border border-[#232D39]/15 bg-white px-2 py-2 text-sm text-[#232D39]"
                      value={values[`${field.fieldKey}Unit`] ?? field.unit ?? ""}
                      onChange={(e) => patch(`${field.fieldKey}Unit`, e.target.value)}
                    >
                      <option value="">单位</option>
                      {PERIOD_UNIT_FALLBACK.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {!field.unitLocked && (
                  <p className="text-[11px] text-[#C77700]">
                    该货品未指定固定保质期单位，请按实物包装选择
                  </p>
                )}
              </div>
            ) : field.control === "region" ? (
              <RegionInputMobile
                value={value}
                onChange={(next) => patch(field.fieldKey, next)}
              />
            ) : (
              <input
                type={field.control === "date" ? "date" : "text"}
                className={fieldClass}
                placeholder={field.placeholder || `请输入${field.label}`}
                value={value}
                onChange={(e) => patch(field.fieldKey, e.target.value)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function RegionInputMobile({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  const [province, city, district] = parseRegion(value)
  const cities = citiesOf(province)
  const districts = districtsOf(province, city)
  const selectClass =
    "w-full rounded-lg border border-[#232D39]/15 bg-white px-2 py-2 text-sm text-[#232D39]"

  return (
    <div className="flex flex-col gap-1.5">
      <select
        className={selectClass}
        value={province}
        onChange={(e) => e.target.value && onChange(formatRegion(e.target.value, "", ""))}
      >
        <option value="">选择省份</option>
        {REGION_CATALOG.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={city}
        disabled={!province}
        onChange={(e) =>
          e.target.value && onChange(formatRegion(province, e.target.value, ""))
        }
      >
        <option value="">选择城市</option>
        {cities.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={district}
        disabled={!city}
        onChange={(e) =>
          e.target.value && onChange(formatRegion(province, city, e.target.value))
        }
      >
        <option value="">选择区县</option>
        {districts.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
