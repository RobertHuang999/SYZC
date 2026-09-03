export type ReleaseNavigationState = {
  from: "list" | "detail"
  releaseConfirmed: true
}

export function isReleaseNavigationState(
  value: unknown
): value is ReleaseNavigationState {
  if (!value || typeof value !== "object") {
    return false
  }

  const state = value as Partial<ReleaseNavigationState>
  return (
    (state.from === "list" || state.from === "detail") &&
    state.releaseConfirmed === true
  )
}

export function getReleaseBackPath(
  eventId: string,
  from: ReleaseNavigationState["from"] | undefined
): string {
  if (from === "list") {
    return "/物联网IOT与预警/预警信息/设备预警信息"
  }

  return `/物联网IOT与预警/预警信息/设备预警信息/详情/${eventId}`
}
