/**
 * H5 标注的版本归属 —— 供「标注视图」三档切换使用。
 *
 * 口径（不自己拍脑袋）：以 `02-PRD文档/B-迭代需求/6.3版本（2026.09）/00-菜单迭代记录.md`
 * 的「菜单调整明细」为准。凡是 6.3 涉及的页面，这一页的标注整体视为「6.3 变更」；
 * 其余标注视为历史沿用（6.2 及更早）。
 *
 * 后续某个菜单升级到新版本时，只需要在这里加一条前缀，页面代码不用动。
 */
const V63_ANNOTATION_PREFIXES = [
  "partner-archive", // 合作方档案：H5 用户中心四个入口
  "wh-h5-", // 仓库管理：仓库主档、库房、分区
  "inbound-h5-", // 入库记录：货主 R03 快捷建档
  "inbound-staging-h5-", // 入库暂存登记：R32 通道与转正
  "outbound-h5-", // 出库记录：货主引用、提货人 O06a
  "receipt-", // 仓单管理：存货人 / 持有人引用合作方
  "device-warning-", // 设备预警信息：人工解除门控放开
] as const

export function inferAnnotationVersion(id: string): "6.3" | undefined {
  return V63_ANNOTATION_PREFIXES.some((prefix) => id.startsWith(prefix))
    ? "6.3"
    : undefined
}
