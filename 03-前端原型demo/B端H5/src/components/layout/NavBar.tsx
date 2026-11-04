import { ChevronLeft } from "lucide-react"
import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { handleStackBack } from "@/shared/navigation/stack-back"
import { MiniProgramCapsule } from "./MiniProgramCapsule"

type NavBarProps = {
  title: string
  onBack?: () => void
  backTo?: string
  right?: ReactNode
  /** 四个主 Tab 页不显示返回箭头（小程序 Tab 页没有上一级） */
  showBack?: boolean
}

/**
 * 小程序导航栏：高 44px，标题 17px，右侧固定胶囊按钮。
 *
 * - 没有右侧按钮时：标题在整屏居中，两边各留出胶囊的宽度，绝不压到胶囊。
 * - 有右侧按钮时：标题让出右侧空间，在「返回键」和「右侧按钮」之间居中，
 *   宁可标题略偏左，也不截断成一两个字（小程序右侧空间被胶囊占掉了大半）。
 */
export function NavBar({ title, onBack, backTo, right, showBack = true }: NavBarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    if (backTo) {
      handleStackBack(navigate, location, backTo)
      return
    }

    navigate(-1)
  }

  const titleClassName =
    "min-w-0 max-w-full truncate text-center text-[17px] font-semibold leading-[44px] text-gray-900"

  return (
    <header className="relative z-20 flex h-11 shrink-0 items-center border-b border-gray-200/80 bg-white pl-0.5 pr-2">
      <div className="flex w-11 shrink-0 items-center">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="flex h-11 w-11 items-center justify-center text-gray-900 active:opacity-50"
            aria-label="返回"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>
        )}
      </div>

      {right ? (
        <div className="flex min-w-0 flex-1 justify-center px-1">
          <h1 className={titleClassName}>{title}</h1>
        </div>
      ) : (
        <h1
          className={`pointer-events-none absolute left-1/2 top-0 h-11 max-w-[46%] -translate-x-1/2 ${titleClassName}`}
        >
          {title}
        </h1>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        {right}
        <MiniProgramCapsule />
      </div>
    </header>
  )
}
