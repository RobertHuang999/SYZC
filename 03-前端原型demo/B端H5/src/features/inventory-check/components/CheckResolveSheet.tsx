import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

type CheckResolveSheetProps = {
  open: boolean
  goodsName: string
  onClose: () => void
  onConfirm: (remark: string) => void
}

export function CheckResolveSheet({
  open,
  goodsName,
  onClose,
  onConfirm,
}: CheckResolveSheetProps) {
  const [remark, setRemark] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setRemark("")
      setError("")
    }
  }, [open])

  if (!open) return null

  const handleSubmit = () => {
    const trimmed = remark.trim()
    if (!trimmed) {
      setError("请填写处理说明，说清异常原因和处理结果")
      return
    }
    if (trimmed.length > 200) {
      setError("处理说明不能超过 200 字")
      return
    }
    onConfirm(trimmed)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="关闭解除异常"
        onClick={onClose}
      />
      <div className="relative max-h-[80%] w-full overflow-y-auto rounded-t-2xl bg-white p-4 pb-8">
        <PrototypeAnnotationTarget annotationIds={["check-h5-resolve"]}>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
            <span className="rounded bg-amber-50 p-1 text-amber-600">
              <AlertCircle className="size-4" />
            </span>
            解除盘点异常
          </h3>
          <button type="button" onClick={onClose} className="text-xs text-[#232D39]/50">
            关闭
          </button>
        </div>

        <p className="mt-2 text-xs text-[#232D39]/60">
          针对货品：
          <span className="font-medium text-[#232D39]">{goodsName}</span>
        </p>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-[#232D39]">
              <span className="mr-1 text-rose-500">*</span>处理说明
            </span>
            <span
              className={`text-[11px] ${
                remark.length > 200 ? "font-semibold text-rose-500" : "text-[#232D39]/40"
              }`}
            >
              {remark.length}/200
            </span>
          </div>
          <textarea
            value={remark}
            onChange={(event) => {
              setRemark(event.target.value)
              if (error) setError("")
            }}
            rows={4}
            placeholder="请写清现场异常的原因、处理方式和复验结果，例如：已补录移库单并回写货位，实物位置已恢复一致。"
            className={`w-full resize-none rounded-lg border px-3 py-2 text-xs leading-relaxed text-[#232D39] placeholder:text-[#232D39]/35 ${
              error ? "border-rose-300" : "border-gray-200"
            }`}
          />
          {error && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-500">
              <AlertCircle className="size-3" />
              {error}
            </p>
          )}
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#232D39]/40">
            提交后会写入盘点历史，记录解除人、时间和说明，不能修改。
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-[#232D39]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
          >
            确认解除
          </button>
        </div>
        </PrototypeAnnotationTarget>
      </div>
    </div>
  )
}
