import { createContext, useContext } from "react"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  countSubtree,
  getCheckState,
  type CheckState,
  type MenuNode,
} from "../lib/permission-tree"

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"

type CollapseApi = {
  collapsed: Set<string>
  toggle: (id: string) => void
}

const CollapseContext = createContext<CollapseApi>({ collapsed: new Set(), toggle: () => {} })

function CollapseToggle({ node }: { node: MenuNode }) {
  const { collapsed, toggle } = useContext(CollapseContext)
  const isCollapsed = collapsed.has(node.id)

  return (
    <button
      type="button"
      aria-label={isCollapsed ? `展开${node.name}` : `收起${node.name}`}
      aria-expanded={!isCollapsed}
      onClick={(event) => {
        event.stopPropagation()
        toggle(node.id)
      }}
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        FOCUS_RING,
      )}
    >
      {isCollapsed ? (
        <ChevronRightIcon className="size-3.5" />
      ) : (
        <ChevronDownIcon className="size-3.5" />
      )}
    </button>
  )
}

function DisabledBadge({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <span className="shrink-0 rounded border border-dashed border-slate-300 px-1 py-px text-[9px] text-slate-400">
      已停用
    </span>
  )
}

function glyphClass(state: CheckState) {
  return cn(
    "inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
    state === "checked" || state === "indeterminate"
      ? "border-primary bg-primary text-primary-foreground"
      : state === "disabled"
        ? "border-slate-200 bg-slate-100"
        : "border-slate-300 bg-white",
  )
}

export function CheckGlyph({ state }: { state: CheckState }) {
  return (
    <span aria-hidden className={glyphClass(state)}>
      {state === "checked" && <CheckIcon className="size-2.5" strokeWidth={3.2} />}
      {state === "indeterminate" && <MinusIcon className="size-2.5" strokeWidth={3.2} />}
    </span>
  )
}

type ToggleProps = {
  node: MenuNode
  state: CheckState
  onToggle: (node: MenuNode, next: boolean) => void
  className?: string
  children?: React.ReactNode
}

/** 独立勾选框（用于分组标题），点击后切换本节点及其全部下级 */
export function ToggleCheckbox({ node, state, onToggle, className, children }: ToggleProps) {
  const disabled = state === "disabled"

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onToggle(node, state !== "checked")
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded text-left",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        FOCUS_RING,
        className,
      )}
    >
      <CheckGlyph state={state} />
      {children}
    </button>
  )
}

/** 平铺胶囊：整块可点，勾选框只是视觉元素 */
export function PermissionChip({
  node,
  state,
  onToggle,
}: {
  node: MenuNode
  state: CheckState
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  const disabled = state === "disabled"

  return (
    <span
      role="checkbox"
      aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onToggle(node, state !== "checked")
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onToggle(node, state !== "checked")
        }
      }}
      title={`${node.name}${node.enabled ? "" : "（已停用）"}`}
      className={cn(
        "inline-flex max-w-full select-none items-center gap-1 rounded-md border px-1.5 py-[3px] text-[11px] leading-snug transition-colors",
        FOCUS_RING,
        state === "checked" && "border-primary/50 bg-primary/[0.06] text-foreground",
        state === "indeterminate" && "border-primary/40 bg-primary/[0.04] text-foreground",
        state === "unchecked" && "border-border/80 bg-background text-foreground hover:border-primary/40 hover:bg-primary/[0.02]",
        disabled && "cursor-not-allowed border-dashed border-slate-200 bg-slate-50/80 text-slate-400",
      )}
    >
      <CheckGlyph state={state} />
      <span className="min-w-0">{node.name}</span>
      {disabled && <span className="shrink-0 text-[9px] text-slate-400">停用</span>}
    </span>
  )
}

