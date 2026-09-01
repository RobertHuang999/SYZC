import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CompassIcon,
  CopyIcon,
  DatabaseIcon,
  EyeIcon,
  EyeOffIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  GripVerticalIcon,
  LayersIcon,
  ListFilterIcon,
  Maximize2Icon,
  Minimize2Icon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  PinIcon,
  RotateCcwIcon,
  SearchIcon,
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
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { isMermaidCode, MermaidDiagram } from "@/shared/components/MermaidDiagram"
import type { PrototypeDocument } from "@/shared/components/DocumentViewerModal"

export type { PrototypeDocument }

export type AnnotationKind = "页面" | "交互" | "字段" | "规则" | "待确认"
export type DrawerTabKey = "annotations" | "fields" | "prd" | "rules"

export type PrototypeAnnotation = {
  id: string
  targetId?: string
  number: number
  kind: AnnotationKind
  title: string
  content: string
  details: Array<{
    title: string
    items: Array<{
      label: string
      content: string
    }>
  }>
}

function AnnotationItemContent({ content }: { content: string }) {
  if (isMermaidCode(content)) {
    return (
      <MermaidDiagram
        chart={content}
        className="my-1 border-0 bg-transparent p-0 shadow-none hover:shadow-none"
      />
    )
  }

  return <>{content}</>
}

type Point = {
  x: number
  y: number
}

type Size = {
  width: number
  height: number
}

type AnnotationContextValue = {
  title: string
  enabled: boolean
  drawerOpen: boolean
  isWideDrawer: boolean
  activeDrawerTab: DrawerTabKey
  showMarkers: boolean
  activePopupAnnotationId: string | null
  filterKind: AnnotationKind | "全部"
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
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null)

const kindStyles: Record<AnnotationKind, string> = {
  页面: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300",
  交互: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300",
  字段: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  规则: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
  待确认: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
}

const kindOptions: Array<AnnotationKind | "全部"> = [
  "全部",
  "页面",
  "交互",
  "字段",
  "规则",
  "待确认",
]

