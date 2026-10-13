import { Check } from "lucide-react"

const STEPS = ["基础信息", "货品明细"] as const

type Props = {
  current: 0 | 1
}

export function NativeInboundStepBar({ current }: Props) {
  return (
    <div className="flex shrink-0 items-start justify-between px-1 py-4">
      {STEPS.map((title, index) => {
        const done = index < current
        const active = index === current
        const isLast = index === STEPS.length - 1
        return (
          <div key={title} className="flex min-w-0 flex-1 items-start">
            <div className="flex min-w-[72px] flex-1 flex-col items-center gap-2">
              {done ? (
                <div className="flex size-6 items-center justify-center rounded-full bg-orange-100">
                  <Check className="size-3.5 stroke-[3] text-orange-600" />
                </div>
              ) : active ? (
                <div className="flex size-6 items-center justify-center rounded-full bg-orange-100">
                  <div className="size-3.5 rounded-full bg-orange-600" />
                </div>
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-[#232D39]/20 text-xs font-medium text-white">
                  {index + 1}
                </div>
              )}
              <span
                className={`w-full text-center text-xs leading-tight ${
                  active || done ? "font-medium text-[#232D39]" : "text-[#232D39]/60"
                }`}
              >
                {title}
              </span>
            </div>
            {!isLast ? (
              <div
                className={`mt-3 h-0.5 min-w-[24px] flex-1 ${
                  done ? "bg-orange-600" : "bg-orange-100"
                }`}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
