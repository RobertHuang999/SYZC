import { Label } from "@/components/ui/label"
import type { YesNo } from "../domain/types"

type YesNoRadioProps = {
  name: string
  label: string
  required?: boolean
  value: YesNo
  onChange: (value: YesNo) => void
  hint?: string
}

export function YesNoRadio({
  name,
  label,
  required,
  value,
  onChange,
  hint,
}: YesNoRadioProps) {
  return (
    <div className="space-y-2">
      <Label>
        {required && <span className="text-destructive">* </span>}
        {label}
      </Label>
      <div className="flex gap-6">
        {(["是", "否"] as const).map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