export function PrototypeAnnotationProvider({
  title = "原型交互与业务批注",
  annotations,
  documents = [],
  children,
}: {
  title?: string
  annotations: PrototypeAnnotation[]
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
      <div
        className={cn(
          "prototype-annotation-content min-w-0",
          !drawerOpen && "prototype-annotation-content-with-fold-tab"
        )}
      >
        {children}
      </div>
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
 * 1. 常驻右侧悬浮栏 (分层包含【打点开关】【需求打点】【字段清单】【需求文档】【业务规则规格】)
 */
function RightEdgeFoldTab() {
  const context = useAnnotationContext()

  if (context.drawerOpen) {
    return null
  }

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[65] flex flex-col items-center overflow-hidden rounded-l-2xl border-2 border-r-0 border-blue-400/80 bg-white/95 text-slate-800 shadow-[0_10px_35px_rgba(37,99,235,0.22)] backdrop-blur-xl transition-all select-none dark:bg-slate-900/95 dark:text-slate-100 dark:border-blue-500/80"
      aria-label="需求与设计悬浮导航栏"
    >
      {/* 1. 顶部快速开关 (点击立即开启/隐藏页面打点数字) */}
      <button
        type="button"
        className={cn(
          "flex w-11 cursor-pointer flex-col items-center justify-center gap-0.5 border-b border-blue-100/90 py-2 transition-all hover:brightness-105 active:scale-90 focus-visible:outline-none dark:border-blue-900/60",
          context.showMarkers
            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
            : "bg-slate-100/70 text-slate-400 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-400"
        )}
        onClick={(e) => {
          e.stopPropagation()
          context.toggleShowMarkers()
        }}
        title={context.showMarkers ? "快捷关闭页面打点数字（仅看原型）" : "快捷开启页面打点数字"}
      >
        {context.showMarkers ? (
          <>
            <EyeIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[8px] font-extrabold leading-none text-blue-600 dark:text-blue-400">ON</span>
          </>
        ) : (
          <>
            <EyeOffIcon className="size-3.5 text-slate-400" />
            <span className="text-[8px] font-extrabold leading-none text-slate-400">OFF</span>
          </>
        )}
      </button>

      {/* 2. 【需求打点】按钮 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-blue-50/80 dark:hover:bg-blue-950/40 active:scale-95 focus-visible:outline-none dark:border-blue-900/50 group"
        onClick={() => context.openDrawerTab("annotations")}
        title="点击在页面展开【需求打点】清单"
      >
        <PinIcon className="size-3.5 text-blue-600 dark:text-blue-400 rotate-45 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-slate-800 dark:text-slate-100 leading-tight">
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
              : "bg-slate-400 dark:bg-slate-700 text-slate-100"
          )}
        >
          {context.annotations.length}
        </span>
      </button>

      {/* 3. 【字段清单】按钮 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 active:scale-95 focus-visible:outline-none dark:border-blue-900/50 group"
        onClick={() => context.openDrawerTab("fields")}
        title="点击直接在页面展开查看【字段清单】"
      >
        <FileSpreadsheetIcon className="size-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-emerald-700 dark:text-emerald-300 leading-tight">
          <span>字</span>
          <span>段</span>
          <span>清</span>
          <span>单</span>
        </div>
      </button>

      {/* 4. 【需求文档】按钮 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 border-b border-blue-100/70 py-2.5 transition-all hover:bg-sky-50/80 dark:hover:bg-sky-950/40 active:scale-95 focus-visible:outline-none dark:border-blue-900/50 group"
        onClick={() => context.openDrawerTab("prd")}
        title="点击直接在页面展开查看【PRD需求文档】"
      >
        <FileTextIcon className="size-3.5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-sky-700 dark:text-sky-300 leading-tight">
          <span>需</span>
          <span>求</span>
          <span>文</span>
          <span>档</span>
        </div>
      </button>

      {/* 5. 【业务规则规格】按钮 */}
      <button
        type="button"
        className="flex w-11 cursor-pointer flex-col items-center gap-1 py-2.5 transition-all hover:bg-orange-50/80 dark:hover:bg-orange-950/40 active:scale-95 focus-visible:outline-none group"
        onClick={() => context.openDrawerTab("rules")}
        title="点击直接在页面展开查看【业务规则规格】"
      >
        <WorkflowIcon className="size-3.5 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-center justify-center font-bold text-[10.5px] text-orange-700 dark:text-orange-300 leading-tight">
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
 * 2. 页面元素原位打点与就近原位弹出卡片
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
  const activeAnnotation = annotations.find(
    (annotation) => annotation.id === context.activePopupAnnotationId
  )

  return (
    <div
      data-prototype-target={targetId}
      className={cn(
        "relative transition-all duration-200",
        context.enabled &&
          context.showMarkers &&
          activeAnnotation &&
          "ring-1 ring-rose-400/80 shadow-[0_0_0_1px_rgba(244,63,94,0.25),0_0_10px_rgba(244,63,94,0.1)] bg-rose-500/[0.03] rounded-xl dark:ring-rose-400/70 dark:bg-rose-950/20",
        className
      )}
    >
      {children}

      {/* On-Page Red Markers (仅在 showMarkers 为 true 时渲染) */}
      {context.enabled && context.showMarkers && annotations.length > 0 && (
        <div
          className={cn(
            "absolute z-[60] flex items-center gap-1.5",
            markerPosition === "top-left" ? "top-1 left-1" : "top-1 right-1"
          )}
        >
          {annotations.map((annotation) => {
            const isPopupOpen = annotation.id === context.activePopupAnnotationId
            return (
              <button
                key={annotation.id}
                type="button"
                className={cn(
                  "flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg transition-all hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-95",
                  isPopupOpen
                    ? "bg-rose-600 ring-4 ring-rose-400/40 scale-110"
                    : "bg-rose-500 hover:bg-rose-600"
                )}
                title={`需求打点 #${annotation.number}：${annotation.title}（点击就近弹出查看）`}
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

      {/* 就近原位弹出卡片 (In-Place Floating Popup Card) */}
      {context.enabled && context.showMarkers && activeAnnotation && (
        <InPlaceAnnotationCard
          annotation={activeAnnotation}
          targetId={targetId}
          markerPosition={markerPosition}
          onClose={context.closeInPlacePopup}
        />
      )}
    </div>
  )
}

/**
 * 就近弹出卡片详情组件 (支持拖拽移动位置与右下角拉伸缩放宽高)
 */
function InPlaceAnnotationCard({
  annotation,
  targetId,
  markerPosition = "top-right",
  onClose,
}: {
  annotation: PrototypeAnnotation
  targetId?: string
  markerPosition?: "top-left" | "top-right"
  onClose: () => void
}) {
  const context = useAnnotationContext()
  const cardRef = useRef<HTMLDivElement>(null)

  // 1. 位置拖拽偏移状态
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const moveDragStart = useRef<
    | {
        pointerId: number
        clientX: number
        clientY: number
        origin: Point
      }
    | undefined
  >(undefined)

  // 2. 宽高尺寸调整状态
  const [cardSize, setCardSize] = useState<Size>({
    width: 520,
    height: 400,
  })
  const resizeDragStart = useRef<
    | {
        pointerId: number
        clientX: number
        clientY: number
        originSize: Size
        originOffset: Point
        handle: "right" | "left" | "bottom" | "bottom-right" | "bottom-left"
      }
    | undefined
  >(undefined)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // 头部位置拖拽处理器
  const onMovePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest("button")
    ) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    moveDragStart.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      origin: offset,
    }
  }

  const onMovePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = moveDragStart.current
    if (!start || start.pointerId !== event.pointerId) {
      return
    }
    setOffset({
      x: start.origin.x + event.clientX - start.clientX,
      y: start.origin.y + event.clientY - start.clientY,
    })
  }

  const onMovePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (moveDragStart.current?.pointerId !== event.pointerId) {
      return
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    moveDragStart.current = undefined
  }

  // 边缘拉伸处理器
  const startResize = (
    handle: "right" | "left" | "bottom" | "bottom-right" | "bottom-left",
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    event.stopPropagation()
    resizeDragStart.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      originSize: { ...cardSize },
      originOffset: { ...offset },
      handle,
    }
  }

  const onResizeMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = resizeDragStart.current
    if (!start || start.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - start.clientX
    const deltaY = event.clientY - start.clientY

    let nextWidth = start.originSize.width
    let nextHeight = start.originSize.height
    let nextOffsetX = start.originOffset.x

    const minW = 340
    const maxW = Math.max(340, window.innerWidth - 60)
    const minH = 240
    const maxH = Math.max(240, window.innerHeight - 80)

    // 水平方向拉伸
    if (start.handle === "right" || start.handle === "bottom-right") {
      if (markerPosition === "top-right") {
        nextWidth = Math.max(minW, Math.min(maxW, start.originSize.width + deltaX))
        const appliedDeltaX = nextWidth - start.originSize.width
        nextOffsetX = start.originOffset.x + appliedDeltaX
      } else {
        nextWidth = Math.max(minW, Math.min(maxW, start.originSize.width + deltaX))
      }
    } else if (start.handle === "left" || start.handle === "bottom-left") {
      if (markerPosition === "top-right") {
        nextWidth = Math.max(minW, Math.min(maxW, start.originSize.width - deltaX))
      } else {
        nextWidth = Math.max(minW, Math.min(maxW, start.originSize.width - deltaX))
        const appliedDeltaX = start.originSize.width - nextWidth
        nextOffsetX = start.originOffset.x + appliedDeltaX
      }
    }

    // 垂直方向拉伸
    if (
      start.handle === "bottom" ||
      start.handle === "bottom-right" ||
      start.handle === "bottom-left"
    ) {
      nextHeight = Math.max(minH, Math.min(maxH, start.originSize.height + deltaY))
    }

    setCardSize({ width: nextWidth, height: nextHeight })
    if (nextOffsetX !== offset.x) {
      setOffset((prev) => ({ ...prev, x: nextOffsetX }))
    }
  }

  const onResizeEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (resizeDragStart.current?.pointerId !== event.pointerId) {
      return
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resizeDragStart.current = undefined
  }

  const handleReset = () => {
    setOffset({ x: 0, y: 0 })
    setCardSize({ width: 520, height: 400 })
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute z-[65] flex flex-col rounded-2xl border-2 border-blue-400/80 bg-white/95 text-slate-900 shadow-[0_20px_50px_rgba(37,99,235,0.18)] backdrop-blur-2xl transition-[box-shadow] animate-in fade-in-50 zoom-in-95 text-left select-text dark:bg-slate-900/95 dark:text-slate-100 dark:border-blue-500/80",
        markerPosition === "top-left" ? "top-8 left-0" : "top-8 right-0"
      )}
      style={{
        width: `${cardSize.width}px`,
        height: `${cardSize.height}px`,
        maxWidth: "calc(100vw - 2rem)",
        maxHeight: "calc(100vh - 2rem)",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Card Header with Dragging for position */}
      <div
        className="flex cursor-move select-none items-start justify-between gap-3 border-b border-blue-100/90 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white/90 px-4 py-2.5 rounded-t-2xl dark:border-blue-900/50 dark:from-blue-950/50 dark:to-slate-900/80"
        title="按住标题栏可自由拖动卡片位置"
        onPointerDown={onMovePointerDown}
        onPointerMove={onMovePointerMove}
        onPointerUp={onMovePointerUp}
        onPointerCancel={onMovePointerUp}
      >
        <div className="flex items-center gap-2 min-w-0">
          <GripVerticalIcon className="size-3.5 text-blue-500/80 shrink-0" />
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-xs">
            {annotation.number}
          </span>
          <h3 className="font-semibold text-foreground text-xs truncate">
            {annotation.title}
          </h3>
        </div>

        <div
          className="flex items-center gap-1 shrink-0 cursor-default"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={() => context.openDrawerTab("annotations")}
            title="在右侧页面展开需求抽屉"
          >
            {context.drawerOpen ? (
              <PanelRightCloseIcon className="size-3" />
            ) : (
              <PanelRightOpenIcon className="size-3" />
            )}
            <span>侧边栏</span>
          </button>

          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={context.toggleShowMarkers}
            title={context.showMarkers ? "隐藏页面打点" : "显示页面打点"}
          >
            {context.showMarkers ? (
              <EyeOffIcon className="size-3.5" />
            ) : (
              <EyeIcon className="size-3.5" />
            )}
          </button>

          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={handleReset}
            title="重置卡片位置与宽高"
          >
            <RotateCcwIcon className="size-3.5" />
          </button>

          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 cursor-pointer"
            onClick={onClose}
            title="关闭卡片 (Esc)"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Tags / Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded border px-2 py-0.5 text-[11px] font-medium leading-none",
              kindStyles[annotation.kind]
            )}
          >
            {annotation.kind}
          </span>
          <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            v6.2.0
          </span>
          {targetId && (
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              #{targetId}
            </span>
          )}
        </div>

        {/* 快捷跳转文档按钮 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="text-[11px] text-emerald-600 hover:underline cursor-pointer flex items-center gap-0.5"
            onClick={() => context.openDrawerTab("fields")}
          >
            <FileSpreadsheetIcon className="size-3" />
            <span>查字段</span>
          </button>
          <span className="text-muted-foreground/40">|</span>
          <button
            type="button"
            className="text-[11px] text-sky-600 hover:underline cursor-pointer flex items-center gap-0.5"
            onClick={() => context.openDrawerTab("prd")}
          >
            <FileTextIcon className="size-3" />
            <span>读PRD</span>
          </button>
          <span className="text-muted-foreground/40">|</span>
          <button
            type="button"
            className="text-[11px] text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5"
            onClick={() => context.openDrawerTab("rules")}
          >
            <WorkflowIcon className="size-3" />
            <span>看规则</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-xs">
        <div className="rounded-xl border bg-muted/20 p-3 leading-relaxed text-foreground text-xs shadow-2xs">
          {annotation.content}
        </div>

        {annotation.details.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 border-b pb-1">
              <span className="size-1.5 rounded-full bg-blue-500 inline-block" />
              {group.title}
            </h4>
            <div className="grid gap-1.5 pl-1">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="rounded-lg border bg-card/60 p-2 text-xs leading-relaxed"
                >
                  <div className="font-medium text-foreground mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-muted-foreground text-[11.5px] leading-normal">
                    <AnnotationItemContent content={item.content} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Left Edge Handle */}
      <div
        className="group absolute top-0 bottom-0 left-0 w-2.5 cursor-ew-resize touch-none select-none z-20 flex justify-start"
        title="左右拖拽拉伸卡片宽度"
        onPointerDown={(e) => startResize("left", e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      >
        <div className="h-full w-1 transition-colors group-hover:bg-blue-500/50 group-active:bg-blue-500" />
      </div>

      {/* Right Edge Handle */}
      <div
        className="group absolute top-0 bottom-0 right-0 w-2.5 cursor-ew-resize touch-none select-none z-20 flex justify-end"
        title="左右拖拽拉伸卡片宽度"
        onPointerDown={(e) => startResize("right", e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      >
        <div className="h-full w-1 transition-colors group-hover:bg-blue-500/50 group-active:bg-blue-500" />
      </div>

      {/* Bottom Edge Handle */}
      <div
        className="group absolute bottom-0 left-0 right-0 h-2.5 cursor-ns-resize touch-none select-none z-20 flex items-end"
        title="上下拖拽拉伸卡片高度"
        onPointerDown={(e) => startResize("bottom", e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      >
        <div className="w-full h-1 transition-colors group-hover:bg-blue-500/50 group-active:bg-blue-500" />
      </div>

      {/* Bottom-Left Corner Handle (左下角自由拖动宽高) */}
      <div
        className="group absolute bottom-0 left-0 size-6 cursor-nesw-resize touch-none select-none flex items-end justify-start p-0.5 z-30"
        title="按住左下角自由拉伸卡片宽度与高度"
        onPointerDown={(e) => startResize("bottom-left", e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      >
        <div className="rounded-sm bg-muted-foreground/30 p-0.5 transition-colors group-hover:bg-blue-600 group-hover:text-white group-active:bg-blue-600 shadow-xs">
          <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 15L9 21M3 9L15 21M3 3L21 21" />
          </svg>
        </div>
      </div>

      {/* Bottom-Right Corner Handle (右下角自由拖动宽高) */}
      <div
        className="group absolute bottom-0 right-0 size-6 cursor-nwse-resize touch-none select-none flex items-end justify-end p-0.5 z-30"
        title="按住右下角自由拉伸卡片宽度与高度"
        onPointerDown={(e) => startResize("bottom-right", e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      >
        <div className="rounded-sm bg-muted-foreground/30 p-0.5 transition-colors group-hover:bg-blue-600 group-hover:text-white group-active:bg-blue-600 shadow-xs">
          <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 15L15 21M21 9L9 21M21 3L3 21" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/**
 * 3. 右侧全局需求与规格抽屉 (直接在页面展示【需求打点】【字段清单】【需求文档】【业务规则规格】)
 */
function AnnotationSidebarDrawer() {
  const context = useAnnotationContext()
  const [searchKeyword, setSearchKeyword] = useState("")

  // 根据当前上下文解析匹配各个专项文档
  const fieldsDoc = useMemo(
    () =>
      context.documents.find(
        (doc) => doc.id === "fields" || doc.title.includes("字段")
      ),
    [context.documents]
  )

  const prdDoc = useMemo(
    () =>
      context.documents.find(
        (doc) =>
          doc.id === "prd" ||
          doc.title.includes("PRD") ||
          doc.title.includes("需求")
      ),
    [context.documents]
  )

  const rulesDoc = useMemo(
    () =>
      context.documents.find(
        (doc) => doc.id === "rules" || doc.title.includes("规则")
      ),
    [context.documents]
  )

  const filteredAnnotations = useMemo(() => {
    return context.annotations.filter((item) => {
      const matchKind =
        context.filterKind === "全部" || item.kind === context.filterKind
      const matchKeyword =
        !searchKeyword.trim() ||
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.content.toLowerCase().includes(searchKeyword.toLowerCase())
      return matchKind && matchKeyword
    })
  }, [context.annotations, context.filterKind, searchKeyword])

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

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 bottom-0 z-[70] flex flex-col border-l border-border bg-background shadow-2xl transition-all duration-200 animate-in slide-in-from-right",
        context.isWideDrawer
          ? "w-[min(68rem,100vw)]"
          : "w-[min(46rem,100vw)]"
      )}
      aria-label="需求与文档规格侧边栏"
    >
      {/* 1. 顶部 Header 与 4 大分类选项卡 */}
      <div className="border-b bg-muted/30 px-4 py-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="font-bold text-sm text-foreground">
              需求与产品规格看板
            </h2>
            <span className="text-[11px] text-muted-foreground font-mono">
              v6.2.0
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              onClick={context.toggleWideDrawer}
              title={context.isWideDrawer ? "切换为紧凑宽度" : "切换为宽屏阅读模式"}
            >
              {context.isWideDrawer ? (
                <>
                  <Minimize2Icon className="size-3.5" />
                  <span className="text-[11px]">紧凑</span>
                </>
              ) : (
                <>
                  <Maximize2Icon className="size-3.5" />
                  <span className="text-[11px]">宽屏</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              onClick={() => context.setDrawerOpen(false)}
              title="收起侧边栏"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* 4 个并列的核心导航 Tab：【需求打点】【字段清单】【需求文档】【业务规则规格】 */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/60 p-1 border">
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer",
              context.activeDrawerTab === "annotations"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            )}
            onClick={() => context.setActiveDrawerTab("annotations")}
          >
            <PinIcon className="size-3.5 rotate-45 shrink-0" />
            <span className="truncate">需求打点</span>
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                context.activeDrawerTab === "annotations"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {context.annotations.length}
            </span>
          </button>

          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer",
              context.activeDrawerTab === "fields"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            )}
            onClick={() => context.setActiveDrawerTab("fields")}
          >
            <FileSpreadsheetIcon className="size-3.5 shrink-0" />
            <span className="truncate">字段清单</span>
          </button>

          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer",
              context.activeDrawerTab === "prd"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            )}
            onClick={() => context.setActiveDrawerTab("prd")}
          >
            <FileTextIcon className="size-3.5 shrink-0" />
            <span className="truncate">需求文档</span>
          </button>

          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer",
              context.activeDrawerTab === "rules"
                ? "bg-orange-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            )}
            onClick={() => context.setActiveDrawerTab("rules")}
          >
            <WorkflowIcon className="size-3.5 shrink-0" />
            <span className="truncate">业务规则规格</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 内容展示区 */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Tab 1: 【需求打点】列表 */}
        {context.activeDrawerTab === "annotations" && (
          <div className="flex flex-col h-full">
            {/* Version & Marker Toggle Row */}
            <div className="border-b bg-muted/10 px-4 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                <span>📍 原型打点项 ({context.annotations.length} 项)</span>
              </div>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all shadow-xs cursor-pointer",
                  context.showMarkers
                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={context.toggleShowMarkers}
                title={context.showMarkers ? "点击隐藏页面上的打点数字" : "点击显示页面上的打点数字"}
              >
                {context.showMarkers ? (
                  <>
                    <EyeIcon className="size-3.5" />
                    <span>打点：显示中</span>
                  </>
                ) : (
                  <>
                    <EyeOffIcon className="size-3.5" />
                    <span>打点：已隐藏</span>
                  </>
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="border-b px-4 py-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="模糊搜索打点标题或内容..."
                  className="h-8 w-full rounded-lg border bg-muted/30 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none"
                />
              </div>
            </div>

            {/* Filter Tabs & Collapse All */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto border-b bg-background px-3 py-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <ListFilterIcon className="mr-1 size-3.5 shrink-0 text-muted-foreground" />
                {kindOptions.map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-xs transition-colors cursor-pointer",
                      context.filterKind === kind
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => context.setFilterKind(kind)}
                  >
                    {kind}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={isAllCollapsed ? expandAll : collapseAll}
                className="flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {isAllCollapsed ? (
                  <>
                    <ChevronDownIcon className="size-3" />
                    <span>全部展开</span>
                  </>
                ) : (
                  <>
                    <ChevronUpIcon className="size-3" />
                    <span>全部折叠</span>
                  </>
                )}
              </button>
            </div>

            {/* Demand Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAnnotations.map((annotation) => {
                const isTargetActive =
                  annotation.id === context.activePopupAnnotationId
                const isCollapsed = Boolean(collapsedMap[annotation.id])

                return (
                  <div
                    key={annotation.id}
                    className={cn(
                      "rounded-xl border p-3.5 space-y-2.5 transition-all hover:border-primary/50 hover:shadow-sm",
                      isTargetActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-card"
                    )}
                  >
                    {/* 卡片头部：左侧序号+标题+类型，右侧折叠按钮 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm">
                          {annotation.number}
                        </span>
                        <h3 className="font-semibold text-xs text-foreground leading-snug">
                          {annotation.title}
                        </h3>
                        <span
                          className={cn(
                            "rounded border px-1.5 py-0.2 text-[10px] leading-none",
                            kindStyles[annotation.kind]
                          )}
                        >
                          {annotation.kind}
                        </span>
                      </div>

                      {/* 折叠/展开按钮 */}
                      <button
                        type="button"
                        onClick={() => toggleCollapse(annotation.id)}
                        className="flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0 cursor-pointer"
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

                    {/* 折叠时隐藏以下内容 */}
                    {!isCollapsed && (
                      <>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {annotation.content}
                        </p>

                        {/* Group Details */}
                        {annotation.details.length > 0 && (
                          <div className="grid gap-1.5 border-t pt-2">
                            {annotation.details.map((group, gIdx) => (
                              <div key={gIdx} className="space-y-1">
                                <div className="text-[11px] font-semibold text-foreground/90">
                                  {group.title}
                                </div>
                                <div className="grid gap-1">
                                  {group.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="rounded bg-muted/40 px-2 py-1 text-[11px]"
                                    >
                                      <span className="font-medium text-foreground mr-1.5">
                                        {item.label}:
                                      </span>
                                      {isMermaidCode(item.content) ? (
                                        <div className="mt-2 text-muted-foreground">
                                          <AnnotationItemContent content={item.content} />
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          {item.content}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Bottom Action Row with [🎯 定位] */}
                        <div className="flex items-center justify-between border-t pt-2 text-xs">
                          <span className="text-[11px] text-muted-foreground font-mono">
                            #{annotation.targetId ?? annotation.id}
                          </span>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-xs transition-colors hover:bg-primary hover:text-white active:scale-95 cursor-pointer"
                            onClick={() => context.locateAndOpenPopup(annotation.id)}
                            title="页面滚动并就近弹出打点详情卡片"
                          >
                            <CompassIcon className="size-3.5" />
                            <span>🎯 页面定位</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}

              {filteredAnnotations.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  未找到匹配的需求打点条目
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 【字段清单】直接在页面展示 */}
        {context.activeDrawerTab === "fields" && (
          <DocumentContentRenderer
            doc={fieldsDoc}
            fallbackTitle="字段清单"
            badge="数据模型与字段规范"
            badgeColor="text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
          />
        )}

        {/* Tab 3: 【需求文档】直接在页面展示 */}
        {context.activeDrawerTab === "prd" && (
          <DocumentContentRenderer
            doc={prdDoc}
            fallbackTitle="PRD需求文档"
            badge="产品需求规格说明书"
            badgeColor="text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50"
          />
        )}

        {/* Tab 4: 【业务规则规格】直接在页面展示 */}
        {context.activeDrawerTab === "rules" && (
          <DocumentContentRenderer
            doc={rulesDoc}
            fallbackTitle="业务规则规格"
            badge="状态机与风控业务规则"
            badgeColor="text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50"
          />
        )}
      </div>
    </aside>
  )
}

/**
 * 4. 专项文档内容直接渲染器（支持 Markdown、Mermaid 流程图、表格与一键复制）
 */
function DocumentContentRenderer({
  doc,
  fallbackTitle,
  badge,
  badgeColor,
}: {
  doc?: PrototypeDocument
  fallbackTitle: string
  badge: string
  badgeColor: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (doc?.content) {
      navigator.clipboard.writeText(doc.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-3">
        <DatabaseIcon className="size-10 text-muted-foreground/40" />
        <div className="font-semibold text-sm text-foreground">
          暂未挂载「{fallbackTitle}」文件
        </div>
        <p className="text-xs max-w-sm">
          当前模块未配置独立的文档文件，请查阅 PRD 或联系产品经理补充挂载。
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-4">
      {/* Document Subheader */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="space-y-1">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", badgeColor)}>
            <LayersIcon className="size-3" />
            <span>{badge}</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {doc.title}
          </h1>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          onClick={handleCopy}
          title="复制完整的 Markdown 文档源码"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">已复制 Markdown</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>复制 Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Markdown Document Content with Full Styling */}
      <article className="prose prose-slate max-w-none text-xs leading-relaxed dark:prose-invert">
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
                  className={`rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground ${className ?? ""}`}
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
                <div className="my-4 overflow-x-auto rounded-lg border shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    {children}
                  </table>
                </div>
              )
            },
            thead({ children }) {
              return <thead className="bg-muted/70 border-b">{children}</thead>
            },
            th({ children }) {
              return <th className="p-2.5 font-semibold text-foreground text-xs">{children}</th>
            },
            td({ children }) {
              return <td className="p-2.5 border-b text-muted-foreground text-xs leading-normal">{children}</td>
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-3 border-l-4 border-primary/40 bg-muted/20 py-2 px-4 italic text-muted-foreground rounded-r-lg">
                  {children}
                </blockquote>
              )
            },
            h1({ children }) {
              return <h1 className="mt-5 mb-2.5 text-base font-bold text-foreground border-b pb-1.5">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="mt-4 mb-2 text-sm font-semibold text-foreground">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="mt-3.5 mb-1.5 text-xs font-semibold text-foreground">{children}</h3>
            },
            ul({ children }) {
              return <ul className="my-2 list-disc pl-5 space-y-1 text-muted-foreground">{children}</ul>
            },
            ol({ children }) {
              return <ol className="my-2 list-decimal pl-5 space-y-1 text-muted-foreground">{children}</ol>
            },
            li({ children }) {
              return <li className="leading-5">{children}</li>
            },
            p({ children }) {
              return <p className="my-2 text-muted-foreground leading-5">{children}</p>
            },
            hr() {
              return <hr className="my-4 border-border" />
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

function useAnnotationContext() {
  const context = useContext(AnnotationContext)
  if (!context) {
    throw new Error(
      "PrototypeAnnotationTarget must be used inside PrototypeAnnotationProvider"
    )
  }
  return context
}
