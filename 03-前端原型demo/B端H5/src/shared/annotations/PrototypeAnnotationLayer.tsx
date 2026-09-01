import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CompassIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Maximize2Icon,
  Minimize2Icon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  PinIcon,
  SearchIcon,
  SmartphoneIcon,
  WorkflowIcon,
  XIcon,
} from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useLocation, useNavigate } from "react-router-dom"
import { isMermaidCode, MermaidDiagram } from "@/shared/components/MermaidDiagram"
import type {
  AnnotationKind,
  DrawerTabKey,
  PrototypeAnnotation,
  PrototypeDocument,
} from "./annotation.types"

export type { AnnotationKind, DrawerTabKey, PrototypeAnnotation, PrototypeDocument }

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

type PhoneDevicePreset = {
  name: string
  width: number
  height: number
}

export const PHONE_PRESETS: PhoneDevicePreset[] = [
  { name: "iPhone 13/14/15 Pro (390px)", width: 390, height: 844 },
  { name: "iPhone SE / 标准 (375px)", width: 375, height: 812 },
  { name: "iPhone Pro Max (414px)", width: 414, height: 896 },
]

type AnnotationContextValue = {
  title: string
  enabled: boolean
  drawerOpen: boolean
  isWideDrawer: boolean
  activeDrawerTab: DrawerTabKey
  showMarkers: boolean
  activePopupAnnotationId: string | null
  filterKind: AnnotationKind | "全部"
  selectedPreset: PhoneDevicePreset
  annotations: PrototypeAnnotation[]
  documents: PrototypeDocument[]
  setEnabled: (enabled: boolean) => void
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  toggleWideDrawer: () => void
  setActiveDrawerTab: (tab: DrawerTabKey) => void
  openDrawerTab: (tab: DrawerTabKey) => void
  setShowMarkers: (show: boolean) => void
  toggleShowMarkers: () => void
  openInPlacePopup: (annotationId: string) => void
  closeInPlacePopup: () => void
  locateAndOpenPopup: (annotationId: string) => void
  setFilterKind: (kind: AnnotationKind | "全部") => void
  setSelectedPreset: (preset: PhoneDevicePreset) => void
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null)

export function useAnnotationContext() {
  const context = useContext(AnnotationContext)
  if (!context) {
    throw new Error("useAnnotationContext must be used within PrototypeAnnotationProvider")
  }
  return context
}

const kindStyles: Record<AnnotationKind, string> = {
  页面: "border-sky-200 bg-sky-50 text-sky-700",
  交互: "border-violet-200 bg-violet-50 text-violet-700",
  字段: "border-emerald-200 bg-emerald-50 text-emerald-700",
  规则: "border-orange-200 bg-orange-50 text-orange-700",
  待确认: "border-rose-200 bg-rose-50 text-rose-700",
}

const kindOptions: Array<AnnotationKind | "全部"> = [
  "全部",
  "页面",
  "交互",
  "字段",
  "规则",
  "待确认",
]

function AnnotationItemContent({ content }: { content: string }) {
  if (isMermaidCode(content)) {
    return (
      <MermaidDiagram
        chart={content}
        className="my-1 border-0 bg-transparent p-0 shadow-none hover:shadow-none"
      />
    )
  }

  return <span className="whitespace-pre-wrap">{content}</span>
}

