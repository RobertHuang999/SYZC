import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

type AccordionItemProps = {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  return (
    <details
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 marker:content-none">
        {title}
        <ChevronDown className="size-4 text-gray-400 transition group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
        {children}
      </div>
    </details>
  )
}

type KeyValueProps = {
  label: string
  value: ReactNode
}

export function KeyValue({ label, value }: KeyValueProps) {
  return (
    <div className="flex gap-3">
      <span className="w-20 shrink-0 text-gray-500">{label}</span>
      <span className="flex-1 break-all text-gray-900">{value}</span>
    </div>
  )
}
