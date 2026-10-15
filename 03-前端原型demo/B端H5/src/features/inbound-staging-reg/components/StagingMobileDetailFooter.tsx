import { STAGING_ACTION_LABELS } from "@prototype/shared/inbound/staging-ui-labels"
import { H5_DETAIL_BTN_PRIMARY } from "@/shared/h5-ui-theme"

type PendingProps = {
  variant: "pending"
  onEdit: () => void
  onConvert: () => void
  onVoid: () => void
}

type ConvertedProps = {
  variant: "converted"
  onViewFormal: () => void
}

type Props = PendingProps | ConvertedProps

function ActionSep() {
  return <span className="shrink-0 select-none px-2 text-sm text-gray-300">|</span>
}

const shellClass =
  "fixed inset-x-0 bottom-0 z-30 border-t border-[#232D39]/10 bg-white px-3.5 py-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"

export function StagingMobileDetailFooter(props: Props) {
  if (props.variant === "converted") {
    return (
      <div className={shellClass}>
        <button type="button" className={`${H5_DETAIL_BTN_PRIMARY} w-full flex-none`} onClick={props.onViewFormal}>
          {STAGING_ACTION_LABELS.viewFormal}
        </button>
      </div>
    )
  }

  return (
    <div className={shellClass}>
      <div className="flex flex-nowrap items-center justify-center gap-0 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="shrink-0 whitespace-nowrap px-1 py-1 text-sm font-medium text-red-600 active:opacity-75"
          onClick={props.onVoid}
        >
          {STAGING_ACTION_LABELS.void}
        </button>
        <ActionSep />
        <button
          type="button"
          className="shrink-0 whitespace-nowrap px-1 py-1 text-sm font-medium text-[#232D39] active:opacity-75"
          onClick={props.onEdit}
        >
          {STAGING_ACTION_LABELS.edit}
        </button>
        <ActionSep />
        <button
          type="button"
          className="shrink-0 whitespace-nowrap px-1 py-1 text-sm font-semibold text-blue-600 active:opacity-75"
          onClick={props.onConvert}
        >
          {STAGING_ACTION_LABELS.convert}
        </button>
      </div>
    </div>
  )
}
