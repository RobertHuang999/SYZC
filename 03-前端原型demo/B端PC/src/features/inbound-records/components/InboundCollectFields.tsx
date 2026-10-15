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

type Props = {
  fields: readonly InboundCollectFieldDef[]
  values: Record<string, string>
  onChange: (next: Record<string, string>) => void
  /** 暂存登记：收集项全面选填 (P05) */
  allOptional?: boolean
}

export function InboundCollectFields({ fields, values, onChange, allOptional }: Props) {
  if (fields.length === 0) return null

  const patch = (fieldKey: string, value: string) => {
    onChange({ ...values, [fieldKey]: value })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => (
        <div key={field.fieldKey} className="space-y-1.5">
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
            <Select
              value={values[field.fieldKey] ?? ""}
              onValueChange={(v) => v && patch(field.fieldKey, v)}
            >
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
              value={values[field.fieldKey] ?? ""}
              onChange={(e) => patch(field.fieldKey, e.target.value)}
            />
          ) : (
            <Input
              placeholder={`请输入${field.label}`}
              className="text-sm"
              value={values[field.fieldKey] ?? ""}
              onChange={(e) => patch(field.fieldKey, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
