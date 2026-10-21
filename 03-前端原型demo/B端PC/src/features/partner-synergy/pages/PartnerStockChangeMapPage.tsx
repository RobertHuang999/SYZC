import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { MapIcon, FileTextIcon } from "lucide-react"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { partnerStockChangeMapAnnotations } from "../annotations/partner-stock-change-map.annotations"
import { partnerStockChangeMapDocuments } from "../documents/partner-stock-change-map-documents"
import { PartnerChangeDetailDialog } from "../components/PartnerChangeDetailDialog"
import {
  countMapStats,
  PARTNER_CHANGE_LEVEL_LABEL,
  PARTNER_PROTOTYPE_STATUS_LABEL,
  partnerStockChangeMapRows,
  type PartnerChangeLevel,
  type PartnerStockChangeMapRow,
} from "../data/partner-stock-change-map"

const SECTORS = [...new Set(partnerStockChangeMapRows.map((r) => r.sector))]

function levelBadgeClass(level: PartnerChangeLevel): string {
  switch (level) {
    case "must-change":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
    case "fk-snapshot":
      return "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
    case "read-only":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
    case "doc-only":
      return "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100"
    case "out-of-scope":
      return "bg-muted text-muted-foreground"
    case "tentative":
      return "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100"
    default:
      return "bg-muted"
  }
}

/** 用户中心 · 合作方档案存量改造地图 */
export function PartnerStockChangeMapPage() {
  const [sector, setSector] = useState<string>("全部")
  const [p0Only, setP0Only] = useState(true)
  const [detailRow, setDetailRow] = useState<PartnerStockChangeMapRow | null>(null)

  const stats = useMemo(() => countMapStats(partnerStockChangeMapRows), [])

  const filtered = useMemo(() => {
    return partnerStockChangeMapRows.filter((r) => {
      if (sector !== "全部" && r.sector !== sector) return false
      if (p0Only && r.priority !== "P0") return false
      return true
    })
  }, [sector, p0Only])

  return (
    <PrototypeAnnotationProvider documents={partnerStockChangeMapDocuments} annotations={partnerStockChangeMapAnnotations}>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <PrototypeAnnotationTarget annotationIds={["change-map-scope"]}>
          <header className="mb-5 border-b pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" aria-hidden />
                <h1 className="text-lg font-semibold">合作方档案存量改造地图</h1>
              </div>
              <Link
                to="/用户中心/业务协同/存量业务单据协同"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <FileTextIcon className="h-4 w-4" aria-hidden />
                协同规格全文
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              6.3 哪些菜单要改、原型能否点开、文档在哪——索引页。业务真源见协同规格与 08 里程碑。
            </p>
          </header>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["change-map-stats"]}>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "P0 改造项", value: stats.p0MustChange },
              { label: "6.3 原型已交付", value: stats.delivered },
              { label: "文档/占位验收", value: stats.docOnly },
              { label: "本期不做", value: stats.outOfScope },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-card px-3 py-2">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
        </PrototypeAnnotationTarget>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">板块</span>
            <select
              className="rounded-md border bg-background px-2 py-1"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="全部">全部</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={p0Only}
              onChange={(e) => setP0Only(e.target.checked)}
              className="rounded border"
            />
            仅 P0
          </label>
        </div>

        <PrototypeAnnotationTarget annotationIds={["change-map-table"]}>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-100 text-xs font-medium uppercase tracking-wide text-muted-foreground dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2.5">菜单</th>
                  <th className="px-3 py-2.5">优先级</th>
                  <th className="px-3 py-2.5">改造</th>
                  <th className="px-3 py-2.5">合作方域</th>
                  <th className="px-3 py-2.5">原型</th>
                  <th className="px-3 py-2.5 w-28">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((row) => (
                  <tr key={row.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80">
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-foreground">{row.menuLabel}</p>
                      <p className="text-xs text-muted-foreground">{row.menuPath}</p>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{row.priority}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${levelBadgeClass(row.changeLevel)}`}
                      >
                        {PARTNER_CHANGE_LEVEL_LABEL[row.changeLevel]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {row.archiveMenus.length ? row.archiveMenus.join("、") : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {PARTNER_PROTOTYPE_STATUS_LABEL[row.prototypeStatus]}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setDetailRow(row)}
                      >
                        说明
                      </button>
                      {row.prototypeRoute && row.prototypeStatus === "delivered-63" && (
                        <>
                          <span className="mx-1 text-muted-foreground">·</span>
                          <Link to={row.prototypeRoute} className="text-primary hover:underline">
                            原型
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PrototypeAnnotationTarget>

        {filtered.length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">当前筛选无结果，请放宽条件。</p>
        )}
      </div>

      <PartnerChangeDetailDialog
        row={detailRow}
        open={detailRow !== null}
        onOpenChange={(open) => {
          if (!open) setDetailRow(null)
        }}
      />
    </PrototypeAnnotationProvider>
  )
}
