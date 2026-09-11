import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import midLoanPrd from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/03贷中风控管理/贷中风控管理主PRD.md?raw"
import midLoanFields from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/03贷中风控管理/贷中风控管理字段清单.md?raw"
import midLoanRules from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/03贷中风控管理/贷中风控管理业务规则规格.md?raw"
import disclosurePrd from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/04风险公示/风险公示主PRD.md?raw"
import disclosureFields from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/04风险公示/风险公示字段清单.md?raw"
import disclosureRules from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/04风险公示/风险公示业务规则规格.md?raw"

function createDocuments(
  prefix: string,
  prd: string,
  fields: string,
  rules: string
): PrototypeDocument[] {
  return [
    {
      id: `${prefix}-prd`,
      title: "主 PRD",
      content: prd,
      category: "PRD需求规格",
      badge: "6.2 唯一定义",
    },
    {
      id: `${prefix}-fields`,
      title: "字段清单",
      content: fields,
      category: "字段字典清单",
      badge: "数据模型",
    },
    {
      id: `${prefix}-rules`,
      title: "业务规则规格",
      content: rules,
      category: "业务规则规格",
      badge: "状态机与规则",
    },
  ]
}

export const readonlyRiskDocuments = {
  "mid-loan": createDocuments("mid-loan", midLoanPrd, midLoanFields, midLoanRules),
  "risk-disclosure": createDocuments(
    "risk-disclosure",
    disclosurePrd,
    disclosureFields,
    disclosureRules
  ),
} as const
