import { ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  PARTNER_CHANGE_LEVEL_LABEL,
  PARTNER_PROTOTYPE_STATUS_LABEL,
  type PartnerStockChangeMapRow,
} from "../data/partner-stock-change-map"

type Props = {
  row: PartnerStockChangeMapRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PartnerChangeDetailDialog({ row, open, onOpenChange }: Props) {
  if (!row) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{row.menuLabel}</DialogTitle>
          <DialogDescription className="text-left text-sm">{row.menuPath}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{row.priority}</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
              {PARTNER_CHANGE_LEVEL_LABEL[row.changeLevel]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800">
              {PARTNER_PROTOTYPE_STATUS_LABEL[row.prototypeStatus]}
            </span>
          </div>

          {row.archiveMenus.length > 0 && (
            <p className="text-muted-foreground">
              合作方域：{row.archiveMenus.join(" · ")}
            </p>
          )}

          <section>
            <h3 className="mb-1.5 font-medium text-foreground">要改什么</h3>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {row.summaryBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          {row.doNot && row.doNot.length > 0 && (
            <section>
              <h3 className="mb-1.5 font-medium text-foreground">不要改什么</h3>
              <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                {row.doNot.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {row.acceptanceIds && row.acceptanceIds.length > 0 && (
            <section>
              <h3 className="mb-1.5 font-medium text-foreground">验收编号</h3>
              <p className="font-medium text-foreground">{row.acceptanceIds.join(" · ")}</p>
            </section>
          )}

          {row.prototypeRoute && (
            <Link
              to={row.prototypeRoute}
              className="inline-flex items-center gap-1 text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              打开原型
              <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}

          {row.specHint && (
            <PrototypeSpecCallout>
              规格真源：{row.specHint}（变更须先改 05/08/各菜单三件套，再同步本地图数据）
            </PrototypeSpecCallout>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
