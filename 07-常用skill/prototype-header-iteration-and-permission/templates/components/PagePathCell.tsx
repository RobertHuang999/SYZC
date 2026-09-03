import { ChevronRight, ExternalLink } from "lucide-react"
import type { PermissionRecord, PrototypeRouteResolver } from "../types"

export type PagePathCellProps = {
  record: PermissionRecord
  routeResolver?: PrototypeRouteResolver
  onNavigate?: (route: string) => void
}

export function PagePathCell({ record, routeResolver, onNavigate }: PagePathCellProps) {
  const moduleLabel = record.module.replace(/^\d+[\.、\s]*/, "")

  const resolvedRoute = routeResolver
    ? routeResolver({
        module: record.module,
        pagePathSegments: record.pagePathSegments,
        level1Menu: record.pagePathSegments[0] ?? "",
        level2Menu: record.pagePathSegments[1] ?? "",
        tab: record.pagePathSegments[2] ?? "",
      })
    : null

  return (
    <div className="min-w-[200px] max-w-xs space-y-1.5">
      {/* 平台与模块 */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          {record.platform}
        </span>
        <span className="rounded border border-slate-200 bg-slate-50/50 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
          {moduleLabel}
        </span>
      </div>

      {/* 菜单路径面包屑 */}
      <div className="flex flex-wrap items-center gap-0.5 text-xs font-medium text-slate-900 dark:text-slate-100">
        {record.pagePathSegments.length > 0 ? (
          record.pagePathSegments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="inline-flex items-center gap-0.5">
              {index > 0 && <ChevronRight className="size-3 text-slate-400" />}
              <span>{segment}</span>
            </span>
          ))
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>

      {/* 原型路由跳转 */}
      {resolvedRoute ? (
        onNavigate ? (
          <button
            type="button"
            onClick={() => onNavigate(resolvedRoute)}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
          >
            <span>#{resolvedRoute}</span>
            <ExternalLink className="size-3" />
          </button>
        ) : (
          <a
            href={resolvedRoute.startsWith("#") ? resolvedRoute : `#${resolvedRoute}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline dark:text-blue-400"
          >
            <span>#{resolvedRoute}</span>
            <ExternalLink className="size-3" />
          </a>
        )
      ) : (
        <span className="font-mono text-[11px] text-slate-400/80">原型路径自动映射</span>
      )}

      {/* 旧系统迁移提示 */}
      {record.legacyPath && (
        <p className="text-[10px] text-slate-400">原系统：{record.legacyPath}</p>
      )}
    </div>
  )
}

export function PagePathLegend({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] text-slate-500 ${className}`}>
      页面与导航层级路径；点击蓝色路由可直接跳转至对应原型页面
    </p>
  )
}
