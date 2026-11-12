/**
 * 单据抬头系统名称：取当前登录租户配置（门户/租户档案的系统全称与针式纸短名称）。
 * 排版模板禁止写死「森云科技…」；上线由登录态接口下发，原型用当前演示租户配置快照。
 */
export type ReceiptPrintHeader = {
  /** A4 / A5 单据抬头全称 */
  systemName: string
  /** 针式连续纸短抬头；未单独配置时与全称相同 */
  systemNameCompact: string
}

/** 当前演示租户的系统名称快照，仅作动态取值来源，不是排版常量 */
const CURRENT_TENANT_PRINT_HEADER: ReceiptPrintHeader = {
  systemName: "森云科技供应链金融存货监管系统",
  systemNameCompact: "森云仓储监管系统",
}

export function getCurrentTenantPrintIdentity(): ReceiptPrintHeader {
  return { ...CURRENT_TENANT_PRINT_HEADER }
}

export function withTenantPrintHeader<T extends object>(payload: T): T & ReceiptPrintHeader {
  return { ...payload, ...getCurrentTenantPrintIdentity() }
}
