import { useEffect, useState } from "react"
import type { OwnerType } from "../domain/form-types"

type Props = {
  open: boolean
  ownerType: OwnerType
  ownerName: string
  ownerIdentifier: string
  contactOrIdCard: string
  onClose: () => void
  onConfirm: () => void
}

export function OwnerVerifySheet({
  open,
  ownerType,
  ownerName,
  ownerIdentifier,
  contactOrIdCard,
  onClose,
  onConfirm,
}: Props) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setCode("")
      setError(null)
    }
  }, [open])

  if (!open) return null

  const handleConfirm = () => {
    if (code.trim() !== "123456") {
      setError("验证码错误，Mock 环境请输入 123456")
      return
    }
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-4 pb-8">
        <h3 className="text-base font-semibold">货主信息确认</h3>
        <p className="mt-1 text-xs text-gray-500">新货主须完成短信二元核验（R03）</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">货主类型</dt>
            <dd>{ownerType}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">货主名称</dt>
            <dd>{ownerName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">货主标识</dt>
            <dd>{ownerIdentifier}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">{ownerType === "个人货主" ? "身份证" : "联系电话"}</dt>
            <dd>{contactOrIdCard}</dd>
          </div>
        </dl>
        <label className="mt-4 block text-xs text-gray-500">
          短信验证码
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="6 位验证码"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
            onClick={onClose}
          >
            返回修改
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm text-primary-foreground"
            onClick={handleConfirm}
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  )
}
