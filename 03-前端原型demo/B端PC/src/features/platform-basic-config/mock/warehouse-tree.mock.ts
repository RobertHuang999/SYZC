import type { WarehouseRoomNode } from "../domain/types"

export interface WarehouseTreeGroup {
  warehouseId: string
  warehouseName: string
  rooms: { id: string; name: string }[]
}

export const WAREHOUSE_TREE_MOCK: WarehouseTreeGroup[] = [
  {
    warehouseId: "wh-sz-qh",
    warehouseName: "深圳前海保税仓",
    rooms: [
      { id: "room-sz-1", name: "1号保税库房" },
      { id: "room-sz-2", name: "2号恒温库房" },
      { id: "room-sz-3", name: "3号露天堆场" },
    ],
  },
  {
    warehouseId: "wh-sh-lg",
    warehouseName: "上海临港监管仓",
    rooms: [
      { id: "room-sh-a", name: "A区立体库房" },
      { id: "room-sh-b", name: "B区普通库房" },
    ],
  },
  {
    warehouseId: "wh-tj-metal",
    warehouseName: "天津港金属期货交割仓",
    rooms: [
      { id: "room-tj-1", name: "电解铜交割区" },
      { id: "room-tj-2", name: "热轧卷板暂存区" },
      { id: "room-tj-3", name: "铝锭监管区" },
      { id: "room-tj-4", name: "橡胶恒温库" },
    ],
  },
]

export function resolveWarehouseRooms(ids: string[]): WarehouseRoomNode[] {
  const nodes: WarehouseRoomNode[] = []
  for (const group of WAREHOUSE_TREE_MOCK) {
    for (const room of group.rooms) {
      if (ids.includes(room.id)) {
        nodes.push({
          id: room.id,
          warehouseName: group.warehouseName,
          roomName: room.name,
        })
      }
    }
  }
  return nodes
}

export function formatRoomLabel(node: WarehouseRoomNode) {
  return `${node.warehouseName} / ${node.roomName}`
}
