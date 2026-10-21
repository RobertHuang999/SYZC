import type { MigrationDocumentItem } from "./migration-documents"
import partnerMigrationMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/05-存量改造与关联业务协同/6.3合作方主数据-数据迁移与切流.md?raw"

/** 6.3 合作方主数据迁移（PRD ?raw，非 6.2 自动生成包） */
export const migrationDocuments63Partner: MigrationDocumentItem[] = [
  {
    id: "partner-master-data-migration-63",
    title: "6.3 合作方主数据 · 数据迁移与切流",
    shortTitle: "合作方主数据迁移",
    category: "6.3 合作方割接",
    filePath: "6.3合作方主数据-数据迁移与切流.md",
    badge: "P0 / 实施",
    routePath: "/历史迁移与割接/合作方主数据迁移",
    version: "V1.0",
    author: "产品团队",
    updatedAt: "2026-10-20",
    description:
      "方案 B 四子菜单、partner_id 回填波次、接收方→货主、MIG-V01~15 与切流回滚",
    content: partnerMigrationMarkdown,
  },
]