function InlineNode({
  node,
  granted,
  onToggle,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  const state = getCheckState(node, granted)
  const isCollapsed = useContext(CollapseContext).collapsed.has(node.id)

  if (node.children.length === 0) {
    return <PermissionChip node={node} state={state} onToggle={onToggle} />
  }

  return (
    <span
      className={cn(
        "flex w-full flex-col gap-1 rounded-md border px-1.5 py-1",
        state === "disabled"
          ? "border-dashed border-slate-200 bg-slate-50/60"
          : "border-primary/30 bg-primary/[0.035]",
      )}
    >
      <span className="flex flex-wrap items-center gap-1.5">
        <CollapseToggle node={node} />
        <ToggleCheckbox node={node} state={state} onToggle={onToggle}>
          <span
            className={cn(
              "text-[11px] font-semibold",
              state === "disabled" ? "text-slate-400" : "text-foreground",
            )}
          >
            {node.name}
          </span>
        </ToggleCheckbox>
        <DisabledBadge show={!node.enabled} />
        <span
          className={cn(
            "rounded-full px-1.5 py-px text-[9.5px]",
            state === "disabled"
              ? "bg-slate-100 text-slate-400"
              : "bg-primary/10 text-primary",
          )}
        >
          含 {node.children.length} 项子操作
        </span>
      </span>
      {!isCollapsed && (
        <span className="ml-2 flex flex-wrap items-center gap-1 border-l-2 border-primary/25 pl-2">
          {node.children.map((child) => (
            <InlineNode
              key={child.id}
              node={child}
              granted={granted}
              onToggle={onToggle}
            />
          ))}
        </span>
      )}
    </span>
  )
}

function GroupActions({
  node,
  onToggle,
}: {
  node: MenuNode
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggle(node, true)
        }}
        className="rounded px-1.5 py-0.5 text-[10px] text-primary transition-colors hover:bg-primary/10"
      >
        全选
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggle(node, false)
        }}
        className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted"
      >
        清空
      </button>
    </span>
  )
}

