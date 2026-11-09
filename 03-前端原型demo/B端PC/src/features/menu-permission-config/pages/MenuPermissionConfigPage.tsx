import { useMemo, useState } from "react"
import {
  CheckIcon,
  InfoIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SystemReferenceSubNav } from "@/features/permission-reference/components/SystemReferenceSubNav"
import { cn } from "@/lib/utils"
import { menuPermissionChannels } from "../data/menu-permissions.generated"
import { defaultRoleId, demoRoles } from "../data/demo-roles"
import {
  buildPresetGrants,
  countSubtree,
  diffGranted,
  filterVisibleTree,
  getCheckState,
  getChannelTree,
  getNodePathLabel,
  nodeMatchesKeyword,
  summarizeChannel,
  toggleNode,
  type MenuNode,
} from "../lib/permission-tree"
import {
  clearSavedGrants,
  loadSavedGrants,
  saveGrants,
} from "../lib/selection-storage"
import { ModulePanel, ToggleCheckbox } from "../components/PermissionTree"

const LEVEL_LABEL: Record<MenuNode["level"], string> = {
  模块: "模块",
  目录: "目录",
  菜单: "菜单",
  按钮: "操作",
}

function LevelBadge({ level }: { level: MenuNode["level"] }) {
  return (
    <span className="shrink-0 rounded border border-border/70 bg-muted/40 px-1 py-px text-[9.5px] text-muted-foreground">
      {LEVEL_LABEL[level]}
    </span>
  )
}

function presetForChannel(roleId: string, channelId: string) {
  const role = demoRoles.find((item) => item.id === roleId) ?? demoRoles[0]
  const preset = buildPresetGrants(role.presetPrefixes)
  const tree = getChannelTree(channelId)
  const result = new Set<string>()
  for (const id of preset) if (tree.byId.has(id)) result.add(id)
  return result
}

function initialSnapshot(roleId: string, channelId: string) {
  const saved = loadSavedGrants(roleId, channelId)
  return {
    grants: saved ?? presetForChannel(roleId, channelId),
    fromStorage: saved !== null,
  }
}

/** 默认落在第一个「有下级且已有勾选」的模块，避免打开就是大屏首页这种空模块 */
function firstModuleId(tree: ReturnType<typeof getChannelTree>, granted: Set<string>) {
  const withChildren = tree.modules.filter((item) => item.children.length > 0)
  const withSelection = withChildren.find(
    (item) => countSubtree(item.children, granted).selected > 0,
  )
  return (withSelection ?? withChildren[0] ?? tree.modules[0])?.id ?? ""
}

