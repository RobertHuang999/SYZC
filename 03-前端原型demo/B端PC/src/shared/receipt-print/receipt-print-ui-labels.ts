/**
 * 6.4 出入库单据导出与打印（PDF）— 上线用户说明 vs 原型规格对照文案真源
 * 遵循 AGENTS.md 4.1.3 分层约定：
 * - *_USER_* 仅用于 ProductFieldHint / 弹窗面向用户的通俗提示（不带规则编号）
 * - *_SPEC_* 仅用于 PrototypeSpecCallout 原型规格对照（含需求编号与设计原因）
 */

export type ReceiptPaperSize = "a4" | "a5" | "continuous"

export const RECEIPT_PAPER_OPTIONS: Array<{
  value: ReceiptPaperSize
  label: string
  subLabel: string
  dimensionsLabel: string
}> = [
  {
    value: "a4",
    label: "A4 完整版（210×297mm·纵向归档）",
    subLabel: "适用于通用激光/喷墨打印机，用于银行审查底稿、司法存证与档案室正式归档",
    dimensionsLabel: "210mm × 297mm · 纵向",
  },
  {
    value: "a5",
    label: "A5 便携版（210×148mm·横向便携）",
    subLabel: "适用于办公室快速对账、随车携带便携凭单与门岗放行核验",
    dimensionsLabel: "210mm × 148mm · 横向",
  },
  {
    value: "continuous",
    label: "针式连续纸二等分（241×139.5mm·现场机打）",
    subLabel: "适用于地磅房/卡口针式点阵打印机（如 EPSON LQ-630K），多联无碳复写纸一打多出",
    dimensionsLabel: "241mm × 139.5mm · 横向连续走纸（避开左右 13mm 走纸孔带）",
  },
]

export const RECEIPT_PRINT_USER_HINTS: Record<ReceiptPaperSize, string> = {
  a4: "当前为 A4 纵向完整归档版，完整呈现单据头、货主主体、货品汇总明细及双排六方签章框，建议使用激光或喷墨打印机按 A4 纵向无缩放打印。",
  a5: "当前为 A5 横向便携版，压缩表头并采用底部四列横向一排签章，适合随车携带或门卫快速核验，打印时请选择 A5 横向。",
  continuous:
    "当前为二等分针式连续复写纸模式（241mm × 139.5mm），已预留左右各 13mm 拖纸孔边距与纯黑实线防断针排版，适配现场多联无碳复写纸机打。",
}

export const INBOUND_RECEIPT_SPEC_NOTE =
  "【入库单多介质导出与打印规格】(REQ-6.4-001 / REQ-6.4-003)：① 采用全空白纸系统绘制 1px 纯黑实线表格，严禁灰阶底色、条形码/二维码及冗长免责声明，防止针式打印机断针与多联复写字迹模糊；② 入库明细固定按「一级货品汇总（选项 B）」输出大类、品类、规格、数量与批次收集项，不拆分二级具体垛位以保护监管仓内部库容安全；③ 货主证件号与联系电话明文展示，便于现场交接核验；④ 单据抬头取当前租户配置的系统名称，禁止在排版模板写死；⑤ 不同货品计量单位不同时按单位分组合计，不得把吨和公斤混加成一笔。"

export const OUTBOUND_RECEIPT_SPEC_NOTE =
  "【出库单多介质导出与打印规格】(REQ-6.4-002 / REQ-6.4-003)：① 支持 A4 纵向归档、A5 横向便携、241×139.5mm 针式连续纸三种规格即时切换；② 质押/抵押等出库单中【单价】与【货物价值】保留列头、数值强制留空脱敏，防止商业价格向承运司机及门卫泄露；③ 货主与提货人证件号、联系电话、车牌号明文展示，预留仓管、司机、复核/门卫及货权方四方手签捺印框；④ 单据抬头取当前租户配置的系统名称，禁止在排版模板写死；⑤ 不同货品计量单位不同时按单位分组合计，不得混加。"

