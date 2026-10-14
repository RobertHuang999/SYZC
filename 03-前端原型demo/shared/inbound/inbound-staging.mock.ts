import { formatInboundGoodsSummary } from "./inbound-list-format"

export type StagingRegStatus = "待补全" | "已转正式" | "已作废"

export type StagingInboundType =
  | "普通入库"
  | "质押入库"
  | "抵押入库"
  | "监管服务入库"
  | "仓单入库"

export interface InboundStagingReg {
  id: string
  regNo: string
  inboundDate: string
  warehouseName: string
  inboundType: StagingInboundType
  ownerDisplay: string
  ownerTag?: "档案货主" | "临时待核"
  goodsSummary: string
  /** 多货品 Mock / 保存快照；列表摘要见 goodsSummary（首项 + 等 N 种） */
  goodsNames?: string[]
  declaredQty: number
  unit: string
  status: StagingRegStatus
  relatedFormalNo: string | null
  version: number
  registrant: string
  registeredAt: string
  relatedOrderNo?: string
  remark?: string
  locationHint?: string
  voidReason?: string
  storeroomName?: string
}

/**
 * 登记单 Mock 场景索引（评审 / 自测对照《业务流程推演》第六节）
 *
 * | id | 登记单号 | 要点 |
 * | reg-1 | …00001 | 待补全·质押·手填关联单（剧本 G-C）·临时货主 |
 * | reg-2 | …00002 | 已转正式·P10 驳回 Demo（联动 apply-staging-p10） |
 * | reg-3 | …00003 | 待补全·抵押·系统有效关联单（剧本 G-B） |
 * | reg-4 | …00004 | 待补全·监管服务·关联单留空（剧本 G-A） |
 * | reg-5 | …00005 | 待补全·普通·多货品（电解铜+铝锭）·混选库房 |
 * | reg-6 | …00006 | 已转正式·质押·无待审申请（稳定已转正式） |
 * | reg-p10 | …00007 | 待补全·P10 已回退样例（备注含驳回原因） |
 * | reg-cd | …00008 | 待补全·仓单·PC 转正须 H5（剧本 C） |
 * | reg-9 | …00009 | 待补全·热轧+冷轧多货品·部分已分垛 |
 * | reg-10 | …00010 | 已作废·退货不入库 |
 * | reg-11 | …00011 | 已作废·重复登记误操作 |
 * | reg-12 | …00012 | 待补全·海霸王（H5 筛仓）·天然橡胶 |
 * | reg-13 | …00013 | 待补全·生鲜仓·个人档案货主 |
 * | reg-14 | …00014 | 待补全·电解铜·仅申报无货主说明 |
 * | reg-15 | …00015 | 待补全·冷链仓单类货品·多备注 |
 */
