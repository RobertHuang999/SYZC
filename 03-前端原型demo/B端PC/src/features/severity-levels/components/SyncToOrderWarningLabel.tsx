import { CircleHelpIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SYNC_TO_ORDER_WARNING_TOOLTIP } from "../domain/constants"

export function SyncToOrderWarningLabel() {
  return (
    <span className="inline-flex items-center gap-1">
      同步至订单预警
      <Tooltip>
        <TooltipTrigger
          type="button"
          className="inline-flex text-muted-foreground hover:text-foreground"
          aria-label="同步至订单预警说明"
        >
          <CircleHelpIcon className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {SYNC_TO_ORDER_WARNING_TOOLTIP}
        </TooltipContent>
      </Tooltip>
    </span>
  )
}
