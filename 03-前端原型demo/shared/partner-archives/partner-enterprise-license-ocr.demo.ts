import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

/** 原型 Demo：企业营业执照 OCR 识别回填（【企业营业执照 OCR 识别规则】(PA-R13)） */
export type PartnerEnterpriseLicenseOcrDemoResult = {
  enterpriseName: string
  unifiedSocialCreditCode: string
}

const DEMO_BY_MENU: Record<PartnerArchiveMenuLabel, PartnerEnterpriseLicenseOcrDemoResult> = {
  货主信息: {
    enterpriseName: "无锡华东电解铜仓储贸易有限公司",
    unifiedSocialCreditCode: "91320200MA1MXH8K2P",
  },
  提货人信息: {
    enterpriseName: "江苏顺达物流经办服务有限公司",
    unifiedSocialCreditCode: "91320105MA1WABCD9X",
  },
  资金方信息: {
    enterpriseName: "中国建设银行股份有限公司无锡分行",
    unifiedSocialCreditCode: "91320200123456789X",
  },
  服务方信息: {
    enterpriseName: "森云监管服务（江苏）有限公司",
    unifiedSocialCreditCode: "91320211MA7FQREG8N",
  },
}

export function demoPartnerEnterpriseLicenseOcr(
  archiveMenu: PartnerArchiveMenuLabel,
): PartnerEnterpriseLicenseOcrDemoResult {
  return DEMO_BY_MENU[archiveMenu]
}

export const PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL = "识别营业执照"
export const PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_RECOGNIZING =
  "正在进行营业执照 OCR 图像识别…"
export const PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_SUCCESS =
  "营业执照 OCR 识别成功：已自动回填企业全称与统一社会信用代码"