export const inboundStagingRegsMock: InboundStagingReg[] = [
  {
    id: "reg-1",
    regNo: "REG-20261014-00001",
    inboundDate: "2026-10-14 14:20:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "质押入库",
    ownerDisplay: "司机王师傅/豫A88888",
    ownerTag: "临时待核",
    goodsSummary: "有色-电解铜-高纯",
    declaredQty: 50.25,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 2,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-14 14:20:00",
    relatedOrderNo: "司机纸质单据-0988",
    locationHint: "待理货定垛",
    remark: "月台卸货，待核对质押单",
  },
  {
    id: "reg-2",
    regNo: "REG-20261014-00002",
    inboundDate: "2026-10-14 15:10:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "普通入库",
    ownerDisplay: "河南豫光金铅股份有限公司",
    ownerTag: "档案货主",
    goodsSummary: "有色-铅锭-国标1号",
    declaredQty: 120,
    unit: "吨",
    status: "已转正式",
    relatedFormalNo: "2026101415101200008",
    version: 3,
    registrant: "李四(地磅员)",
    registeredAt: "2026-10-14 15:10:00",
    storeroomName: "1号常温标准库房",
    locationHint: "已分配库位",
  },
  {
    id: "reg-3",
    regNo: "REG-20261014-00003",
    inboundDate: "2026-10-14 11:05:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "抵押入库",
    ownerDisplay: "原原李",
    ownerTag: "档案货主",
    goodsNames: ["有色-铝锭-A00", "有色-电解铜-高纯", "有色-铅锭-国标1号"],
    goodsSummary: formatInboundGoodsSummary([
      "有色-铝锭-A00",
      "有色-电解铜-高纯",
      "有色-铅锭-国标1号",
    ]),
    declaredQty: 300,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "王五(监管员)",
    registeredAt: "2026-10-14 11:05:00",
    relatedOrderNo: "DY20260818-0056",
    locationHint: "待理货定垛",
  },
  {
    id: "reg-4",
    regNo: "REG-20261014-00004",
    inboundDate: "2026-10-14 09:40:00",
    warehouseName: "龙泉驿综合工业备件2号仓",
    inboundType: "监管服务入库",
    ownerDisplay: "张一",
    ownerTag: "档案货主",
    goodsSummary: "黑色金属-高线-HPB300",
    declaredQty: 600,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-14 09:40:00",
    remark: "关联监管单现场未带，暂存后补",
    locationHint: "待理货定垛",
  },
  {
    id: "reg-5",
    regNo: "REG-20261014-00005",
    inboundDate: "2026-10-14 08:15:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "普通入库",
    ownerDisplay: "四川华西大宗商品供应链管理有限公司",
    ownerTag: "档案货主",
    goodsNames: ["有色-电解铜-标准阴极铜", "有色-铝锭-A00"],
    goodsSummary: formatInboundGoodsSummary([
      "有色-电解铜-标准阴极铜",
      "有色-铝锭-A00",
    ]),
    declaredQty: 86,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 2,
    registrant: "李四(地磅员)",
    registeredAt: "2026-10-14 08:15:00",
    storeroomName: "1号常温标准库房、3号露天堆场",
    locationHint: "已分配库位",
    remark: "主表库房混选演示（暂存不 R06）",
  },
  {
    id: "reg-6",
    regNo: "REG-20261014-00006",
    inboundDate: "2026-10-14 07:50:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "质押入库",
    ownerDisplay: "四川华西大宗商品供应链管理有限公司",
    ownerTag: "档案货主",
    goodsNames: ["有色-电解铜-标准阴极铜", "黑色金属-热轧卷板-Q235B"],
    goodsSummary: formatInboundGoodsSummary([
      "有色-电解铜-标准阴极铜",
      "黑色金属-热轧卷板-Q235B",
    ]),
    declaredQty: 500,
    unit: "吨",
    status: "已转正式",
    relatedFormalNo: "2026101015300000123",
    version: 4,
    registrant: "仓库主管-赵六",
    registeredAt: "2026-10-14 07:50:00",
    relatedOrderNo: "ZY20260901-0012",
    storeroomName: "2号高位重型库房",
    locationHint: "已分配库位",
  },
  {
    id: "reg-p10",
    regNo: "REG-20261014-00007",
    inboundDate: "2026-10-13 16:30:00",
    warehouseName: "天府现代农产品冷链物流仓",
    inboundType: "抵押入库",
    ownerDisplay: "阜阳市大象粮油产运有限公司",
    ownerTag: "档案货主",
    goodsSummary: "农产品-玉米-国标二等",
    declaredQty: 2500,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 5,
    registrant: "李四(地磅员)",
    registeredAt: "2026-10-13 16:30:00",
    relatedOrderNo: "DY20260822-0091",
    remark: "正式单 2026101314300000999 已驳回，暂存回退待补全（P10 Mock）",
    locationHint: "待理货定垛",
  },
  {
    id: "reg-cd",
    regNo: "REG-20261012-00008",
    inboundDate: "2026-10-12 16:45:00",
    warehouseName: "天府现代农产品冷链物流仓",
    inboundType: "仓单入库",
    ownerDisplay: "二哥",
    ownerTag: "档案货主",
    goodsSummary: "冻品-冷冻牛肉-36个月",
    declaredQty: 30,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-12 16:45:00",
    relatedOrderNo: "CD-20261012-001",
    locationHint: "待理货定垛",
    storeroomName: "冷链1号深冷库",
  },
  {
    id: "reg-9",
    regNo: "REG-20261012-00009",
    inboundDate: "2026-10-12 10:20:00",
    warehouseName: "龙泉驿综合工业备件2号仓",
    inboundType: "普通入库",
    ownerDisplay: "张一",
    ownerTag: "档案货主",
    goodsNames: ["黑色金属-热轧卷板-Q235B", "黑色金属-冷轧卷板-SPCC"],
    goodsSummary: formatInboundGoodsSummary([
      "黑色金属-热轧卷板-Q235B",
      "黑色金属-冷轧卷板-SPCC",
    ]),
    declaredQty: 1200,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 2,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-12 10:20:00",
    storeroomName: "B区通用工业库",
    locationHint: "已分配库位",
    remark: "部分垛位已填，转正须 R13 清零复核",
  },
  {
    id: "reg-10",
    regNo: "REG-20261011-00010",
    inboundDate: "2026-10-11 15:00:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "质押入库",
    ownerDisplay: "司机李师傅/川A12345",
    ownerTag: "临时待核",
    goodsSummary: "化工-聚乙烯-LLDPE",
    declaredQty: 80,
    unit: "吨",
    status: "已作废",
    relatedFormalNo: null,
    version: 2,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-11 15:00:00",
    voidReason: "货主通知整车退货，未卸入监管区（剧本 F）",
    relatedOrderNo: "ZY20260905-0045",
  },
  {
    id: "reg-11",
    regNo: "REG-20261011-00011",
    inboundDate: "2026-10-11 09:10:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "普通入库",
    ownerDisplay: "重复录入误操作",
    ownerTag: "临时待核",
    goodsSummary: "有色-电解铜-高纯",
    declaredQty: 50.25,
    unit: "吨",
    status: "已作废",
    relatedFormalNo: null,
    version: 1,
    registrant: "李四(地磅员)",
    registeredAt: "2026-10-11 09:10:00",
    voidReason: "与 REG-20261014-00001 重复登记，作废留痕",
  },
  {
    id: "reg-12",
    regNo: "REG-20261010-00012",
    inboundDate: "2026-10-10 14:00:00",
    warehouseName: "海霸王仓库",
    inboundType: "普通入库",
    ownerDisplay: "李爱",
    ownerTag: "档案货主",
    goodsNames: ["橡胶-天然橡胶-20号标胶", "化工-聚乙烯-LLDPE"],
    goodsSummary: formatInboundGoodsSummary([
      "橡胶-天然橡胶-20号标胶",
      "化工-聚乙烯-LLDPE",
    ]),
    declaredQty: 430,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-10 14:00:00",
    locationHint: "待理货定垛",
    remark: "H5 列表「海霸王仓库」筛选项对照",
  },
  {
    id: "reg-13",
    regNo: "REG-20261010-00013",
    inboundDate: "2026-10-10 08:30:00",
    warehouseName: "生鲜仓库",
    inboundType: "普通入库",
    ownerDisplay: "原原李",
    ownerTag: "档案货主",
    goodsSummary: "水果-苹果-新疆红富士",
    declaredQty: 22.5,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "王五(监管员)",
    registeredAt: "2026-10-10 08:30:00",
    storeroomName: "水果库房审核",
    locationHint: "已分配库位",
  },
  {
    id: "reg-14",
    regNo: "REG-20261009-00014",
    inboundDate: "2026-10-09 17:45:00",
    warehouseName: "青白江大宗商品监管1号仓",
    inboundType: "普通入库",
    ownerDisplay: "未填写货主/送货说明",
    goodsSummary: "有色-电解铜-高纯",
    declaredQty: 12,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "张三(理货员)",
    registeredAt: "2026-10-09 17:45:00",
    locationHint: "待理货定垛",
    remark: "P02 允许货主留空时的列表展示",
  },
  {
    id: "reg-15",
    regNo: "REG-20261009-00015",
    inboundDate: "2026-10-09 06:20:00",
    warehouseName: "天府现代农产品冷链物流仓",
    inboundType: "监管服务入库",
    ownerDisplay: "四川享宇科技有限公司",
    ownerTag: "档案货主",
    goodsNames: ["冻货-鸡翅-四川-特级", "冻货-鸡腿-四川"],
    goodsSummary: formatInboundGoodsSummary(["冻货-鸡翅-四川-特级", "冻货-鸡腿-四川"]),
    declaredQty: 28.6,
    unit: "吨",
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant: "李四(地磅员)",
    registeredAt: "2026-10-09 06:20:00",
    relatedOrderNo: "JG20260908-0033",
    remark: "早班冷链到货，监管单已系统关联",
    locationHint: "待理货定垛",
  },
]

