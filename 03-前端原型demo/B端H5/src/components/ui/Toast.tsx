import { useEffect, useState } from "react"

type ToastProps = {
  message: string | null
  duration?: number
  onClose?: () => void
}

export function Toast({ message, duration = 2500, onClose }: ToastProps) {
  const [visible, setVisible] = useState(Boolean(message))

  useEffect(() => {
    if (!message) {
      setVisible(false)
      return
    }
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!visible || !message) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-12 z-50 flex justify-center px-4 animate-in fade-in-50 duration-150">
      <div className="rounded-xl bg-gray-900/90 px-4 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-xs max-w-[85%] text-center leading-relaxed">
        {message}
      </div>
    </div>
  )
}