export function MenuPermissionConfigPage() {
  const [initial] = useState(() => {
    const roleId = defaultRoleId
    const channelId = menuPermissionChannels[0].id
    const snapshot = initialSnapshot(roleId, channelId)
    return {
      roleId,
      channelId,
      ...snapshot,
      moduleId: firstModuleId(getChannelTree(channelId), snapshot.grants),
    }
  })
  const [roleId, setRoleId] = useState(initial.roleId)
  const [channelId, setChannelId] = useState(initial.channelId)
  const [moduleId, setModuleId] = useState<string>(initial.moduleId)
  const [search, setSearch] = useState("")
  const [showDisabled, setShowDisabled] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [granted, setGranted] = useState<Set<string>>(initial.grants)
  const [saved, setSaved] = useState<Set<string>>(initial.grants)
  const [savedAt, setSavedAt] = useState<string>("")
  const [loadedFromStorage, setLoadedFromStorage] = useState(initial.fromStorage)

  const tree = getChannelTree(channelId)
  const role = demoRoles.find((item) => item.id === roleId) ?? demoRoles[0]
  const keyword = search.trim().toLowerCase()

  /** 切角色 / 切渠道：一次性换好授权、模块和搜索，避免 effect 里二次渲染 */
  const switchContext = (nextRoleId: string, nextChannelId: string) => {
    const dirtyNow = diffGranted(granted, saved) > 0
    if (dirtyNow && !window.confirm("当前角色有未保存的权限改动，切换后会丢失，确定继续？")) {
      return
    }
    const nextTree = getChannelTree(nextChannelId)
    const next = initialSnapshot(nextRoleId, nextChannelId)
    setRoleId(nextRoleId)
    setChannelId(nextChannelId)
    setGranted(new Set(next.grants))
    setSaved(new Set(next.grants))
    setLoadedFromStorage(next.fromStorage)
    setSavedAt("")
    setSearch("")
    setCollapsed(new Set())
    setModuleId(firstModuleId(nextTree, next.grants))
  }

  const module =
    tree.modules.find((item) => item.id === moduleId) ??
    tree.modules.find((item) => item.children.length > 0) ??
    tree.modules[0]

  const searchResults = useMemo(() => {
    if (!keyword) return []
    const result: MenuNode[] = []
    for (const node of tree.byId.values()) {
      if (node.synthetic) continue
      if (!node.enabled && !showDisabled) continue
      if (!nodeMatchesKeyword(node, keyword)) continue
      result.push(node)
    }
    return result
  }, [keyword, showDisabled, tree])

  const stats = summarizeChannel(tree, granted)
  const changed = diffGranted(granted, saved)
  const dirty = changed > 0
  const enabledCount = useMemo(() => tree.enabledIds.length, [tree])
  const disabledCount = useMemo(() => {
    let count = 0
    for (const node of tree.byId.values()) {
      if (!node.synthetic && !node.enabled) count += 1
    }
    return count
  }, [tree])

  const visibleModule = useMemo(
    () => (module ? filterVisibleTree(module, showDisabled) : null),
    [module, showDisabled],
  )
  const handleToggle = (node: MenuNode, next: boolean) => {
    setGranted((prev) => toggleNode(tree, prev, node, next))
  }

  const handleToggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allGroupIds = useMemo(
    () =>
      [...tree.byId.values()]
        .filter((node) => node.children.length > 0)
        .map((node) => node.id),
    [tree],
  )

  const handleSave = () => {
    saveGrants(roleId, channelId, granted)
    setSaved(new Set(granted))
    setLoadedFromStorage(true)
    setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }))
  }

  const handleDiscard = () => {
    setGranted(new Set(saved))
  }

  const handleResetPreset = () => {
    setGranted(presetForChannel(roleId, channelId))
    setSavedAt("")
  }

  const handleResetStorage = () => {
    clearSavedGrants(roleId, channelId)
    const preset = presetForChannel(roleId, channelId)
    setGranted(preset)
    setSaved(new Set(preset))
    setLoadedFromStorage(false)
    setSavedAt("")
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-4">
      {/* 顶部操作区 */}
      <div className="shrink-0 rounded-lg border bg-card px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
            <ShieldCheckIcon className="size-4 text-primary" />
            功能与菜单权限配置
          </h1>

          <SystemReferenceSubNav active="menu-config" />

          <span className="hidden h-4 w-px bg-border sm:block" />

          <label className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            当前角色
            <select
              value={roleId}
              onChange={(event) => switchContext(event.target.value, channelId)}
              className="h-7 rounded-md border bg-background px-2 text-[11.5px] font-medium text-foreground outline-none ring-primary/30 transition focus:ring-1"
            >
              {demoRoles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索页面、按钮名称或编号..."
              className="h-7 w-full rounded-md border bg-background pl-7 pr-2 text-[11px] outline-none ring-primary/30 transition focus:ring-1"
            />
          </div>

          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
            <Switch checked={showDisabled} onCheckedChange={setShowDisabled} />
            显示已停用
          </label>

          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {tree.channel.label} · 启用 {enabledCount} 条 / 停用 {disabledCount} 条
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 overflow-x-auto border-t border-border/60 pt-2 no-scrollbar">
          {menuPermissionChannels.map((channel) => {
            const active = channel.id === channelId
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => switchContext(roleId, channel.id)}
                className={cn(
                  "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {channel.label}
                <span className={cn("ml-1 text-[10px]", active ? "text-primary-foreground/80" : "text-muted-foreground/80")}>
                  {channel.total}
                </span>
              </button>
            )
          })}
          <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10px] text-muted-foreground md:flex">
            <InfoIcon className="size-3" />
            菜单与按钮取自现网权限库 sys_permit.sql，原样全量展示
          </span>
        </div>
      </div>

      {/* 主体：左模块导航 + 右平铺矩阵 */}
      <div className="flex min-h-0 flex-1 gap-2">
        <aside className="flex w-[172px] shrink-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm xl:w-[196px]">
          <div className="border-b border-border/60 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-semibold text-foreground">业务模块</div>
              <button
                type="button"
                onClick={() => setCollapsed((prev) => (prev.size > 0 ? new Set() : new Set(allGroupIds)))}
                className="rounded px-1 py-0.5 text-[10px] text-primary transition-colors hover:bg-primary/10"
              >
                {collapsed.size > 0 ? "全部展开" : "全部收起"}
              </button>
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              已选 / 可配置
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-1.5">
            {tree.modules.map((moduleItem) => {
              const { selected, total } =
                moduleItem.level === "模块"
                  ? countSubtree(moduleItem.children, granted)
                  : countSubtree([moduleItem], granted)
              const active = moduleItem.id === module?.id
              return (
                <button
                  key={moduleItem.id}
                  type="button"
                  onClick={() => {
                    setModuleId(moduleItem.id)
                    setSearch("")
                  }}
                  className={cn(
                    "mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors cursor-pointer",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium">
                    {moduleItem.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] tabular-nums",
                      active ? "text-primary-foreground/85" : "text-muted-foreground",
                    )}
                  >
                    {selected}/{total}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="border-t border-border/60 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
            <div className="mb-1 font-medium text-foreground">图例</div>
            <div className="flex items-center gap-1">
              <span className="inline-block size-2.5 rounded-[2px] border border-primary bg-primary" />
              已勾选
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex size-2.5 items-center justify-center rounded-[2px] border border-primary bg-primary">
                <span className="h-[1.5px] w-1.5 rounded-sm bg-white" />
              </span>
              <span className="flex-1">部分勾选（部分下级未开通）</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block size-2.5 rounded-[2px] border border-slate-300 bg-white" />
              未勾选
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block size-2.5 rounded-[2px] border border-dashed border-slate-200 bg-slate-100" />
              已停用（不可配置）
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="h-full max-h-[calc(100vh-196px)] overflow-auto p-2.5">
            {keyword ? (
              <div>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <span className="text-[12px] font-semibold text-foreground">搜索结果</span>
                  <span className="text-[10px] text-muted-foreground">
                    命中 {searchResults.length} 条 · 范围：{tree.channel.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="ml-auto rounded px-1.5 py-0.5 text-[10px] text-primary hover:bg-primary/10"
                  >
                    清除搜索
                  </button>
                </div>
                {searchResults.length === 0 ? (
                  <div className="px-3 py-10 text-center text-[11.5px] text-muted-foreground">
                    没有匹配的菜单或按钮，换个关键词试试（支持中文名称、权限编码、前端路由）。
                  </div>
                ) : (
                  <div className="divide-y divide-border/60 rounded-md border border-border/70">
                    {searchResults.map((node) => {
                      const state = getCheckState(node, granted)
                      return (
                        <div
                          key={node.id}
                          className={cn(
                            "flex items-start gap-2 px-2.5 py-1.5",
                            state === "disabled" ? "bg-slate-50/60" : "hover:bg-muted/30",
                          )}
                        >
                          <div className="pt-0.5">
                            <ToggleCheckbox node={node} state={state} onToggle={handleToggle}>
                              <span
                                className={cn(
                                  "text-[12px] font-medium",
                                  state === "disabled" ? "text-slate-400" : "text-foreground",
                                )}
                              >
                                {node.name}
                              </span>
                            </ToggleCheckbox>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <LevelBadge level={node.level} />
                              {!node.enabled && (
                                <span className="rounded border border-dashed border-slate-300 px-1 py-px text-[9.5px] text-slate-400">
                                  已停用
                                </span>
                              )}
                              <span className="truncate text-[10.5px] text-muted-foreground">
                                {getNodePathLabel(tree, node)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : visibleModule ? (
              <ModulePanel
                module={visibleModule}
                granted={granted}
                onToggle={handleToggle}
                collapsed={collapsed}
                onToggleCollapse={handleToggleCollapse}
              />
            ) : (
              <div className="px-3 py-10 text-center text-[11.5px] text-muted-foreground">
                当前渠道没有可配置的菜单权限。
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部固定保存栏 */}
      <div className="shrink-0 rounded-lg border bg-card px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="font-medium text-foreground">{role.name}</span>
            <span className="text-muted-foreground">
              已配置 <span className="font-semibold text-foreground">{stats.menus}</span> 个菜单页面，
              开通 <span className="font-semibold text-foreground">{stats.actions}</span> 项操作权限
            </span>
            {dirty ? (
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] text-amber-700">
                本次变动 {changed} 项，尚未保存
              </span>
            ) : savedAt ? (
              <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-600">
                <CheckIcon className="size-3" />
                已保存 {savedAt}
              </span>
            ) : loadedFromStorage ? (
              <span className="text-[10.5px] text-muted-foreground">当前为本机保存的授权</span>
            ) : (
              <span className="text-[10.5px] text-muted-foreground">当前为该角色默认授权</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleResetPreset}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="把当前角色恢复到内置示例授权（需保存后生效）"
            >
              <RotateCcwIcon className="size-3" />
              恢复示例授权
            </button>
            <button
              type="button"
              onClick={handleResetStorage}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="清除本机保存的该角色授权记录，并还原为示例授权"
            >
              清除本机记录
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!dirty}
              className="rounded-md border px-2.5 py-1 text-[11px] transition enabled:cursor-pointer enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              放弃修改
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition enabled:cursor-pointer enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SaveIcon className="size-3" />
              保存权限
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
