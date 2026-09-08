/** 用户可配置的处置策略（规则级 · 用户可配 + 系统推荐） */
export const DISPOSITION_MODES = [
  "RECORD_ONLY",
  "ACTION_REQUIRED",
  "AUTO_RECOVER",
] as const

export type DispositionMode = (typeof DISPOSITION_MODES)[number]

/** 配置侧：结案路径（与信息侧「待处置/已结案」状态词解耦） */
export const DISPOSITION_MODE_LABELS: Record<DispositionMode, string> = {
  RECORD_ONLY: "触发即结案",
  ACTION_REQUIRED: "人工解除结案",
  AUTO_RECOVER: "恢复自动结案",
}

export const DISPOSITION_MODE_SHORT_LABELS: Record<DispositionMode, string> = {
  RECORD_ONLY: "即结案",
  ACTION_REQUIRED: "人工解除",
  AUTO_RECOVER: "自动结案",
}

export const DISPOSITION_MODE_HINTS: Record<DispositionMode, string> = {
  RECORD_ONLY:
    "写入设备预警信息；触发时直接「已结案 · 有效」。可作通知留痕，无待处置待办与解除入口（R06'）",
  ACTION_REQUIRED:
    "写入设备预警信息；初态「待处置 · 有效」，须人工解除后「已结案 · 有效」，支持超时升级（R14'）",
  AUTO_RECOVER:
    "写入设备预警信息；初态「待处置 · 有效」，采集/设备恢复后系统自动「已结案 · 有效」，不可人工解除（R03/R17）",
}

const NOTIFY_SUB_TYPES = ["开锁通知", "关锁通知", "设备上线", "设备移除"] as const

const SENSOR_SUB_TYPES = [
  "温度异常",
  "湿度异常",
  "烟感异常",
  "二氧化碳异常",
  "氧气异常",
] as const

const SECURITY_SUB_TYPES = [
  "拆壳",
  "锁舌被卡",
  "锁杆被剪",
  "非法开箱",
  "拆卡报警",
  "关锁异常",
  "门未关",
  "行人入侵",
  "车辆入侵",
  "物品形态变化",
  "非法拆除",
  "怠速滞留",
  "路线偏离",
] as const

/** R15c：无 02/01 R03 自动恢复信号的子类型，禁止 AUTO_RECOVER */
export const AUTO_RECOVER_FORBIDDEN_SUB_TYPES = [
  ...SECURITY_SUB_TYPES,
  "密码错误",
] as const

export function getAutoRecoverForbiddenSubTypes(subTypes: string[]): string[] {
  return subTypes
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((subType) =>
      (AUTO_RECOVER_FORBIDDEN_SUB_TYPES as readonly string[]).includes(subType)
    )
}

export function canSelectAutoRecoverDisposition(subTypes: string[]): boolean {
  return getAutoRecoverForbiddenSubTypes(subTypes).length === 0
}

export function validateAutoRecoverDisposition(
  subTypes: string[],
  mode: DispositionMode
): string | null {
  if (mode !== "AUTO_RECOVER") {
    return null
  }
  const forbidden = getAutoRecoverForbiddenSubTypes(subTypes)
  if (forbidden.length === 0) {
    return null
  }
  return `子类型「${forbidden.join("、")}」无自动恢复信号，不可选择「${DISPOSITION_MODE_LABELS.AUTO_RECOVER}」（R15c）`
}

/** 单个子类型的系统推荐（非强制，用户可改） */
export function getRecommendedDispositionForSubType(subType: string): DispositionMode {
  if ((NOTIFY_SUB_TYPES as readonly string[]).includes(subType)) {
    return "RECORD_ONLY"
  }
  if ((SENSOR_SUB_TYPES as readonly string[]).includes(subType)) {
    return "AUTO_RECOVER"
  }
  if (subType === "设备离线") {
    return "AUTO_RECOVER"
  }
  if (["进围栏", "出围栏", "普通限速", "电量低于20%"].includes(subType)) {
    return "AUTO_RECOVER"
  }
  if ((SECURITY_SUB_TYPES as readonly string[]).includes(subType)) {
    return "ACTION_REQUIRED"
  }
  if (subType === "密码错误") {
    return "ACTION_REQUIRED"
  }
  return "ACTION_REQUIRED"
}

