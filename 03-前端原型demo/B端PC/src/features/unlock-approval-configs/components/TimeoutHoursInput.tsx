import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldLabelWithHelp } from "./FieldHelpTooltip"

type TimeoutHoursInputProps = {
  value: string
  onChange: (value: string) => void
}

export function TimeoutHoursInput({ value, onChange }: TimeoutHoursInputProps) {
  return (
    <div className="space-y-2 max-w-xs">
      <Label htmlFor="timeoutHours">
        <FieldLabelWithHelp
          required
          label="审批超时时间"
          help="申请进入待审批后，超过该时长未处理将自动失效。单位：小时。"
        />
      </Label>
      <div className="relative">
        <Input
          id="timeoutHours"
          type="number"
          min={1}
          className="pr-14"
          placeholder="请输入"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center border-l bg-muted/30 text-sm text-muted-foreground">
          小时
        </span>
      </div>
    </div>
  )
}
