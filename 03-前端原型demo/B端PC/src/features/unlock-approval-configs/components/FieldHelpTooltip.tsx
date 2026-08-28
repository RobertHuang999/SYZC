import { CircleHelpIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function FieldHelpTooltip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        aria-label="字段说明"
      >
        <CircleHelpIcon className="size-3.5" strokeWidth={1.8} />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs whitespace-normal leading-relaxed">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export function FieldLabelWithHelp({
  label,
  required,
  help,
}: {
  label: string
  required?: boolean
  help?: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {required && <span className="text-destructive font-bold">*</span>}
      <span>{label}</span>
      {help && <FieldHelpTooltip content={help} />}
    </span>
  )
}