export function PrototypeAnnotationProvider({
  title = "森云 H5 移动端原型与业务标注",
  annotations = [],
  documents = [],
  children,
}: {
  title?: string
  annotations?: PrototypeAnnotation[]
  documents?: PrototypeDocument[]
  children: ReactNode
}) {
  const [enabled, setEnabledState] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isWideDrawer, setIsWideDrawer] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTabKey>("annotations")
  const [showMarkers, setShowMarkers] = useState(true)
  const [activePopupAnnotationId, setActivePopupAnnotationId] = useState<string | null>(null)
  const [filterKind, setFilterKind] = useState<AnnotationKind | "全部">("全部")
  const [selectedPreset, setSelectedPreset] = useState<PhoneDevicePreset>(PHONE_PRESETS[0])

  const setEnabled = useCallback((nextEnabled: boolean) => {
    setEnabledState(nextEnabled)
    if (!nextEnabled) {
      setActivePopupAnnotationId(null)
      setDrawerOpen(false)
    }
  }, [])

  const toggleShowMarkers = useCallback(() => {
    setShowMarkers((prev) => {
      const next = !prev
      if (!next) {
        setActivePopupAnnotationId(null)
      }
      return next
    })
  }, [])

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev)
  }, [])

  const toggleWideDrawer = useCallback(() => {
    setIsWideDrawer((prev) => !prev)
  }, [])

  const openDrawerTab = useCallback((tab: DrawerTabKey) => {
    setActiveDrawerTab(tab)
    setDrawerOpen(true)
  }, [])

  const openInPlacePopup = useCallback((annotationId: string) => {
    setActivePopupAnnotationId((prev) => (prev === annotationId ? null : annotationId))
  }, [])

  const closeInPlacePopup = useCallback(() => {
    setActivePopupAnnotationId(null)
  }, [])

  const locateAndOpenPopup = useCallback(
    (annotationId: string) => {
      setShowMarkers(true)
      setActivePopupAnnotationId(annotationId)
      const annotation = annotations.find((item) => item.id === annotationId)
      if (annotation) {
        const targetId = annotation.targetId ?? annotation.id
        window.requestAnimationFrame(() => {
          const target = document.querySelector(`[data-prototype-target="${targetId}"]`)
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" })
            target.classList.add("ring-4", "ring-blue-500", "ring-offset-2")
            setTimeout(() => {
              target.classList.remove("ring-4", "ring-blue-500", "ring-offset-2")
            }, 2500)
          }
        })
      }
    },
    [annotations]
  )

  const contextValue = useMemo(
    () => ({
      title,
      enabled,
      drawerOpen,
      isWideDrawer,
      activeDrawerTab,
      showMarkers,
      activePopupAnnotationId,
      filterKind,
      selectedPreset,
      annotations,
      documents,
      setEnabled,
      setDrawerOpen,
      toggleDrawer,
      toggleWideDrawer,
      setActiveDrawerTab,
      openDrawerTab,
      setShowMarkers,
      toggleShowMarkers,
      openInPlacePopup,
      closeInPlacePopup,
      locateAndOpenPopup,
      setFilterKind,
      setSelectedPreset,
    }),
    [
      title,
      enabled,
      drawerOpen,
      isWideDrawer,
      activeDrawerTab,
      showMarkers,
      activePopupAnnotationId,
      filterKind,
      selectedPreset,
      annotations,
      documents,
      setEnabled,
      toggleDrawer,
      toggleWideDrawer,
      openDrawerTab,
      setShowMarkers,
      toggleShowMarkers,
      openInPlacePopup,
      closeInPlacePopup,
      locateAndOpenPopup,
    ]
  )

  return (
    <AnnotationContext.Provider value={contextValue}>
      <WorkbenchLayout>{children}</WorkbenchLayout>
      {enabled && (
        <>
          <RightEdgeFoldTab />
          <AnnotationSidebarDrawer />
        </>
      )}
    </AnnotationContext.Provider>
  )
}

/**
 * 移动端触屏/鼠标拖拽滑动模拟 Hook（支持滚轮 + 鼠标按住拖拽滑动双重交互）
 */
function useMobileDragScroll(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let isDown = false
    let startY = 0
    let scrollTarget: HTMLElement | null = null
    let startScrollTop = 0

    const findScrollParent = (target: HTMLElement | null): HTMLElement | null => {
      let curr = target
      while (curr && curr !== el) {
        const style = window.getComputedStyle(curr)
        const overflowY = style.overflowY
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          curr.scrollHeight > curr.clientHeight
        ) {
          return curr
        }
        curr = curr.parentElement
      }
      return null
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement | null
      // 忽略可输入控件、交互按钮与特定免拖拽元素
      if (
        target?.closest("input, select, textarea, button, a, [role='button'], [data-no-drag]")
      ) {
        return
      }

      scrollTarget = findScrollParent(target)
      if (!scrollTarget) return

      isDown = true
      startY = e.clientY
      startScrollTop = scrollTarget.scrollTop
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown || !scrollTarget) return
      const deltaY = e.clientY - startY
      if (Math.abs(deltaY) > 1) {
        scrollTarget.scrollTop = startScrollTop - deltaY
      }
    }

    const onPointerUp = () => {
      isDown = false
      scrollTarget = null
    }

    el.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)

    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
    }
  }, [containerRef])
}

type PrototypeNavItem = {
  title: string
  path: string
  icon: string
  matchPrefixes?: string[]
}

