import {
  menuPermissionChannels,
  menuPermissionRecords,
  type MenuPermissionChannel,
  type MenuPermissionRecord,
} from "../data/menu-permissions.generated"

export type MenuNode = MenuPermissionRecord & {
  children: MenuNode[]
  /** 原库里上级缺失时，页面自动归拢出来的虚拟分组，不计入权限统计 */
  synthetic?: boolean
}

export type ChannelTree = {
  channel: MenuPermissionChannel
  roots: MenuNode[]
  modules: MenuNode[]
  byId: Map<string, MenuNode>
  parentOf: Map<string, MenuNode | null>
  enabledIds: string[]
}

const ORPHAN_GROUP_NAME = "未挂载上级的权限"

function buildChannelTree(channel: MenuPermissionChannel): ChannelTree {
  const channelRecords = menuPermissionRecords.filter((record) => record.channelId === channel.id)
  const byId = new Map<string, MenuNode>()
  for (const record of channelRecords) {
    byId.set(record.id, { ...record, children: [] })
  }

  const roots: MenuNode[] = []
  const orphans: MenuNode[] = []
  const parentOf = new Map<string, MenuNode | null>()

  for (const node of byId.values()) {
    if (node.parentId === "-1") {
      roots.push(node)
      parentOf.set(node.id, null)
      continue
    }
    const parent = byId.get(node.parentId)
    if (parent) {
      parent.children.push(node)
      parentOf.set(node.id, parent)
    } else {
      orphans.push(node)
      parentOf.set(node.id, null)
    }
  }

  if (orphans.length > 0) {
    const group: MenuNode = {
      id: `__orphan__${channel.id}`,
      parentId: "-1",
      channelId: channel.id,
      name: ORPHAN_GROUP_NAME,
      code: "",
      level: "目录",
      mode: "-",
      clientUri: "",
      serverUri: "",
      enabled: true,
      sort: Number.MAX_SAFE_INTEGER,
      children: orphans,
      synthetic: true,
    }
    roots.push(group)
    byId.set(group.id, group)
    for (const orphan of orphans) parentOf.set(orphan.id, group)
  }

  const enabledIds: string[] = []
  for (const node of byId.values()) {
    if (node.enabled && !node.synthetic) enabledIds.push(node.id)
  }

  const moduleRoots = roots.filter((node) => node.level === "模块")
  // 平台端 / 个人门户没有「模块」这一层，根节点本身就是目录或菜单，
  // 直接把根节点当作左侧导航项，否则整条渠道会显示为空。
  const modules =
    moduleRoots.length > 0
      ? [...moduleRoots, ...roots.filter((node) => node.synthetic)]
      : roots

  return {
    channel,
    roots,
    modules,
    byId,
    parentOf,
    enabledIds,
  }
}

export const channelTrees: ChannelTree[] = menuPermissionChannels.map(buildChannelTree)

export const channelTreeById = new Map(channelTrees.map((tree) => [tree.channel.id, tree]))

export function getChannelTree(channelId: string): ChannelTree {
  return channelTreeById.get(channelId) ?? channelTrees[0]
}

export function collectDescendantIds(node: MenuNode, acc: string[] = []): string[] {
  for (const child of node.children) {
    acc.push(child.id)
    collectDescendantIds(child, acc)
  }
  return acc
}

export function collectAncestorNodes(tree: ChannelTree, nodeId: string): MenuNode[] {
  const result: MenuNode[] = []
  let current = tree.parentOf.get(nodeId) ?? null
  while (current) {
    result.unshift(current)
    current = tree.parentOf.get(current.id) ?? null
  }
  return result
}

export function getNodePath(tree: ChannelTree, nodeId: string): string[] {
  const node = tree.byId.get(nodeId)
  if (!node) return []
  return [...collectAncestorNodes(tree, nodeId), node].map((item) => item.name)
}

export function getNodePathLabel(tree: ChannelTree, node: MenuNode): string {
  const ancestors = collectAncestorNodes(tree, node.id)
    .filter((item) => !item.synthetic)
    .map((item) => item.name)
  return [...ancestors, node.name].join(" / ")
}

export type CheckState = "checked" | "indeterminate" | "unchecked" | "disabled"

