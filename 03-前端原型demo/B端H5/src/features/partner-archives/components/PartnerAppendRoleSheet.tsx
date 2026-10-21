import { useEffect, useMemo, useState } from "react"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { PartnerSubject } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  linkedArchiveMenuLabel,
  otherArchiveMenus,
} from "@prototype/B端PC/src/features/partner-archives/lib/linked-partner-archives"

type PartnerAppendRoleSheetProps = {
  partner: PartnerSubject | null
  open: boolean
  onClose: () => void
  onConfirm: (targetMenus: PartnerArchiveMenuLabel[]) => void
}

export function PartnerAppendRoleSheet({
  partner,
  open,
  onClose,
  onConfirm,
}: PartnerAppendRoleSheetProps) {
  const availableMenus = useMemo(() => {
    if (!partner) {
      return [] as PartnerArchiveMenuLabel[]
    }
    const linked = new Set(
      (partner.linkedPartnerArchives ?? []).map((item) => item.targetMenu),
    )
    return otherArchiveMenus(partner.archiveMenu).filter((menu) => !linked.has(menu))
  }, [partner])

  const [selected, setSelected] = useState<PartnerArchiveMenuLabel[]>([])

  useEffect(() => {
    if (open) {
      setSelected([])
    }
  }, [open, partner?.id])

  if (!open || !partner) {
    return null
  }

  const toggle = (menu: PartnerArchiveMenuLabel) => {
    setSelected((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu],
    )
  }

  const linkedSummary =
    partner.linkedPartnerArchives && partner.linkedPartnerArchives.length > 0
      ? partner.linkedPartnerArchives.map((item) => linkedArchiveMenuLabel(item)).join("、")
      : "——"

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-base font-semibold text-gray-900">追加合作方档案角色</p>
          <p className="mt-1 text-xs text-gray-500">
            为「{partner.name}」在其他子菜单创建独立主档或建立关联（当前：{partner.archiveMenu}）。
          </p>
        </div>
        <div className="space-y-2 px-4 py-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm">
            <div className="text-xs text-gray-500">已关联其他合作档案</div>
            <div className="mt-1 font-medium leading-relaxed text-gray-900">{linkedSummary}</div>
          </div>
          {availableMenus.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              已关联全部可选子菜单，无需再次追加。
            </p>
          ) : (
            <>
              <p className="text-xs font-medium text-gray-700">
                目标菜单<span className="text-red-500"> *</span>
              </p>
              {availableMenus.map((menu) => {
                const active = selected.includes(menu)
                return (
                  <button
                    key={menu}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-800"
                    }`}
                    onClick={() => toggle(menu)}
                  >
                    {menu}
                    <span
                      className={`size-4 rounded-full border ${
                        active ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}
                    />
                  </button>
                )
              })}
            </>
          )}
        </div>
        <div className="flex gap-3 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            onClick={() => onConfirm(selected)}
          >
            确认追加
          </button>
        </div>
      </div>
    </div>
  )
}
