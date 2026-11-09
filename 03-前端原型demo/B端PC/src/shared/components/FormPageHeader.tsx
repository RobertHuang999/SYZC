import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type FormPageHeaderProps = {
  /** 页面主标题，例如「新增入库」「编辑转让单」 */
  title: string
  /** 一句话说明：这页要填什么、有什么约束。没有就不渲染 */
  description?: string
  /** 点「返回」时的动作 */
  onBack: () => void
  /** 返回按钮文案，默认「返回」 */
  backLabel?: string
  /** 标题右侧的操作按钮 */
  actions?: ReactNode
}

/**
 * PC 新增 / 编辑页统一页头：
 * 左侧「返回 + 主标题（24px）+ 一句话说明」，右侧放页面级操作。
 * 与 DetailPageHeader 的差别：详情页返回固定在右上角，表单页返回跟着标题走。
 */
export function FormPageHeader({
  title,
  description,
  onBack,
  backLabel = "返回",
  actions,
}: FormPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 h-8 shrink-0 gap-1 px-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
