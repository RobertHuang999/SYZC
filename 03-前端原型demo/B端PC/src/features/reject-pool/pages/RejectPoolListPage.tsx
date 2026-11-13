import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CheckCircle2Icon,
  DownloadIcon,
  RotateCcwIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { SegmentedTabs } from "@/shared/components/SegmentedTabs"
import { REJECT_POOL_PAGE_USER_DESC } from "@prototype/shared/reject-pool/reject-pool-ui-labels"
import { rejectPoolListAnnotations } from "../annotations/reject-pool-list.annotations"
import { RejectPoolFiltersPanel } from "../components/RejectPoolFiltersPanel"
import {
  RejectPoolTable,
  type RejectPoolRowActionKind,
} from "../components/RejectPoolTable"
import { rejectPoolDocuments } from "../documents/reject-pool-documents"
import {
  DEFAULT_REJECT_POOL_FILTERS,
  OVERDUE_HOURS_THRESHOLD,
  REJECT_POOL_LOG_STORAGE_KEY,
  REJECT_POOL_STORAGE_KEY,
  TAB_META,
  isCircuitBroken,
  rejectPoolActionPath,
  rejectPoolDetailPath,
  type RejectPoolFilters,
  type RejectPoolRecord,
  type RejectPoolTabFilter,
  type RescheduledLogItem,
} from "../domain/types"

/**
 * 全状态内联 Mock 数据（严格覆盖 3 大标签页 + 申请失败/受理失败 + 企业/个人 + 存货/仓单 + 超期未调度 >72h + 5次熔断锁定）
 */
