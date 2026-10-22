import type { AssociatedDocItem } from "../domain/types"

/** PA-R02 原型演示：货主名下在库/在押 — 列表/详情点【冻结】应弹出阻断弹窗（赵磊 PA-202609001） */
export const MOCK_OWNER_FREEZE_BLOCKING_DOCS: AssociatedDocItem[] = [
  {
    id: "doc-rk-p01-1",
    docType: "INBOUND",
    docTypeName: "入库记录",
    docNo: "RK-20260915-018",
    roleName: "货主",
    bizDate: "2026-09-15",
    statusName: "已完成",
    handlerName: "王调度",
    remark: "电解铜 50 吨 · 在库可用库存（无锡阳山监管仓 A-01）",
  },
  {
    id: "doc-wd-p01-1",
    docType: "WARRANT",
    docTypeName: "电子仓单",
    docNo: "WD-20260820-006",
    roleName: "存货人",
    bizDate: "2026-08-20",
    statusName: "有效在押",
    handlerName: "系统",
    remark: "热轧卷板 120 吨 · 质押锁定中",
  },
]

/** PA-R02 演示：提货人待提货出库单（李华 PA-202609005） */
export const MOCK_PICKUP_FREEZE_BLOCKING_DOCS: AssociatedDocItem[] = [
  {
    id: "doc-ck-p05-1",
    docType: "OUTBOUND",
    docTypeName: "出库记录",
    docNo: "CK-20260922-033",
    roleName: "提货经办人",
    bizDate: "2026-09-22",
    statusName: "待提货",
    handlerName: "李值班员",
    remark: "电解铜 20 吨 · 待现场核验提货",
  },
]

/** PA-R02 演示：服务方进行中监管单（中储发展 PA-202609010 · p-10） */
export const MOCK_SERVICE_FREEZE_BLOCKING_DOCS: AssociatedDocItem[] = [
  {
    id: "doc-jg-p10-1",
    docType: "WARRANT",
    docTypeName: "监管服务单",
    docNo: "JG-20260918-007",
    roleName: "监管方",
    bizDate: "2026-09-18",
    statusName: "生效中",
    handlerName: "郑主管",
    remark: "无锡阳山电解铜监管服务 · 协议存续",
  },
]

/** PA-R02 演示：资金方进行中抵质押（建行无锡分行 PA-202609008） */
export const MOCK_FUNDER_FREEZE_BLOCKING_DOCS: AssociatedDocItem[] = [
  {
    id: "doc-dy-p08-1",
    docType: "WARRANT",
    docTypeName: "抵质押单",
    docNo: "DY-20260710-002",
    roleName: "资金方",
    bizDate: "2026-07-10",
    statusName: "生效中",
    handlerName: "孙经理",
    remark: "铝锭质押融资 · 存续在押",
  },
]
