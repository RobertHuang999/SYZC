import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { INBOUND_TYPE_OPTIONS } from "../domain/form-constants"
import type { ManualInboundType } from "../domain/form-types"

type InboundTypeSelectProps = {
  value: ManualInboundType | ""
  onChange: (value: ManualInboundType) => void
}

export function InboundTypeSelect({ value, onChange }: InboundTypeSelectProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => {
        if (!next) return
        onChange(next as ManualInboundType)
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="请选择入库类型" />
      </SelectTrigger>
      <SelectContent>
        {INBOUND_TYPE_OPTIONS.map((option) => {
          const display = option.hint
            ? `${option.label}（${option.hint}）`
            : option.label
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(option.disabled && "text-muted-foreground opacity-60")}
            >
              {display}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
