import {
  RECEIPT_WAREHOUSE_TOPOLOGY,
  receiptAvailableStock,
  receiptIssuanceCandidates,
  warehouseReceiptSeed,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import {
  findMobileReceipt,
  getAllMobileReceipts,
} from "../lib/created-receipts"

export const mobileReceiptsMock = warehouseReceiptSeed
export const mobileIssuanceCandidates = receiptIssuanceCandidates
export const mobileAvailableStock = receiptAvailableStock
export const mobileWarehouseTopology = RECEIPT_WAREHOUSE_TOPOLOGY

export { getAllMobileReceipts }

export function getMobileReceiptById(id: string | undefined) {
  return findMobileReceipt(id)
}

export const RECEIPT_OWNER_OPTIONS = [
  {
    id: "owner-fuyang",
    type: "ENTERPRISE" as const,
    name: "阜阳市大数据资产运营有限公司",
    identifier: "91341202MA2U0JHJ3F",
    idCardNo: "",
  },
  {
    id: "owner-yuanyuan",
    type: "PERSON" as const,
    name: "原原李",
    identifier: "185****7112",
    idCardNo: "420101********6682",
  },
]

export const RECEIPT_WAREHOUSE_OPTIONS = [
  "生鲜仓库",
  "海霸王仓库",
  "华东1号智能立体仓",
  "西南大宗物资仓",
]