type PrototypeNavGroup = {
  label: string
  items: PrototypeNavItem[]
}

const PROTOTYPE_NAV_GROUPS: PrototypeNavGroup[] = [
  {
    label: "基础 Tab",
    items: [
      { title: "首页中枢", path: "/m/home", icon: "🏠" },
      { title: "工作台", path: "/m/workspace", icon: "📊" },
      { title: "业务办理", path: "/m/tasks", icon: "📝" },
      { title: "机构与权限", path: "/m/profile", icon: "👤" },
    ],
  },
  {
    label: "风控预警",
    items: [
      { title: "押品预警列表", path: "/m/supervision/order-warnings", icon: "⚠️" },
      { title: "设备预警列表", path: "/m/iot/device-warning-events", icon: "📡" },
    ],
  },
  {
    label: "审批中心",
    items: [
      {
        title: "我的申请记录",
        path: "/m/my-applies?tab=unlock-applies",
        icon: "📋",
        matchPrefixes: ["/m/my-applies"],
      },
      {
        title: "开锁审核",
        path: "/m/approval/unlock-applies",
        icon: "🔓",
        matchPrefixes: ["/m/approval/unlock-applies"],
      },
    ],
  },
  {
    label: "设备管理",
    items: [
      {
        title: "设备管理 Hub",
        path: "/m/device-management",
        icon: "📷",
        matchPrefixes: ["/m/device-management", "/m/access-control-devices"],
      },
    ],
  },
]

