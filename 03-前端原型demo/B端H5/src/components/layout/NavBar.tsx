import { ChevronLeft } from "lucide-react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type NavBarProps = {
  title: string
  onBack?: () => void
  backTo?: string
  right?: ReactNode
}

export function NavBar({ title, onBack, backTo, right }: NavBarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    if (backTo) {
      navigate(backTo)
      return
    }

    navigate(-1)
  }

  return (
    <header className="sticky top-0 z-20 flex h-11 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
        aria-label="返回"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="max-w-[55%] truncate text-base font-semibold text-gray-900">
        {title}
      </h1>
      <div className="flex min-w-9 items-center justify-end">{right}</div>
    </header>
  )
}
