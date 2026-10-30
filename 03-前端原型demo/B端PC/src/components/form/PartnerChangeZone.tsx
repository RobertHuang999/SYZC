import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { useIterationHighlight } from "@/shared/components/IterationHighlight"

/**
 * 6.3 改造点：控件轻量描边 + 下方一条琥珀规格框（用户说明 + 规则对照同框）。
 * 描边受顶栏「版本视图」总开关控制，切到「还原线上」时自动隐藏。
 */
export function PartnerChangeFieldMark({
  markId,
  children,
  className,
  userHint,
  specNote,
}: {
  markId?: string
  children: ReactNode
  className?: string
  userHint?: string
  specNote?: string
}) {
  const { highlightEnabled } = useIterationHighlight()
  const showCallout = Boolean(userHint || specNote)

  return (
    <div
      id={markId ? `partner-change-zone-${markId}` : undefined}
      data-partner-change-mark={markId}
      className={cn("space-y-2", className)}
    >
      <div
        className={cn(
          "rounded-lg p-2",
          highlightEnabled && "ring-1 ring-inset ring-amber-500/40"
        )}
      >
        {children}
      </div>
      {showCallout ? (
        <PrototypeSpecCallout>
          {userHint ? (
            <p className="mb-1.5 text-[11px] leading-relaxed text-foreground/90">{userHint}</p>
          ) : null}
          {specNote ? <p>{specNote}</p> : null}
        </PrototypeSpecCallout>
      ) : null}
    </div>
  )
}

/** @deprecated 使用 PartnerChangeFieldMark */
export const PartnerChangeZone = PartnerChangeFieldMark
