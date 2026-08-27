import type { SeverityLevelRecord } from "../domain/types"
import { SEVERITY_LEVELS } from "@/shared/mock/severity-levels"

export const severityLevelsMock: SeverityLevelRecord[] = SEVERITY_LEVELS.map(
  (level) => ({
    levelId: level.severityLevelId,
    sortOrder: level.sortOrder,
    severityCode: level.severityCode,
    displayName: level.severityName,
    labelColor: level.severityColor,
    syncToOrderWarning: level.syncToOrderWarning,
    enabled: level.enabled,
    description: level.description,
    updatedBy: level.updatedBy,
    updatedAt: level.updatedAt,
  })
)
