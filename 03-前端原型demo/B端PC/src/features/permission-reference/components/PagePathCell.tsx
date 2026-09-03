import { Link } from "react-router-dom"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"
import type { PermissionRecord } from "../data/permission-records"
import { resolvePrototypeRoute } from "../data/prototype-route-map"
import { cn } from "@/lib/utils"

export function PagePathCell({ record }: { record: PermissionRecord }) {
  const prototypeRoute = resolvePrototypeRoute({
    level1Menu: record.pagePathSegments[0] ?? "",
    level2Menu: record.pagePathSegments[1] ?? "",
    tab: record.pagePathSegments[2] ?? "",
  })
  const moduleLabel = record.module.replace(/^\d+\./, "")

  return (
    <div className="min-w-[200px] max-w-xs space-y-1.5">
      <div className="flex flex-wrap items-center gap-1">
        <span className="rounded border border-border/70 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {record.platform}
        </span>
        <span className="rounded border border-border/70 bg-muted/20 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {moduleLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-0.5 text-xs font-medium text-foreground">
        {record.pagePathSegments.length > 0 ? (
          record.pagePathSegments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="inline-flex items-center gap-0.5">
              {index > 0 && <ChevronRightIcon className="size-3 text-muted-foreground/70" />}
              <span>{segment}</span>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>

      {prototypeRoute ? (
        <Link
          to={prototypeRoute}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
        >
          #{prototypeRoute}
          <ExternalLinkIcon className="size-3" />
        </Link>
      ) : (
        <span className="font-mono text-[11px] text-muted-foreground/60">原型未实现</span>
      )}

    </div>
  )
}

export function PagePathLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-[10px] font-normal text-muted-foreground", className)}>
      菜单路径 + 原型路由；研发对照时以「页面路径」为唯一入口
    </p>
  )
}
