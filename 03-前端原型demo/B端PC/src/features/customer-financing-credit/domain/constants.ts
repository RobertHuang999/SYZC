import type {
  CreditFilters,
  CreditStatus,
  CustomerFinancingCredit,
  RejectCategory,
} from "./types"

export const CREDIT_STORAGE_KEY = "SYZC_CUSTOMER_FINANCING_CREDIT_RECORDS_V1"

export const PAGE_SIZE = 10

export const DEFAULT_CREDIT_FILTERS: CreditFilters = {
  keyword: "",
  status: "ALL",
  applicantType: "ALL",
  needDiligence: "ALL",
}

export const CREDIT_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "全部", value: "ALL" },
  { label: "授信已受理", value: "CREDIT_ACCEPTED" },
  { label: "申请成功", value: "APPLY_SUCCESS" },
  { label: "申请失败", value: "APPLY_FAILED" },
]

export const APPLICANT_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "全部", value: "ALL" },
  { label: "企业货主", value: "企业货主" },
  { label: "个人货主", value: "个人货主" },
]

export const NEED_DILIGENCE_OPTIONS: { label: string; value: string }[] = [
  { label: "全部", value: "ALL" },
  { label: "是", value: "YES" },
  { label: "否", value: "NO" },
]

export const REJECT_CATEGORY_OPTIONS: { label: string; value: RejectCategory }[] = [
  { label: "综合负债率过高", value: "综合负债率过高" },
  { label: "质押率不达标", value: "质押率不达标" },
  { label: "经营风险未通过", value: "经营风险未通过" },
  { label: "其他原因", value: "其他原因" },
]

export const STATUS_META: Record<
  CreditStatus,
  { label: string; className: string; borderClass: string }
