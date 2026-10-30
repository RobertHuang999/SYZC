import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown, ChevronRight, HistoryIcon, KeyRound } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  useIterationHighlight,
  type IterationViewMode,
} from "@/shared/components/IterationHighlight"
import {
  iterationRecords,
  iterationVersions,
} from "@/features/permission-reference/data/menu-iteration-records"
import {
  isSystemReferencePath,
  ITERATION_RECORD_PATH,
  PERMISSION_REFERENCE_PATH,
} from "@/config/navigation"
import { cn } from "@/lib/utils"

type ViewOption = {
  value: IterationViewMode
  label: string
  desc: string
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    value: "focus63",
    label: "只看 6.3 变更",
    desc: "只留 6.3 新增/调整的琥珀框与点位，历史沿用收起",
  },
  {
    value: "all",
    label: "全部原型",
    desc: "琥珀框 + 全部点位，新旧变更一眼对比",
  },
  {
    value: "off",
    label: "还原线上",
    desc: "隐藏全部框与点位编号，还原线上真实观感",
  },
]

/**
 * 顶栏「版本视图」合并入口：
 * 一个按钮管住三档标注视图，下拉里再带「迭代记录」「功能与数据权限」两个资料页。
 */
export function VersionViewMenu() {
  const { viewMode, setViewMode } = useIterationHighlight()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const current = VIEW_OPTIONS.find((option) => option.value === viewMode) ?? VIEW_OPTIONS[1]
  const highlightOn = viewMode !== "off"

  const onReferencePage = isSystemReferencePath(pathname)

  const currentVersionCount = useMemo(() => {
    const version = iterationVersions[0]?.version ?? "6.3"
    return {
      version,
      count: iterationRecords.filter((record) => record.version === version).length,
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "version-view-trigger",
          highlightOn && "is-highlight-on",
          onReferencePage && "is-on-reference"
        )}
        aria-label={`版本视图：${current.label}`}
        title="切换原型标注视图，并可跳转迭代记录 / 功能与数据权限"
      >
        <span className={cn("version-view-trigger-dot", !highlightOn && "is-off")} aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown size={13} strokeWidth={1.8} className="version-view-trigger-caret" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[286px] rounded-xl border-[#e5e6eb] bg-white p-1.5 shadow-[0_10px_28px_rgba(29,33,41,0.12)]"
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
          <span className="text-[11px] font-medium text-[#86909c]">标注显示</span>
          <span className="flex items-center gap-2 text-[10px] text-[#a9aeb8]">
            <span className="inline-flex items-center gap-1">
              <i className="size-2 rounded-[2px] border border-[#ff9a2e] bg-[#fff3e0]" />
              6.3 变更
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="size-2 rounded-[2px] border border-[#c9cdd4] bg-white" />
              历史沿用
            </span>
          </span>
        </div>

        <div role="radiogroup" aria-label="原型标注视图">
          {VIEW_OPTIONS.map((option) => {
            const active = option.value === viewMode
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setViewMode(option.value)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors cursor-pointer",
                  active ? "bg-[#fff7e8]" : "hover:bg-[#f7f8fa]"
                )}
              >
                <span
                  className={cn(
                    "mt-[3px] grid size-3.5 shrink-0 place-items-center rounded-full border bg-white",
                    active ? "border-[#ff9a2e]" : "border-[#c9cdd4]"
                  )}
                  aria-hidden="true"
                >
                  {active ? <span className="size-1.5 rounded-full bg-[#ff9a2e]" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[12.5px] leading-5",
                      active ? "font-semibold text-[#1d2129]" : "font-medium text-[#4e5969]"
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-[1.45] text-[#86909c]">
                    {option.desc}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="my-1 h-px bg-[#f0f1f3]" />

        <Link
          to={ITERATION_RECORD_PATH}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[12.5px] text-[#1d2129] no-underline transition-colors hover:bg-[#f7f8fa]"
        >
          <HistoryIcon size={14} strokeWidth={1.8} className="shrink-0 text-[#86909c]" />
          <span className="flex-1">迭代记录</span>
          <span className="text-[11px] text-[#86909c]">
            {currentVersionCount.version} · {currentVersionCount.count} 条
          </span>
          <ChevronRight size={13} className="shrink-0 text-[#c9cdd4]" />
        </Link>

        <Link
          to={PERMISSION_REFERENCE_PATH}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[12.5px] text-[#1d2129] no-underline transition-colors hover:bg-[#f7f8fa]"
        >
          <KeyRound size={14} strokeWidth={1.8} className="shrink-0 text-[#86909c]" />
          <span className="flex-1">功能与数据权限</span>
          <ChevronRight size={13} className="shrink-0 text-[#c9cdd4]" />
        </Link>
      </PopoverContent>
    </Popover>
  )
}
