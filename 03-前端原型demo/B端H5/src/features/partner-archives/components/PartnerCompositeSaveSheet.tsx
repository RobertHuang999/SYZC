import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type {
  AppendPlanItem,
  CompositePrecheckFailure,
  CompositeSaveResultLine,
} from "@prototype/B端PC/src/features/partner-archives/lib/composite-append-save"
import {
  planActionLabel,
  resultOutcomeLabel,
} from "@prototype/B端PC/src/features/partner-archives/lib/composite-append-save"
import {
  PARTNER_COMPOSITE_SAVE_CONFIRM_SPEC,
  PARTNER_COMPOSITE_SAVE_CONFIRM_USER,
  PARTNER_COMPOSITE_SAVE_FAILURE_INTRO,
  PARTNER_COMPOSITE_SAVE_SUCCESS_INTRO,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"

export type PartnerCompositeSaveSheetMode = "confirm" | "failure" | "success"

type PartnerCompositeSaveSheetProps = {
  open: boolean
  mode: PartnerCompositeSaveSheetMode
  currentMenu: PartnerArchiveMenuLabel
  plan?: AppendPlanItem[]
  appendMenus?: PartnerArchiveMenuLabel[]
  failures?: CompositePrecheckFailure[]
  successLines?: CompositeSaveResultLine[]
  verifiedOnCreate?: boolean
  onClose: () => void
  onConfirmComposite?: () => void
  onViewDetail?: () => void
  onBackToList?: () => void
}

export function PartnerCompositeSaveSheet({
  open,
  mode,
  currentMenu,
  plan = [],
  appendMenus = [],
  failures = [],
  successLines = [],
  verifiedOnCreate,
  onClose,
  onConfirmComposite,
  onViewDetail,
  onBackToList,
}: PartnerCompositeSaveSheetProps) {
  if (!open) {
    return null
  }

  const title =
    mode === "confirm"
      ? "确认一并保存合作方档案"
      : mode === "failure"
        ? "保存未成功"
        : "保存成功"

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-base font-semibold text-gray-900">{title}</p>
          {mode === "confirm" ? (
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {PARTNER_COMPOSITE_SAVE_CONFIRM_USER}
            </p>
          ) : mode === "failure" ? (
            <p className="mt-1 text-xs text-amber-800">{PARTNER_COMPOSITE_SAVE_FAILURE_INTRO}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">{PARTNER_COMPOSITE_SAVE_SUCCESS_INTRO}</p>
          )}
        </div>

        <div className="space-y-3 px-4 py-3 text-sm">
          {mode === "confirm" ? (
            <>
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">本页（当前菜单）</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  · 【{currentMenu}】 → 新建档案（隐式身份）
                </div>
              </div>
              {plan.length > 0 ? (
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">同时追加的其他合作档案</p>
                  <ul className="space-y-1 rounded-lg border border-gray-100 px-3 py-2">
                    {plan.map((item) => (
                      <li key={item.targetMenu}>
                        · 【{item.targetMenu}】 → {planActionLabel(item.action)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <PrototypeSpecCallout className="text-xs">
                {PARTNER_COMPOSITE_SAVE_CONFIRM_SPEC}
              </PrototypeSpecCallout>
            </>
          ) : null}

          {mode === "failure" ? (
            <>
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">处理结果</p>
                <ul className="space-y-1 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-red-900">
                  <li>· 【{currentMenu}（本页）】 ✗ 未保存</li>
                  {appendMenus.map((menu) => (
                    <li key={menu}>
                      · 【{menu}（追加）】 ✗ 未保存
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">失败原因</p>
                <ol className="list-decimal space-y-2 pl-5 text-gray-700">
                  {failures.map((item) => (
                    <li key={`${item.scopeLabel}-${item.reason}`}>
                      <span className="font-medium">{item.scopeLabel}</span>
                      <div className="text-xs text-gray-500">{item.reason}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : null}

          {mode === "success" ? (
            <>
              <ul className="space-y-2">
                {successLines.map((line) => (
                  <li
                    key={line.scopeLabel}
                    className="rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-emerald-900"
                  >
                    · {line.scopeLabel} ✓ {resultOutcomeLabel(line.outcome)}
                    {line.detail ? (
                      <div className="mt-0.5 text-xs text-emerald-800/80">{line.detail}</div>
                    ) : null}
                  </li>
                ))}
              </ul>
              {verifiedOnCreate ? (
                <ProductFieldHint className="text-xs text-gray-500">
                  本页联系手机已完成短信验证。
                </ProductFieldHint>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="flex gap-2 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {mode === "confirm" ? (
            <>
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                onClick={onConfirmComposite}
              >
                确认一并保存
              </button>
            </>
          ) : null}
          {mode === "failure" ? (
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
              onClick={onClose}
            >
              我知道了
            </button>
          ) : null}
          {mode === "success" ? (
            <>
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium"
                onClick={onBackToList}
              >
                返回列表
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                onClick={onViewDetail}
              >
                查看详情
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
