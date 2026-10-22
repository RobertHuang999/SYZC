import type { DocumentItem, TimelineStep } from "./types"

/** 原型阶段用于图片类资料预览的示例图（与出库记录演示图同源） */
const DOC_IMAGE_SAMPLE_A =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60"
const DOC_IMAGE_SAMPLE_B =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60"

/**
 * 演示用资料库：与 PC 端 shared/document-management/mock.ts 保持同一批业务数据，
 * 便于双端对照。H5 是独立部署工程，因此这里保留一份本地副本。
 */
export const initialDocumentsMock: DocumentItem[] = [
  {
    id: "doc-in-01",
    orderNo: "2059897000077811713",
    approvalId: "SP202605280001",
    orderType: "inbound",
    flowType: "1",
    flowNodeTitle: "入库申请初审",
    nature: "BASE",
    category: "ONSITE",
    name: "现场随车送货单_原件照片.jpg",
    version: "V1.0",
    fileType: "jpg",
    fileSize: "1.82 MB",
    createTime: "2026-05-28 15:18:12",
    uploader: "lxy",
    uploaderOrg: "四川享宇科技有限公司",
    hash: "d41d8cd98f00b204e9800998ecf8427e",
    description: "随车初步送货清单及承运车牌实物照片",
    statusText: "已通过",
    previewImages: [DOC_IMAGE_SAMPLE_A, DOC_IMAGE_SAMPLE_B],
  },
  {
    id: "doc-in-02",
    orderNo: "2059897000077811713",
    approvalId: "SP202605280001",
    orderType: "inbound",
    flowType: "2",
    flowNodeTitle: "库管审核与过磅核验",
    nature: "BASE",
    category: "WEIGHT",
    name: "20260528_现场地磅过磅单.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "1.65 MB",
    createTime: "2026-05-28 15:19:40",
    uploader: "黄主管",
    uploaderOrg: "海霸王仓库-冷藏部",
    hash: "3b712b3e1c4834468f764a856627063d",
    description: "现场初审地磅过磅单据与实车数据核验记录",
    statusText: "已归档",
  },
  {
    id: "doc-in-03",
    orderNo: "2059897000077811713",
    approvalId: "SP202605280001",
    orderType: "inbound",
    flowType: "2",
    flowNodeTitle: "过磅核验",
    nature: "ADDITION",
    category: "WEIGHT",
    name: "20260601_海霸王地磅更正情况说明函_盖章件.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "2.15 MB",
    createTime: "2026-06-01 10:20:15",
    uploader: "张三",
    uploaderOrg: "海霸王地磅计量中心",
    hash: "e2fc714c4727ee9395f87b8b2d184729",
    description: "现场初审录入时随车地磅单车牌少录一位，现补充地磅站重开并加盖公章的情况说明函件作为补充凭证存证。",
    statusText: "有效补充",
  },
  {
    id: "doc-in-04",
    orderNo: "2059897000077811713",
    approvalId: "SP202605280001",
    orderType: "inbound",
    flowType: "3",
    flowNodeTitle: "入库终审",
    nature: "ADDITION",
    category: "INSPECTION",
    name: "SGS第三方铜锭化验分析单_盖章扫描件.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "3.40 MB",
    createTime: "2026-06-03 14:15:22",
    uploader: "李四",
    uploaderOrg: "SGS第三方检测技术服务部",
    hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    description: "供应商化验检测周期为作业后3个工作日，现收到正式纸质检测单扫描件，特予后置补录归档至终审质检阶段。",
    statusText: "有效补充",
  },
  {
    id: "doc-in-05",
    orderNo: "2059897000077811713",
    approvalId: "SP202605280001",
    orderType: "inbound",
    flowType: "9527",
    flowNodeTitle: "补充资料",
    nature: "ADDITION",
    category: "SETTLEMENT",
    name: "20260605_海霸王冷库仓储费结算单及电子发票.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "1.18 MB",
    createTime: "2026-06-05 16:30:00",
    uploader: "财务王会计",
    uploaderOrg: "海霸王财务结算中心",
    hash: "c7d8e9f0a1b2c3d4e5f60718293a4b5c",
    description: "本批次冻牛肉冷藏仓储费结算凭证及全额发票盖章件。",
    statusText: "有效补充",
  },
  {
    id: "doc-in-10",
    orderNo: "2059897000077811714",
    approvalId: "SP202605280002",
    orderType: "inbound",
    flowType: "1",
    flowNodeTitle: "入库申请",
    nature: "BASE",
    category: "ONSITE",
    name: "电解铜进场随车交接单.jpg",
    version: "V1.0",
    fileType: "jpg",
    fileSize: "2.10 MB",
    createTime: "2026-05-28 16:30:10",
    uploader: "王经理",
    uploaderOrg: "江苏大宗有色贸易有限公司",
    hash: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
    description: "大宗金属电解铜进场单据及随车检验报告",
    statusText: "已通过",
    previewImages: [DOC_IMAGE_SAMPLE_B],
  },
  {
    id: "doc-out-01",
    orderNo: "2059897000077811715",
    approvalId: "SP202605290001",
    orderType: "outbound",
    flowType: "1",
    flowNodeTitle: "出库申请",
    nature: "BASE",
    category: "OWNERSHIP",
    name: "货权提货交接委托函_盖章原件.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "1.45 MB",
    createTime: "2026-05-29 09:30:00",
    uploader: "赵调度",
    uploaderOrg: "中储发展物流中心",
    hash: "c4ca4238a0b923820dcc509a6f75849b",
    description: "货主法定代表人签章提货委托书",
    statusText: "已通过",
  },
  {
    id: "doc-out-02",
    orderNo: "2059897000077811715",
    approvalId: "SP202605290001",
    orderType: "outbound",
    flowType: "2",
    flowNodeTitle: "出场核验",
    nature: "BASE",
    category: "WEIGHT",
    name: "出库地磅复磅单.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "1.92 MB",
    createTime: "2026-05-29 11:15:20",
    uploader: "钱过磅",
    uploaderOrg: "海霸王仓库-地磅组",
    hash: "c81e728d9d4c2f636f067f89cc14862c",
    description: "车辆净重与货物出场核销磅单",
    statusText: "已通过",
  },
  {
    id: "doc-out-02b",
    orderNo: "2059897000077811715",
    approvalId: "SP202605290001",
    orderType: "outbound",
    flowType: "2",
    flowNodeTitle: "出场核验",
    nature: "ADDITION",
    category: "WEIGHT",
    name: "20260530_海霸王地磅二次复核盖章单.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "1.74 MB",
    createTime: "2026-05-30 14:20:00",
    uploader: "钱过磅",
    uploaderOrg: "海霸王仓库-地磅组",
    hash: "a8b9c0d1e2f3a4b5c6d7e8f901234567",
    description: "事后针对出库提货车辆二次复核称重并补盖地磅中心印章。",
    statusText: "有效补充",
  },
  {
    id: "doc-out-02c",
    orderNo: "2059897000077811715",
    approvalId: "SP202605290001",
    orderType: "outbound",
    flowType: "3",
    flowNodeTitle: "出库终审",
    nature: "ADDITION",
    category: "INSPECTION",
    name: "20260531_提货品质与数量交接确认回执.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "2.35 MB",
    createTime: "2026-05-31 16:10:00",
    uploader: "李质检",
    uploaderOrg: "中储品质检验室",
    hash: "b9c0d1e2f3a4b5c6d7e8f9012345678a",
    description: "承运方提货验收合格签字盖章交接回执，补录至终审放行环节归档。",
    statusText: "有效补充",
  },
  {
    id: "doc-out-03",
    orderNo: "2059897000077811715",
    approvalId: "SP202605290001",
    orderType: "outbound",
    flowType: "9527",
    flowNodeTitle: "补充资料",
    nature: "ADDITION",
    category: "SETTLEMENT",
    name: "仓储费与理货杂费结算发票.pdf",
    version: "V1.0",
    fileType: "pdf",
    fileSize: "850 KB",
    createTime: "2026-06-02 16:40:00",
    uploader: "孙财务",
    uploaderOrg: "四川享宇科技有限公司-财务部",
    hash: "eccbc87e4b5ce2fe28308fd9f2a7baf3",
    description: "出库后财务对账完毕开具的增值税专用发票电子件后置归档。",
    statusText: "有效补充",
  },
]

