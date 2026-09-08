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
    "预警触发后直接自动结案，仅作通知留痕，无需人工处置与解除。",
  ACTION_REQUIRED:
    "预警触发后进入待处置状态，须现场核查并人工解除结案，支持配置超时升级。",
  AUTO_RECOVER:
    "预警触发后进入待处置状态，当检测到设备状态恢复后系统自动结案，无需人工解除。",
}

/** 通知/上线类 · 系统推荐触发即结案（R06'） */
export const NOTIFY_SUB_TYPES = [
  "开锁通知",
  "关锁通知",
  "设备上线",
  "设备移除",
] as const

/** 传感器环境类 · R03 数值/烟感恢复 */
const SENSOR_SUB_TYPES = [
  "温度异常",
  "湿度异常",
  "烟感异常",
  "二氧化碳异常",
  "氧气异常",
] as const

/** GPS 围栏/限速类 · R03 GPS 正常/回到合法状态 */
const GPS_AUTO_RECOVER_SUB_TYPES = [
  "进围栏",
  "出围栏",
  "普通限速",
  "怠速滞留",
  "路线偏离",
] as const

/**
 * R15c 白名单：仅下列子类型存在 02/01 R03 明确恢复信号，允许「恢复自动结案」。
 * 其余子类型禁止 AUTO_RECOVER，避免落账后无 R03/R04 闭环。
 */
export const AUTO_RECOVER_ALLOWED_SUB_TYPES = [
  ...SENSOR_SUB_TYPES,
  "设备离线",
  ...GPS_AUTO_RECOVER_SUB_TYPES,
] as const

/** 安防/破坏/图像/事务类 · 系统推荐人工解除 */
const ACTION_REQUIRED_SUB_TYPES = [
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
  "密码错误",
  "电量低于20%",
] as const

export type SubTypeDispositionCapability = {
  recommended: DispositionMode
  autoRecoverAllowed: boolean
  r03Signal: string
}

/** 附录 A · 子类型 × disposition 能力（与 constants.ts 枚举对齐） */
export const SUB_TYPE_DISPOSITION_BY_CATEGORY: Record<
  string,
  Record<string, SubTypeDispositionCapability>
> = {
  设备图像识别预警: {
    行人入侵: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    车辆入侵: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    物品形态变化: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    设备离线: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "设备重新上线",
    },
    设备上线: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（触发即完成）",
    },
    设备移除: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不设配置子类型）",
    },
  },
  设备物联预警: {
    温度异常: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "采集值回到阈值内并稳定 1 分钟",
    },
    湿度异常: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "采集值回到阈值内并稳定 1 分钟",
    },
    烟感异常: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "烟感恢复事件",
    },
    二氧化碳异常: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "采集值回到阈值内并稳定 1 分钟",
    },
    氧气异常: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "采集值回到阈值内并稳定 1 分钟",
    },
    设备离线: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "设备重新上线",
    },
    设备上线: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（触发即完成）",
    },
    设备移除: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不设配置子类型）",
    },
  },
  智能挂锁预警: {
    拆壳: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    锁舌被卡: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    锁杆被剪: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    非法开箱: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    拆卡报警: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    密码错误: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    关锁异常: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    "电量低于20%": {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无 R03 电量恢复（须人工或换电后人工解除）",
    },
    开锁通知: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不与关锁配对结案）",
    },
    关锁通知: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不与开锁配对结案）",
    },
    设备上线: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（触发即完成）",
    },
    设备移除: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不设配置子类型）",
    },
  },
  人脸门禁预警: {
    门未关: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无 R03 门关闭信号（须人工解除）",
    },
    密码错误: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    设备离线: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "设备重新上线",
    },
    开锁通知: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不与关锁配对结案）",
    },
    关锁通知: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不与开锁配对结案）",
    },
    设备上线: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（触发即完成）",
    },
    设备移除: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不设配置子类型）",
    },
  },
  设备GPS预警: {
    进围栏: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "GPS 回到围栏合法状态",
    },
    出围栏: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "GPS 回到围栏合法状态",
    },
    普通限速: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "GPS 速度恢复正常",
    },
    怠速滞留: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "GPS 滞留条件解除",
    },
    路线偏离: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "GPS 回到规划路线",
    },
    非法拆除: {
      recommended: "ACTION_REQUIRED",
      autoRecoverAllowed: false,
      r03Signal: "无（须人工核查）",
    },
    设备离线: {
      recommended: "AUTO_RECOVER",
      autoRecoverAllowed: true,
      r03Signal: "设备重新上线",
    },
    设备上线: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（触发即完成）",
    },
    设备移除: {
      recommended: "RECORD_ONLY",
      autoRecoverAllowed: false,
      r03Signal: "无（不设配置子类型）",
    },
  },
}