> = {
  CREDIT_ACCEPTED: {
    label: "授信已受理",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    borderClass: "border-blue-200 dark:border-blue-800",
  },
  APPLY_SUCCESS: {
    label: "申请成功",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
  APPLY_FAILED: {
    label: "申请失败",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    borderClass: "border-rose-200 dark:border-rose-800",
  },
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "--"
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export const INITIAL_CREDIT_MOCK: CustomerFinancingCredit[] = [
  {
    id: "CRD_202611030001",
    sourceApplyNo: "CLUE_202611020001",
    productName: "大宗金属质押贷·电解铜专享",
    needDiligence: true,
    applicantType: "企业货主",
    applicantName: "无锡中联金属资源发展有限公司",
    applicantIdentifier: "91320200MA1W9KXX01",
    applicantLegalPerson: "周志刚",
    agentName: "陈伟明",
    agentPhone: "139****7821",
    collateralType: "存货",
    intendedAmount: 5000000.0,
    intendedPeriods: 12,
    creditAmount: null,
    creditPeriods: null,
    status: "CREDIT_ACCEPTED",
    isDownstreamTriggered: false,
    funderOrgName: "中国建设银行股份有限公司江苏省分行",
    appliedAt: "2026-11-02 09:15:30",
    processor: "--",
    processedAt: "--",
    riskScore: 88,
    riskSummary: "尽调结论合格，库区监管设备全覆盖，资产负债率52.3%，符合建行准入标准",
    inventoryDetails: [
      {
        id: "INV_01",
        category: "有色金属",
        subcategory: "阴极铜(电解铜)",
        specification: "Cu-CATH-1 (国标高纯)",
        quantity: 120.5,
        unit: "吨",
        warehouseLocation: "无锡硕放综合监管仓 A区-03库位",
        declaredValue: 7850000.0,
      },
    ],
    changeRecords: [],
    logs: [
      {
        id: "LOG_01",
        action: "单据接入",
        operator: "系统自动派单",
        organization: "森云科技供应链金融服务平台",
        time: "2026-11-02 16:40:12",
        detail: "尽调办理通过，锁定资方机构【中国建设银行】，单据状态初始化为授信已受理 (R01)",
      },
    ],
  },
  {
    id: "CRD_202611030002",
    sourceApplyNo: "CLUE_202611020002",
    productName: "铝锭数字仓单秒融通",
    needDiligence: false,
    applicantType: "企业货主",
    applicantName: "常州恒润有色科技有限公司",
    applicantIdentifier: "91320400MA23T8XX92",
    applicantLegalPerson: "孙立强",
    agentName: "高俊",
    agentPhone: "137****6618",
    collateralType: "仓单",
    intendedAmount: 3200000.0,
    intendedPeriods: 6,
    creditAmount: null,
    creditPeriods: null,
    status: "CREDIT_ACCEPTED",
    isDownstreamTriggered: false,
    funderOrgName: "华夏银行无锡分行",
    appliedAt: "2026-11-02 10:30:00",
    processor: "--",
    processedAt: "--",
    riskScore: 92,
    riskSummary: "免尽调标准仓单产品，已对接上期所交割仓库，数字仓单真实有效 (R01)",
    warehouseReceiptDetails: {
      receiptNo: "CR-2026-WX00912",
      warehouseName: "无锡硕放现代物流监管库",
      estimatedValue: 4800000.0,
      freezeStatus: "未冻结",
    },
    changeRecords: [],
    logs: [
      {
        id: "LOG_02",
        action: "免尽调直连接入",
        operator: "系统自动流转",
        organization: "森云科技供应链金融服务平台",
        time: "2026-11-02 10:31:05",
        detail: "免尽调线上秒批产品，直接接入华夏银行授信任务池 (R01)",
      },
    ],
  },
  {
    id: "CRD_202611030003",
    sourceApplyNo: "CLUE_202611010003",
    productName: "黑色系热卷保理质押款",
    needDiligence: true,
    applicantType: "企业货主",
    applicantName: "张家港博泰钢铁贸易有限公司",
    applicantIdentifier: "91320582MA1MY7XX33",
    applicantLegalPerson: "王建国",
    agentName: "刘晓敏",
    agentPhone: "136****5432",
    collateralType: "存货",
    intendedAmount: 4500000.0,
    intendedPeriods: 12,
    creditAmount: 4000000.0,
    creditPeriods: 6,
    creditRemark: "贷审会核准额度400万元，授信期限缩短为6期以管控钢材行情波动风险",
    status: "APPLY_SUCCESS",
    isDownstreamTriggered: false,
    funderOrgName: "江苏银行苏州分行营业部",
    appliedAt: "2026-11-01 14:20:00",
    processor: "李明（信贷审批专员）",
    processedAt: "2026-11-02 11:25:40",
    riskScore: 84,
    riskSummary: "尽调合格，现货质押热轧卷板300吨，货值约510万元，质押率78.4%",
    inventoryDetails: [
      {
        id: "INV_02",
        category: "黑色金属",
        subcategory: "热轧卷板",
        specification: "Q235B 5.75*1500*C",
        quantity: 300.0,
        unit: "吨",
        warehouseLocation: "张家港沙钢物流园保税库 B区-01",
        declaredValue: 5100000.0,
      },
    ],
    changeRecords: [],
    logs: [
      {
        id: "LOG_03",
        action: "核准授信",
        operator: "李明（信贷审批专员）",
        organization: "江苏银行苏州分行营业部",
        time: "2026-11-02 11:25:40",
        detail: "标记申请成功：核准授信金额 4,000,000.0000 元，授信期数 6 期，激活下游抵质押 (R04/R06)",
      },
    ],
  },
  {
    id: "CRD_202611030004",
    sourceApplyNo: "CLUE_202610280004",
    productName: "天然橡胶仓单保理融",
    needDiligence: false,
    applicantType: "企业货主",
    applicantName: "上海中化橡塑国际贸易有限公司",
    applicantIdentifier: "91310115MA1H78XX88",
    applicantLegalPerson: "郭德明",
    agentName: "赵强",
    agentPhone: "135****9901",
    collateralType: "仓单",
    intendedAmount: 8000000.0,
    intendedPeriods: 12,
    creditAmount: 7500000.0,
    creditPeriods: 12,
    creditRemark: "优质AAA级大宗客户，审批核准授信750万元，下游已发起线上抵质押确认",
    status: "APPLY_SUCCESS",
    isDownstreamTriggered: true, // 下游已提交抵质押，改标锁定 C01
    funderOrgName: "招商银行上海分行公司金融部",
    appliedAt: "2026-10-28 11:00:15",
    processor: "王敏（高级审核官）",
    processedAt: "2026-10-29 15:10:00",
    riskScore: 95,
    riskSummary: "免尽调白名单企业，青岛保税区标准橡胶仓单",
    warehouseReceiptDetails: {
      receiptNo: "CR-2026-QD00388",
      warehouseName: "青岛前湾保税港物流库",
      estimatedValue: 11200000.0,
      freezeStatus: "已质押冻结",
    },
    changeRecords: [],
    logs: [
      {
        id: "LOG_04",
        action: "核准授信",
        operator: "王敏（高级审核官）",
        organization: "招商银行上海分行公司金融部",
        time: "2026-10-29 15:10:00",
        detail: "标记申请成功：核准授信金额 7,500,000.0000 元，授信期数 12 期",
      },
      {
        id: "LOG_05",
        action: "下游发起抵质押",
        operator: "借款人经办人（赵强）",
        organization: "线上监管业务办理系统",
        time: "2026-10-30 09:12:00",
        detail: "借款企业已在下游提交线上抵质押信息确认，授信结果永久锁定禁止改标 (R03/C01)",
      },
    ],
  },
  {
    id: "CRD_202611030005",
    sourceApplyNo: "CLUE_202610250005",
    productName: "工业线材短融快线",
    needDiligence: true,
    applicantType: "个人货主",
    applicantName: "李建平（个体经营）",
    applicantIdentifier: "3202111985********",
    agentName: "李建平",
    agentPhone: "185****7112",
    collateralType: "存货",
    intendedAmount: 600000.0,
    intendedPeriods: 6,
    creditAmount: null,
    creditPeriods: null,
    status: "APPLY_FAILED",
    isDownstreamTriggered: false,
    isRescheduledInPool: false, // 尚未被重新调度，支持资方改标为成功
    funderOrgName: "无锡农村商业银行城东支行",
    appliedAt: "2026-10-25 15:45:00",
    processor: "张建（信贷审批员）",
    processedAt: "2026-10-26 14:30:10",
    rejectCategory: "综合负债率过高",
    rejectDetail: "征信审查显示借款人个人多头借贷严重，资产负债率达83.5%，超出本行小微个人准入红线 (R05)",
    riskScore: 56,
    riskSummary: "个人征信评分较低，负债率超标",
    inventoryDetails: [
      {
        id: "INV_03",
        category: "优特钢",
        subcategory: "冷镦钢盘条",
        specification: "SWRCH22A Φ6.5",
        quantity: 110.0,
        unit: "吨",
        warehouseLocation: "无锡惠山钢材市场库 C-02",
        declaredValue: 820000.0,
      },
    ],
    changeRecords: [],
    logs: [
      {
        id: "LOG_06",
        action: "标记申请失败",
        operator: "张建（信贷审批员）",
        organization: "无锡农村商业银行城东支行",
        time: "2026-10-26 14:30:10",
        detail: "审批拒绝：综合负债率过高，可靠写入被拒退回池 -> 授信失败标签页 (R05/C03)",
      },
    ],
  },
  {
    id: "CRD_202611030006",
    sourceApplyNo: "CLUE_202610200006",
    productName: "电解镍质押周转通",
    needDiligence: true,
    applicantType: "企业货主",
    applicantName: "苏州金源合金新材料有限公司",
    applicantIdentifier: "91320500MA1T54XX17",
    applicantLegalPerson: "徐金宝",
    agentName: "陈志刚",
    agentPhone: "138****1290",
    collateralType: "存货",
    intendedAmount: 6500000.0,
    intendedPeriods: 6,
    creditAmount: null,
    creditPeriods: null,
    status: "APPLY_FAILED",
    isDownstreamTriggered: false,
    isRescheduledInPool: true, // 已被被拒退回池重新调度
    funderOrgName: "平安银行苏州分行",
    appliedAt: "2026-10-20 09:00:00",
    processor: "吴主管（风控审查组）",
    processedAt: "2026-10-21 16:20:00",
    rejectCategory: "质押率不达标",
    rejectDetail: "评估存货跌价波动较大，企业无法补足追加保证金，测算综合质押率低于资方60%门槛要求",
    riskScore: 68,
    riskSummary: "有色金属镍行情波动剧烈，质押率不满足资方策略",
    inventoryDetails: [
      {
        id: "INV_04",
        category: "有色金属",
        subcategory: "电解镍(板状)",
        specification: "Ni9996",
        quantity: 45.0,
        unit: "吨",
        warehouseLocation: "苏州工业园区综合保税仓 D-05",
        declaredValue: 6900000.0,
      },
    ],
    changeRecords: [],
    logs: [
      {
        id: "LOG_07",
        action: "标记申请失败",
        operator: "吴主管（风控审查组）",
        organization: "平安银行苏州分行",
        time: "2026-10-21 16:20:00",
        detail: "审批拒绝：质押率不达标，单据移入被拒退回池",
      },
      {
        id: "LOG_08",
        action: "被拒池重新调度",
        operator: "系统风控路由器",
        organization: "森云科技供应链金融服务平台",
        time: "2026-10-23 10:15:00",
        detail: "运营人员已在被拒退回池中将该单据重新调度指派至其他合作资方，改标通道已锁定",
      },
    ],
  },
]

export function creditDetailPath(id: string): string {
  return `/融资/监管/融资管理/客户融资授信办理/详情/${encodeURIComponent(id)}`
}

