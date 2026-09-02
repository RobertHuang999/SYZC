/** 向上查找移动端浮层挂载根节点（MobileShell / 手机画板视口） */
export function getOverlayRoot(element: HTMLElement | null): HTMLElement {
  let current = element?.parentElement ?? null
  while (current) {
    if (current.hasAttribute("data-overlay-root")) {
      return current
    }
    current = current.parentElement
  }
  return document.body
}