function ActionGroupCard({
  node,
  granted,
  onToggle,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  const state = getCheckState(node, granted)
  const { selected, total } = countSubtree(node.children, granted)
  const isCollapsed = useContext(CollapseContext).collapsed.has(node.id)

  return (
    <div
      className={cn(
        "rounded-md border",
        state === "disabled" ? "border-dashed border-slate-200 bg-slate-50/40" : "border-border/70 bg-muted/[0.12]",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 px-2 py-1">
        <CollapseToggle node={node} />
        <ToggleCheckbox node={node} state={state} onToggle={onToggle}>
          <span
            className={cn(
              "text-[11.5px] font-medium",
              state === "disabled" ? "text-slate-400" : "text-foreground",
            )}
          >
            {node.name}
          </span>
        </ToggleCheckbox>
        <DisabledBadge show={!node.enabled} />
        <span className="text-[10px] text-muted-foreground">
          {selected}/{total}
        </span>
        {node.enabled && <GroupActions node={node} onToggle={onToggle} />}
      </div>
      {!isCollapsed && (
        <div className="flex flex-wrap gap-x-2 gap-y-1.5 px-2 py-1.5">
          {node.children.map((child) => (
            <InlineNode
              key={child.id}
              node={child}
              granted={granted}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MenuCard({
  node,
  granted,
  onToggle,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  const state = getCheckState(node, granted)
  const { selected, total } = countSubtree(node.children, granted)
  const isCollapsed = useContext(CollapseContext).collapsed.has(node.id)
  const hasChildren = node.children.length > 0
  const leafChildren = node.children.filter((child) => child.children.length === 0)
  const groupChildren = node.children.filter((child) => child.children.length > 0)

  return (
    <div className="rounded-md border border-border/80 bg-card">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 px-2.5 py-1.5",
          hasChildren && "border-b border-border/60",
          "bg-slate-50/70",
        )}
      >
        {hasChildren ? <CollapseToggle node={node} /> : <span className="size-5 shrink-0" />}
        <ToggleCheckbox node={node} state={state} onToggle={onToggle}>
          <span
            className={cn(
              "text-[12px] font-semibold",
              state === "disabled" ? "text-slate-400" : "text-foreground",
            )}
          >
            {node.name}
          </span>
        </ToggleCheckbox>
        <DisabledBadge show={!node.enabled} />
        {hasChildren ? (
          <>
            <span className="text-[10px] text-muted-foreground">
              {selected}/{total}
            </span>
            {node.enabled && <GroupActions node={node} onToggle={onToggle} />}
          </>
        ) : (
          <span className="text-[10px] text-muted-foreground">无下级操作</span>
        )}
      </div>
      {hasChildren && !isCollapsed && (
        <div className="space-y-1.5 px-2.5 py-2">
          {leafChildren.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1.5">
              {leafChildren.map((child) => (
                <PermissionChip
                  key={child.id}
                  node={child}
                  state={getCheckState(child, granted)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          )}
          {groupChildren.map((child) =>
            child.level === "菜单" ? (
              <MenuCard
                key={child.id}
                node={child}
                granted={granted}
                onToggle={onToggle}
              />
            ) : (
              <ActionGroupCard
                key={child.id}
                node={child}
                granted={granted}
                onToggle={onToggle}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}

function SectionShell({
  node,
  granted,
  onToggle,
  depth,
  children,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
  depth: number
  children: React.ReactNode
}) {
  const state = getCheckState(node, granted)
  const { selected, total } = countSubtree(node.children, granted)
  const isCollapsed = useContext(CollapseContext).collapsed.has(node.id)

  return (
    <section
      className={cn(
        "rounded-lg border",
        depth === 0 ? "border-border/80" : "border-border/60",
        state === "disabled" ? "border-dashed border-slate-200 bg-slate-50/30" : "bg-card",
      )}
    >
      <header
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-t-lg border-b px-3 py-1.5",
          depth === 0 ? "border-border/70 bg-muted/30" : "border-border/50 bg-muted/15",
        )}
      >
        <CollapseToggle node={node} />
        <ToggleCheckbox node={node} state={state} onToggle={onToggle}>
          <span
            className={cn(
              depth === 0 ? "text-[12.5px] font-semibold" : "text-[12px] font-medium",
              state === "disabled" ? "text-slate-400" : "text-foreground",
            )}
          >
            {node.name}
          </span>
        </ToggleCheckbox>
        <DisabledBadge show={!node.enabled} />
        <span className="text-[10px] text-muted-foreground">
          {selected}/{total}
        </span>
        {node.enabled && <GroupActions node={node} onToggle={onToggle} />}
      </header>
      {!isCollapsed && <div className="space-y-2 px-2.5 py-2">{children}</div>}
    </section>
  )
}

function NodeChildren({
  node,
  granted,
  onToggle,
  depth,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
  depth: number
}) {
  const blocks: React.ReactNode[] = []
  let leafBuffer: MenuNode[] = []

  const flushLeaves = () => {
    if (leafBuffer.length === 0) return

    // 模块层的叶子节点（如「外链平台」「数据走势」）与「审批中心」「数据一览」同级，
    // 用整行小卡片呈现，避免被误读成上一张卡片的下级。
    if (node.level === "模块") {
      for (const leaf of leafBuffer) {
        blocks.push(
          <div
            key={leaf.id}
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5"
          >
            <ToggleCheckbox
              node={leaf}
              state={getCheckState(leaf, granted)}
              onToggle={onToggle}
            >
              <span className="text-[12px] font-medium text-foreground">{leaf.name}</span>
            </ToggleCheckbox>
            <span className="text-[10px] text-muted-foreground">无下级操作</span>
          </div>,
        )
      }
      leafBuffer = []
      return
    }

    blocks.push(
      <div key={`leaves-${leafBuffer[0].id}`} className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span
          className="shrink-0 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
          title="直接挂在本层、没有再往下分组的操作权限"
        >
          本层直属操作 · {leafBuffer.length} 项
        </span>
        {leafBuffer.map((child) => (
          <PermissionChip
            key={child.id}
            node={child}
            state={getCheckState(child, granted)}
            onToggle={onToggle}
          />
        ))}
      </div>,
    )
    leafBuffer = []
  }

  for (const child of node.children) {
    if (child.level === "菜单") {
      flushLeaves()
      blocks.push(<MenuCard key={child.id} node={child} granted={granted} onToggle={onToggle} />)
      continue
    }
    if (child.children.length > 0) {
      flushLeaves()
      blocks.push(
        <SectionShell
          key={child.id}
          node={child}
          granted={granted}
          onToggle={onToggle}
          depth={depth + 1}
        >
          <NodeChildren
            node={child}
            granted={granted}
            onToggle={onToggle}
            depth={depth + 1}
          />
        </SectionShell>,
      )
      continue
    }
    leafBuffer.push(child)
  }
  flushLeaves()

  if (blocks.length === 0) {
    return (
      <div className="px-2 py-2 text-[11px] text-muted-foreground">
        下级权限均已停用，打开顶部「显示已停用」可查看。
      </div>
    )
  }

  return <>{blocks}</>
}

export function ModulePanel({
  module,
  granted,
  onToggle,
  collapsed,
  onToggleCollapse,
}: {
  module: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
  collapsed: Set<string>
  onToggleCollapse: (id: string) => void
}) {
  return (
    <CollapseContext.Provider value={{ collapsed, toggle: onToggleCollapse }}>
      {module.level === "菜单" ? (
        <MenuCard node={module} granted={granted} onToggle={onToggle} />
      ) : (
        <SectionShell node={module} granted={granted} onToggle={onToggle} depth={0}>
          {module.children.length === 0 ? (
            <div className="px-3 py-6 text-center text-[11px] text-muted-foreground">
              该模块在现网权限库里没有下级权限。
            </div>
          ) : (
            <NodeChildren node={module} granted={granted} onToggle={onToggle} depth={0} />
          )}
        </SectionShell>
      )}
    </CollapseContext.Provider>
  )
}
