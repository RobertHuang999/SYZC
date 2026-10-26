import type { NavigateFunction } from "react-router-dom"
import { receiptH5DetailPath } from "../domain/constants"

export function backToReceiptDetail(
  navigate: NavigateFunction,
  id: string,
  flash: string,
) {
  navigate(receiptH5DetailPath(id), { state: { flash } })
}

export function todayDateTimeLocal(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function toDateTimeText(value: string): string {
  return value.replace("T", " ") + (value.length === 16 ? ":00" : "")
}