export function isAutoRecoverAllowedForSubType(subType: string): boolean {
  return (AUTO_RECOVER_ALLOWED_SUB_TYPES as readonly string[]).includes(
    subType.trim()
  )
}

/** 所选子类型中不允许 AUTO_RECOVER 的项（R15c） */
export function getAutoRecoverIneligibleSubTypes(subTypes: string[]): string[] {
  return subTypes
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((subType) => !isAutoRecoverAllowedForSubType(subType))
}

/** @deprecated 使用 getAutoRecoverIneligibleSubTypes */
export function getAutoRecoverForbiddenSubTypes(subTypes: string[]): string[] {
  return getAutoRecoverIneligibleSubTypes(subTypes)
}

export function canSelectAutoRecoverDisposition(subTypes: string[]): boolean {
  const normalized = subTypes.map((item) => item.trim()).filter(Boolean)
  if (normalized.length === 0) {
    return false
  }
  return getAutoRecoverIneligibleSubTypes(normalized).length === 0
}

export function validateAutoRecoverDisposition(
  subTypes: string[],
  mode: DispositionMode
): string | null {
  if (mode !== "AUTO_RECOVER") {
    return null
  }
  const ineligible = getAutoRecoverIneligibleSubTypes(subTypes)
  if (ineligible.length === 0) {
    return null
  }
  return `子类型「${ineligible.join("、")}」无 02/01 R03 自动恢复信号，不可选择「${DISPOSITION_MODE_LABELS.AUTO_RECOVER}」（R15c）`
}

/** 单个子类型的系统推荐（非强制，用户可改；AUTO_RECOVER 仍受 R15c 白名单约束） */
export function getRecommendedDispositionForSubType(subType: string): DispositionMode {
  const normalized = subType.trim()
  if ((NOTIFY_SUB_TYPES as readonly string[]).includes(normalized)) {
    return "RECORD_ONLY"
  }
  if (isAutoRecoverAllowedForSubType(normalized)) {
    return "AUTO_RECOVER"
  }
  if ((ACTION_REQUIRED_SUB_TYPES as readonly string[]).includes(normalized)) {
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
  if (normalized.every(isAutoRecoverAllowedForSubType)) {
    return "AUTO_RECOVER"
  }
  return "ACTION_REQUIRED"
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
      (ACTION_REQUIRED_SUB_TYPES as readonly string[]).includes(subType)
    )
  ) {
    return `子类型「${subTypeText}」系统推荐「${recommendedLabel}」。选择「${selectedLabel}」后触发即结案、无解除入口，请确认仍按此策略保存。`
  }

  if (
    mode === "ACTION_REQUIRED" &&
    normalized.every(isAutoRecoverAllowedForSubType)
  ) {
    return `子类型「${subTypeText}」系统推荐「${recommendedLabel}」。选择「${selectedLabel}」后须人工解除结案，请确认仍按此策略保存。`
  }

  if (mode === "AUTO_RECOVER") {
    const ineligible = getAutoRecoverIneligibleSubTypes(normalized)
    if (ineligible.length > 0) {
      return `子类型「${ineligible.join("、")}」无 R03 恢复信号，不可选「${selectedLabel}」（R15c）`
    }
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