export function getCheckState(node: MenuNode, granted: Set<string>): CheckState {
  if (!node.enabled) return "disabled"
  if (!granted.has(node.id)) return "unchecked"
  const enabledChildren = node.children.filter((child) => child.enabled)
  if (enabledChildren.length > 0 && enabledChildren.some((child) => !granted.has(child.id))) {
    return "indeterminate"
  }
  return "checked"
}

export function toggleNode(
  tree: ChannelTree,
  granted: Set<string>,
  node: MenuNode,
  next: boolean,
): Set<string> {
  if (!node.enabled) return granted
  const result = new Set(granted)

  if (next) {
    result.add(node.id)
    for (const id of collectDescendantIds(node)) {
      const child = tree.byId.get(id)
      if (child?.enabled) result.add(id)
    }
    for (const ancestor of collectAncestorNodes(tree, node.id)) {
      if (ancestor.enabled) result.add(ancestor.id)
    }
  } else {
    result.delete(node.id)
    for (const id of collectDescendantIds(node)) result.delete(id)
  }

  return result
}

export function countSubtree(nodes: MenuNode[], granted: Set<string>) {
  let total = 0
  let selected = 0

  const walk = (node: MenuNode) => {
    if (!node.synthetic && node.enabled) {
      total += 1
      if (granted.has(node.id)) selected += 1
    }
    for (const child of node.children) walk(child)
  }

  for (const node of nodes) walk(node)
  return { total, selected }
}

/** 统计某渠道下已勾选的菜单页面数、操作权限数与总权限数 */
export function summarizeChannel(tree: ChannelTree, granted: Set<string>) {
  let menus = 0
  let actions = 0
  let enabledTotal = 0

  for (const node of tree.byId.values()) {
    if (node.synthetic || !node.enabled) continue
    enabledTotal += 1
    if (!granted.has(node.id)) continue
    if (node.level === "菜单") menus += 1
    if (node.level === "按钮") actions += 1
  }

  return { menus, actions, enabledTotal }
}

export function diffGranted(left: Set<string>, right: Set<string>) {
  let count = 0
  for (const id of left) if (!right.has(id)) count += 1
  for (const id of right) if (!left.has(id)) count += 1
  return count
}

function matchesPrefix(code: string, prefix: string) {
  return code === prefix || code.startsWith(`${prefix}:`)
}

/**
 * 按「权限编码前缀」生成角色的默认授权：
 * 命中前缀的节点连同其全部下级、全部上级一起勾上，
 * 这样编码不规则的老数据（如 审批中心 下挂 rwzx:*）也能完整覆盖。
 */
export function buildPresetGrants(prefixes: string[]): Set<string> {
  const granted = new Set<string>()
  if (prefixes.length === 0) return granted

  for (const tree of channelTrees) {
    for (const node of tree.byId.values()) {
      if (node.synthetic || !node.enabled) continue
      if (!prefixes.some((prefix) => matchesPrefix(node.code, prefix))) continue

      granted.add(node.id)
      for (const id of collectDescendantIds(node)) {
        const child = tree.byId.get(id)
        if (child?.enabled) granted.add(id)
      }
      for (const ancestor of collectAncestorNodes(tree, node.id)) {
        if (ancestor.enabled) granted.add(ancestor.id)
      }
    }
  }

  return granted
}

function visibleNodes(nodes: MenuNode[], showDisabled: boolean): MenuNode[] {
  const result: MenuNode[] = []
  for (const node of nodes) {
    const children = visibleNodes(node.children, showDisabled)
    // 停用的节点只有在整枝都无可显示内容时才隐藏；
    // 原库里存在「停用父级下挂着启用子项」（如监管业务、监管报告），
    // 这类父级必须保留，否则下级会被提上来、层级就串了。
    if (!showDisabled && !node.enabled && children.length === 0) continue
    result.push({ ...node, children })
  }
  return result
}

export function filterVisibleTree(node: MenuNode, showDisabled: boolean): MenuNode {
  return { ...node, children: visibleNodes(node.children, showDisabled) }
}

export function nodeMatchesKeyword(node: MenuNode, keyword: string) {
  const haystack = [node.name, node.code, node.clientUri, node.serverUri].join(" ").toLowerCase()
  return haystack.includes(keyword)
}
