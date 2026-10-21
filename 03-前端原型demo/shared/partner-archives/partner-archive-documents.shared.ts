import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

import publicPrd from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方主数据-公共主PRD.md?raw"
import publicFields from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方主数据-公共字段清单.md?raw"
import publicRules from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方主数据-公共业务规则规格.md?raw"

import ownerRules from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-1-货主信息/货主信息业务规则规格.md?raw"
import pickupRules from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-2-提货人信息/提货人信息业务规则规格.md?raw"
import funderRules from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-3-资金方信息/资金方信息业务规则规格.md?raw"
import serviceRules from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-4-服务方信息/服务方信息业务规则规格.md?raw"

import ownerPrd from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-1-货主信息/货主信息主PRD.md?raw"
import pickupPrd from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-2-提货人信息/提货人信息主PRD.md?raw"
import funderPrd from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-3-资金方信息/资金方信息主PRD.md?raw"
import servicePrd from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/04-4-服务方信息/服务方信息主PRD.md?raw"

const SUBMENU_RULES: Record<PartnerArchiveMenuLabel, string> = {
  货主信息: ownerRules,
  提货人信息: pickupRules,
  资金方信息: funderRules,
  服务方信息: serviceRules,
}

const SUBMENU_PRD: Record<PartnerArchiveMenuLabel, string> = {
  货主信息: ownerPrd,
  提货人信息: pickupPrd,
  资金方信息: funderPrd,
  服务方信息: servicePrd,
}

/** 公共三件套 + 当前 archiveMenu 子菜单规则/主 PRD 补充（原型标注挂载真源） */
export function buildPartnerArchiveDocuments(
  archiveMenu: PartnerArchiveMenuLabel,
): PrototypeDocument[] {
  return [
    {
      id: "prd",
      title: "主PRD规格",
      category: "PRD需求规格",
      content: `${publicPrd}\n\n---\n\n## 当前子菜单主 PRD（${archiveMenu}）\n\n${SUBMENU_PRD[archiveMenu]}`,
    },
    {
      id: "fields",
      title: "字段清单字典",
      category: "字段字典清单",
      content: publicFields,
    },
    {
      id: "rules",
      title: "业务规则规格",
      category: "业务规则规格",
      content: `${publicRules}\n\n---\n\n## 子菜单规则补充（${archiveMenu}）\n\n${SUBMENU_RULES[archiveMenu]}`,
    },
  ]
}
