import type { ReactNode } from "react"

type PageHeaderProps = {
  /** 页面主标题，例如「入库记录」「货物盘点」 */
  title: string
  /** 一句话说明：这页是干什么的。没有就不渲染 */
  description?: string
  /** 标题右侧的版本标签、角标等 */
  badge?: ReactNode
  /** 标题右侧的操作按钮或当前登录人信息 */
  actions?: ReactNode
}

/**
 * PC 列表页 / 台账页统一页头：
 * 左侧「主标题（24px）+ 一句话说明」，右侧放版本标签或操作。
 * 所有列表页统一使用，保证标题层级、字号、说明位置一致。
 */
export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {badge}
        </div>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
