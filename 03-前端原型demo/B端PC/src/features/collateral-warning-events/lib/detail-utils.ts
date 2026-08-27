import type { CollateralWarningEventDetail } from "../domain/types"
import { getCollateralWarningDetailExtension } from "../mock/collateral-warning-event-details.mock"
import { collateralWarningEventsMock } from "../mock/collateral-warning-events.mock"

export function getCollateralWarningById(
  eventId: string | undefined
): CollateralWarningEventDetail | null {
  if (!eventId) {
    return null
  }

  const event = collateralWarningEventsMock.find((item) => item.eventId === eventId)
  if (!event) {
    return null
  }

  return {
    ...event,
    ...getCollateralWarningDetailExtension(event),
  }
}
