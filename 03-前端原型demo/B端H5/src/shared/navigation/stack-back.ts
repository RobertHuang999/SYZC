import type { Location, NavigateFunction } from "react-router-dom"

export type StackBackLocationState = {
  /** 跨模块深链进入时显式指定返回路径 */
  returnTo?: string
}

/**
 * 列表 → 详情 → 返回：优先浏览器历史后退，避免 backTo 再次 navigate 压栈导致「返回两次仍停在详情」。
 * 无历史（直链打开）时 replace 到 fallbackPath。
 */
export function handleStackBack(
  navigate: NavigateFunction,
  location: Location,
  fallbackPath: string,
): void {
  const state = location.state as StackBackLocationState | null
  if (state?.returnTo) {
    navigate(state.returnTo)
    return
  }

  if (location.key !== "default") {
    navigate(-1)
    return
  }

  navigate(fallbackPath, { replace: true })
}
