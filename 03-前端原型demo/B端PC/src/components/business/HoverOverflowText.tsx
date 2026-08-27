import type { ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type HoverOverflowTextProps = {
  children: ReactNode
  content?: ReactNode
  className?: string
  ariaLabel?: string
}

export function HoverOverflowText({
  children,
  content,
  className,
  ariaLabel,
}: HoverOverflowTextProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className={cn(
          "block max-w-full cursor-help truncate text-left",
          className
        )}
        aria-label={ariaLabel}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-md whitespace-normal break-words">
        {content ?? children}
      </TooltipContent>
    </Tooltip>
  )
}
