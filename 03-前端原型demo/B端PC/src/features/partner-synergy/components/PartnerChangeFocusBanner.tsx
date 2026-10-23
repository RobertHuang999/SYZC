import { Link } from "react-router-dom"
import { ArrowLeftIcon, MapIcon } from "lucide-react"
import {
  findPartnerStockChangeMapRow,
  PARTNER_CHANGE_LEVEL_LABEL,
} from "../data/partner-stock-change-map"

type Props = {
  mapId: string
}

/** 从改造地图深链进入时，页顶改造摘要条 */
export function PartnerChangeFocusBanner({ mapId }: Props) {
  const row = findPartnerStockChangeMapRow(mapId)
  if (!row) {
    return (
      <div className="rounded-lg border border-amber-300/60 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-50">
        <Link
          to="/用户中心/业务协同/合作方档案存量改造地图"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
          返回改造地图
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">未识别 mapId：{mapId}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-amber-400/45 bg-gradient-to-r from-amber-50/95 to-amber-50/40 px-4 py-3 dark:from-amber-950/40 dark:to-amber-950/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <MapIcon className="h-4 w-4 shrink-0 text-amber-800 dark:text-amber-200" aria-hidden />
            <p className="text-sm font-semibold text-foreground">
              6.3 改造视窗 · {row.menuLabel}
            </p>
            <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-medium text-amber-950 dark:bg-amber-900 dark:text-amber-100">
              {row.priority} · {PARTNER_CHANGE_LEVEL_LABEL[row.changeLevel]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{row.menuPath}</p>
          <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-foreground/90">
            {row.summaryBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {row.doNot && row.doNot.length > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              勿改：{row.doNot.join("；")}
            </p>
          ) : null}
          {row.acceptanceIds?.length ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              验收：{row.acceptanceIds.join(" · ")}
            </p>
          ) : null}
        </div>
        <Link
          to="/用户中心/业务协同/合作方档案存量改造地图"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
          改造地图
        </Link>
      </div>
    </div>
  )
}
