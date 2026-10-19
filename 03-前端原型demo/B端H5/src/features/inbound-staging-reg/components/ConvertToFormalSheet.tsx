import type { InboundStagingReg } from "@prototype/shared/inbound/inbound-staging.mock"
import { PrototypeSpecCallout } from "@prototype/B端PC/src/components/form/PrototypeSpecCallout"
import {
  STAGING_ACTION_LABELS,
  STAGING_O03_H5_ROUTE_HINT_USER,
  STAGING_O03_H5_ROUTE_HINT_SPEC,
  STAGING_O03_REMINDERS_SPEC,
  STAGING_O03_REMINDERS_USER,
} from "@prototype/shared/inbound/staging-ui-labels"

type Props = {
  open: boolean
  reg: InboundStagingReg | null
  onClose: () => void
  onConfirm: () => void
}

export function ConvertToFormalSheet({ open, reg, onClose, onConfirm }: Props) {
  if (!open || !reg) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 text-sm">
        <p className="text-base font-semibold text-[#232D39]">转为正式入库确认</p>
        <p className="mt-1 text-xs text-[#232D39]/55">
          {reg.regNo} · {reg.inboundType}
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#232D39]/70">
          {STAGING_O03_REMINDERS_USER.map((line) => (
            <li key={line}>{line}</li>
          ))}
          <li className="font-medium text-blue-800">{STAGING_O03_H5_ROUTE_HINT_USER}</li>
        </ul>
        <PrototypeSpecCallout className="mt-2">
          {STAGING_O03_REMINDERS_SPEC} {STAGING_O03_H5_ROUTE_HINT_SPEC.replace("{REG}", reg.regNo)}
        </PrototypeSpecCallout>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            className="h-11 rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
            onClick={onConfirm}
          >
            {STAGING_ACTION_LABELS.convert}
          </button>
          <button
            type="button"
            className="h-11 rounded-lg border border-[#232D39]/15 text-sm text-[#232D39]"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
