import type { Location, NavigateFunction } from "react-router-dom"
import { INBOUND_LIST_ROUTE } from "../domain/constants"

export type InboundDetailLocationState = {
  /** 显式指定返回路径（跨模块深链时使用） */
  returnTo?: string
}

/** 列表 → 详情 → 返回：优先历史后退，避免 backTo 压栈导致二次返回仍停在详情 */
export function handleInboundDetailBack(
  navigate: NavigateFunction,
  location: Location,
): void {
  const state = location.state as InboundDetailLocationState | null
  if (state?.returnTo) {
    navigate(state.returnTo)
    return
  }

  if (location.key !== "default") {
    navigate(-1)
    return
  }

  navigate(INBOUND_LIST_ROUTE, { replace: true })
}