// 内存单例：刷新页面即重置，原型阶段够用
let documentsState: DocumentItem[] = [...initialDocumentsMock]

// 演示模板：取种子单号的整套资料，克隆给 H5 里其它单号使用
const DOCUMENT_TEMPLATES: Record<"inbound" | "outbound", DocumentItem[]> = {
  inbound: initialDocumentsMock.filter((d) => d.orderNo === "2059897000077811713"),
  outbound: initialDocumentsMock.filter((d) => d.orderNo === "2059897000077811715"),
}

/**
 * 按单号取资料。
 *
 * H5 详情页的单号与演示数据里的单号大多对不上，所以首次访问某个单号时，
 * 把同类型的模板资料「克隆」一份挂到该单号下并写入内存。
 * 这样既保证任意单据点进去都有演示内容，又不会在后续上传新资料后
 * 因为精确匹配命中而把模板资料弄丢（PC 端旧兜底写法存在这个隐患）。
 */
export function getDocumentsByOrderNo(
  orderNo: string,
  orderType: "inbound" | "outbound" = "inbound"
): DocumentItem[] {
  const matched = documentsState.filter((d) => d.orderNo === orderNo)
  if (matched.length > 0) return matched

  const cloned = DOCUMENT_TEMPLATES[orderType].map((doc, index) => ({
    ...doc,
    id: `${doc.id}-${orderNo}-${index + 1}`,
    orderNo,
    previewImages: doc.previewImages ? [...doc.previewImages] : undefined,
  }))
  documentsState = [...cloned, ...documentsState]
  return cloned
}