function isPrototypeNavActive(pathname: string, item: PrototypeNavItem) {
  const prefixes = item.matchPrefixes ?? [item.path.split("?")[0]]
  return prefixes.some((prefix) => {
    if (prefix === "/m/home") {
      return pathname === "/" || pathname === "/m/home"
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

/**
 * 桌面三栏工作台包装容器（清爽浅色现代 B 端风格）
 */
function WorkbenchLayout({ children }: { children: ReactNode }) {
  const context = useAnnotationContext()
  const location = useLocation()
  const navigate = useNavigate()
  const phoneViewportRef = useRef<HTMLDivElement>(null)

  useMobileDragScroll(phoneViewportRef)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#edf2f7] text-slate-800 font-sans select-none">
      {/* 1. 左侧页面导航栏（浅色清爽设计） */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-xl">
        {/* 系统标题 */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-100">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md text-xs">
            SY
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-tight">森云科技 · SYZC</h2>
            <p className="text-[10px] text-slate-500">H5 移动原型与 PRD 标注台</p>
          </div>
        </div>

        {/* 页面快速切换列表 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            原型页面导航
          </div>
          {PROTOTYPE_NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-medium text-slate-400">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = isPrototypeNavActive(location.pathname, item)
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer",
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    {isActive && <div className="size-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="pt-1 px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            标注与规格统计
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 text-[11px] space-y-1.5 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">当前页面打点：</span>
              <span className="font-bold text-blue-600">{context.annotations.length} 个</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">PRD与规则文档：</span>
              <span className="font-bold text-emerald-600">{context.documents.length} 篇</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">打点显示状态：</span>
              <span
                className={cn(
                  "font-bold",
                  context.showMarkers ? "text-rose-600" : "text-slate-400"
                )}
              >
                {context.showMarkers ? "已开启" : "已隐藏"}
              </span>
            </div>
          </div>
        </div>

        {/* 底部控制 */}
        <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          森云供应链金融存货监管系统 v6.2
        </div>
      </aside>

      {/* 2. 中间主工作区（浅色背景 + 顶部工具栏 + 手机预览视口） */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#e6edf5]">
        {/* 顶部工具栏 */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md shadow-2xs">
          {/* 机型尺寸选择 */}
          <div className="flex items-center gap-2">
            <SmartphoneIcon className="size-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">机型预览：</span>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-xs">
              {PHONE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => context.setSelectedPreset(preset)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer",
                    context.selectedPreset.width === preset.width
                      ? "bg-white text-blue-600 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {preset.width}px
                </button>
              ))}
            </div>
          </div>

          {/* 打点开关与抽屉切换 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={context.toggleShowMarkers}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                context.showMarkers
                  ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {context.showMarkers ? (
                <>
                  <EyeIcon className="size-3.5 text-rose-600" />
                  <span>打点已开启 ({context.annotations.length})</span>
                </>
              ) : (
                <>
                  <EyeOffIcon className="size-3.5 text-slate-400" />
                  <span>纯净原型模式</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => context.openDrawerTab("annotations")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-all cursor-pointer"
            >
              <PanelRightOpenIcon className="size-3.5" />
              <span>打开 PRD/规则抽屉</span>
            </button>
          </div>
        </header>

        {/* 手机模拟预览居中视口 + 画布外侧需求规则检查器（大画布联动画布） */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[#d8e2ec] relative gap-6">
          {/* 1. 手机真机视口容器 */}
          <div
            className="relative flex flex-col shrink-0 overflow-hidden bg-[#edf2f8] shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition-all duration-300 rounded-[42px] border-[8px] border-slate-800"
            style={{
              width: `${context.selectedPreset.width}px`,
              height: `${context.selectedPreset.height}px`,
              maxHeight: "calc(100vh - 5.5rem)",
            }}
          >
            {/* iOS 顶部状态栏与灵动岛 */}
            <div className="relative flex h-10 shrink-0 items-center justify-between px-6 pt-1 text-[12px] font-semibold text-gray-900 bg-[#edf2f8] z-20 border-b border-gray-100/40 select-none">
              <span>09:41</span>
              {/* 灵动岛 */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4 w-24 rounded-full bg-black flex items-center justify-end px-2">
                <div className="size-2 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-mono text-[10px]">5G</span>
                <div className="h-2.5 w-5 rounded-xs border border-gray-800 p-0.5 flex items-center">
                  <div className="h-full w-full bg-gray-800 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* 页面内容注入 */}
            <div
              ref={phoneViewportRef}
              className="flex flex-1 flex-col min-h-0 overflow-hidden relative text-slate-900 select-text"
            >
              {children}
            </div>

            {/* iOS 底部小黑条 */}
            <div className="h-4 bg-[#edf2f8] flex items-center justify-center shrink-0 z-20">
              <div className="h-1 w-28 rounded-full bg-slate-400/80" />
            </div>
          </div>

          {/* 2. 原型屏幕外侧的大画布需求检查器面板（Canvas Inspector，极度舒适宽屏大字号） */}
          {context.enabled && context.activePopupAnnotationId && (
            <CanvasAnnotationInspector />
          )}
        </div>
      </main>
    </div>
  )
}

/**
 * 右侧常驻折叠悬浮栏
 */
function RightEdgeFoldTab() {
  const context = useAnnotationContext()

  if (context.drawerOpen) {
    return null
  }

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[65] flex flex-col items-center overflow-hidden rounded-l-2xl border-2 border-r-0 border-blue-400/80 bg-white/95 text-slate-800 shadow-[0_10px_35px_rgba(37,99,235,0.22)] backdrop-blur-xl transition-all select-none"
      aria-label="需求与设计悬浮导航栏"
    >
      {/* 1. 顶部打点开关 */}
      <button
        type="button"
        className={cn(
          "flex w-11 cursor-pointer flex-col items-center justify-center gap-0.5 border-b border-blue-100/90 py-2 transition-all hover:brightness-105 active:scale-90 focus-visible:outline-none",
          context.showMarkers
            ? "bg-blue-500/15 text-blue-600"
            : "bg-slate-100/70 text-slate-400 hover:bg-slate-200/80"
        )}
        onClick={(e) => {
          e.stopPropagation()
          context.toggleShowMarkers()
        }}
        title={context.showMarkers ? "快捷关闭打点数字" : "快捷开启打点数字"}
      >
        {context.showMarkers ? (
          <>
            <EyeIcon className="size-3.5 text-blue-600" />
            <span className="text-[8px] font-extrabold leading-none text-blue-600">ON</span>
          </>
        ) : (
          <>
            <EyeOffIcon className="size-3.5 text-slate-400" />
            <span className="text-[8px] font-extrabold leading-none text-slate-400">OFF</span>
          </>
        )}
      </button>

      {/* 2. 【需求打点】 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-blue-50/80 active:scale-95 focus-visible:outline-none group"
        onClick={() => context.openDrawerTab("annotations")}
        title="点击展开【需求打点】"
      >
        <PinIcon className="size-3.5 text-blue-600 rotate-45 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-slate-800 leading-tight">
          <span>需</span>
          <span>求</span>
          <span>打</span>
          <span>点</span>
        </div>
        <span
          className={cn(
            "mt-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-xs transition-colors",
            context.showMarkers
              ? "bg-blue-600 shadow-[0_2px_6px_rgba(37,99,235,0.4)]"
              : "bg-slate-400 text-slate-100"
          )}
        >
          {context.annotations.length}
        </span>
      </button>

      {/* 3. 【字段清单】 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-emerald-50/80 active:scale-95 focus-visible:outline-none group"
        onClick={() => context.openDrawerTab("fields")}
        title="点击展开查看【字段清单】"
      >
        <FileSpreadsheetIcon className="size-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-emerald-700 leading-tight">
          <span>字</span>
          <span>段</span>
          <span>清</span>
          <span>单</span>
        </div>
      </button>

      {/* 4. 【PRD需求文档】 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-sky-50/80 active:scale-95 focus-visible:outline-none group"
        onClick={() => context.openDrawerTab("prd")}
        title="点击展开查看【PRD需求文档】"
      >
        <FileTextIcon className="size-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-sky-700 leading-tight">
          <span>需</span>
          <span>求</span>
          <span>文</span>
          <span>档</span>
        </div>
      </button>

      {/* 5. 【业务规则/规格】 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 py-2.5 transition-all hover:bg-orange-50/80 active:scale-95 focus-visible:outline-none group"
        onClick={() => context.openDrawerTab("rules")}
        title="点击展开查看【业务规则与规格】"
      >
        <WorkflowIcon className="size-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-orange-700 leading-tight">
          <span>规</span>
          <span>则</span>
          <span>规</span>
          <span>格</span>
        </div>
      </button>
    </div>
  )
}

/**
 * 页面元素原位打点包装器（纯净无遮挡，点击触发外侧大画布检查器）
 */
export function PrototypeAnnotationTarget({
  annotationIds,
  children,
  className,
  markerPosition = "top-right",
}: {
  annotationIds: string[]
  children: ReactNode
  className?: string
  markerPosition?: "top-left" | "top-right"
}) {
  const context = useAnnotationContext()
  const annotations = annotationIds
    .map((id) => context.annotations.find((annotation) => annotation.id === id))
    .filter((annotation): annotation is PrototypeAnnotation => Boolean(annotation))
  const targetId = annotations[0]?.targetId ?? annotations[0]?.id
  const isTargetActive = annotations.some(
    (annotation) => annotation.id === context.activePopupAnnotationId
  )

  return (
    <div
      data-prototype-target={targetId}
      className={cn(
        "relative transition-all duration-300",
        isTargetActive &&
          "ring-1 ring-rose-400/80 shadow-[0_0_0_1px_rgba(244,63,94,0.25),0_0_10px_rgba(244,63,94,0.1)] bg-rose-500/[0.03] rounded-xl dark:ring-rose-400/70 dark:bg-rose-950/20",
        className
      )}
    >
      {children}

      {/* On-Page Red Markers (仅在 showMarkers 为 true 时渲染) */}
      {context.enabled && context.showMarkers && annotations.length > 0 && (
        <div
          className={cn(
            "absolute z-30 flex items-center gap-1",
            markerPosition === "top-left" ? "top-1 left-1" : "top-1 right-1"
          )}
        >
          {annotations.map((annotation) => {
            const isActive = annotation.id === context.activePopupAnnotationId
            return (
              <button
                key={annotation.id}
                type="button"
                className={cn(
                  "flex size-5.5 cursor-pointer items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md transition-all hover:scale-125 focus-visible:outline-none active:scale-95",
                  isActive
                    ? "bg-blue-600 ring-4 ring-blue-400/60 scale-110 animate-pulse"
                    : "bg-rose-500 hover:bg-rose-600"
                )}
                title={`需求打点 #${annotation.number}：${annotation.title}（点击在屏幕外画布查看完整规则）`}
                onClick={(e) => {
                  e.stopPropagation()
                  context.openInPlacePopup(annotation.id)
                }}
              >
                {annotation.number}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * 手机外侧大画布需求检查器面板 (Canvas Annotation Inspector)
 * 彻底解决手机屏幕太小、看文档字太小被遮挡的痛点
 */
function CanvasAnnotationInspector() {
  const context = useAnnotationContext()
  const activeAnnotation = context.annotations.find(
    (item) => item.id === context.activePopupAnnotationId
  )

  if (!activeAnnotation) {
    return null
  }

  // 计算当前打点在所有打点中的索引，支持上一条/下一条切换
  const currentIndex = context.annotations.findIndex((item) => item.id === activeAnnotation.id)
  const prevAnnotation = currentIndex > 0 ? context.annotations[currentIndex - 1] : null
  const nextAnnotation =
    currentIndex >= 0 && currentIndex < context.annotations.length - 1
      ? context.annotations[currentIndex + 1]
      : null

  const targetId = activeAnnotation.targetId ?? activeAnnotation.id

  return (
    <aside
      className="hidden md:flex flex-col w-[440px] lg:w-[500px] xl:w-[560px] max-h-[calc(100vh-5.5rem)] rounded-3xl border border-slate-200/90 bg-white/95 text-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl overflow-hidden transition-all duration-300 select-text animate-in fade-in slide-in-from-right-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. 顶部标头与控制栏 */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-sm">
            #{activeAnnotation.number}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {activeAnnotation.title}
              </h3>
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.2 text-[10px] font-semibold leading-none",
                  kindStyles[activeAnnotation.kind]
                )}
              >
                {activeAnnotation.kind}
              </span>
            </div>
            {targetId && (
              <span className="text-[10px] font-mono text-slate-400">
                绑定靶点: #{targetId}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => context.openDrawerTab("annotations")}
            title="在右侧全局抽屉查看"
          >
            <PanelRightOpenIcon className="size-3.5" />
            <span className="hidden lg:inline text-[11px]">抽屉</span>
          </button>

          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            onClick={context.closeInPlacePopup}
            title="关闭画布检查器"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* 2. 核心内容区域（宽敞舒服的大字号阅读体验） */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* 核心事实需求摘要 */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 text-slate-800 text-[12px] leading-relaxed shadow-2xs">
          <div className="text-[11px] font-bold text-blue-800 mb-1 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-blue-600" />
            <span>核心需求说明</span>
          </div>
          <p className="font-normal text-slate-700 leading-relaxed">
            {activeAnnotation.content}
          </p>
        </div>

        {/* 业务规则分项细节 */}
        {activeAnnotation.details.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-2"
          >
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="size-2 rounded-full bg-blue-600" />
              <span>{group.title}</span>
            </h4>
            <div className="grid gap-2">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-[11.5px] leading-relaxed"
                >
                  <div className="font-semibold text-slate-800 mb-1 text-[11px]">
                    {item.label}
                  </div>
                  <div className="text-slate-600 leading-relaxed">
                    <AnnotationItemContent content={item.content} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. 底部导航与快捷切换栏（上一条 / 下一条打点快速审查） */}
      <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-2.5 shrink-0 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {prevAnnotation ? (
            <button
              type="button"
              onClick={() => context.locateAndOpenPopup(prevAnnotation.id)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title={`切换至 #${prevAnnotation.number} ${prevAnnotation.title}`}
            >
              <span>◀ #{prevAnnotation.number}</span>
              <span className="max-w-[70px] truncate hidden sm:inline">
                {prevAnnotation.title}
              </span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-300">已是第一条</span>
          )}

          {nextAnnotation ? (
            <button
              type="button"
              onClick={() => context.locateAndOpenPopup(nextAnnotation.id)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title={`切换至 #${nextAnnotation.number} ${nextAnnotation.title}`}
            >
              <span className="max-w-[70px] truncate hidden sm:inline">
                {nextAnnotation.title}
              </span>
              <span>#{nextAnnotation.number} ▶</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-300">已是最后一条</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => context.locateAndOpenPopup(activeAnnotation.id)}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors shrink-0"
        >
          <CompassIcon className="size-3" />
          <span>手机聚焦</span>
        </button>
      </div>
    </aside>
  )
}

/**
 * 右侧全局需求与规格抽屉
 */
function AnnotationSidebarDrawer() {
  const context = useAnnotationContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const collapseAll = () => {
    const next: Record<string, boolean> = {}
    context.annotations.forEach((item) => {
      next[item.id] = true
    })
    setCollapsedMap(next)
  }

  const expandAll = () => {
    setCollapsedMap({})
  }

  const isAllCollapsed =
    context.annotations.length > 0 &&
    context.annotations.every((item) => Boolean(collapsedMap[item.id]))

  if (!context.drawerOpen) {
    return null
  }

  const tabs: Array<{ key: DrawerTabKey; label: string; icon: any; count?: number }> = [
    { key: "annotations", label: "需求打点", icon: PinIcon, count: context.annotations.length },
    {
      key: "fields",
      label: "字段清单",
      icon: FileSpreadsheetIcon,
      count: context.documents.filter((d) => d.id === "fields" || d.category.includes("字段")).length,
    },
    {
      key: "prd",
      label: "PRD需求",
      icon: FileTextIcon,
      count: context.documents.filter((d) => d.id === "prd" || d.category.includes("PRD") || d.category.includes("需求")).length,
    },
    {
      key: "rules",
      label: "业务规则",
      icon: WorkflowIcon,
      count: context.documents.filter((d) => d.id === "rules" || d.category.includes("规则")).length,
    },
  ]

  const filteredAnnotations = context.annotations.filter((item) => {
    const matchKind = context.filterKind === "全部" || item.kind === context.filterKind
    const matchQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchKind && matchQuery
  })

  return (
    <div
      className={cn(
        "fixed right-0 top-0 bottom-0 z-[70] flex flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl transition-all duration-300",
        context.isWideDrawer ? "w-[780px]" : "w-[520px]",
        "max-w-[96vw]"
      )}
    >
      {/* 抽屉头部 */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
            PRD
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">{context.title}</h2>
            <p className="text-[10px] text-slate-500">双向联动 · 规则与字段字典对齐</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            onClick={context.toggleWideDrawer}
            title={context.isWideDrawer ? "还原紧凑宽度" : "宽屏阅读模式"}
          >
            {context.isWideDrawer ? (
              <>
                <Minimize2Icon className="size-3" />
                <span>紧凑</span>
              </>
            ) : (
              <>
                <Maximize2Icon className="size-3" />
                <span>宽屏</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            onClick={() => context.setDrawerOpen(false)}
            title="关闭抽屉"
          >
            <PanelRightCloseIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* 抽屉 Tab 导航栏 */}
      <div className="flex border-b border-slate-100 bg-slate-100/60 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = context.activeDrawerTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => context.setActiveDrawerTab(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-white text-blue-600 font-bold shadow-xs"
                  : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
              )}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className="rounded-full bg-slate-200/80 px-1.5 py-0.2 text-[9px]">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 抽屉主体内容区 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Tab 1: 需求打点列表 */}
        {context.activeDrawerTab === "annotations" && (
          <div className="space-y-3">
            {/* 搜索与分类过滤 */}
            <div className="space-y-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索打点标题与规则关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex flex-wrap gap-1">
                  {kindOptions.map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => context.setFilterKind(kind)}
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer",
                        context.filterKind === kind
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {kind}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={isAllCollapsed ? expandAll : collapseAll}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {isAllCollapsed ? (
                    <>
                      <ChevronDownIcon className="size-3 text-slate-500" />
                      <span>全部展开</span>
                    </>
                  ) : (
                    <>
                      <ChevronUpIcon className="size-3 text-slate-500" />
                      <span>全部折叠</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 打点卡片列表 */}
            {filteredAnnotations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                暂无匹配的需求打点
              </div>
            ) : (
              filteredAnnotations.map((annotation) => {
                const isCollapsed = Boolean(collapsedMap[annotation.id])
                return (
                  <div
                    key={annotation.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md group"
                  >
                    {/* 卡片头部：左侧序号+标题+类型，右侧折叠按钮 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                        <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                          {annotation.number}
                        </span>
                        <h3 className="font-bold text-xs text-slate-900 leading-snug">
                          {annotation.title}
                        </h3>
                        <span className={cn("rounded border px-1.5 py-0.2 text-[10px] font-medium leading-none", kindStyles[annotation.kind])}>
                          {annotation.kind}
                        </span>
                      </div>

                      {/* 折叠/展开按钮 */}
                      <button
                        type="button"
                        onClick={() => toggleCollapse(annotation.id)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shrink-0 cursor-pointer"
                        title={isCollapsed ? "点击展开详细规则" : "点击折叠内容"}
                      >
                        {isCollapsed ? (
                          <>
                            <span>展开</span>
                            <ChevronDownIcon className="size-3.5" />
                          </>
                        ) : (
                          <>
                            <span>折叠</span>
                            <ChevronUpIcon className="size-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* 折叠时隐藏以下主体内容 */}
                    {!isCollapsed && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {annotation.content}
                        </p>

                        {/* 详细细节项 */}
                        {annotation.details.length > 0 && (
                          <div className="space-y-2 border-t border-slate-100 pt-2 text-xs">
                            {annotation.details.map((group, gIdx) => (
                              <div key={gIdx} className="space-y-1">
                                <div className="font-semibold text-[11px] text-slate-800 flex items-center gap-1">
                                  <span className="size-1.5 rounded-full bg-blue-500" />
                                  {group.title}
                                </div>
                                <div className="grid gap-1">
                                  {group.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed border border-slate-100"
                                    >
                                      <div className="font-medium text-slate-800 mb-0.5">{item.label}</div>
                                      <div className="text-slate-600">
                                        <AnnotationItemContent content={item.content} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 底部定位按钮 */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => context.locateAndOpenPopup(annotation.id)}
                            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <CompassIcon className="size-3" />
                            <span>在手机屏幕上高亮定位</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab 2: 字段清单 */}
        {context.activeDrawerTab === "fields" && (
          <DocumentTabContent
            targetDocId="fields"
            fallbackCategory="字段字典清单"
          />
        )}

        {/* Tab 3: PRD 需求文档 */}
        {context.activeDrawerTab === "prd" && (
          <DocumentTabContent
            targetDocId="prd"
            fallbackCategory="PRD需求规格"
          />
        )}

        {/* Tab 4: 业务规则规格 */}
        {context.activeDrawerTab === "rules" && (
          <DocumentTabContent
            targetDocId="rules"
            fallbackCategory="业务规则规格"
          />
        )}
      </div>
    </div>
  )
}

function DocumentTabContent({
  targetDocId,
  fallbackCategory,
}: {
  targetDocId: string
  fallbackCategory: string
}) {
  const context = useAnnotationContext()
  const [copied, setCopied] = useState(false)
  const doc = context.documents.find(
    (d) =>
      d.id === targetDocId ||
      d.category === fallbackCategory ||
      d.title.includes(fallbackCategory.slice(0, 2))
  )

  const handleCopy = () => {
    if (doc?.content) {
      navigator.clipboard.writeText(doc.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!doc) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
        当前页面暂无相关文档
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="size-2 rounded-full bg-blue-600 shrink-0" />
          <h3 className="font-bold text-sm text-slate-900 truncate">{doc.title}</h3>
          {doc.badge && (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200 shrink-0">
              {doc.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-1 shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
          onClick={handleCopy}
          title="复制完整的 Markdown 文档源码"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">已复制</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3" />
              <span>复制 Markdown</span>
            </>
          )}
        </button>
      </div>

      <div className="prose prose-xs max-w-none text-slate-700 text-xs leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              const isMermaid = match && match[1] === "mermaid"
              if (isMermaid) {
                return (
                  <div className="my-4 not-prose">
                    <MermaidDiagram chart={String(children).replace(/\n$/, "")} />
                  </div>
                )
              }
              return (
                <code
                  className={cn(
                    "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-800 border border-slate-200/60",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              )
            },
            pre({ children }) {
              return <div className="not-prose my-3">{children}</div>
            },
            table({ children }) {
              return (
                <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    {children}
                  </table>
                </div>
              )
            },
            thead({ children }) {
              return <thead className="bg-slate-100/90 border-b border-slate-200">{children}</thead>
            },
            th({ children }) {
              return <th className="p-2.5 font-bold text-slate-800 text-xs">{children}</th>
            },
            td({ children }) {
              return <td className="p-2.5 border-b border-slate-100 text-slate-600 text-xs leading-normal">{children}</td>
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-3 border-l-4 border-blue-500/80 bg-blue-50/50 py-2 px-4 italic text-slate-700 rounded-r-lg">
                  {children}
                </blockquote>
              )
            },
            h1({ children }) {
              return <h1 className="mt-5 mb-2.5 text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="mt-4 mb-2 text-sm font-semibold text-slate-900">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="mt-3.5 mb-1.5 text-xs font-semibold text-slate-800">{children}</h3>
            },
            ul({ children }) {
              return <ul className="my-2 list-disc pl-5 space-y-1 text-slate-600">{children}</ul>
            },
            ol({ children }) {
              return <ol className="my-2 list-decimal pl-5 space-y-1 text-slate-600">{children}</ol>
            },
            li({ children }) {
              return <li className="leading-5">{children}</li>
            },
            p({ children }) {
              return <p className="my-2 text-slate-600 leading-relaxed">{children}</p>
            },
            hr() {
              return <hr className="my-4 border-slate-200" />
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