export const INITIAL_REJECT_POOL_MOCK: RejectPoolRecord[] = [
  // ================= ① 线索被拒标签页 =================
  {
    id: "rp-20261110-0001",
    applyNo: "FIN-20261110-0001",
    batchNo: "FIN-20261110-0001-B02",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "有色金属动态质押贷（电解铜专享）",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "上海晟源有色金属有限公司",
    applicantIdentifier: "91310115MA1K4R892X",
    businessLicenseNo: "91310115MA1K4R892X",
    businessLicenseFileName: "上海晟源有色金属_营业执照副本.pdf",
    agentName: "沈文涛",
    agentPhone: "138****4512",
    agentIdCard: "310115********3418",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-1",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "沪产 1# 标准阴极铜 (Cu≥99.95%)",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-01-03",
        pledgeQuantity: 68.5,
        unit: "吨",
        unitPriceYuan: 74200,
        assessedValueYuan: 5082700,
      },
    ],
    intendedAmountYuan: 3200000,
    intendedPeriods: 6,
    lastRejectReason:
      "上游冶炼厂采购发票与入库磅单重量存在 1.8 吨差异，且缺少最近一期增值税完税证明，请客户补充说明后重新救活。",
    rejectCount: 2,
    stagnationHours: 96.4,
    appliedAt: "2026-11-08 14:22:10",
    rejectHandler: "张晓梅",
    rejectHandlerOrg: "森云融资运营中心",
    rejectedAt: "2026-11-09 10:15:00",
    historicalRejectedFunders: [],
    attachments: [
      {
        id: "att-101",
        category: "申请资料",
        fileName: "上海晟源_电解铜购销合同_202611.pdf",
        fileSize: "2.3 MB",
        uploadedBy: "沈文涛（经办人）",
        uploadedAt: "2026-11-08 14:20:05",
        summary: "70 吨 1# 电解铜框架采购协议及首付款回单。",
      },
      {
        id: "att-102",
        category: "历史驳回凭证",
        fileName: "初审退回补正清单_FIN-20261110-0001.pdf",
        fileSize: "412 KB",
        uploadedBy: "张晓梅（森云融资运营中心）",
        uploadedAt: "2026-11-09 10:14:40",
        summary: "明确列明采购发票与监管库复磅重量差异核查要求。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261110-0001-B02",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（二次驳回入池）",
        operatorName: "张晓梅",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-09 10:15:00",
        reasonOrNote:
          "上游冶炼厂采购发票与入库磅单重量存在 1.8 吨差异，且缺少最近一期增值税完税证明，请客户补充说明后重新救活。",
      },
      {
        batchNo: "FIN-20261110-0001-B01",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（首次入池）",
        operatorName: "李雪",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-08 17:40:12",
        reasonOrNote: "企业授权经办人委托书未加盖公章骑缝章，退回补章。",
      },
    ],
  },
  {
    id: "rp-20261112-0002",
    applyNo: "FIN-20261112-0002",
    batchNo: "FIN-20261112-0002-B01",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "数字仓单极速质押通（免现场尽调）",
    needDiligence: false,
    applicantType: "INDIVIDUAL",
    applicantName: "周建国",
    applicantIdentifier: "139****6682",
    applicantPhone: "139****6682",
    applicantIdCard: "320281********2219",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2091023847561102336"],
    inventoryItems: [
      {
        id: "inv-2",
        categoryName: "有色金属",
        varietyName: "铝锭",
        specModel: "国标 A00 重熔用铝锭 (Al99.70)",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "二号库房 · B区 B-03-11",
        pledgeQuantity: 92.0,
        unit: "吨",
        unitPriceYuan: 20650,
        assessedValueYuan: 1899800,
      },
    ],
    intendedAmountYuan: 1200000,
    intendedPeriods: 3,
    lastRejectReason:
      "客户填写的收款结算账户开户行支行名称不完整，请核实后补全并按路由直派合作资金方。",
    rejectCount: 1,
    stagnationHours: 18.5,
    appliedAt: "2026-11-12 09:30:18",
    rejectHandler: "陈丽华",
    rejectHandlerOrg: "森云融资运营中心",
    rejectedAt: "2026-11-12 16:05:33",
    historicalRejectedFunders: [],
    attachments: [
      {
        id: "att-201",
        category: "申请资料",
        fileName: "周建国_个人数字仓单质押申请表.pdf",
        fileSize: "1.1 MB",
        uploadedBy: "周建国（个人货主）",
        uploadedAt: "2026-11-12 09:29:45",
        summary: "绑定数字仓单 CD2091023847561102336 的个人融资申请电子签章件。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261112-0002-B01",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（首次入池）",
        operatorName: "陈丽华",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-12 16:05:33",
        reasonOrNote:
          "客户填写的收款结算账户开户行支行名称不完整，请核实后补全并按路由直派合作资金方。",
      },
    ],
  },
  {
    id: "rp-20261105-0003",
    applyNo: "FIN-20261105-0003",
    batchNo: "FIN-20261105-0003-B05",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "钢铁大宗供应链保理融",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "江苏弘毅钢铁贸易有限公司",
    applicantIdentifier: "91320506MA1P9X330D",
    businessLicenseNo: "91320506MA1P9X330D",
    businessLicenseFileName: "江苏弘毅钢铁_营业执照.pdf",
    agentName: "吴志远",
    agentPhone: "136****9087",
    agentIdCard: "320506********0912",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-3",
        categoryName: "黑色金属",
        varietyName: "热轧卷板",
        specModel: "Q235B 5.75*1500mm 沙钢",
        warehouseName: "西南大宗物流监管仓",
        zoneLocation: "大宗库房 · 一号分区 垛位-01",
        pledgeQuantity: 420.0,
        unit: "吨",
        unitPriceYuan: 3780,
        assessedValueYuan: 1587600,
      },
    ],
    intendedAmountYuan: 1100000,
    intendedPeriods: 6,
    lastRejectReason:
      "连续五轮提交的质押货权证明存在多头质押疑点（与第三方保理登记重叠），触发风控熔断。",
    rejectCount: 5,
    stagnationHours: 168.0,
    appliedAt: "2026-11-01 11:10:00",
    rejectHandler: "高风控",
    rejectHandlerOrg: "森云首席风控办公室",
    rejectedAt: "2026-11-06 10:30:00",
    historicalRejectedFunders: ["浙商银行宁波分行"],
    attachments: [
      {
        id: "att-301",
        category: "历史驳回凭证",
        fileName: "中登网动产担保查重异常报告.pdf",
        fileSize: "3.2 MB",
        uploadedBy: "高风控（森云首席风控办公室）",
        uploadedAt: "2026-11-06 10:28:15",
        summary: "第 5 次入池驳回核查附件：存在历史重复质押登记告警。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261105-0003-B05",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（累计第 5 次入池触发熔断）",
        operatorName: "高风控",
        operatorOrg: "森云首席风控办公室",
        operatedAt: "2026-11-06 10:30:00",
        reasonOrNote:
          "连续五轮提交的质押货权证明存在多头质押疑点，已锁定线上重调度权限，需线下特批解除。",
      },
    ],
  },

  // ================= ② 尽调失败标签页 =================
  {
    id: "rp-20261109-0004",
    applyNo: "FIN-20261109-0004",
    batchNo: "FIN-20261109-0004-B02",
    tabKey: "DILIGENCE_FAILED",
    rejectNodeName: "尽调风控不通过",
    businessStatus: "ACCEPT_FAILED",
    productName: "橡胶化工现货监管贷",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "浙江远大橡胶制品有限公司",
    applicantIdentifier: "91330200MA287E451K",
    businessLicenseNo: "91330200MA287E451K",
    businessLicenseFileName: "浙江远大橡胶_营业执照正本.pdf",
    agentName: "方敏",
    agentPhone: "158****3301",
    agentIdCard: "330203********5524",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-4",
        categoryName: "能源化工",
        varietyName: "天然橡胶",
        specModel: "云南农垦全乳胶 SCRWF",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · C区 C-02-05",
        pledgeQuantity: 115.0,
        unit: "吨",
        unitPriceYuan: 15800,
        assessedValueYuan: 1817000,
      },
    ],
    intendedAmountYuan: 1250000,
    intendedPeriods: 6,
    lastRejectReason:
      "原指派尽调专员陈志强因宁波区域现场排期冲突退回拒单（受理失败），建议改派其他尽调专员接手核查。",
    rejectCount: 2,
    stagnationHours: 84.2,
    appliedAt: "2026-11-07 15:40:20",
    rejectHandler: "陈志强",
    rejectHandlerOrg: "华东仓储监管尽调一组",
    rejectedAt: "2026-11-09 22:20:00",
    lastSurveyorId: "SUR-001",
    lastSurveyorName: "陈志强",
    historicalRejectedFunders: ["平安银行大宗商品金融事业部"],
    attachments: [
      {
        id: "att-401",
        category: "申请资料",
        fileName: "浙江远大橡胶_全乳胶质检单与仓单清单.pdf",
        fileSize: "1.9 MB",
        uploadedBy: "方敏（经办人）",
        uploadedAt: "2026-11-07 15:38:00",
        summary: "云南全乳胶出厂质量检验合格证及入库验货清单。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261109-0004-B02",
        nodeName: "尽调风控不通过",
        actionResult: "受理失败（尽调专员拒单退回）",
        operatorName: "陈志强",
        operatorOrg: "华东仓储监管尽调一组",
        operatedAt: "2026-11-09 22:20:00",
        reasonOrNote: "同期外勤排期已满无法按 48h 时效到库盘点，退回池内重派新专员。",
      },
      {
        batchNo: "FIN-20261109-0004-B01",
        nodeName: "需求线索驳回",
        actionResult: "已救活流转",
        operatorName: "张晓梅",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-08 11:05:10",
        reasonOrNote: "补充近 6 个月银行对公流水后已救活并派发尽调。",
      },
    ],
  },
  {
    id: "rp-20261111-0005",
    applyNo: "FIN-20261111-0005",
    batchNo: "FIN-20261111-0005-B03",
    tabKey: "DILIGENCE_FAILED",
    rejectNodeName: "尽调风控不通过",
    businessStatus: "APPLY_FAILED",
    productName: "粤港澳有色金属仓单质押贷",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "广东粤海铜业供应链有限公司",
    applicantIdentifier: "91440101MA59T8821N",
    businessLicenseNo: "91440101MA59T8821N",
    businessLicenseFileName: "广东粤海铜业_营业执照.pdf",
    agentName: "梁家辉",
    agentPhone: "135****7721",
    agentIdCard: "440106********1833",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2092155678901234567"],
    inventoryItems: [
      {
        id: "inv-5",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "标准阴极铜 贵溪牌",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-02-01",
        pledgeQuantity: 105.0,
        unit: "吨",
        unitPriceYuan: 74500,
        assessedValueYuan: 7822500,
      },
    ],
    intendedAmountYuan: 5200000,
    intendedPeriods: 12,
    lastRejectReason:
      "智风控企业涉诉扫描命中历史买卖合同纠纷一审待决记录，尽调人工核查驳回；若客户补足全额保证金可考虑风控特批直推资方。",
    rejectCount: 3,
    stagnationHours: 36.8,
    appliedAt: "2026-11-09 10:12:45",
    rejectHandler: "赵明远",
    rejectHandlerOrg: "华南产业风控尽调组",
    rejectedAt: "2026-11-11 21:45:12",
    lastSurveyorId: "SUR-002",
    lastSurveyorName: "赵明远",
    historicalRejectedFunders: ["浦发银行供应链金融部"],
    attachments: [
      {
        id: "att-501",
        category: "尽调底稿",
        fileName: "粤海铜业_智风控企业征信核查底稿.pdf",
        fileSize: "4.6 MB",
        uploadedBy: "赵明远（华南产业风控尽调组）",
        uploadedAt: "2026-11-11 21:40:00",
        summary: "含企查查涉诉详情页及监管库现场视频抽检截图。",
      },
      {
        id: "att-502",
        category: "申请资料",
        fileName: "粤海铜业_央企上游保兑确认函.pdf",
        fileSize: "1.2 MB",
        uploadedBy: "梁家辉（经办人）",
        uploadedAt: "2026-11-11 22:10:00",
        summary: "客户事后提交的关联增信担保函扫描件。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261111-0005-B03",
        nodeName: "尽调风控不通过",
        actionResult: "申请失败（尽调驳回）",
        operatorName: "赵明远",
        operatorOrg: "华南产业风控尽调组",
        operatedAt: "2026-11-11 21:45:12",
        reasonOrNote: "智风控命中未结涉诉纠纷且暂未补充担保函，尽调不通过入池。",
      },
      {
        batchNo: "FIN-20261111-0005-B02",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（曾被浦发银行拒绝）",
        operatorName: "王授信",
        operatorOrg: "浦发银行供应链金融部",
        operatedAt: "2026-11-10 16:30:00",
        reasonOrNote: "行业集中度额度暂时用罄，退回重新安排尽调增信。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
  {
    id: "rp-20261104-0006",
    applyNo: "FIN-20261104-0006",
    batchNo: "FIN-20261104-0006-B05",
    tabKey: "DILIGENCE_FAILED",
    rejectNodeName: "尽调风控不通过",
    businessStatus: "APPLY_FAILED",
    productName: "华北建材现货抵押贷",
    needDiligence: true,
    applicantType: "INDIVIDUAL",
    applicantName: "林振华",
    applicantIdentifier: "186****9104",
    applicantPhone: "186****9104",
    applicantIdCard: "130203********4011",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-6",
        categoryName: "黑色金属",
        varietyName: "螺纹钢",
        specModel: "HRB400E Φ20mm 河钢",
        warehouseName: "西南大宗物流监管仓",
        zoneLocation: "大宗库房 · 二号分区 垛位-07",
        pledgeQuantity: 260.0,
        unit: "吨",
        unitPriceYuan: 3650,
        assessedValueYuan: 949000,
      },
    ],
    intendedAmountYuan: 650000,
    intendedPeriods: 3,
    lastRejectReason:
      "现场监管仓两次盘点均发现部分钢材存在锈蚀降级且未能补足差额货值，累计被拒 5 次已熔断锁定。",
    rejectCount: 5,
    stagnationHours: 192.5,
    appliedAt: "2026-10-30 09:15:00",
    rejectHandler: "林静雯",
    rejectHandlerOrg: "森云总部驻库尽调部",
    rejectedAt: "2026-11-05 09:55:00",
    lastSurveyorId: "SUR-003",
    lastSurveyorName: "林静雯",
    historicalRejectedFunders: [],
    attachments: [
      {
        id: "att-601",
        category: "尽调底稿",
        fileName: "林振华_现场盘点锈蚀核减报告.pdf",
        fileSize: "5.1 MB",
        uploadedBy: "林静雯（森云总部驻库尽调部）",
        uploadedAt: "2026-11-05 09:50:00",
        summary: "现场货品品质复核及净值重估报告。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261104-0006-B05",
        nodeName: "尽调风控不通过",
        actionResult: "申请失败（累计第 5 次入池触发熔断）",
        operatorName: "林静雯",
        operatorOrg: "森云总部驻库尽调部",
        operatedAt: "2026-11-05 09:55:00",
        reasonOrNote: "货值核减后质押率突破 85% 警戒线且客户无力补仓，触发 5 次熔断锁定。",
      },
    ],
  },

  // ================= ③ 授信失败标签页 =================
  {
    id: "rp-20261108-0007",
    applyNo: "FIN-20261108-0007",
    batchNo: "FIN-20261108-0007-B02",
    tabKey: "CREDIT_FAILED",
    rejectNodeName: "授信资方拒绝",
    businessStatus: "APPLY_FAILED",
    productName: "数字仓单银企直连授信产品",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "宁波港通金属材料有限公司",
    applicantIdentifier: "91330206MA29K5527P",
    businessLicenseNo: "91330206MA29K5527P",
    businessLicenseFileName: "宁波港通金属_营业执照.pdf",
    agentName: "胡海波",
    agentPhone: "137****6190",
    agentIdCard: "330206********7714",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2088001122334455667"],
    inventoryItems: [
      {
        id: "inv-7",
        categoryName: "有色金属",
        varietyName: "铝锭",
        specModel: "A00 重熔用铝锭",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "二号库房 · B区 B-04-06",
        pledgeQuantity: 280.0,
        unit: "吨",
        unitPriceYuan: 20500,
        assessedValueYuan: 5740000,
      },
    ],
    intendedAmountYuan: 4000000,
    intendedPeriods: 6,
    approvedCreditAmountYuan: 3500000,
    approvedCreditPeriods: 6,
    lastRejectReason:
      "浦发银行供应链金融部因本月华东有色授信敞口额度已满拒绝放款（非主体信用问题），原尽调结论继续有效，建议立即改派平安银行或苏州银行。",
    rejectCount: 2,
    stagnationHours: 110.6,
    appliedAt: "2026-11-06 13:18:00",
    rejectHandler: "王授信",
    rejectHandlerOrg: "浦发银行供应链金融部",
    rejectedAt: "2026-11-08 19:45:00",
    historicalRejectedFunders: ["浦发银行供应链金融部", "浙商银行宁波分行"],
    attachments: [
      {
        id: "att-701",
        category: "尽调底稿",
        fileName: "宁波港通_尽调合格终审报告（有效）.pdf",
        fileSize: "3.8 MB",
        uploadedBy: "周建峰（长三角数字仓单核查组）",
        uploadedAt: "2026-11-07 16:00:00",
        summary: "现场核库及仓单冻结校验全项通过，授信重派可直接复用。",
      },
      {
        id: "att-702",
        category: "历史驳回凭证",
        fileName: "浦发银行_额度受限拒绝回执.pdf",
        fileSize: "320 KB",
        uploadedBy: "王授信（浦发银行供应链金融部）",
        uploadedAt: "2026-11-08 19:42:00",
        summary: "资金方行内涉金属授信总额度阶段性上限说明。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261108-0007-B02",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（浦发银行拒批）",
        operatorName: "王授信",
        operatorOrg: "浦发银行供应链金融部",
        operatedAt: "2026-11-08 19:45:00",
        reasonOrNote: "行内当月大宗有色额度受限拒绝（内部批注：核定风险净值 350 万元，跨行推送自动脱敏）。",
        isConfidentialFunderRemark: true,
      },
      {
        batchNo: "FIN-20261108-0007-B01",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（浙商银行拒批）",
        operatorName: "刘经理",
        operatorOrg: "浙商银行宁波分行",
        operatedAt: "2026-11-07 20:10:00",
        reasonOrNote: "申请期数超出我行短期流贷 3 个月偏好上限。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
  {
    id: "rp-20261112-0008",
    applyNo: "FIN-20261112-0008",
    batchNo: "FIN-20261112-0008-B01",
    tabKey: "CREDIT_FAILED",
    rejectNodeName: "授信资方拒绝",
    businessStatus: "APPLY_FAILED",
    productName: "中小微现货快融宝",
    needDiligence: false,
    applicantType: "ENTERPRISE",
    applicantName: "无锡华联特种钢材有限公司",
    applicantIdentifier: "91320205MA1W3H904E",
    businessLicenseNo: "91320205MA1W3H904E",
    businessLicenseFileName: "无锡华联特钢_营业执照.pdf",
    agentName: "孙建军",
    agentPhone: "133****8850",
    agentIdCard: "320205********6118",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-8",
        categoryName: "黑色金属",
        varietyName: "冷轧不锈钢卷",
        specModel: "304/2B 2.0*1219mm 太钢",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-03-02",
        pledgeQuantity: 95.0,
        unit: "吨",
        unitPriceYuan: 13900,
        assessedValueYuan: 1320500,
      },
    ],
    intendedAmountYuan: 880000,
    intendedPeriods: 3,
    lastRejectReason:
      "网商银行产业金融部自动风控模型判定近 3 个月下游开票集中度偏高拒批，建议改派苏州银行或浙商银行人工加线下复核。",
    rejectCount: 1,
    stagnationHours: 24.0,
    appliedAt: "2026-11-11 10:00:00",
    rejectHandler: "自动化授信网关",
    rejectHandlerOrg: "网商银行产业金融部",
    rejectedAt: "2026-11-12 10:30:00",
    historicalRejectedFunders: ["网商银行产业金融部"],
    attachments: [
      {
        id: "att-801",
        category: "申请资料",
        fileName: "无锡华联_304不锈钢入库质押明细表.xlsx",
        fileSize: "840 KB",
        uploadedBy: "孙建军（经办人）",
        uploadedAt: "2026-11-11 09:58:00",
        summary: "95 吨太钢 304 冷轧不锈钢卷入库货值确认单。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261112-0008-B01",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（首次授信被拒）",
        operatorName: "自动化授信网关",
        operatorOrg: "网商银行产业金融部",
        operatedAt: "2026-11-12 10:30:00",
        reasonOrNote: "线上评分未达免人工阈值（内部评分 612 分，跨行脱敏）。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
  {
    id: "rp-20261102-0009",
    applyNo: "FIN-20261102-0009",
    batchNo: "FIN-20261102-0009-B05",
    tabKey: "CREDIT_FAILED",
    rejectNodeName: "授信资方拒绝",
    businessStatus: "APPLY_FAILED",
    productName: "天然橡胶仓单质押授信",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "山东齐鲁化工物流有限公司",
    applicantIdentifier: "91370200MA3N5R6T8W",
    businessLicenseNo: "91370200MA3N5R6T8W",
    businessLicenseFileName: "齐鲁化工物流_营业执照.pdf",
    agentName: "赵刚",
    agentPhone: "159****4432",
    agentIdCard: "370202********2901",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2093344556677889900"],
    inventoryItems: [
      {
        id: "inv-9",
        categoryName: "能源化工",
        varietyName: "天然橡胶",
        specModel: "泰国 3# 烟片胶 RSS3",
        warehouseName: "西南大宗物流监管仓",
        zoneLocation: "大宗库房 · 三号分区 垛位-03",
        pledgeQuantity: 150.0,
        unit: "吨",
        unitPriceYuan: 16400,
        assessedValueYuan: 2460000,
      },
    ],
    intendedAmountYuan: 1700000,
    intendedPeriods: 6,
    lastRejectReason:
      "5 家合作资金方连续评估后均因期现基差波动风险超出阈值拒批，已触发 5 次熔断锁定。",
    rejectCount: 5,
    stagnationHours: 216.0,
    appliedAt: "2026-10-28 16:00:00",
    rejectHandler: "李审",
    rejectHandlerOrg: "苏州银行贸易融资中心",
    rejectedAt: "2026-11-04 10:00:00",
    historicalRejectedFunders: [
      "浦发银行供应链金融部",
      "浙商银行宁波分行",
      "网商银行产业金融部",
      "平安银行大宗商品金融事业部",
      "苏州银行贸易融资中心",
    ],
    attachments: [
      {
        id: "att-901",
        category: "历史驳回凭证",
        fileName: "五轮资方授信评估驳回汇总表.pdf",
        fileSize: "2.1 MB",
        uploadedBy: "系统风控网关",
        uploadedAt: "2026-11-04 10:02:00",
        summary: "记录连续五次资方拒绝及熔断保护触发凭证。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261102-0009-B05",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（第 5 次被拒触发熔断）",
        operatorName: "李审",
        operatorOrg: "苏州银行贸易融资中心",
        operatedAt: "2026-11-04 10:00:00",
        reasonOrNote: "东南亚烟片胶现货流动性折价高于预期，不予授信。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
]

export const INITIAL_RESCHEDULED_LOGS: RescheduledLogItem[] = [
  {
    id: "log-seed-1",
    applyNo: "FIN-20261106-0081",
    batchNo: "FIN-20261106-0081-B02",
    applicantName: "安徽皖江金属材料有限公司",
    productName: "有色金属动态质押贷（电解铜专享）",
    actionName: "重新分配资方",
    targetStatusLabel: "授信已受理",
    targetAssignee: "平安银行大宗商品金融事业部",
    operatedAt: "2026-11-12 15:20:00",
  },
  {
    id: "log-seed-2",
    applyNo: "FIN-20261107-0064",
    batchNo: "FIN-20261107-0064-B02",
    applicantName: "宁波甬江钢铁贸易有限公司",
    productName: "数字仓单银企直连授信产品",
    actionName: "重新救活",
    targetStatusLabel: "待受理",
    targetAssignee: "需求线索分配池",
    operatedAt: "2026-11-11 18:05:12",
  },
]

export function loadRejectPoolRecords(): RejectPoolRecord[] {
  try {
    const raw = localStorage.getItem(REJECT_POOL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load reject pool records:", e)
  }
  return INITIAL_REJECT_POOL_MOCK
}

export function saveRejectPoolRecords(records: RejectPoolRecord[]) {
  try {
    localStorage.setItem(REJECT_POOL_STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error("Failed to save reject pool records:", e)
  }
}

export function loadRescheduledLogs(): RescheduledLogItem[] {
  try {
    const raw = localStorage.getItem(REJECT_POOL_LOG_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load rescheduled logs:", e)
  }
  return INITIAL_RESCHEDULED_LOGS
}

export function saveRescheduledLogs(logs: RescheduledLogItem[]) {
  try {
    localStorage.setItem(REJECT_POOL_LOG_STORAGE_KEY, JSON.stringify(logs))
  } catch (e) {
    console.error("Failed to save rescheduled logs:", e)
  }
}

export function resetRejectPoolDemoData() {
  saveRejectPoolRecords(INITIAL_REJECT_POOL_MOCK)
  saveRescheduledLogs(INITIAL_RESCHEDULED_LOGS)
  return {
    records: INITIAL_REJECT_POOL_MOCK,
    logs: INITIAL_RESCHEDULED_LOGS,
  }
}


export function RejectPoolListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get("tab") as RejectPoolTabFilter | null
  const [activeTab, setActiveTab] = useState<RejectPoolTabFilter>(
    tabParam === "ALL" || (tabParam && TAB_META[tabParam]) ? tabParam : "ALL",
  )

  const [records, setRecords] = useState<RejectPoolRecord[]>(loadRejectPoolRecords)
  const [draftFilters, setDraftFilters] = useState<RejectPoolFilters>(
    DEFAULT_REJECT_POOL_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<RejectPoolFilters>(
    DEFAULT_REJECT_POOL_FILTERS,
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  const handleTabChange = (nextTab: RejectPoolTabFilter) => {
    setActiveTab(nextTab)
    setPage(1)
    setSearchParams({ tab: nextTab }, { replace: true })
  }

  const filteredRecords = useMemo(() => {
    return records
      .filter((item) => activeTab === "ALL" || item.tabKey === activeTab)
      .filter((item) => {
        if (appliedFilters.applyNo.trim()) {
          const q = appliedFilters.applyNo.trim().toLowerCase()
          if (!item.applyNo.toLowerCase().includes(q)) return false
        }
        if (appliedFilters.keyword.trim()) {
          const kw = appliedFilters.keyword.trim().toLowerCase()
          const hit =
            item.applicantName.toLowerCase().includes(kw) ||
            item.productName.toLowerCase().includes(kw)
          if (!hit) return false
        }
        if (appliedFilters.needDiligence !== "ALL") {
          const want = appliedFilters.needDiligence === "YES"
          if (item.needDiligence !== want) return false
        }
        if (appliedFilters.stagnationState === "OVERDUE") {
          if (item.stagnationHours <= OVERDUE_HOURS_THRESHOLD) return false
        } else if (appliedFilters.stagnationState === "NORMAL") {
          if (item.stagnationHours > OVERDUE_HOURS_THRESHOLD) return false
        }
        if (appliedFilters.rejectNodeName !== "ALL") {
          if (item.rejectNodeName !== appliedFilters.rejectNodeName) return false
        }
        if (appliedFilters.businessStatus !== "ALL") {
          if (item.businessStatus !== appliedFilters.businessStatus) return false
        }
        if (appliedFilters.appliedStart) {
          if (item.appliedAt.slice(0, 10) < appliedFilters.appliedStart) return false
        }
        if (appliedFilters.appliedEnd) {
          if (item.appliedAt.slice(0, 10) > appliedFilters.appliedEnd) return false
        }
        if (appliedFilters.rejectedStart) {
          if (item.rejectedAt.slice(0, 10) < appliedFilters.rejectedStart) return false
        }
        if (appliedFilters.rejectedEnd) {
          if (item.rejectedAt.slice(0, 10) > appliedFilters.rejectedEnd) return false
        }
        return true
      })
      .sort((a, b) => b.stagnationHours - a.stagnationHours)
  }, [records, activeTab, appliedFilters])

  const pagedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, page, pageSize])

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_REJECT_POOL_FILTERS)
    setAppliedFilters(DEFAULT_REJECT_POOL_FILTERS)
    setPage(1)
  }

  const handleExport = () => {
    const tabLabel = activeTab === "ALL" ? "全部" : TAB_META[activeTab].shortLabel
    showToast(
      `已导出「${tabLabel}」异常台账（共 ${filteredRecords.length} 条）。`,
    )
  }

  const handleRestoreDemo = () => {
    const restored = resetRejectPoolDemoData()
    setRecords(restored.records)
    setPage(1)
    showToast("已恢复 9 条全状态初始演示数据（含三大标签页、超期件与熔断锁定示例）。")
  }

  const handleRowAction = (action: RejectPoolRowActionKind, item: RejectPoolRecord) => {
    if (action === "detail") {
      navigate(rejectPoolDetailPath(item.id))
      return
    }
    if (action !== "unlock" && isCircuitBroken(item)) {
      showToast("已触发风控熔断（被拒满 5 次），需先执行线下特批解封。")
      return
    }
    navigate(rejectPoolActionPath(item.id, action))
  }

  return (
    <PrototypeAnnotationProvider
      documents={rejectPoolDocuments}
      annotations={rejectPoolListAnnotations}
    >
      <div className="space-y-4 p-6 font-sans">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl">
            <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["reject-pool-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              被拒退回记录池
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {REJECT_POOL_PAGE_USER_DESC}
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 4 大分类标签页（对齐现网：全部 / 线索被拒 / 尽调失败 / 授信失败） */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-tabs"]}>
          <SegmentedTabs<RejectPoolTabFilter>
            items={(["ALL", "CLUE_REJECTED", "DILIGENCE_FAILED", "CREDIT_FAILED"] as const).map(
              (key) => ({
                key,
                label: key === "ALL" ? "全部" : TAB_META[key].shortLabel,
              }),
            )}
            value={activeTab}
            onChange={handleTabChange}
          />
        </PrototypeAnnotationTarget>

        {/* 组合筛选区（默认 4 项 + 展开 4 项） */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-filter"]}>
          <RejectPoolFiltersPanel
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            extraActions={
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleRestoreDemo}
                >
                  <RotateCcwIcon className="size-3.5" />
                  恢复演示数据
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleExport}
                >
                  <DownloadIcon className="size-3.5" />
                  导出异常台账
                </Button>
              </>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 数据台账表格与吸底分页 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-table", "reject-pool-actions"]}>
          <Card>
            <CardContent className="p-4">
              <RejectPoolTable
                activeTab={activeTab}
                data={pagedRecords}
                page={page}
                pageSize={pageSize}
                onAction={handleRowAction}
                onResetFilters={handleReset}
              />

              <WarningListPagination
                total={filteredRecords.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setPage(1)
                }}
                totalLabel="条被拒记录"
              />
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>
      </div>
    </PrototypeAnnotationProvider>
  )
}