function nowLocalText(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function addDocumentItem(
  doc: Omit<DocumentItem, "id" | "createTime" | "hash">
): DocumentItem {
  const newDoc: DocumentItem = {
    ...doc,
    id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createTime: nowLocalText(),
    hash: Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
  }
  documentsState = [newDoc, ...documentsState]
  return newDoc
}

export function buildTimelineSteps(
  orderNo: string,
  orderType: "inbound" | "outbound" = "inbound"
): TimelineStep[] {
  const docs = getDocumentsByOrderNo(orderNo, orderType)

  if (orderType === "inbound") {
    return [
      {
        stepIndex: 1,
        title: "入库申请",
        flowType: "1",
        statusText: "已通过",
        statusType: "success",
        time: "2026-05-28 15:18:12~2026-05-28 15:19:40",
        operator: "lxy",
        org: "四川享宇科技有限公司",
        documents: docs.filter((d) => d.flowType === "1"),
      },
      {
        stepIndex: 2,
        title: "过磅核验",
        flowType: "2",
        statusText: "已通过",
        statusType: "success",
        time: "2026-05-28 15:20:05~2026-05-28 15:20:06",
        operator: "黄主管",
        org: "海霸王仓库-冷藏部",
        documents: docs.filter((d) => d.flowType === "2"),
      },
      {
        stepIndex: 3,
        title: "入库终审",
        flowType: "3",
        statusText: "已通过",
        statusType: "success",
        time: "2026-05-28 15:20:06~2026-05-28 15:20:06",
        operator: "系统自动",
        org: "SYZC 自动化规则引擎",
        documents: docs.filter((d) => d.flowType === "3"),
      },
      {
        stepIndex: 4,
        title: "补充资料",
        flowType: "9527",
        statusText: "",
        statusType: "info",
        time: "2026-06-03 14:15:22",
        operator: "业务后置补录",
        org: "多主体协同归档",
        documents: docs.filter((d) => d.flowType === "9527"),
      },
    ]
  }

  return [
    {
      stepIndex: 1,
      title: "出库申请",
      flowType: "1",
      statusText: "已通过",
      statusType: "success",
      time: "2026-05-29 09:30:00~2026-05-29 09:32:15",
      operator: "赵调度",
      org: "中储发展物流中心",
      documents: docs.filter((d) => d.flowType === "1"),
    },
    {
      stepIndex: 2,
      title: "出场核验",
      flowType: "2",
      statusText: "已通过",
      statusType: "success",
      time: "2026-05-29 11:15:20~2026-05-29 11:20:00",
      operator: "钱过磅",
      org: "海霸王仓库-地磅组",
      documents: docs.filter((d) => d.flowType === "2"),
    },
    {
      stepIndex: 3,
      title: "出库终审",
      flowType: "3",
      statusText: "已通过",
      statusType: "success",
      time: "2026-05-29 11:30:00~2026-05-29 11:30:00",
      operator: "系统自动",
      org: "SYZC 自动化规则引擎",
      documents: docs.filter((d) => d.flowType === "3"),
    },
    {
      stepIndex: 4,
      title: "补充资料",
      flowType: "9527",
      statusText: "",
      statusType: "info",
      time: "2026-06-02 16:40:00",
      operator: "业务后置补录",
      org: "财务与质检协同归档",
      documents: docs.filter((d) => d.flowType === "9527"),
    },
  ]
}
