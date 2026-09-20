/** 界面展示用：中文（English），避免单独使用 LTV */
export const LTV_DISPLAY_LABEL = "抵/质押率 (LTV)"

export const LTV_RELEASE_METHOD_OPTIONS = ["补仓", "平仓", "部分结清"] as const

export type LtvReleaseMethod = (typeof LTV_RELEASE_METHOD_OPTIONS)[number]

export const LTV_FOOTER_HINT =
  "任一条线满足上述条件即产生预警，解除方式取被命中那组的配置；若补仓线与平仓线同时满足，按平仓线认定。"

/** 当前率无法计算时，紧挨「当前订单抵/质押率 (LTV)：—」展示 */
export const LTV_UNAVAILABLE_HINT =
  "尚未录入放款结果或货值评估未完成，暂无法计算当前抵/质押率 (LTV)。"

/** 只读展示：完整触发条件（详情页等） */
export function formatLtvTriggerRuleText(threshold: string | undefined): string {
  return `当 ${LTV_DISPLAY_LABEL} 超过 ${formatLtvPercent(threshold)} 时触发预警（不含等于该阈值）`
}

export const LTV_HIT_RULE_HINT =
  "同时命中补仓线与平仓线时认定为平仓线；解除时仅展示命中线解除方式。"

export type LtvStrategyParams = {
  marginCallLtv: string
  closeOutLtv: string
  marginCallReleaseMethods: string
  closeOutReleaseMethods: string
}

export const DEFAULT_LTV_PARAMS: LtvStrategyParams = {
  marginCallLtv: "75",
  closeOutLtv: "85",
  marginCallReleaseMethods: "补仓,部分结清",
  closeOutReleaseMethods: "平仓,部分结清",
}

export function parseReleaseMethodsParam(value: string | undefined): string[] {
  if (!value?.trim()) {
    return []
  }
  return value
    .split(/[,、]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function serializeReleaseMethods(methods: string[]): string {
  return methods.join(",")
}

export function formatReleaseMethodsDisplay(methods: string[]): string {
  return methods.length > 0 ? methods.join("、") : "—"
}

export function toggleReleaseMethod(current: string[], method: LtvReleaseMethod): string[] {
  return current.includes(method)
    ? current.filter((item) => item !== method)
    : [...current, method]
}

export function formatLtvPercent(value: string | undefined): string {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return "—"
  }
  return `${numeric.toFixed(2)}%`
}

export function buildLtvDetailFields(
  params: LtvStrategyParams,
  currentLtv?: string | null
): { label: string; value: string }[] {
  const marginMethods = parseReleaseMethodsParam(params.marginCallReleaseMethods)
  const closeMethods = parseReleaseMethodsParam(params.closeOutReleaseMethods)

  const fields: { label: string; value: string }[] = []

  if (currentLtv) {
    fields.push({
      label: `当前订单${LTV_DISPLAY_LABEL}（配置参考）`,
      value: formatLtvPercent(currentLtv),
    })
  }

  fields.push(
    {
      label: "补仓线",
      value: `${formatLtvTriggerRuleText(params.marginCallLtv)} · 解除方式：${formatReleaseMethodsDisplay(marginMethods)}`,
    },
    {
      label: "平仓线",
      value: `${formatLtvTriggerRuleText(params.closeOutLtv)} · 解除方式：${formatReleaseMethodsDisplay(closeMethods)}`,
    },
    {
      label: "命中规则",
      value: LTV_HIT_RULE_HINT,
    }
  )

  return fields
}

export function parseLtvParamsFromDetailFields(
  fields: { label: string; value: string }[]
): Partial<LtvStrategyParams> {
  const params: Partial<LtvStrategyParams> = {}

  for (const field of fields) {
    if (field.label.includes("补仓线")) {
      const ltvMatch = field.value.match(/([\d.]+)\s*%/)
      if (ltvMatch) {
        params.marginCallLtv = ltvMatch[1]
      }
      const releaseMatch = field.value.match(/解除方式：(.+)/)
      if (releaseMatch) {
        params.marginCallReleaseMethods = serializeReleaseMethods(
          parseReleaseMethodsParam(releaseMatch[1])
        )
      }
    }

    if (field.label.includes("平仓线")) {
      const ltvMatch = field.value.match(/([\d.]+)\s*%/)
      if (ltvMatch) {
        params.closeOutLtv = ltvMatch[1]
      }
      const releaseMatch = field.value.match(/解除方式：(.+)/)
      if (releaseMatch) {
        params.closeOutReleaseMethods = serializeReleaseMethods(
          parseReleaseMethodsParam(releaseMatch[1])
        )
      }
    }
  }

  return params
}

export function extractLtvParams(record: Record<string, string>): LtvStrategyParams {
  return {
    marginCallLtv: record.marginCallLtv ?? DEFAULT_LTV_PARAMS.marginCallLtv,
    closeOutLtv: record.closeOutLtv ?? DEFAULT_LTV_PARAMS.closeOutLtv,
    marginCallReleaseMethods:
      record.marginCallReleaseMethods ?? DEFAULT_LTV_PARAMS.marginCallReleaseMethods,
    closeOutReleaseMethods:
      record.closeOutReleaseMethods ?? DEFAULT_LTV_PARAMS.closeOutReleaseMethods,
  }
}
