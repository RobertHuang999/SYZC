import { useState } from "react"
import type { InboundStagingReg } from "../domain/types"
import type { StagingDetailGoodsRow } from "../lib/staging-detail-display"
import { STAGING_DETAIL_TABS } from "@prototype/shared/inbound/staging-ui-labels"
import { StagingDetailGoodsSection } from "./StagingDetailGoodsSection"
import { StagingOperationTimeline } from "./StagingOperationTimeline"

type StagingDetailTab = "goods" | "audit"

type Props = {
  reg: InboundStagingReg
  goodsRows: StagingDetailGoodsRow[]
}

/** 排版对齐入库记录详情：标签页 + 入库明细 / 审核记录 */
export function StagingDetailTabsPanel({ reg, goodsRows }: Props) {
  const [tab, setTab] = useState<StagingDetailTab>("goods")

  return (
    <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
      <div className="flex border-b">
        {(
          [
            ["goods", STAGING_DETAIL_TABS.goods],
            ["audit", STAGING_DETAIL_TABS.audit],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`border-b-2 px-5 py-2.5 text-xs font-medium transition-colors ${
              tab === key
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "goods" ? <StagingDetailGoodsSection embedded rows={goodsRows} /> : null}
      {tab === "audit" ? <StagingOperationTimeline embedded reg={reg} /> : null}
    </div>
  )
}
