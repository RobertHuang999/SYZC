import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  /** 暂存登记：收集项全面选填 (P05) */
  allOptional?: boolean
}

/** 老货品未指定固定单位时，现场可临时选择的单位 */
const PERIOD_UNIT_FALLBACK = ["天", "个月", "年"] as const

/** 数字区间值约定存为「最小值|最大值」 */
export function splitRange(value: string): [string, string] {
  const [min = "", max = ""] = value.split("|")
  return [min, max]
}

export function InboundCollectFields({ fields, values, onChange, allOptional }: Props) {
  if (fields.length === 0) return null

  const patch = (fieldKey: string, value: string) => {
    onChange({ ...values, [fieldKey]: value })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => {
        const value = values[field.fieldKey] ?? ""
        const wide = field.control === "range" || field.control === "region"
        return (
          <div
            key={field.fieldKey}
            className={wide ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}
          >
            <Label className="text-xs font-medium text-foreground">
              {!allOptional && field.required ? (
                <span className="text-destructive">* </span>
              ) : null}
              {field.label}
              {allOptional ? (
                <span className="ml-1 font-normal text-muted-foreground">（选填）</span>
              ) : null}
            </Label>

            {field.control === "select" ? (
              <Select value={value} onValueChange={(v) => v && patch(field.fieldKey, v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`请选择${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options ?? []).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.control === "date" ? (
              <Input
                type="date"
                className="text-sm"
                value={value}
                onChange={(e) => patch(field.fieldKey, e.target.value)}
              />
            ) : field.control === "range" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="text-sm"
                  placeholder="最小值"
                  value={splitRange(value)[0]}
                  onChange={(e) =>
                    patch(
                      field.fieldKey,
                      `${e.target.value}|${splitRange(value)[1]}`
                    )
                  }
                />
                <span className="shrink-0 text-xs text-muted-foreground">至</span>
                <Input
                  type="number"
                  className="text-sm"
                  placeholder="最大值"
                  value={splitRange(value)[1]}
                  onChange={(e) =>
                    patch(
                      field.fieldKey,
                      `${splitRange(value)[0]}|${e.target.value}`
                    )
                  }
                />
                <span className="shrink-0 text-sm text-foreground">
                  {field.unit ?? ""}
                </span>
              </div>
            ) : field.control === "percent" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  className="text-sm"
                  placeholder={`请输入${field.label}`}
                  value={value}
                  onChange={(e) => patch(field.fieldKey, e.target.value)}
                />
                <span className="shrink-0 text-sm text-foreground">
                  {field.unit ?? "%"}
                </span>
              </div>
            ) : field.control === "period" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="text-sm"
                    placeholder={`请输入${field.label}数值`}
                    value={value}
                    onChange={(e) => patch(field.fieldKey, e.target.value)}
                  />
                  {field.unitLocked && field.unit ? (
                    <span className="shrink-0 whitespace-nowrap text-sm font-medium text-foreground">
                      {field.unit}
                    </span>
                  ) : (
                    <Select
                      value={field.unit ?? ""}
                      onValueChange={(v) => v && patch(`${field.fieldKey}Unit`, v)}
                    >
                      <SelectTrigger className="w-24 shrink-0">
                        <SelectValue placeholder="单位" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIOD_UNIT_FALLBACK.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {!field.unitLocked && (
                  <p className="text-[11px] text-amber-600">
                    该货品未指定固定保质期单位，请按实物包装选择
                  </p>
                )}
              </div>
            ) : field.control === "region" ? (
              <RegionInput
                value={value}
                onChange={(next) => patch(field.fieldKey, next)}
              />
            ) : (
              <Input
                placeholder={`请输入${field.label}`}
                className="text-sm"
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

function RegionInput({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  const [province, city, district] = parseRegion(value)
  const cities = citiesOf(province)
  const districts = districtsOf(province, city)

  return (
    <div className="flex items-center gap-2">
      <Select
        value={province}
        onValueChange={(v) => v && onChange(formatRegion(v, "", ""))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择省份" />
        </SelectTrigger>
        <SelectContent>
          {REGION_CATALOG.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={city}
        disabled={!province}
        onValueChange={(v) => v && onChange(formatRegion(province, v, ""))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择城市" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={district}
        disabled={!city}
        onValueChange={(v) => v && onChange(formatRegion(province, city, v))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择区县" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
