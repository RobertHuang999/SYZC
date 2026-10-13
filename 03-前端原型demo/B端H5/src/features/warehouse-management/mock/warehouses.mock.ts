import type { PartitionNode, WarehouseRecord } from "../domain/types"

export const warehousesMock: WarehouseRecord[] = [
  {
    id: "wh-sz-qh",
    name: "深圳前海保税仓",
    status: "ENABLED",
    managerName: "中远海运物流供应链有限公司",
    managerType: "ENTERPRISE",
    zhongdengAccess: "YES",
    createdBy: "王建国",
    createdAt: "2025-04-10 16:26:01",
    address: "广东省深圳市南山区前海深港合作区保税物流园 8 号库",
    area: 28600.5,
    warehouseTypes: ["通用/常温库", "冷库"],
    managerPhone: "0755-88392000",
    managerIdNumber: "91440300MA5EXXXXXX",
    supervisorType: "按人",
    supervisors: ["张伟", "李明"],
    regionalManagerType: "按人",
    regionalManagers: ["陈建国", "王崇"],
    hasInventory: false,
    storerooms: [
      {
        id: "room-sz-1",
        name: "1号保税库房",
        status: "ENABLED",
        remark: "电解铜主库区",
        partitions: [
          {
            id: "part-sz-1-a",
            name: "A01 分区",
            status: "ENABLED",
            remark: "靠东侧月台",
          },
        ],
      },
      {
        id: "room-sz-2",
        name: "2号恒温库房",
        status: "ENABLED",
        remark: "",
        partitions: [],
      },
      {
        id: "room-sz-3",
        name: "3号露天堆场",
        status: "ENABLED",
        remark: "热轧卷板临时堆存",
        partitions: [],
      },
    ],
    facilities: [
      {
        id: "fac-1",
        name: "气体灭火与防爆喷淋系统",
        quantity: 1,
        unit: "套",
        validUntil: "2027-06-24",
      },
    ],
  },
  {
    id: "wh-sh-lg",
    name: "上海宝山钢铁仓",
    status: "ENABLED",
    managerName: "宝武大宗商品物流股份有限公司",
    managerType: "ENTERPRISE",
    zhongdengAccess: "NO",
    createdBy: "周明",
    createdAt: "2025-04-01 17:32:30",
    address: "上海市宝山区宝杨路 2000 号钢铁物流园 A 区",
    area: 52000,
    warehouseTypes: ["堆场", "通用/常温库"],
    managerPhone: "021-26648888",
    managerIdNumber: "91310000MA1XXXXXXX",
    supervisorType: "按角色",
    supervisors: ["期货交割库现场监管组"],
    regionalManagerType: "按人",
    regionalManagers: ["周明"],
    hasInventory: false,
    storerooms: [
      {
        id: "room-sh-a",
        name: "A区立体库房",
        status: "ENABLED",
        remark: "",
        partitions: [
          {
            id: "part-sh-a-1",
            name: "01 货位区",
            status: "ENABLED",
            remark: "",
          },
        ],
      },
      {
        id: "room-sh-b",
        name: "B区普通库房",
        status: "ENABLED",
        remark: "整改中",
        partitions: [],
      },
    ],
    facilities: [],
  },
  {
    id: "wh-demo",
    name: "天津港保税金属仓",
    status: "ENABLED",
    managerName: "中储发展股份有限公司天津分公司",
    managerType: "ENTERPRISE",
    zhongdengAccess: "YES",
    createdBy: "李晓峰",
    createdAt: "2026-06-24 16:23:03",
    address: "天津市滨海新区天津港保税区临港物流园 6 号库",
    area: 36000,
    warehouseTypes: ["通用/常温库", "堆场"],
    managerPhone: "022-25708888",
    managerIdNumber: "91120116MA0XXXXXXX",
    supervisorType: "按人",
    supervisors: ["周全", "郑建邦"],
    regionalManagerType: "按角色",
    regionalManagers: ["北方大区风控巡查组"],
    hasInventory: false,
    storerooms: [
      {
        id: "room-demo-1",
        name: "1号电解铝库房",
        status: "ENABLED",
        remark: "沪铝期货交割指定库房",
        partitions: [],
      },
      {
        id: "room-demo-2",
        name: "2号铜线杆库房",
        status: "ENABLED",
        remark: "铜深加工原材料专区",
        partitions: [],
      },
    ],
    facilities: [
      {
        id: "fac-d1",
        name: "气体灭火与防爆喷淋系统",
        quantity: 1,
        unit: "套",
        validUntil: "2027-06-24",
      },
      {
        id: "fac-d2",
        name: "电子地磅与轮轴称重传感器",
        quantity: 2,
        unit: "台",
        validUntil: "2028-12-31",
      },
    ],
  },
]

export function getWarehouseById(id: string | undefined) {
  if (!id) return undefined
  return warehousesMock.find((w) => w.id === id)
}

export function flattenPartitions(
  warehouse: WarehouseRecord
): PartitionNode[] {
  const list: PartitionNode[] = []
  for (const room of warehouse.storerooms) {
    for (const part of room.partitions) {
      list.push({
        ...part,
        storeroomId: room.id,
        storeroomName: room.name,
      })
    }
  }
  return list
}
