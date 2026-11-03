import {
  SHARED_GOODS,
  SHARED_INVENTORY_DETAILS,
  SHARED_INVENTORY_TRANSACTIONS,
} from "@/features/shared/mock/inventory-shared-seed"

export type CascadeNode = {
  id: string
  name: string
  children?: CascadeNode[]
}

/** 仓库 → 库房 → 分区 三级级联树（数据取自库存明细与流水台账） */
export const WAREHOUSE_CASCADE_TREE: CascadeNode[] = (() => {
  const tree: CascadeNode[] = []

  const rows = [...SHARED_INVENTORY_DETAILS, ...SHARED_INVENTORY_TRANSACTIONS]

  rows.forEach((row) => {
    let warehouseNode = tree.find((node) => node.id === row.warehouseName)
    if (!warehouseNode) {
      warehouseNode = { id: row.warehouseName, name: row.warehouseName, children: [] }
      tree.push(warehouseNode)
    }

    const houseId = `${row.warehouseName}|${row.houseName}`
    let houseNode = warehouseNode.children?.find((node) => node.id === houseId)
    if (!houseNode) {
      houseNode = { id: houseId, name: row.houseName, children: [] }
      warehouseNode.children!.push(houseNode)
    }

    const partitionId = `${houseId}|${row.partitionName}`
    if (!houseNode.children?.some((node) => node.id === partitionId)) {
      houseNode.children!.push({ id: partitionId, name: row.partitionName })
    }
  })

  return tree
})()

/** 货品大类 → 品类 → 规格 三级级联树 */
export const GOODS_CASCADE_TREE: CascadeNode[] = (() => {
  const tree: CascadeNode[] = []

  SHARED_GOODS.forEach((goods) => {
    let categoryNode = tree.find((node) => node.id === goods.category)
    if (!categoryNode) {
      categoryNode = { id: goods.category, name: goods.category, children: [] }
      tree.push(categoryNode)
    }

    const varietyId = `${goods.category}|${goods.variety}`
    let varietyNode = categoryNode.children?.find((node) => node.id === varietyId)
    if (!varietyNode) {
      varietyNode = { id: varietyId, name: goods.variety, children: [] }
      categoryNode.children!.push(varietyNode)
    }

    const specId = `${varietyId}|${goods.specification}`
    if (!varietyNode.children?.some((node) => node.id === specId)) {
      varietyNode.children!.push({ id: specId, name: goods.specification })
    }
  })

  return tree
})()

/** 一条存货记录对应的仓库级联叶子键 */
export function warehouseKeyOf(row: {
  warehouseName: string
  houseName: string
  partitionName: string
}) {
  return `${row.warehouseName}|${row.houseName}|${row.partitionName}`
}

/** 一条记录对应的货品级联叶子键 */
export function goodsKeyOf(row: {
  category: string
  variety: string
  specification: string
}) {
  return `${row.category}|${row.variety}|${row.specification}`
}

export function leafKeysOf(nodes: CascadeNode[] | undefined): string[] {
  if (!nodes) return []
  return nodes.flatMap((node) =>
    node.children?.length ? leafKeysOf(node.children) : [node.id]
  )
}