export function getStagingRegByNo(regNo: string): InboundStagingReg | undefined {
  return inboundStagingRegsMock.find((r) => r.regNo === regNo)
}

export function getStagingRegById(id: string): InboundStagingReg | undefined {
  return inboundStagingRegsMock.find((r) => r.id === id)
}

export function markStagingConverted(regNo: string, formalNo: string) {
  const row = inboundStagingRegsMock.find((r) => r.regNo === regNo)
  if (!row || row.status !== "待补全") return false
  row.status = "已转正式"
  row.relatedFormalNo = formalNo
  row.version += 1
  notifyStagingRegUpdated()
  return true
}

/** P10：正式单驳回/撤回后回退待补全 */
export function rollbackStagingReg(regNo: string, reason: string) {
  const row = inboundStagingRegsMock.find((r) => r.regNo === regNo)
  if (!row) return false
  row.status = "待补全"
  row.relatedFormalNo = null
  row.version += 1
  row.remark = reason
  notifyStagingRegUpdated()
  return true
}

export function voidStagingReg(regNo: string, reason: string) {
  const row = inboundStagingRegsMock.find((r) => r.regNo === regNo)
  if (!row || row.status !== "待补全") return false
  row.status = "已作废"
  row.voidReason = reason
  row.version += 1
  notifyStagingRegUpdated()
  return true
}

function notifyStagingRegUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("staging-reg-updated"))
  }
}

export function nextStagingRegNo(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const d = String(today.getDate()).padStart(2, "0")
  const prefix = `REG-${y}${m}${d}-`
  const sameDay = inboundStagingRegsMock.filter((r) => r.regNo.startsWith(prefix))
  const seq = String(sameDay.length + 1).padStart(5, "0")
  return `${prefix}${seq}`
}

export type SaveStagingRegInput = {
  id?: string
  inboundDate: string
  warehouseName: string
  inboundType: StagingInboundType
  ownerDisplay: string
  ownerTag?: InboundStagingReg["ownerTag"]
  goodsSummary: string
  goodsNames?: string[]
  declaredQty: number
  unit: string
  relatedOrderNo?: string
  remark?: string
  locationHint?: string
  storeroomName?: string
  registrant?: string
}

export function saveStagingReg(input: SaveStagingRegInput): InboundStagingReg {
  const now = input.inboundDate || new Date().toISOString().slice(0, 19).replace("T", " ")
  const registrant = input.registrant ?? "张三(理货员)"

  if (input.id) {
    const existing = inboundStagingRegsMock.find((r) => r.id === input.id)
    if (existing && existing.status === "待补全") {
      Object.assign(existing, {
        inboundDate: now,
        warehouseName: input.warehouseName,
        inboundType: input.inboundType,
        ownerDisplay: input.ownerDisplay,
        ownerTag: input.ownerTag,
        goodsSummary: input.goodsSummary,
        goodsNames: input.goodsNames?.length ? [...input.goodsNames] : undefined,
        declaredQty: input.declaredQty,
        unit: input.unit,
        relatedOrderNo: input.relatedOrderNo,
        remark: input.remark,
        locationHint: input.locationHint,
        storeroomName: input.storeroomName,
        version: existing.version + 1,
      })
      notifyStagingRegUpdated()
      return existing
    }
  }

  const row: InboundStagingReg = {
    id: `reg-${Date.now()}`,
    regNo: nextStagingRegNo(),
    inboundDate: now,
    warehouseName: input.warehouseName,
    inboundType: input.inboundType,
    ownerDisplay: input.ownerDisplay,
    ownerTag: input.ownerTag,
    goodsSummary: input.goodsSummary,
    goodsNames: input.goodsNames?.length ? [...input.goodsNames] : undefined,
    declaredQty: input.declaredQty,
    unit: input.unit,
    status: "待补全",
    relatedFormalNo: null,
    version: 1,
    registrant,
    registeredAt: now,
    relatedOrderNo: input.relatedOrderNo,
    remark: input.remark,
    locationHint: input.locationHint ?? "待理货定垛",
    storeroomName: input.storeroomName,
  }
  inboundStagingRegsMock.unshift(row)
  notifyStagingRegUpdated()
  return row
}

export function regToMinimalFormPrefill(reg: InboundStagingReg) {
  return {
    inboundDate: reg.inboundDate,
    inboundType: reg.inboundType,
    relatedOrderNo: reg.relatedOrderNo ?? "",
    ownerDisplay: reg.ownerDisplay,
    remark: reg.remark ?? "",
    warehouseName: reg.warehouseName,
  }
}
