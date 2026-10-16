import type { Location, NavigateFunction } from "react-router-dom"
import { handleStackBack, type StackBackLocationState } from "@/shared/navigation/stack-back"
import { INBOUND_LIST_ROUTE } from "../domain/constants"

export type InboundDetailLocationState = StackBackLocationState

/** 列表 → 详情 → 返回：优先历史后退，避免 backTo 压栈导致二次返回仍停在详情 */
export function handleInboundDetailBack(
  navigate: NavigateFunction,
  location: Location,
): void {
  handleStackBack(navigate, location, INBOUND_LIST_ROUTE)
}