/** 多选子类型时的规则级推荐默认 */
export function getRecommendedDisposition(subTypes: string[]): DispositionMode {
  const normalized = subTypes.map((item) => item.trim()).filter(Boolean)
  if (normalized.length === 0) {
    return "ACTION_REQUIRED"
  }
  if (normalized.length === 1) {
    return getRecommendedDispositionForSubType(normalized[0])
  }

  const recommendations = normalized.map(getRecommendedDispositionForSubType)
  const allSame = recommendations.every((mode) => mode === recommendations[0])
  if (allSame) {
    return recommendations[0]
  }

  if (
    normalized.every((subType) =>
      (NOTIFY_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return "RECORD_ONLY"
  }
  if (
    normalized.some((subType) =>
      (SENSOR_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return "AUTO_RECOVER"
  }
  return "ACTION_REQUIRED"
}

/** 三种策略均可选（用户可配方案） */
export function getAllowedDispositionsForSubType(_subType: string): DispositionMode[] {
  return [...DISPOSITION_MODES]
}

export function getAllowedDispositionsIntersection(_subTypes: string[]): DispositionMode[] {
  return [...DISPOSITION_MODES]
}

export function isDispositionAllowed(
  _subTypes: string[],
  _mode: DispositionMode
): boolean {
  return true
}

export function isDispositionDeviatingFromRecommendation(
  subTypes: string[],
  mode: DispositionMode
): boolean {
  const normalized = subTypes.map((item) => item.trim()).filter(Boolean)
  if (normalized.length === 0) {
    return false
  }
  return mode !== getRecommendedDisposition(normalized)
}

export function getDispositionDeviationMessage(
  subTypes: string[],
  mode: DispositionMode
): string {
  const normalized = subTypes.map((item) => item.trim()).filter(Boolean)
  const recommended = getRecommendedDisposition(normalized)
  const subTypeText = normalized.join("、")
  const recommendedLabel = DISPOSITION_MODE_LABELS[recommended]
  const selectedLabel = DISPOSITION_MODE_LABELS[mode]

  if (
    mode === "RECORD_ONLY" &&
    normalized.some((subType) =>
      (SECURITY_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return `子类型「${subTypeText}」系统推荐「${recommendedLabel}」。选择「${selectedLabel}」后触发即结案、无解除入口，请确认仍按此策略保存。`
  }

  if (
    mode === "ACTION_REQUIRED" &&
    normalized.some((subType) =>
      (SENSOR_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return `子类型「${subTypeText}」系统推荐「${recommendedLabel}」。选择「${selectedLabel}」后须人工解除结案，请确认仍按此策略保存。`
  }

  if (
    mode === "AUTO_RECOVER" &&
    normalized.every((subType) =>
      (NOTIFY_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return `子类型「${subTypeText}」系统推荐「${recommendedLabel}」。选择「${selectedLabel}」需等待恢复信号，部分通知类事件可能长期未结案，请确认仍按此策略保存。`
  }

  return `系统推荐「${recommendedLabel}」，您选择了「${selectedLabel}」，确认保存？`
}

export function resolveDispositionEffects(mode: DispositionMode) {
  return {
    manualReleaseAllowed: mode === "ACTION_REQUIRED",
    autoRecoverEnabled: mode === "AUTO_RECOVER",
    entersTodo: mode !== "RECORD_ONLY",
    hideUpgrade: mode === "RECORD_ONLY",
    initialStatusClosed: mode === "RECORD_ONLY",
  }
}

export function formatDispositionSnapshotLabel(mode: DispositionMode): string {
  return DISPOSITION_MODE_LABELS[mode]
}

/** 子类型 chip 展示：系统推荐（非能力上限） */
export function formatRecommendedDispositionHint(subType: string): string {
  return DISPOSITION_MODE_SHORT_LABELS[getRecommendedDispositionForSubType(subType)]
}

/** @deprecated 使用 formatRecommendedDispositionHint */
export function formatAllowedDispositionsHint(subType: string): string {
  return formatRecommendedDispositionHint(subType)
}

export const DISPOSITION_MODE_BADGE_CLASS: Record<DispositionMode, string> = {
  RECORD_ONLY: "border-blue-200 bg-blue-50 text-blue-700",
  ACTION_REQUIRED: "border-orange-200 bg-orange-50 text-orange-700",
  AUTO_RECOVER: "border-emerald-200 bg-emerald-50 text-emerald-700",
}
