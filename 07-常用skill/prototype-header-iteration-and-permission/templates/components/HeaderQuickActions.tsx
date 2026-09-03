import { KeyRound } from "lucide-react"
import type { IterationRecordEntry, IterationVersionMeta } from "../types"
import { IterationRecordButton } from "./IterationRecordButton"

export type HeaderQuickActionsProps = {
  iterationRecords: IterationRecordEntry[]
  iterationVersions: IterationVersionMeta[]
  /** 点击“功能与数据权限”时的回调或目标路由 */
  onOpenPermissions?: () => void
  permissionUrl?: string
  isPermissionActive?: boolean
  className?: string
}

/**
 * 挂载在原有原型 Header 右侧的操作区组合组件：
 * 包含 [迭代记录] 弹窗按钮 + [功能与数据权限] 页面入口按钮
 */
export function HeaderQuickActions({
  iterationRecords,
  iterationVersions,
  onOpenPermissions,
  permissionUrl = "#/permissions",
  isPermissionActive = false,
  className = "",
}: HeaderQuickActionsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 1. 迭代记录弹窗按钮 */}
      <IterationRecordButton records={iterationRecords} versions={iterationVersions} />

      {/* 2. 功能与数据权限参考入口 */}
      {onOpenPermissions ? (
        <button
          type="button"
          onClick={onOpenPermissions}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer ${
            isPermissionActive ? "border-primary bg-primary/10 text-primary font-semibold" : ""
          }`}
          title="查看全系统功能与数据权限全景大屏"
        >
          <KeyRound size={14} className="text-amber-500" strokeWidth={1.8} />
          <span>功能与数据权限</span>
        </button>
      ) : (
        <a
          href={permissionUrl}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${
            isPermissionActive ? "border-primary bg-primary/10 text-primary font-semibold" : ""
          }`}
          title="查看全系统功能与数据权限全景大屏"
        >
          <KeyRound size={14} className="text-amber-500" strokeWidth={1.8} />
          <span>功能与数据权限</span>
        </a>
      )}
    </div>
  )
}
