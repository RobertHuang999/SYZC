import type { ReactNode } from "react"

type Props = {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function NativeInfoCard({ title, icon, children, className = "overflow-hidden" }: Props) {
  return (
    <section className={`mb-3 rounded-lg bg-white ${className}`}>
      <header className="mx-4 flex items-center gap-2 border-b border-[#232D39]/10 py-4">
        {icon ? <span className="text-blue-600">{icon}</span> : null}
        <h2 className="text-base font-bold text-[#232D39]">{title}</h2>
      </header>
      <div className="px-4 pb-1">{children}</div>
    </section>
  )
}
