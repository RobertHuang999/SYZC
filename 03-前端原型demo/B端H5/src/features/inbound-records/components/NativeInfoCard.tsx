import type { ReactNode } from "react"

type Props = {
  title: string
  icon?: ReactNode
  children: ReactNode
}

export function NativeInfoCard({ title, icon, children }: Props) {
  return (
    <section className="mb-3 overflow-hidden rounded-lg bg-white">
      <header className="mx-4 flex items-center gap-2 border-b border-[#232D39]/10 py-4">
        {icon ? <span className="text-orange-600">{icon}</span> : null}
        <h2 className="text-base font-bold text-[#232D39]">{title}</h2>
      </header>
      <div className="px-4 pb-1">{children}</div>
    </section>
  )
}
