import type { ReadonlyRiskModule, ReadonlyRiskModuleMeta } from "./types"

export const READONLY_RISK_MODULE_META: Record<ReadonlyRiskModule, ReadonlyRiskModuleMeta> = {
  "mid-loan": {
    title: "贷中风控管理",
    subtitle: "仅支持列表与执行历史详情只读查看",
    listPath: "/m/risk/mid-loan",
    detailPath: "/m/risk/mid-loan",
    emptyText: "暂无贷中风控记录",
  },
  "risk-disclosure": {
    title: "风险公示",
    subtitle: "仅支持公示列表与详情只读查看",
    listPath: "/m/risk/disclosures",
    detailPath: "/m/risk/disclosures",
    emptyText: "暂无风险公示记录",
  },
}

export function getReadonlyRiskModuleMeta(module: ReadonlyRiskModule) {
  return READONLY_RISK_MODULE_META[module]
}
