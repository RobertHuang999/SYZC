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

const TREE_LINE = "bg-slate-400/50"

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

/** 一层树线：竖线 + 拐角，最后一个子项竖线在拐角处收住 */
function TreeBranch({ isLast, children }: { isLast: boolean; children: React.ReactNode }) {
  return (
    <div className="relative pl-5">
      <span
        aria-hidden
        className={cn("absolute left-2 top-0 w-px", TREE_LINE, isLast ? "h-[15px]" : "h-full")}
      />
      <span aria-hidden className={cn("absolute left-2 top-[15px] h-px w-[10px]", TREE_LINE)} />
      {children}
    </div>
  )
}

function NodeRow({
  node,
  granted,
  onToggle,
  isRoot = false,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
  isRoot?: boolean
}) {
  const state = getCheckState(node, granted)
  const { selected, total } = countSubtree(node.children, granted)
  const hasChildren = node.children.length > 0

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md px-2 transition-colors hover:bg-muted/40",
        isRoot ? "py-1.5" : "py-1",
      )}
    >
      {hasChildren ? <CollapseToggle node={node} /> : <span className="size-5 shrink-0" />}
      <ToggleCheckbox node={node} state={state} onToggle={onToggle}>
        <span
          className={cn(
            isRoot ? "text-[13px] font-semibold" : "text-[12px] font-medium",
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
  )
}

function DirectOperations({
  nodes,
  granted,
  onToggle,
}: {
  nodes: MenuNode[]
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  return (
    <div className="rounded-md bg-muted/20 px-2 py-1.5">
      <div className="mb-1 text-[10px] text-muted-foreground">
        直属操作 · {nodes.length} 项
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {nodes.map((child) => (
          <PermissionChip
            key={child.id}
            node={child}
            state={getCheckState(child, granted)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

type BranchItem =
  | { kind: "node"; node: MenuNode }
  | { kind: "chips"; nodes: MenuNode[] }

function buildBranchItems(node: MenuNode): BranchItem[] {
  const isDirectLeaf = (child: MenuNode) =>
    child.level !== "菜单" && child.children.length === 0
  const directLeaves = node.children.filter(isDirectLeaf)
  const others = node.children.filter((child) => !isDirectLeaf(child))
  const items: BranchItem[] = []

  if (directLeaves.length > 0) {
    // 模块层的叶子（如外链平台、数据走势）本身就是导航项，单独成行；
    // 其他层级的直属操作合并成一组胶囊，避免每条都占一行。
    if (node.level === "模块") {
      for (const leaf of directLeaves) items.push({ kind: "node", node: leaf })
    } else {
      items.push({ kind: "chips", nodes: directLeaves })
    }
  }

  for (const child of others) items.push({ kind: "node", node: child })
  return items
}

function NodeBody({
  node,
  granted,
  onToggle,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
}) {
  const items = buildBranchItems(node)

  if (items.length === 0) {
    return (
      <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
        下级权限均已停用，打开顶部「显示已停用」可查看。
      </div>
    )
  }

  return (
    <div>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <TreeBranch
            key={item.kind === "node" ? item.node.id : `chips-${item.nodes[0].id}`}
            isLast={isLast}
          >
            {item.kind === "chips" ? (
              <DirectOperations nodes={item.nodes} granted={granted} onToggle={onToggle} />
            ) : (
              <TreeNode node={item.node} granted={granted} onToggle={onToggle} />
            )}
          </TreeBranch>
        )
      })}
    </div>
  )
}

function TreeNode({
  node,
  granted,
  onToggle,
  isRoot = false,
}: {
  node: MenuNode
  granted: Set<string>
  onToggle: (node: MenuNode, next: boolean) => void
  isRoot?: boolean
}) {
  const { collapsed } = useContext(CollapseContext)
  const hasChildren = node.children.length > 0
  const expanded = hasChildren && !collapsed.has(node.id)

  return (
    <div>
      <NodeRow node={node} granted={granted} onToggle={onToggle} isRoot={isRoot} />
      {expanded && <NodeBody node={node} granted={granted} onToggle={onToggle} />}
    </div>
  )
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
      <div className="rounded-lg border border-border/70 bg-card px-2 py-1.5">
        {module.children.length === 0 ? (
          <>
            <NodeRow node={module} granted={granted} onToggle={onToggle} isRoot />
            <div className="px-2 py-3 text-center text-[11px] text-muted-foreground">
              该模块在现网权限库里没有下级权限。
            </div>
          </>
        ) : (
          <TreeNode node={module} granted={granted} onToggle={onToggle} isRoot />
        )}
      </div>
    </CollapseContext.Provider>
  )
}
