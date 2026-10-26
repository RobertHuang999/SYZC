import {
  findWarehouseReceiptByIdOrCode,
  warehouseReceiptSeed,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import type { WarehouseReceipt } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"

export const warehouseReceiptsMock: WarehouseReceipt[] = warehouseReceiptSeed

export function getWarehouseReceiptById(id: string | undefined): WarehouseReceipt | undefined {
  return findWarehouseReceiptByIdOrCode(id)
}
