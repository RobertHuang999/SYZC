import type { ReactNode } from "react"
import { ArrowLeft, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

type DetailPageHeaderProps = {
  /** 页面主标题，统一为「{业务}详情」，例如「出库单详情」 */
  title: string
  /** 业务单号；详情页统一以单据号作为识别信息 */
  number?: string
  /** 单号标签，默认「单号」 */
  numberLabel?: string
  status?: ReactNode
  onBack: () => void
  actions?: ReactNode
  onCopy?: () => void
  copied?: boolean
}

/**
 * PC 详情页统一顶栏：
 * 左侧标题 + 状态 + 单据号；右侧页面级操作 + 「返回」按钮（固定在右上角）。
 * 所有详情页统一使用，保证返回位置、标题层级和单号展示一致。
 */
export function DetailPageHeader({
  title,
  number,
  numberLabel = "单号",
  status,
  onBack,
  actions,
  onCopy,
  copied = false,
}: DetailPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {status}
        </div>
        {number && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{numberLabel}：</span>
            <span className="select-all font-medium text-foreground">{number}</span>
            {onCopy && (
              <button
                type="button"
                onClick={onCopy}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                title={`复制${numberLabel}`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1 px-3 text-xs"
          onClick={onBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回
        </Button>
      </div>
    </div>
  )
}
