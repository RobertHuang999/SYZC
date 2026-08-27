export {
  ENABLED_SEVERITY_LEVELS,
  getSeverityLevelByCode,
  getSeverityLevelById,
  type SeverityLevel,
} from "@/shared/mock/severity-levels"

export const WAREHOUSE_OPTIONS = [
  "全部",
  "一号钢材仓",
  "二号粮油仓",
  "三号冷链仓",
  "四号化工仓",
  "五号监管仓",
] as const
