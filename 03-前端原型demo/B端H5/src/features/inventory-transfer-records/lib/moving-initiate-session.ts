import type { MovingFlowTypeValue } from "../domain/types"
import { MOCK_INITIATE_GOODS_LIST, type MovingGoodsCardItem } from "../mock/moving-form.mock"

export interface MovingFormState {
  // Step 1 基础信息 (完全对齐截图 1)
  ownerType: 1 | 2 // 1 个人, 2 企业
  ownerId: string
  ownerName: string
  ownerIdentity: string // 身份证号
  ownerMobile: string // 手机号
  moveDate: string
  flowType: MovingFlowTypeValue
  relatedOrderId?: string
  relatedOrderCode?: string
  remark: string
  pictureScene: string[]

  // Step 2 货品明细 (完全对齐截图 2)
  goodsCards: MovingGoodsCardItem[]
}

const STORAGE_KEY = "syzc_h5_moving_initiate_draft"

export function getDefaultMovingFormState(): MovingFormState {
  return {
    ownerType: 1, // 个人 (截图选中国家色浅金底个人)
    ownerId: "OWN-000",
    ownerName: "李米娜",
    ownerIdentity: "310101********2738",
    ownerMobile: "185****8733",
    moveDate: "2026-11-05 09:48:35",
    flowType: "NORMAL",
    remark: "",
    pictureScene: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80",
    ],
    goodsCards: JSON.parse(JSON.stringify(MOCK_INITIATE_GOODS_LIST)),
  }
}

export function saveMovingSession(data: MovingFormState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error("保存移库表单缓存失败", e)
  }
}

export function loadMovingSession(): MovingFormState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error("读取移库表单缓存失败", e)
  }
  return getDefaultMovingFormState()
}

export function clearMovingSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error("清除移库表单缓存失败", e)
  }
}
