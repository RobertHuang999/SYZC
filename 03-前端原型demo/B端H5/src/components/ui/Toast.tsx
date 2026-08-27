type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
      <div className="rounded-lg bg-gray-900/90 px-4 py-2.5 text-sm text-white shadow-lg">
        {message}
      </div>
    </div>
  )
}
