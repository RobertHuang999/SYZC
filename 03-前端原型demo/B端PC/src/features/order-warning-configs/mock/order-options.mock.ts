import type { OrderGoodsBatch, OrderType } from "../domain/types"

/**
 * 对齐抵质押业务管理 [DZY-R08a]：
 * - 未录入贷款结果（贷款余额缺失）或货值评估未完成 → currentLtv 为 null，列表/配置页展示 `—`
 * - 监管服务订单同样支持监管业务率 (LTV) 计算；未录入放款或货值未完成时 currentLtv 为 null
 */
export type MockOrderOption = {
  orderNo: string
  orderType: OrderType
  customer: string
  ownerName: string
  ownerPhone: string
  goodsDetail: string
  /** 实时 LTV（%）；null 表示抵质押单据侧尚无法计算，配置页只读区展示 `—` */
  currentLtv: string | null
  goodsBatches: OrderGoodsBatch[]
}

export const MOCK_ORDERS: MockOrderOption[] = [
  {
    orderNo: "PO202608-01",
    orderType: "质押",
    customer: "江苏某大宗商贸",
    ownerName: "张三",
    ownerPhone: "138****8000",
    goodsDetail: "电解铜 / 1# / 500吨",
    currentLtv: "88.50",
    goodsBatches: [
      {
        batchId: "batch-cu-500-demo",
        qrCode: "QR-CU-20260801-001",
        goodsLabel: "电解铜 / 1# / 500吨",
        pledgedAt: "2026-08-01 08:00",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-1002",
    orderType: "抵押",
    customer: "江苏某大宗商贸",
    ownerName: "张三",
    ownerPhone: "138****8000",
    goodsDetail: "电解铜 / 1# / 500吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-cu-500",
        qrCode: "QR-CU-20260801-001",
        goodsLabel: "电解铜 / 1# / 500吨",
        pledgedAt: "2026-08-01 08:00",
        defaultWarningType: "解抵押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-1003",
    orderType: "质押",
    customer: "华东金属贸易",
    ownerName: "孙九",
    ownerPhone: "137****6622",
    goodsDetail: "电解铜 / 1# / 300吨；电解铝 / A00 / 200吨",
    currentLtv: "52.15",
    goodsBatches: [
      {
        batchId: "batch-cu-300",
        qrCode: "QR-CU-20260805-101",
        goodsLabel: "电解铜 / 1# / 300吨",
        pledgedAt: "2026-08-05 09:30",
        defaultWarningType: "解质押超时",
      },
      {
        batchId: "batch-al-200",
        qrCode: "QR-AL-20260805-102",
        goodsLabel: "电解铝 / A00 / 200吨",
        pledgedAt: "2026-08-05 10:15",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-15",
    orderType: "抵押",
    customer: "浙江物产中大金属集团",
    ownerName: "王主管",
    ownerPhone: "136****7788",
    goodsDetail: "热轧卷板 / HRB400 / 1200吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-hrb-1200",
        qrCode: "QR-HRB-20260815-001",
        goodsLabel: "热轧卷板 / HRB400 / 1200吨",
        pledgedAt: "2026-08-15 10:00",
        defaultWarningType: "解抵押超时",
      },
    ],
  },
  {
    orderNo: "PO202607-12",
    orderType: "质押",
    customer: "华南铝业",
    ownerName: "王五",
    ownerPhone: "135****9900",
    goodsDetail: "电解铝 / A00 / 400吨",
    currentLtv: "61.20",
    goodsBatches: [
      {
        batchId: "batch-al-400",
        qrCode: "QR-AL-20260712-001",
        goodsLabel: "电解铝 / A00 / 400吨",
        pledgedAt: "2026-07-12 09:00",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202606-05",
    orderType: "抵押",
    customer: "某铝业集团",
    ownerName: "赵六",
    ownerPhone: "139****1234",
    goodsDetail: "铝锭 / A00 / 200吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-al-200",
        qrCode: "QR-AL-20260605-001",
        goodsLabel: "铝锭 / A00 / 200吨",
        pledgedAt: "2026-06-05 14:00",
        defaultWarningType: "解抵押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-33",
    orderType: "质押",
    customer: "某化工贸易",
    ownerName: "周八",
    ownerPhone: "133****5566",
    goodsDetail: "甲醇 / 优等品 / 800吨",
    currentLtv: "72.80",
    goodsBatches: [
      {
        batchId: "batch-meoh-800",
        qrCode: "QR-MEOH-20260816-001",
        goodsLabel: "甲醇 / 优等品 / 800吨",
        pledgedAt: "2026-08-16 08:00",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202604-20",
    orderType: "抵押",
    customer: "某铜业公司",
    ownerName: "李三",
    ownerPhone: "132****4411",
    goodsDetail: "电解铜板 / 1# / 300吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-cu-plate-300",
        qrCode: "QR-CU-20260420-001",
        goodsLabel: "电解铜板 / 1# / 300吨",
        pledgedAt: "2026-04-20 11:00",
        defaultWarningType: "解抵押超时",
      },
    ],
  },
  {
    orderNo: "PO202606-44",
    orderType: "抵押",
    customer: "某有色贸易",
    ownerName: "郑十",
    ownerPhone: "131****3322",
    goodsDetail: "锌锭 / 0# / 150吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-zn-150",
        qrCode: "QR-ZN-20260644-001",
        goodsLabel: "锌锭 / 0# / 150吨",
        pledgedAt: "2026-06-04 09:00",
        defaultWarningType: "解抵押超时",
      },
    ],
  },
  {
    orderNo: "PO202605-88",
    orderType: "质押",
    customer: "某钢材集团",
    ownerName: "钱一",
    ownerPhone: "130****2211",
    goodsDetail: "螺纹钢 / HRB400E / 600吨",
    currentLtv: "45.00",
    goodsBatches: [
      {
        batchId: "batch-rebar-600",
        qrCode: "QR-RB-20260588-001",
        goodsLabel: "螺纹钢 / HRB400E / 600吨",
        pledgedAt: "2026-05-08 10:00",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202603-15",
    orderType: "质押",
    customer: "某镍业公司",
    ownerName: "周四",
    ownerPhone: "129****1100",
    goodsDetail: "镍板 / N6 / 80吨",
    currentLtv: "38.90",
    goodsBatches: [
      {
        batchId: "batch-ni-80",
        qrCode: "QR-NI-20260315-001",
        goodsLabel: "镍板 / N6 / 80吨",
        pledgedAt: "2026-03-15 08:30",
        defaultWarningType: "解质押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-88",
    orderType: "监管服务",
    customer: "某钢材贸易",
    ownerName: "李四",
    ownerPhone: "139****5678",
    goodsDetail: "大宗钢材 / HRB400 / 800吨",
    currentLtv: "58.30",
    goodsBatches: [
      {
        batchId: "batch-steel-800",
        qrCode: "QR-ST-20260810-001",
        goodsLabel: "大宗钢材 / HRB400 / 800吨",
        pledgedAt: "2026-08-10 14:00",
        defaultWarningType: "监管服务超时",
      },
    ],
  },
  {
    orderNo: "PO202609-20",
    orderType: "监管服务",
    customer: "粮油仓储公司",
    ownerName: "陈七",
    ownerPhone: "136****8899",
    goodsDetail: "大豆 / 国标一等 / 1200吨；玉米 / 二等 / 800吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-soy-1200",
        qrCode: "QR-SOY-20260812-201",
        goodsLabel: "大豆 / 国标一等 / 1200吨",
        pledgedAt: "2026-08-12 08:00",
        defaultWarningType: "监管服务超时",
      },
      {
        batchId: "batch-corn-800",
        qrCode: "QR-CORN-20260812-202",
        goodsLabel: "玉米 / 二等 / 800吨",
        pledgedAt: "2026-08-12 08:30",
        defaultWarningType: "监管服务超时",
      },
    ],
  },
  {
    orderNo: "PO202607-55",
    orderType: "监管服务",
    customer: "某冷链物流",
    ownerName: "吴九",
    ownerPhone: "128****0099",
    goodsDetail: "冷冻肉 / 猪五花 / 200吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-meat-200",
        qrCode: "QR-MEAT-20260755-001",
        goodsLabel: "冷冻肉 / 猪五花 / 200吨",
        pledgedAt: "2026-07-05 07:00",
        defaultWarningType: "监管服务超时",
      },
    ],
  },
  {
    orderNo: "PO202605-12",
    orderType: "监管服务",
    customer: "某棉纺企业",
    ownerName: "孙二",
    ownerPhone: "127****0088",
    goodsDetail: "棉花 / 328级 / 500吨",
    currentLtv: null,
    goodsBatches: [
      {
        batchId: "batch-cotton-500",
        qrCode: "QR-CT-20260512-001",
        goodsLabel: "棉花 / 328级 / 500吨",
        pledgedAt: "2026-05-12 09:00",
        defaultWarningType: "监管服务超时",
      },
    ],
  },
]

export function getMockOrderByNo(orderNo: string): MockOrderOption | undefined {
  return MOCK_ORDERS.find((item) => item.orderNo === orderNo)
}

export function getMockCurrentLtv(orderNo: string | undefined): string | null {
  if (!orderNo) {
    return null
  }
  const order = getMockOrderByNo(orderNo)
  if (!order) {
    return null
  }
  return order.currentLtv
}
