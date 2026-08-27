import type { SeverityLevelRecord } from "../domain/types"
import { severityLevelsMock } from "../mock/severity-levels.mock"

export function getSeverityLevelById(
  levelId: string | undefined
): SeverityLevelRecord | null {
  if (!levelId) {
    return null
  }

  return severityLevelsMock.find((item) => item.levelId === levelId) ?? null
}
