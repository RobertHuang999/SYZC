import type { DeviceWarningEvent } from "../domain/types"
import { TOTAL_MOCK_COUNT } from "../domain/constants"
import { deviceWarningEventUseCases } from "./device-warning-events.usecase"

function cloneWithIndex(index: number, template: DeviceWarningEvent): DeviceWarningEvent {
  const day = String((index % 20) + 1).padStart(2, "0")
  const hour = String(index % 24).padStart(2, "0")
  const minute = String((index * 3) % 60).padStart(2, "0")

  return {
    ...template,
    eventId: `evt-${String(index + 1).padStart(3, "0")}`,
    ruleName:
      index < deviceWarningEventUseCases.length
        ? template.ruleName
        : `${template.ruleName}-${index + 1}`,
    firstWarningTime: `2026-08-${day} ${hour}:${minute}:00`,
    latestWarningTime: `2026-08-${day} ${hour}:${minute}:00`,
    triggerCount: template.triggerCount > 1 ? (index % 8) + 2 : 1,
    version: template.version,
  }
}

/** 列表页 Mock：精编用例 18 条 + 扩展至 Demo 要求的 128 条 */
export const deviceWarningEventsMock: DeviceWarningEvent[] = Array.from(
  { length: TOTAL_MOCK_COUNT },
  (_, index) => {
    if (index < deviceWarningEventUseCases.length) {
      return deviceWarningEventUseCases[index]
    }

    const template =
      deviceWarningEventUseCases[index % deviceWarningEventUseCases.length]
    return cloneWithIndex(index, template)
  }
)

export { deviceWarningEventUseCases } from "./device-warning-events.usecase"
