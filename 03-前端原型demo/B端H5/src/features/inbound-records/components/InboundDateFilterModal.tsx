type DateRangeDraft = {
  inboundStart: string
  inboundEnd: string
  createStart: string
  createEnd: string
}

type InboundDateFilterModalProps = {
  open: boolean
  value: DateRangeDraft
  onChange: (next: DateRangeDraft) => void
  onClose: () => void
  onReset: () => void
  onConfirm: () => void
}

function DateRangeRow({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: string
  end: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.03] px-2 py-2 text-xs text-[#232D39]"
      />
      <span className="shrink-0 text-[#232D39]/40 text-xs">至</span>
      <input
        type="date"
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.03] px-2 py-2 text-xs text-[#232D39]"
      />
    </div>
  )
}

/** 对齐现网 outbound-filter-modal：漏斗打开「入库日期 + 制单时间」范围 */
export function InboundDateFilterModal({
  open,
  value,
  onChange,
  onClose,
  onReset,
  onConfirm,
}: InboundDateFilterModalProps) {
  if (!open) return null

  const patch = (p: Partial<DateRangeDraft>) => onChange({ ...value, ...p })

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        className="relative z-10 mt-[5.75rem] bg-white px-4 pb-4 pt-3 shadow-lg rounded-b-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className="mb-2 text-xs font-semibold text-[#232D39]">入库日期</p>
        <DateRangeRow
          start={value.inboundStart}
          end={value.inboundEnd}
          onStartChange={(inboundStart) => patch({ inboundStart })}
          onEndChange={(inboundEnd) => patch({ inboundEnd })}
        />

        <p className="mb-2 mt-4 text-xs font-semibold text-[#232D39]">制单时间</p>
        <DateRangeRow
          start={value.createStart}
          end={value.createEnd}
          onStartChange={(createStart) => patch({ createStart })}
          onEndChange={(createEnd) => patch({ createEnd })}
        />

        <div className="mt-5 flex gap-3 border-t border-[#232D39]/5 pt-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-lg border border-[#232D39]/15 py-2.5 text-sm text-[#232D39]"
          >
            重置
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

export type { DateRangeDraft }
