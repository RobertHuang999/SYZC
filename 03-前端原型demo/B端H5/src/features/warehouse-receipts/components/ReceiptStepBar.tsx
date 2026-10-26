import { Check } from "lucide-react"

const DEFAULT_STEPS = ["基础信息", "货品明细"] as const

const TONES = {
  blue: {
    doneBg: "bg-blue-100",
    doneIcon: "text-blue-600",
    activeBg: "bg-blue-100",
    activeDot: "bg-blue-600",
    lineDone: "bg-blue-600",
    linePending: "bg-blue-100",
  },
  gold: {
    doneBg: "bg-[#FBF0D9]",
    doneIcon: "text-[#D99A2B]",
    activeBg: "bg-[#FBF0D9]",
    activeDot: "bg-[#E0A23C]",
    lineDone: "bg-[#E0A23C]",
    linePending: "bg-[#F0E3C9]",
  },
} as const

export function ReceiptStepBar({
  current,
  steps = DEFAULT_STEPS,
  theme = "blue",
}: {
  current: number
  steps?: readonly string[]
  theme?: "blue" | "gold"
}) {
  const tone = TONES[theme]

  return (
    <div className="flex shrink-0 items-start justify-between px-1 py-4">
      {steps.map((title, index) => {
        const done = index < current
        const active = index === current
        const isLast = index === steps.length - 1
        return (
          <div key={title} className="flex min-w-0 flex-1 items-start">
            <div className="flex min-w-[62px] flex-1 flex-col items-center gap-1.5">
              {done ? (
                <div className={`flex size-6 items-center justify-center rounded-full ${tone.doneBg}`}>
                  <Check className={`size-3.5 stroke-[3] ${tone.doneIcon}`} />
                </div>
              ) : active ? (
                <div className={`flex size-6 items-center justify-center rounded-full ${tone.activeBg}`}>
                  <div className={`size-3.5 rounded-full ${tone.activeDot}`} />
                </div>
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-[#232D39]/20 text-xs font-medium text-white">
                  {index + 1}
                </div>
              )}
              <span
                className={`w-full text-center text-[11px] leading-tight ${
                  active || done ? "font-medium text-[#232D39]" : "text-[#232D39]/55"
                }`}
              >
                {title}
              </span>
            </div>
            {!isLast ? (
              <div
                className={`mt-3 h-0.5 min-w-[16px] flex-1 ${
                  done ? tone.lineDone : tone.linePending
                }`}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
